import React, { useState, useRef } from "react";
import { createRoot } from "react-dom/client";
import { 
  LayoutDashboard, 
  FileSpreadsheet, 
  FileText, 
  Upload, 
  Download, 
  Eye, 
  Menu,
  X,
  ChevronRight,
  BarChart3,
  Globe,
  XCircle,
  Info,
  TrendingUp
} from "lucide-react";

// --- Types & Constants ---

const MME_COLORS = {
  blue: "#003399", // Deep Blue from logo
  yellow: "#FFCC00", // Yellow from logo/buttons
  darkBlue: "#002060", // Darker header blue
  lightGray: "#f3f4f6",
};

type TabId = "dashboards" | "monitoring" | "pac_generation" | "bulletin" | "site_dates";

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

  const reports = [
    {
      title: "DPME - GAIA",
      url: "https://app.powerbi.com/view?r=eyJrIjoiYWNhOGUyOWEtMGJhMC00MWFiLWFiNzQtMDIxZjFhZGFiYzY1IiwidCI6IjVlMzk3OGI5LTQ5NTAtNDM3Yy04N2I2LTQ5MmYxMjY4ZGVjOCJ9"
    },
    {
      title: "Expansão, PAC e Capacidade Instalada",
      url: "https://app.powerbi.com/view?r=eyJrIjoiOGY0NzY5ZmQtNjQ4Zi00ZWZmLTllNTgtZGJkNGU2NjQ3M2M3IiwidCI6IjVlMzk3OGI5LTQ5NTAtNDM3Yy04N2I2LTQ5MmYxMjY4ZGVjOCJ9"
    },
    {
      title: "Grades Números do PAC - Geração e Transmissão",
      url: "https://app.powerbi.com/view?r=eyJrIjoiMWU2ZTI4YWQtZjhkMS00ODNiLWE0MWMtYTkyMDAxMDk0NDM5IiwidCI6IjVlMzk3OGI5LTQ5NTAtNDM3Yy04N2I2LTQ5MmYxMjY4ZGVjOCJ9&pageName=185dfa9a7b011860d5d0"
    }
  ];

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-300">
      {/* Sub-tabs for Dashboards */}
      <div className="flex space-x-1 bg-gray-200 p-1 rounded-t-lg border-b border-gray-300 overflow-x-auto scrollbar-hide">
        {reports.map((report, idx) => (
          <button
            key={idx}
            onClick={() => setActiveReport(idx)}
            className={`
              px-4 py-3 text-xs md:text-sm font-bold uppercase tracking-wide transition-all duration-200 rounded-t-md whitespace-nowrap flex-1 border-b-2
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

// 2. Preview Modal Component
interface PreviewModalProps {
  file: UploadedFile | null;
  onClose: () => void;
}

const PreviewModal = ({ file, onClose }: PreviewModalProps) => {
  if (!file) return null;

  const isDoc = file.name.endsWith('doc') || file.name.endsWith('docx');
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#003399] bg-opacity-40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl h-[85vh] flex flex-col animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-gray-50 rounded-t-xl">
          <div className="flex items-center gap-3">
             <div className={`p-2 rounded-lg ${isDoc ? 'bg-blue-100' : 'bg-green-100'}`}>
                {isDoc ? <FileText className="text-blue-600 w-6 h-6" /> : <FileSpreadsheet className="text-green-600 w-6 h-6" />}
             </div>
             <div>
               <h3 className="font-bold text-gray-800 text-lg truncate max-w-md">{file.name}</h3>
               <p className="text-xs text-gray-500 uppercase tracking-wider">Modo de Visualização</p>
             </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition-colors p-1 hover:bg-red-50 rounded-full">
            <XCircle className="w-8 h-8" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 bg-slate-100 p-8 overflow-y-auto flex flex-col items-center justify-center text-center relative">
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.gov.br/mme/++theme++mme.theme/assets/img/logo-mme.png')] bg-center bg-no-repeat bg-contain"></div>
            
            {/* Simulation Card */}
            <div className="bg-white p-12 rounded-2xl shadow-xl max-w-lg w-full border border-gray-200 z-10">
                <div className="mb-8 flex justify-center">
                    <div className={`rounded-full p-6 ${isDoc ? 'bg-blue-50' : 'bg-green-50'}`}>
                        {isDoc ? (
                            <FileText className="w-20 h-20 text-blue-400" />
                        ) : (
                            <FileSpreadsheet className="w-20 h-20 text-green-400" />
                        )}
                    </div>
                </div>
                <h4 className="text-xl font-bold text-gray-800 mb-2">Pré-visualização do Arquivo</h4>
                <p className="text-gray-600 mb-8 leading-relaxed">
                    O arquivo <strong>{file.name}</strong> está disponível. 
                    Para visualizar os dados completos, clique no botão abaixo para acessar/baixar.
                </p>
                
                <div className="flex flex-col gap-3">
                    <a 
                        href={file.url} 
                        download={file.name}
                        target={file.url.startsWith('http') && file.url !== '#' ? "_blank" : undefined}
                        rel="noopener noreferrer"
                        className="bg-[#003399] hover:bg-[#002060] text-white px-8 py-4 rounded-xl font-bold transition-all transform hover:scale-[1.02] shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
                        onClick={(e) => {
                          if (file.url === '#') {
                            e.preventDefault();
                            alert("Link pendente: Cole o link do OneDrive no código (index.tsx).");
                          }
                        }}
                    >
                        <Download className="w-5 h-5" />
                        Acessar Arquivo Original
                    </a>
                    <button 
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 font-medium text-sm mt-2 hover:underline"
                    >
                        Fechar visualização
                    </button>
                </div>
            </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-gray-200 bg-gray-50 text-center md:text-right text-xs text-gray-400 rounded-b-xl">
            CGGT - Sistema de Visualização Seguro
        </div>
      </div>
    </div>
  );
};

// 3. Generic Document Repository Component
interface DocumentSectionProps {
  title: string;
  description: string;
  accept: string;
  allowedTypesLabel: string;
  files: UploadedFile[];
  onUpload: (files: UploadedFile[]) => void;
  onPreview: (file: UploadedFile) => void;
}

const DocumentSection = ({ title, description, accept, allowedTypesLabel, files, onUpload, onPreview }: DocumentSectionProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(Array.from(e.target.files));
    }
  };

  const processFiles = (newFiles: File[]) => {
    const processed: UploadedFile[] = newFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      type: file.type,
      size: file.size,
      url: URL.createObjectURL(file),
      date: new Date()
    }));
    onUpload(processed);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(Array.from(e.dataTransfer.files));
    }
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
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-[#003399] inline-flex flex-col">
          {title}
          <span className="h-1.5 w-1/2 bg-[#FFCC00] mt-2 rounded-full"></span>
        </h2>
        <p className="text-gray-600 mt-4 max-w-3xl text-lg">{description}</p>
      </div>

      {/* Upload Area */}
      <div 
        className={`
          border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 mb-8 group
          ${isDragging 
            ? 'border-[#FFCC00] bg-yellow-50 scale-[1.01] shadow-lg' 
            : 'border-gray-300 bg-white hover:border-[#003399] hover:bg-blue-50/30'}
        `}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept={accept} 
          multiple 
          onChange={handleFileSelect}
        />
        <div className="flex justify-center mb-6">
          <div className="bg-blue-50 p-5 rounded-full group-hover:bg-[#003399] transition-colors duration-300">
            <Upload className="w-10 h-10 text-[#003399] group-hover:text-[#FFCC00] transition-colors duration-300" />
          </div>
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">Clique ou arraste arquivos aqui</h3>
        <p className="text-gray-500">Formatos suportados: <span className="font-medium text-[#003399]">{allowedTypesLabel}</span></p>
      </div>

      {/* File List */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 flex-1 overflow-hidden flex flex-col">
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
              <p className="text-lg font-medium">Nenhum arquivo enviado ainda.</p>
              <p className="text-sm">Utilize a área acima para adicionar documentos.</p>
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
                            {file.name.endsWith('doc') || file.name.endsWith('docx') ? (
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
                        <button 
                          onClick={() => onPreview(file)}
                          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-[#003399] bg-blue-50 hover:bg-[#003399] hover:text-white rounded-lg transition-all shadow-sm hover:shadow-md"
                        >
                          <Eye className="w-4 h-4" />
                          <span className="hidden lg:inline">Visualizar</span>
                        </button>
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
  const [previewFile, setPreviewFile] = useState<UploadedFile | null>(null);
  
  // State for storing files per tab to ensure persistence
  const [storedFiles, setStoredFiles] = useState<Record<string, UploadedFile[]>>({
    monitoring: [
      // Pre-loaded file for Monitoring
      {
        id: "preloaded-monitoring",
        name: "Planilha de Monitoramento da Geração.xlsx",
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        size: 5200000, // ~5.2 MB simulated size
        url: "https://mmegovbr-my.sharepoint.com/:f:/g/personal/ricardo_silveira_mme_gov_br/IgCmqwPngAqSTJisFmQnGydfASajYjOCnCRJqTKe8U_a-yc?e=HE7Wo5", 
        date: new Date()
      }
    ],
    pac_generation: [
      // Pre-loaded file for PAC Generation
      {
        id: "preloaded-pac-generation",
        name: "Planilha PAC Geração.xlsx",
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        size: 4100000, // ~4.1 MB simulated size
        url: "https://mmegovbr-my.sharepoint.com/:f:/g/personal/ricardo_silveira_mme_gov_br/IgA3d8GnFnwBT72l3pj3c95wAYLfH6UO7-iiSWSL5vk41WA?e=SRdMcb",
        date: new Date()
      }
    ],
    bulletin: [
      {
        id: "preloaded-bulletin-excel",
        name: "Boletim do Sistema Elétrico - Geração.xlsx",
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        size: 3500000,
        url: "https://mmegovbr-my.sharepoint.com/:f:/g/personal/ricardo_silveira_mme_gov_br/IgBaDcX03NWVTIJfK2c-1fI0AU_CnjBhKuoz5rrfjRsUg2M?e=l3PbWs",
        date: new Date()
      },
      {
        id: "preloaded-bulletin-doc",
        name: "Relatório Técnico - Boletim Geração.docx",
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        size: 1200000,
        url: "https://mmegovbr-my.sharepoint.com/:f:/g/personal/ricardo_silveira_mme_gov_br/IgBaDcX03NWVTIJfK2c-1fI0AU_CnjBhKuoz5rrfjRsUg2M?e=l3PbWs",
        date: new Date()
      }
    ],
    site_dates: [
      // Pre-loaded file placeholder for OneDrive
      {
        id: "preloaded-cmse",
        name: "312 reunião CMSE- Novembro 25.xlsx",
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        size: 2450000, // ~2.45 MB simulated size
        url: "https://mmegovbr-my.sharepoint.com/:f:/g/personal/ricardo_silveira_mme_gov_br/IgD4Gm93r99xQYcqtLvznEcKAbbdRBdb_DFc1jVOWJ8uFEw?e=kbIgiL", 
        date: new Date() 
      }
    ]
  });

  const handleUpload = (tabId: string, newFiles: UploadedFile[]) => {
    setStoredFiles(prev => ({
      ...prev,
      [tabId]: [...prev[tabId], ...newFiles]
    }));
  };

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
      id: "site_dates", 
      label: "Site MME - Datas de Tendência", 
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
            description="Faça upload da planilha de monitoramento (Excel ou Binário) para disponibilização à equipe e ao Ministério."
            accept=".xlsx, .xlsb, .xls"
            allowedTypesLabel="Excel (.xlsx), Excel Binário (.xlsb)"
            files={storedFiles.monitoring}
            onUpload={(files) => handleUpload("monitoring", files)}
            onPreview={setPreviewFile}
          />
        );
      case "pac_generation":
        return (
          <DocumentSection 
            title="Planilha PAC Geração" 
            description="Faça upload da Planilha PAC Geração para acompanhamento da equipe e do Ministério."
            accept=".xlsx, .xlsb, .xls"
            allowedTypesLabel="Excel (.xlsx), Excel Binário (.xlsb)"
            files={storedFiles.pac_generation}
            onUpload={(files) => handleUpload("pac_generation", files)}
            onPreview={setPreviewFile}
          />
        );
      case "bulletin":
        return (
          <DocumentSection 
            title="Boletim do Sistema Elétrico" 
            description="Faça upload do boletim em formato Excel e do relatório em Word."
            accept=".xlsx, .xlsb, .xls, .doc, .docx"
            allowedTypesLabel="Excel (.xlsx, .xlsb) e Word (.docx)"
            files={storedFiles.bulletin}
            onUpload={(files) => handleUpload("bulletin", files)}
            onPreview={setPreviewFile}
          />
        );
      case "site_dates":
        return (
          <DocumentSection 
            title="Datas de Tendência (Site MME)" 
            description="Faça upload da planilha de datas de tendência para atualização do portal."
            accept=".xlsx, .xlsb, .xls"
            allowedTypesLabel="Excel (.xlsx, .xlsb)"
            files={storedFiles.site_dates}
            onUpload={(files) => handleUpload("site_dates", files)}
            onPreview={setPreviewFile}
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
        <div className="p-6 bg-[#002060] border-b border-blue-800">
            <div className="flex items-center gap-3 mb-2">
                <div className="bg-white rounded w-auto px-2 h-8 flex items-center justify-center shadow-md">
                    {/* MME/DPME Box */}
                    <div className="text-[#003399] font-black text-sm leading-none text-center tracking-tight">MME/DPME</div>
                </div>
                <div className="leading-tight">
                    <h1 className="font-bold text-base text-[#FFCC00] tracking-wide">PORTAL CGGT</h1>
                    <p className="text-[10px] text-blue-200 uppercase tracking-wider">Expansão da Geração</p>
                </div>
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
            <div className="flex items-center gap-3 mb-3 opacity-80">
                <Info className="w-4 h-4 text-[#FFCC00]" />
                <span className="text-xs text-blue-100">Precisa de ajuda?</span>
            </div>
            <div className="text-[10px] text-center text-blue-300 border-t border-blue-700 pt-3">
            &copy; 2025 Ministério de Minas e Energia
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
                      Secretaria Nacional de Energia Elétrica - Coordenação-Geral de Expansão da Geração e da Transmissão de Energia Elétrica
                    </span>
                    <h2 className="text-lg md:text-2xl font-extrabold text-gray-800 leading-tight">
                        Portal de Painéis, Planilhas e Relatórios <span className="text-gray-400 mx-1 hidden md:inline">|</span> <span className="text-[#003399] block md:inline mt-1 md:mt-0">- CGGT/DPME/MME</span>
                    </h2>
                </div>

                {/* User Profile Placeholder */}
                <div className="hidden md:flex items-center gap-4 pl-6 border-l border-gray-200 ml-6">
                    <div className="text-right">
                        <div className="text-sm font-bold text-gray-700">Usuário Convidado</div>
                        <div className="text-xs text-gray-500">Acesso Público</div>
                    </div>
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#003399] to-[#0055CC] text-white flex items-center justify-center font-bold border-2 border-white shadow-md">
                        CG
                    </div>
                </div>
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

      {/* Preview Modal */}
      {previewFile && (
        <PreviewModal 
          file={previewFile} 
          onClose={() => setPreviewFile(null)} 
        />
      )}
    </div>
  );
};

const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}