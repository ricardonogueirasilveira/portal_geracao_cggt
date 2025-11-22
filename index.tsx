import React, { useState, useRef, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { 
  LayoutDashboard, 
  FileSpreadsheet, 
  FileText, 
  Upload, 
  Download, 
  Menu,
  X,
  ChevronRight,
  BarChart3,
  Globe,
  RotateCcw
} from "lucide-react";

// --- Types & Constants ---

const MME_COLORS = {
  blue: "#003399", // Deep Blue from logo
  yellow: "#FFCC00", // Yellow from logo/buttons
  darkBlue: "#002060", // Darker header blue
  lightGray: "#f3f4f6",
};

type TabId = "dashboards" | "monitoring" | "pac_generation" | "bulletin" | "briefings" | "site_dates";

interface UploadedFile {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  date: Date;
}

// --- Components ---

// 1. Dashboard Component
const DashboardView = () => {
  const [activeReport, setActiveReport] = useState<number>(0);
  
  // Removed refresh logic as requested

  const reports = [
    {
      title: "DPME / GAIA",
      url: "https://app.powerbi.com/view?r=eyJrIjoiYWNhOGUyOWEtMGJhMC00MWFiLWFiNzQtMDIxZjFhZGFiYzY1IiwidCI6IjVlMzk3OGI5LTQ5NTAtNDM3Yy04N2I2LTQ5MmYxMjY4ZGVjOCJ9"
    },
    {
      title: "GERAÇÃO - COMPLETO",
      url: "https://app.powerbi.com/view?r=eyJrIjoiOGY0NzY5ZmQtNjQ4Zi00ZWZmLTllNTgtZGJkNGU2NjQ3M2M3IiwidCI6IjVlMzk3OGI5LTQ5NTAtNDM3Yy04N2I2LTQ5MmYxMjY4ZGVjOCJ9"
    },
    {
      title: "NÚMEROS PAC",
      url: "https://app.powerbi.com/view?r=eyJrIjoiMWU2ZTI4YWQtZjhkMS00ODNiLWE0MWMtYTkyMDAxMDk0NDM5IiwidCI6IjVlMzk3OGI5LTQ5NTAtNDM3Yy04N2I2LTQ5MmYxMjY4ZGVjOCJ9&pageName=185dfa9a7b011860d5d0"
    }
  ];

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-300">
      {/* Sub-tabs for Dashboards */}
      <div className="flex items-center bg-gray-200 p-1 rounded-t-lg border-b border-gray-300">
        <div className="flex space-x-1 overflow-x-auto scrollbar-hide flex-1 mr-2">
          {reports.map((report, idx) => (
            <button
              key={idx}
              onClick={() => setActiveReport(idx)}
              className={`
                px-4 py-3 text-xs md:text-sm font-bold uppercase tracking-wide transition-all duration-200 rounded-t-md whitespace-nowrap flex-1 border-b-2 min-w-[150px]
                ${activeReport === idx 
                  ? `bg-[${MME_COLORS.blue}] text-white shadow-[0_-2px_10px_rgba(0,0,0,0.1)] border-[#FFCC00]` 
                  : "bg-white text-gray-500 hover:bg-gray-50 hover:text-[#003399] border-transparent"}
              `}
              style={{ 
                backgroundColor: activeReport === idx ? MME_COLORS.blue : undefined,
                color: activeReport === idx ? 'white' : undefined,
                borderColor: activeReport === idx ? MME_COLORS.yellow : 'transparent'
              }}
            >
              {report.title}
            </button>
          ))}
        </div>
      </div>

      {/* Iframe Container */}
      <div className="flex-1 bg-white shadow-md relative border border-gray-200 rounded-b-lg overflow-hidden">
        <iframe 
          title={reports[activeReport].title}
          width="100%" 
          height="100%" 
          src={reports[activeReport].url} 
          frameBorder="0" 
          allowFullScreen={true}
          className="w-full h-full"
          loading="lazy"
        ></iframe>
      </div>
    </div>
  );
};

// 2. Generic Document Repository Component
interface DocumentSectionProps {
  title: string;
  description: React.ReactNode;
  files: UploadedFile[];
}

const DocumentSection = ({ title, description, files }: DocumentSectionProps) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simula o tempo de verificação de novos arquivos no servidor
    setTimeout(() => {
        setIsRefreshing(false);
    }, 1500);
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="h-full flex flex-col p-6 md:p-8 bg-gray-50 overflow-y-auto animate-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8 flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div>
            <h2 className="text-2xl md:text-3xl font-bold text-[#003399] inline-flex flex-col">
            {title}
            <span className="h-1.5 w-1/2 bg-[#FFCC00] mt-2 rounded-full"></span>
            </h2>
            <div className="text-gray-600 mt-4 max-w-3xl text-lg">{description}</div>
        </div>
        <button 
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-[#003399] rounded-lg hover:bg-blue-50 shadow-sm transition-all text-sm font-bold whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-blue-200"
            title="Verificar atualizações de documentos"
        >
            <RotateCcw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Atualizando...' : 'Atualizar Dados'}
        </button>
      </div>

      {/* Upload Area Removed */}

      {/* File List */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 flex-1 overflow-hidden flex flex-col relative">
        {isRefreshing && (
            <div className="absolute inset-0 z-20 bg-white/50 backdrop-blur-[1px] flex items-center justify-center">
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-lg border border-gray-100">
                    <RotateCcw className="w-4 h-4 text-[#003399] animate-spin" />
                    <span className="text-sm font-medium text-gray-600">Verificando novos arquivos...</span>
                </div>
            </div>
        )}
        
        <div className="p-5 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
          <h3 className="font-bold text-gray-700 flex items-center gap-2 text-lg">
            <div className="bg-[#003399] p-1.5 rounded text-white">
                <FileText className="w-4 h-4" />
            </div>
            Arquivos Disponíveis ({files.length})
          </h3>
        </div>
        
        <div className="overflow-y-auto flex-1 p-0 custom-scrollbar">
          {files.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400 bg-gray-50/50">
              <FileSpreadsheet className="w-16 h-16 mb-4 opacity-20" />
              <p className="text-lg font-medium">Nenhum arquivo disponível.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 text-gray-500 text-sm sticky top-0 z-10 shadow-sm">
                <tr>
                  <th className="p-4 font-semibold tracking-wide">NOME DO ARQUIVO</th>
                  <th className="p-4 font-semibold tracking-wide hidden md:table-cell">DATA</th>
                  <th className="p-4 font-semibold tracking-wide hidden sm:table-cell">TAMANHO</th>
                  <th className="p-4 font-semibold tracking-wide text-right">AÇÕES</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {files.map((file) => (
                  <tr key={file.id} className="hover:bg-blue-50/50 transition-colors group">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded bg-white border border-gray-100 shadow-sm">
                            {file.name.endsWith('doc') || file.name.endsWith('docx') || file.type.includes('word') ? (
                            <FileText className="w-6 h-6 text-blue-600" />
                            ) : (
                            <FileSpreadsheet className="w-6 h-6 text-green-600" />
                            )}
                        </div>
                        <span className="font-medium text-gray-800 group-hover:text-[#003399] transition-colors">{file.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-gray-500 text-sm hidden md:table-cell">{file.date.toLocaleDateString()}</td>
                    <td className="p-4 text-gray-500 text-sm font-mono hidden sm:table-cell">{formatSize(file.size)}</td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <a 
                          href={file.url} 
                          download={file.name}
                          target={file.url.startsWith('http') && file.url !== '#' ? "_blank" : undefined}
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-[#FFCC00] hover:text-[#003399] rounded-lg transition-all shadow-sm hover:shadow-md"
                          onClick={(e) => {
                            if (file.url === '#') {
                              e.preventDefault();
                              alert("Link pendente: Adicione o link do OneDrive no código.");
                            }
                          }}
                        >
                          <Download className="w-4 h-4" />
                          <span className="hidden lg:inline">Baixar</span>
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

// --- Main App Component ---

const App = () => {
  const [activeTab, setActiveTab] = useState<TabId>("dashboards");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // State for storing files per tab to ensure persistence
  const [storedFiles] = useState<Record<string, UploadedFile[]>>({
    monitoring: [
      // Pre-loaded file for Monitoring
      {
        id: "preloaded-monitoring",
        name: "Planilha de Monitoramento da Geração",
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        size: 5200000, // ~5.2 MB simulated size
        url: "https://mmegovbr-my.sharepoint.com/:f:/g/personal/ricardo_silveira_mme_gov_br/IgCmqwPngAqSTJisFmQnGydfASajYjOCnCRJqTKe8U_a-yc?e=HE7Wo5&SortField=Modified&SortDir=Desc", 
        date: new Date()
      }
    ],
    pac_generation: [
      // Pre-loaded file for PAC Generation
      {
        id: "preloaded-pac-generation",
        name: "Planilha PAC Geração",
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        size: 4100000, // ~4.1 MB simulated size
        url: "https://mmegovbr-my.sharepoint.com/:f:/g/personal/ricardo_silveira_mme_gov_br/IgA3d8GnFnwBT72l3pj3c95wAYLfH6UO7-iiSWSL5vk41WA?e=SRdMcb&SortField=Modified&SortDir=Desc",
        date: new Date()
      }
    ],
    bulletin: [
      {
        id: "preloaded-bulletin-excel",
        name: "Arquivos do Boletim do Sistema Elétrico - Geração",
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        size: 3500000,
        url: "https://mmegovbr-my.sharepoint.com/:f:/g/personal/ricardo_silveira_mme_gov_br/IgBaDcX03NWVTIJfK2c-1fI0AU_CnjBhKuoz5rrfjRsUg2M?e=l3PbWs&SortField=Modified&SortDir=Desc",
        date: new Date()
      }
    ],
    briefings: [
      {
        id: "briefing-01",
        name: "Arquivos de Briefings de Usinas e Complexos",
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        size: 1100000,
        url: "https://mmegovbr-my.sharepoint.com/:f:/g/personal/ricardo_silveira_mme_gov_br/IgDtzwi2f7z2Q5FdrCQJhZKVATkRkbCs5s7bt70LRNqHJ7Y?e=AfbA1s&SortField=Modified&SortDir=Desc",
        date: new Date()
      }
    ],
    site_dates: [
      // Pre-loaded file placeholder for OneDrive
      {
        id: "preloaded-cmse",
        name: "Arquivos de Datas de Tendência",
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        size: 2450000, // ~2.45 MB simulated size
        url: "https://mmegovbr-my.sharepoint.com/:f:/g/personal/ricardo_silveira_mme_gov_br/IgD4Gm93r99xQYcqtLvznEcKAbbdRBdb_DFc1jVOWJ8uFEw?e=kbIgiL&SortField=Modified&SortDir=Desc", 
        date: new Date() 
      }
    ]
  });

  const menuItems = [
    { 
      id: "dashboards", 
      label: "Dashboards", 
      icon: <LayoutDashboard className="w-5 h-5" /> 
    },
    { 
      id: "monitoring", 
      label: "Planilha de Monitoramento da Geração", 
      icon: <BarChart3 className="w-5 h-5" /> 
    },
    { 
      id: "pac_generation", 
      label: "Planilha PAC Geração", 
      icon: <FileSpreadsheet className="w-5 h-5" /> 
    },
    { 
      id: "bulletin", 
      label: "Boletim do Sistema Elétrico - Geração", 
      icon: <FileText className="w-5 h-5" /> 
    },
    { 
      id: "briefings", 
      label: "Briefings - Geração", 
      icon: <FileText className="w-5 h-5" /> 
    },
    { 
      id: "site_dates", 
      label: "Site MME - Homologação Datas de Tendência pelo CMSE", 
      icon: <Globe className="w-5 h-5" /> 
    },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "dashboards":
        return <DashboardView />;
      case "monitoring":
        return (
          <DocumentSection 
            title="Monitoramento da Geração" 
            description="Baixe a Planilha de Monitoramento da Geração com a data base mais atual."
            files={storedFiles.monitoring}
          />
        );
      case "pac_generation":
        return (
          <DocumentSection 
            title="Planilha PAC Geração" 
            description="Baixe a Planilha PAC Geração com a data base mais atual."
            files={storedFiles.pac_generation}
          />
        );
      case "bulletin":
        return (
          <DocumentSection 
            title="Boletim do Sistema Elétrico" 
            description={
              <>
                Área destinada aos arquivos para elaboração do boletim de monitoramento do sistema elétrico.
                <br />
                <span className="text-base font-normal text-gray-500 mt-1 block">
                    Obs: Clicando em baixar vão aparecer todos os arquivos disponíveis.
                </span>
              </>
            }
            files={storedFiles.bulletin}
          />
        );
      case "briefings":
        return (
          <DocumentSection 
            title="Briefings - Geração" 
            description={
                <>
                    Área destinada aos arquivos de briefings de usinas e Complexos de geração.
                    <br />
                    <span className="text-base font-normal text-gray-500 mt-1 block">
                        Obs: Clicando em baixar vão aparecer todos os arquivos disponíveis.
                    </span>
                </>
            }
            files={storedFiles.briefings}
          />
        );
      case "site_dates":
        return (
          <DocumentSection 
            title="Datas de Tendência CMSE" 
            description={
              <>
                Área destinada aos arquivos com datas de tendência, visando homologação pelo CMSE.
                <br />
                <span className="text-base font-normal text-gray-500 mt-1 block">
                    Obs: Clicando em baixar vão aparecer todos os arquivos disponíveis.
                </span>
              </>
            }
            files={storedFiles.site_dates}
          />
        );
      default:
        return <div className="p-8">Selecione uma opção no menu.</div>;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* Sidebar - Desktop */}
      <aside 
        className={`
          fixed inset-y-0 left-0 z-30 w-72 bg-[#003399] text-white transform transition-transform duration-300 ease-in-out shadow-2xl
          ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"} md:relative md:translate-x-0 flex flex-col
        `}
      >
        {/* Logo Area */}
        <div className="p-6 bg-[#002060] border-b border-blue-800 flex flex-col items-start gap-1">
            {/* MME/DPME Box */}
            <div className="bg-white rounded w-auto px-2 py-0.5 h-6 flex items-center justify-center shadow-md mb-1">
                <div className="text-[#003399] font-black text-xs leading-none text-center tracking-tight">SNEE/DPME</div>
            </div>
            {/* Portal Text */}
            <div className="leading-tight">
                <h1 className="font-bold text-3xl text-[#FFCC00] tracking-wide">PORTAL CGGT</h1>
                <p className="text-[10px] text-blue-200 uppercase tracking-wider">Expansão da Geração</p>
            </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 px-3 space-y-2 overflow-y-auto custom-scrollbar">
        {menuItems.map((item) => (
            <button
            key={item.id}
            onClick={() => {
                setActiveTab(item.id as TabId);
                setMobileMenuOpen(false);
            }}
            className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group text-left relative overflow-hidden
                ${activeTab === item.id 
                ? "bg-[#FFCC00] text-[#003399] font-bold shadow-lg translate-x-1" 
                : "text-blue-100 hover:bg-blue-800 hover:text-white hover:translate-x-1"}
            `}
            >
            <span className={`p-1.5 rounded-md transition-colors ${activeTab === item.id ? 'bg-[#003399]/10' : 'bg-white/5 group-hover:bg-white/10'}`}>
                {item.icon}
            </span>
            <span className="text-sm leading-snug flex-1">{item.label}</span>
            {activeTab === item.id && <ChevronRight className="w-4 h-4 animate-pulse" />}
            </button>
        ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-6 bg-[#002570]">
            <div className="text-[10px] text-center text-blue-300 pt-3 flex flex-col gap-2">
                <span>&copy; 2025 Ministério de Minas e Energia</span>
                <div className="pt-2 border-t border-blue-800/50">
                    <p className="font-medium text-blue-200">Elaborado por: Ricardo Nogueira Silveira</p>
                    <p className="text-blue-400 mt-0.5">Coordenador de Expansão de Geração de Energia Elétrica - CGGT/DPME/SNEE/MME</p>
                </div>
            </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-md border-b border-gray-200 z-20 relative">
            <div className="flex items-center justify-between px-4 md:px-8 py-4">
                <button 
                  className="md:hidden text-[#003399] p-1 hover:bg-blue-50 rounded"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                  {mobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
                </button>
                
                <div className="flex flex-col w-full md:w-auto ml-3 md:ml-0">
                    <span className="text-[#003399] font-bold text-[9px] md:text-xs uppercase tracking-wider mb-1 md:mb-0 leading-tight">
                      Secretaria Nacional de Energia Elétrica - Departamento de Políticas para o Mercado - Coordenação-Geral de Expansão da Geração e da Transmissão de Energia Elétrica
                    </span>
                    <h2 className="text-lg md:text-2xl font-extrabold text-gray-800 leading-tight">
                        Portal de Painéis, Planilhas e Documentos <span className="text-gray-400 mx-1 hidden md:inline">|</span> <span className="text-[#003399] block md:inline mt-1 md:mt-0">- CGGT/DPME/SNEE/MME</span>
                    </h2>
                </div>

                {/* User Profile Removed */}
            </div>
            <div className="h-1.5 bg-gradient-to-r from-[#003399] via-[#0055CC] to-[#FFCC00]"></div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-hidden relative bg-slate-100">
          {renderContent()}
        </main>
      </div>
      
      {/* Overlay for mobile menu */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-[#003399]/50 backdrop-blur-sm z-20 md:hidden transition-opacity"
          onClick={() => setMobileMenuOpen(false)}
        ></div>
      )}
    </div>
  );
};

// Service Worker Registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(registration => {
            console.log('SW registered: ', registration);
        }).catch(registrationError => {
            console.log('SW registration failed: ', registrationError);
        });
    });
}

const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}