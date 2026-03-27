import { motion } from "motion/react";
import { 
  ArrowRight, 
  BrainCircuit, 
  Calendar, 
  Laptop, 
  Linkedin, 
  Network, 
  Users, 
  Mail,
  Quote,
  GraduationCap,
  LineChart,
  Globe,
  CheckCircle2,
  RefreshCw,
  Zap,
  Database,
  Leaf,
  Code,
  Building,
  TrendingUp,
  ChevronLeft,
  MessageSquare,
  X,
  Send,
  Loader2,
  Sparkles,
  Target,
  ShieldCheck,
  Rocket,
  Box,
  Briefcase,
  Megaphone,
  Map as MapIcon,
  Compass,
  Menu,
  X
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { GoogleGenAI } from "@google/genai";
import Markdown from "react-markdown";

// Initialize Gemini
const genAI = process.env.GEMINI_API_KEY ? new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY }) : null;
const GEMINI_MODEL = "gemini-3-flash-preview";

// Configuration-Driven Content
const content = {
  hero: {
    name: "Massimo Caria",
    role: "Innovation Bridge",
    headline: "Affianco i Manager del Turismo nella Sfida dell'Innovazione e della Digitalizzazione.",
    subheadline: "Strategie, competenze e tecnologie per guidare DMO e operatori turistici nell'era digitale.",
    missionTitle: "La mia mission nel settore",
    missionText: "Orientare i Destination Manager verso un futuro digitale, innovativo e sostenibile, favorendo le sinergie tra gli stakeholder del settore turistico, sottolineando l'importanza dei dati e della tecnologia per decisioni strategiche e promuovendo una cultura di agilità e innovazione nelle nostre destinazioni.",
    ctaPrimary: "Fissa una call conoscitiva",
    ctaSecondary: "Scopri il tuo approccio",
    calendarLink: "https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ1moQmdvh9-0wiTeuce3YjVz3m39qKRP15nS7HqE_rpd2SBOzEGATaf4RCGDvkDY9J0FDZ5CfZJ",
  },
  audit: {
    title: "Assessment di Maturità Digitale & Strategica",
    subtitle: "Un'analisi imparziale per valutare il posizionamento tecnologico e organizzativo della tua destinazione.",
    steps: [
      {
        id: "profile",
        question: "In quale tipo di organizzazione operi?",
        options: [
          { text: "Comune", value: 2, category: "Visione Strategica" },
          { text: "Ente di promozione turistica", value: 3, category: "Visione Strategica" },
          { text: "DMO", value: 4, category: "Visione Strategica" },
          { text: "DMC", value: 4, category: "Visione Strategica" },
          { text: "GAL", value: 3, category: "Visione Strategica" },
          { text: "Altro", value: 3, category: "Visione Strategica" }
        ]
      },
      {
        id: "role_public",
        question: "Qual è il tuo ruolo all'interno dell'ente?",
        condition: (answers: any) => ["Comune", "Ente di promozione turistica", "GAL"].includes(answers.profile),
        options: [
          { text: "Amministratore (Sindaco/Assessore)", value: 3, category: "Capitale Umano" },
          { text: "Dirigente / Funzionario", value: 3, category: "Capitale Umano" },
          { text: "Destination Manager", value: 5, category: "Capitale Umano" },
          { text: "Consulente Esterno", value: 4, category: "Capitale Umano" },
          { text: "Altro", value: 2, category: "Capitale Umano" }
        ]
      },
      {
        id: "role_private",
        question: "Qual è il tuo ruolo all'interno dell'organizzazione?",
        condition: (answers: any) => !["Comune", "Ente di promozione turistica", "GAL"].includes(answers.profile),
        options: [
          { text: "CEO / Direttore Generale", value: 5, category: "Capitale Umano" },
          { text: "Destination Manager", value: 5, category: "Capitale Umano" },
          { text: "Marketing / Project Manager", value: 4, category: "Capitale Umano" },
          { text: "Imprenditore", value: 5, category: "Capitale Umano" },
          { text: "Consulente Strategico", value: 4, category: "Capitale Umano" },
          { text: "Altro", value: 2, category: "Capitale Umano" }
        ]
      },
      {
        id: "scale",
        question: "Qual è la scala territoriale della tua organizzazione?",
        options: [
          { text: "Locale", value: 2, category: "Visione Strategica" },
          { text: "Territoriale / Comprensoriale", value: 3, category: "Visione Strategica" },
          { text: "Provinciale", value: 4, category: "Visione Strategica" },
          { text: "Regionale", value: 5, category: "Visione Strategica" },
          { text: "Nazionale", value: 5, category: "Visione Strategica" }
        ],
        condition: (answers: any) => ["Ente di promozione turistica", "DMO", "DMC"].includes(answers.profile)
      },
      {
        id: "geography",
        question: "In quale contesto geografico operi principalmente?",
        options: [
          { text: "Mare / Balneare", value: 3, category: "Visione Strategica" },
          { text: "Montagna / Neve / Laghi", value: 3, category: "Visione Strategica" },
          { text: "Città d'Arte / Metropoli", value: 4, category: "Visione Strategica" },
          { text: "Borghi / Aree Interne / Rurale", value: 2, category: "Visione Strategica" },
          { text: "Terme / Benessere", value: 3, category: "Visione Strategica" },
          { text: "Destinazione Mista / Diffusa", value: 4, category: "Visione Strategica" }
        ]
      },
      {
        id: "team_size",
        question: "Com'è strutturato il tuo team?",
        options: [
          { text: "Lavoro da solo / Freelance", value: 1, category: "Capitale Umano" },
          { text: "Team piccolo (< 5 persone)", value: 2, category: "Capitale Umano" },
          { text: "Team strutturato (5-20 persone)", value: 4, category: "Capitale Umano" },
          { text: "Organizzazione media (20-100 persone)", value: 5, category: "Capitale Umano" },
          { text: "Grande organizzazione (> 100 persone)", value: 5, category: "Capitale Umano" }
        ]
      },
      {
        id: "team_structure",
        question: "Qual è il modello di gestione del team?",
        options: [
          { text: "Gerarchico / Tradizionale", value: 2, category: "Capitale Umano" },
          { text: "Agile / Orizzontale", value: 5, category: "Capitale Umano" },
          { text: "Prevalentemente esternalizzato", value: 3, category: "Capitale Umano" }
        ],
        condition: (answers: any) => answers.team_size !== "Lavoro da solo / Freelance"
      },
      {
        id: "volumes",
        question: "Quali sono i volumi annui (presenze turistiche)?",
        options: [
          { text: "Fino a 100.000", value: 1, category: "Maturità Digitale" },
          { text: "Tra 100.000 e 500.000", value: 2, category: "Maturità Digitale" },
          { text: "Tra 500.000 e 1 Milione", value: 3, category: "Maturità Digitale" },
          { text: "Tra 1 e 5 Milioni", value: 4, category: "Maturità Digitale" },
          { text: "Oltre 5 Milioni", value: 5, category: "Maturità Digitale" }
        ]
      },
      {
        id: "stakeholders",
        question: "Qual è il sentiment prevalente dei tuoi stakeholder?",
        options: [
          { text: "Ostile / Resistente al cambiamento", value: 1, category: "Sostenibilità Sociale" },
          { text: "Indifferente / Passivo", value: 2, category: "Sostenibilità Sociale" },
          { text: "Collaborativo / Aperto", value: 4, category: "Sostenibilità Sociale" },
          { text: "Entusiasta / Proattivo", value: 5, category: "Sostenibilità Sociale" }
        ]
      },
      {
        id: "community",
        question: "Quanto è coinvolta la comunità locale nelle decisioni?",
        options: [
          { text: "Molto coinvolta / Partecipazione attiva", value: 5, category: "Sostenibilità Sociale" },
          { text: "Marginalmente coinvolta", value: 3, category: "Sostenibilità Sociale" },
          { text: "Rapporto conflittuale", value: 1, category: "Sostenibilità Sociale" },
          { text: "Nessun coinvolgimento strutturato", value: 2, category: "Sostenibilità Sociale" }
        ]
      },
      {
        id: "data",
        question: "Come gestite e incrociate i dati?",
        options: [
          { text: "Nessun incrocio (prevalentemente Excel)", value: 1, category: "Maturità Digitale" },
          { text: "Base (Integrazione DMS/CRM)", value: 3, category: "Maturità Digitale" },
          { text: "Avanzato (Data Hub / BI)", value: 4, category: "Maturità Digitale" },
          { text: "Predittivo (Analisi flussi e trend)", value: 5, category: "Maturità Digitale" }
        ]
      },
      {
        id: "ai_vision",
        question: "Qual è la visione dell'AI nella tua realtà?",
        options: [
          { text: "Paura / Rischio di sostituzione", value: 1, category: "Integrazione AI" },
          { text: "Curiosità / Semplice strumento", value: 2, category: "Integrazione AI" },
          { text: "Strategica / Integrazione nei processi", value: 4, category: "Integrazione AI" },
          { text: "Nativa / Ecosistema basato su AI", value: 5, category: "Integrazione AI" }
        ]
      },
      {
        id: "proactivity",
        question: "Come definiresti la vostra proattività?",
        options: [
          { text: "Reattiva (risolviamo problemi)", value: 2, category: "Visione Strategica" },
          { text: "Proattiva (pianifichiamo)", value: 3, category: "Visione Strategica" },
          { text: "Innovativa (sperimentiamo)", value: 4, category: "Visione Strategica" },
          { text: "Leader (creiamo standard)", value: 5, category: "Visione Strategica" }
        ]
      },
      {
        id: "sustainability",
        question: "Qual è il focus sulla sostenibilità?",
        options: [
          { text: "Solo ambientale", value: 3, category: "Sostenibilità Sociale" },
          { text: "Sociale & Ambientale", value: 4, category: "Sostenibilità Sociale" },
          { text: "Integrata nel modello di business", value: 5, category: "Sostenibilità Sociale" },
          { text: "Non è una priorità attuale", value: 1, category: "Sostenibilità Sociale" }
        ]
      }
    ]
  },
  ecosystem: {
    title: "Ecosistema di Valore Integrato",
    subtitle: "Un approccio olistico che connette competenze, tecnologie avanzate e capitale umano per generare innovazione sostenibile.",
    nodes: [
      { title: "Agile & Lean", description: "Metodologie snelle per iterazioni rapide e validazione continua dei progetti.", icon: <Zap className="w-6 h-6" /> },
      { title: "Data Intelligence", description: "Infrastrutture dati e Business Intelligence per decisioni informate.", icon: <Database className="w-6 h-6" /> },
      { title: "Digitalizzazione", description: "Ottimizzazione dei processi per eliminare le inefficienze operative.", icon: <Laptop className="w-6 h-6" /> },
      { title: "AI Advanced", description: "Implementazione di AI generativa e predittiva nei flussi di lavoro.", icon: <BrainCircuit className="w-6 h-6" /> },
      { title: "Network Strategico", description: "Connessioni con territori, DMO, DMC e operatori chiave.", icon: <Globe className="w-6 h-6" /> },
      { title: "Sostenibilità ESG", description: "Integrazione di criteri ambientali, sociali e di governance.", icon: <Leaf className="w-6 h-6" /> },
      { title: "Tech Partners", description: "Sinergie con provider tecnologici d'eccellenza.", icon: <Code className="w-6 h-6" /> },
      { title: "Public-Private", description: "Modelli di collaborazione pubblico-privato per l'impatto territoriale.", icon: <Building className="w-6 h-6" /> },
      { title: "Growth Strategy", description: "Strategie di crescita che fondono prodotto e marketing.", icon: <TrendingUp className="w-6 h-6" /> },
      { title: "Knowledge Transfer", description: "Trasferimento di know-how democratico e accessibile.", icon: <GraduationCap className="w-6 h-6" /> }
    ]
  },
  method: {
    title: "Il Mio Why: Soft AI",
    subtitle: "L'approccio psicologico all'innovazione.",
    paragraphs: [
      "Unione unica di 18 anni di esperienza in Hospitality Tech e un solido background in Psicologia Clinica.",
      "Il mio approccio si basa sulla \"Soft AI Introduction\": non sostituiamo le persone, le potenziamo.",
      "Lavoro per il superamento dei colli di bottiglia operativi attraverso l'empatia e la tecnologia, garantendo un'adozione fluida e naturale dell'innovazione."
    ],
    stats: "18+"
  },
  services: {
    title: "Aree di Intervento Strategico",
    subtitle: "Soluzioni integrate per superare le sfide della trasformazione digitale.",
    items: [
      {
        title: "Consulenza Strategica AI & Data",
        description: "Roadmap per l'integrazione di AI Generativa e Predittiva nei processi decisionali.",
        icon: <BrainCircuit className="w-8 h-8 text-[#45e5ed]" />
      },
      {
        title: "Executive Coaching per DMO",
        description: "Affiancamento alla leadership per l'adozione di metodologie Agile e Lean.",
        icon: <Users className="w-8 h-8 text-[#263647]" />
      },
      {
        title: "Ottimizzazione Processi Digitali",
        description: "Audit e reingegnerizzazione degli ecosistemi digitali territoriali.",
        icon: <Laptop className="w-8 h-8 text-[#45e5ed]" />
      },
      {
        title: "Gestione e Allineamento Stakeholder",
        description: "Strategie di coinvolgimento degli attori locali per modelli di sviluppo condivisi.",
        icon: <Network className="w-8 h-8 text-[#263647]" />
      }
    ]
  },
  testimonials: {
    title: "Dicono di Me",
    items: [
      {
        quote: "[Spazio riservato alla recensione] Tema suggerito: implementazione e formazione con tool di AI per il destination management.",
        name: "Paolo Grigolli",
        role: "Esperto Destination Manager e Mentor"
      },
      {
        quote: "[Spazio riservato alla recensione] Tema suggerito: workshop di ispirazione per il team sui temi di AI.",
        name: "Carlo Runggaldier",
        role: "Destination Manager DMO San Vigilio di Marebbe"
      },
      {
        quote: "[Spazio riservato alla recensione] Tema suggerito: percorso di formazione per il team front office che è tuttora in svolgimento.",
        name: "Roberta Agosti",
        role: "Direttore Azienda di Turismo e Soggiorno"
      }
    ]
  },
  footer: {
    linkedin: "https://linkedin.com/in/massimocaria",
    email: "mailto:max@destinova.it",
    destinova: "https://destinova.it",
    copyright: `© ${new Date().getFullYear()} Massimo Caria. Tutti i diritti riservati.`
  }
};

function CalendarModal({ isOpen, onClose, url }: { isOpen: boolean; onClose: () => void; url: string }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-[#263647]/80 backdrop-blur-sm" onClick={onClose}></div>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative w-full max-w-5xl h-[85vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col"
      >
        <div className="flex justify-between items-center p-4 border-b border-[#d7d8d8] bg-[#f8f9fa]">
          <h3 className="font-display font-bold text-[#263647] flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#45e5ed]" />
            Prenota Call Strategica
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            <X className="w-5 h-5 text-[#263647]" />
          </button>
        </div>
        <div className="flex-1 w-full h-full bg-white">
          <iframe 
            src={url} 
            width="100%" 
            height="100%" 
            frameBorder="0" 
            title="Calendly Scheduling Page"
            className="w-full h-full"
          ></iframe>
        </div>
      </motion.div>
    </div>
  );
}

interface TabContent {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
  items: { name: string; desc: string }[];
}

interface LandingPageProps {
  badge: string;
  title: React.ReactNode;
  description: string;
  ctaText: string;
  ctaLink: string;
  ctaAction?: (e: React.MouseEvent) => void;
  features: { icon: React.ReactNode; title: string; subtitle: string; description: string }[];
  modulesTitle?: string;
  modulesSubtitle?: string;
  tabs?: TabContent[];
  bottomCtaTitle: string;
  bottomCtaSubtitle: string;
  bottomCtaText: string;
  bottomCtaLink: string;
  bottomCtaAction?: (e: React.MouseEvent) => void;
  onClose: () => void;
  logo: React.ReactNode;
  theme?: 'destinova' | 'celestec';
}

function LandingPageTemplate(props: LandingPageProps) {
  const [activeTab, setActiveTab] = useState(0);
  const theme = props.theme || 'destinova';

  // Theme Configuration
  const colors = {
    destinova: {
      bg: "bg-[#263647]",
      text: "text-[#263647]",
      accent: "text-[#45e5ed]",
      accentBg: "bg-[#45e5ed]",
      accentBorder: "border-[#45e5ed]",
      buttonText: "text-[#263647]",
      lightBg: "bg-[#f8f9fa]",
      cardBorder: "border-slate-200",
      activeTabBg: "bg-[#263647]",
      activeTabText: "text-white"
    },
    celestec: {
      bg: "bg-[#0052cc]", // Royal Blue
      text: "text-[#003366]", // Darker Blue
      accent: "text-[#00a3ff]", // Light Blue
      accentBg: "bg-[#00a3ff]",
      accentBorder: "border-[#00a3ff]",
      buttonText: "text-white",
      lightBg: "bg-blue-50/50",
      cardBorder: "border-blue-100",
      activeTabBg: "bg-[#0052cc]",
      activeTabText: "text-white"
    }
  };

  const t = colors[theme];

  // Grid background for Celestec
  const gridStyle = theme === 'celestec' ? {
    backgroundImage: 'radial-gradient(#0052cc 0.5px, transparent 0.5px)',
    backgroundSize: '24px 24px',
    backgroundColor: '#ffffff'
  } : {};

  return (
    <div className="fixed inset-0 z-[300] bg-white overflow-y-auto font-sans" style={theme === 'celestec' ? gridStyle : undefined}>
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          {props.logo}
        </div>
        <button onClick={props.onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
          <X className="w-6 h-6 text-slate-600" />
        </button>
      </div>

      {/* Hero */}
      <div className={`${t.bg} text-white py-20 px-6 relative overflow-hidden`}>
        {theme === 'celestec' && (
           <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        )}
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10">
          <div>
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-bold uppercase tracking-widest mb-6`}>
              <Sparkles className={`w-3 h-3 ${theme === 'celestec' ? 'text-white' : 'text-[#45e5ed]'}`} />
              {props.badge}
            </div>
            <h1 className="text-5xl md:text-6xl font-display font-bold mb-6 leading-tight">
              {props.title}
            </h1>
            <p className="text-lg text-white/80 mb-8 max-w-xl leading-relaxed">
              {props.description}
            </p>
            <a 
              href={props.ctaLink}
              onClick={props.ctaAction}
              target={props.ctaLink.startsWith('http') ? "_blank" : undefined}
              rel={props.ctaLink.startsWith('http') ? "noopener noreferrer" : undefined}
              className={`inline-flex items-center gap-2 px-8 py-4 rounded-lg ${t.accentBg} ${t.buttonText} font-bold hover:opacity-90 transition-opacity shadow-lg shadow-blue-900/20`}
            >
              {props.ctaText}
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
          <div className="relative">
            {/* Mockup Graphic */}
            <div className={`aspect-[4/3] rounded-2xl ${theme === 'celestec' ? 'bg-white/10 border-white/20 backdrop-blur-sm' : 'bg-[#1e293b] border-white/10'} shadow-2xl p-6 flex flex-col`}>
              <div className="flex items-center gap-3 mb-8">
                {props.logo}
              </div>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="h-24 rounded-lg bg-white/5 border border-white/10"></div>
                <div className="h-24 rounded-lg bg-white/5 border border-white/10"></div>
                <div className="h-24 rounded-lg bg-white/5 border border-white/10"></div>
              </div>
              <div className="flex-1 rounded-lg bg-white/5 border border-white/10 flex items-end p-4 gap-4">
                <div className="w-1/4 h-1/3 bg-white/10 rounded"></div>
                <div className="w-1/4 h-2/3 bg-white/10 rounded"></div>
                <div className={`w-1/4 h-full ${theme === 'celestec' ? 'bg-[#00a3ff]' : 'bg-[#45e5ed]'} rounded shadow-[0_0_15px_rgba(69,229,237,0.3)]`}></div>
                <div className="w-1/4 h-1/2 bg-white/10 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className={`py-20 px-6 ${theme === 'celestec' ? 'bg-transparent' : 'bg-white border-b border-slate-100'}`}>
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-12">
          {props.features.map((f, i) => (
            <div key={i} className={`flex flex-col items-start ${theme === 'celestec' ? 'bg-white p-8 rounded-2xl shadow-sm border border-blue-100' : ''}`}>
              <div className={`w-12 h-12 rounded-xl ${theme === 'celestec' ? 'bg-blue-50 text-[#0052cc]' : 'bg-[#45e5ed]/10 text-[#45e5ed]'} flex items-center justify-center mb-6`}>
                {f.icon}
              </div>
              <h3 className={`text-xl font-bold ${t.text} mb-1`}>{f.title}</h3>
              <p className={`text-xs font-bold ${t.accent} uppercase tracking-widest mb-4`}>{f.subtitle}</p>
              <p className="text-slate-600 leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Modular Architecture */}
      {props.tabs && props.tabs.length > 0 && (
        <div className={`py-24 px-6 ${t.lightBg}`}>
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className={`text-3xl md:text-4xl font-display font-bold ${t.text} mb-4`}>{props.modulesTitle}</h2>
              <p className="text-slate-600 max-w-2xl mx-auto">{props.modulesSubtitle}</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
              {/* Tabs List */}
              <div className="lg:w-1/3 flex flex-col gap-3">
                {props.tabs.map((tab, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveTab(i)}
                    className={`flex items-center gap-4 p-5 rounded-xl border text-left transition-all ${
                      activeTab === i 
                        ? `${t.activeTabBg} ${theme === 'celestec' ? 'border-[#0052cc]' : 'border-[#263647]'} text-white shadow-lg` 
                        : `bg-white ${t.cardBorder} text-slate-600 hover:${t.accentBorder} hover:shadow-md`
                    }`}
                  >
                    <div className={`${activeTab === i ? (theme === 'celestec' ? 'text-white' : 'text-[#45e5ed]') : 'text-slate-400'}`}>
                      {tab.icon}
                    </div>
                    <div>
                      <div className={`font-bold ${activeTab === i ? 'text-white' : t.text}`}>{tab.title}</div>
                      <div className={`text-sm ${activeTab === i ? 'text-white/70' : 'text-slate-500'}`}>{tab.id}</div>
                    </div>
                    <ArrowRight className={`w-5 h-5 ml-auto ${activeTab === i ? 'text-white/50' : 'text-slate-300'}`} />
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="lg:w-2/3">
                <div className={`bg-white rounded-2xl border ${t.cardBorder} p-8 md:p-10 shadow-xl shadow-slate-200/50 h-full flex flex-col`}>
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`p-3 ${theme === 'celestec' ? 'bg-blue-50 text-[#0052cc]' : 'bg-slate-50 text-[#263647]'} rounded-xl border border-slate-100`}>
                      {props.tabs[activeTab].icon}
                    </div>
                    <h3 className={`text-3xl font-bold ${t.text}`}>{props.tabs[activeTab].title}</h3>
                  </div>
                  <p className="text-slate-600 mb-10 text-lg">{props.tabs[activeTab].description}</p>

                  <div className="grid md:grid-cols-2 gap-4 mb-10 flex-1">
                    {props.tabs[activeTab].items.map((item, i) => (
                      <div key={i} className={`p-6 rounded-xl bg-slate-50 border ${t.cardBorder} relative`}>
                        <div className={`absolute top-6 right-6 w-2 h-2 rounded-full ${theme === 'celestec' ? 'bg-[#00a3ff]' : 'bg-[#d7d8d8]'}`}></div>
                        <h4 className={`font-bold ${t.text} mb-2 pr-6`}>{item.name}</h4>
                        <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
                      </div>
                    ))}
                  </div>

                  <div className={`pt-6 border-t border-slate-100 flex justify-end items-center gap-2 ${t.accent} font-bold text-xs uppercase tracking-widest`}>
                    MODULO ATTIVO <Zap className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom CTA */}
      <div className={`py-24 px-6 ${theme === 'celestec' ? 'bg-transparent' : 'bg-white'} text-center`}>
        <div className="max-w-3xl mx-auto">
          <h2 className={`text-3xl md:text-4xl font-display font-bold ${t.text} mb-6`}>{props.bottomCtaTitle}</h2>
          <p className="text-lg text-slate-600 mb-10">{props.bottomCtaSubtitle}</p>
          <a 
            href={props.bottomCtaLink}
            onClick={props.bottomCtaAction}
            target={props.bottomCtaLink.startsWith('http') ? "_blank" : undefined}
            rel={props.bottomCtaLink.startsWith('http') ? "noopener noreferrer" : undefined}
            className={`inline-flex items-center gap-2 px-8 py-4 rounded-lg ${t.bg} text-white font-bold hover:opacity-90 transition-opacity shadow-lg shadow-blue-900/20`}
          >
            {props.bottomCtaText}
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </div>
    </div>
  );
}

function CelestecModal({ isOpen, onClose, onOpenCalendar }: { isOpen: boolean; onClose: () => void; onOpenCalendar: (e: React.MouseEvent) => void }) {
  if (!isOpen) return null;

  return (
    <LandingPageTemplate
      theme="celestec"
      badge="THE OPERATING SYSTEM FOR TRANSFORMATION"
      title={<>Plasmare il Futuro. <br /><span className="text-[#00a3ff]">Rompere i Silos.</span></>}
      description="La piattaforma AI collaborativa per team interdisciplinari nel turismo. Unisci Strategia, Esecuzione e Valore Umano in un unico sistema."
      ctaText="Richiedi Accesso"
      ctaLink={content.hero.calendarLink}
      ctaAction={(e) => { onClose(); onOpenCalendar(e); }}
      logo={
        <>
          <svg width="32" height="32" viewBox="0 0 100 100" className="text-white">
            <polygon points="50,10 90,90 10,90" fill="currentColor" opacity="0.8"/>
            <polygon points="50,10 90,90 50,70" fill="#45e5ed" opacity="0.9"/>
            <polygon points="50,10 10,90 50,70" fill="#ffffff" opacity="0.9"/>
          </svg>
          <span className="font-display font-bold text-xl text-[#263647] md:text-white">Celestec</span>
        </>
      }
      features={[
        {
          icon: <Network className="w-6 h-6" />,
          title: "Collaborazione Totale",
          subtitle: "ROMPERE I SILOS",
          description: "Strategia, Marketing e Operativo lavorano su un'unica 'Single Source of Truth', riducendo i malintesi e allineando gli obiettivi."
        },
        {
          icon: <BrainCircuit className="w-6 h-6" />,
          title: "Efficienza AI 80/20",
          subtitle: "IL TUO CO-PILOTA",
          description: "L'AI Agentica gestisce l'80% del lavoro (ricerca, struttura, bozze), permettendoti di concentrarti sul 20% di valore umano e strategico."
        },
        {
          icon: <Compass className="w-6 h-6" />,
          title: "Chiarezza Strategica",
          subtitle: "ORIENTAMENTO",
          description: "Framework guidati per navigare la complessità. Trasforma 'tante skills' disconnesse in un flusso di lavoro coerente."
        }
      ]}
      modulesTitle="I Moduli di Celestec"
      modulesSubtitle="Un ecosistema strutturato per guidare le destinazioni dalla visione strategica all'esecuzione operativa."
      tabs={[
        {
          id: "Business",
          title: "Business Modeling",
          icon: <Target className="w-6 h-6" />,
          description: "Allineare gli stakeholder e definire il potenziale della destinazione.",
          items: [
            { name: "Vision", desc: "Esprime l'ambizione di lungo periodo in una frase chiara, facilitando l'allineamento degli stakeholder e rassicurando sulla coerenza strategica." },
            { name: "10 Years Roadmap", desc: "Mostra tappe e priorità con metriche di successo; il team vede che ogni step è collegato a un outcome." },
            { name: "Tourism Asset Analysis", desc: "Identifica attrazioni, servizi e flussi; mostra chiaramente dove c'è domanda latente e dove mancano offerte." },
            { name: "Personas dei Clienti", desc: "Individua il pubblico target e i segmenti di clientela." },
            { name: "Value for Our Customers", desc: "Descrive i vantaggi unici che ogni progetto offre ai clienti." },
            { name: "Surveys", desc: "Raccoglie input e opinioni dagli stakeholder." }
          ]
        },
        {
          id: "Product",
          title: "Product Modeling",
          icon: <Box className="w-6 h-6" />,
          description: "Sviluppare offerte turistiche basate sui dati e differenziarsi dalla concorrenza.",
          items: [
            { name: "Prototype Development", desc: "Si concentra sulla creazione dei concetti di prodotto iniziali e dei prototipi." },
            { name: "Market Insights", desc: "Quantifica segmenti e willingness to pay; consente di decidere con dati, non con opinioni." },
            { name: "Competition", desc: "Confronta feature, pricing e canali; aiuta a visualizzare in che cosa differenziarsi." },
            { name: "Operational Foundations", desc: "Dettaglia le strutture e i sistemi fondamentali vitali per il buon funzionamento dell'attività." }
          ]
        },
        {
          id: "Management",
          title: "Management",
          icon: <Briefcase className="w-6 h-6" />,
          description: "Strutturare l'implementazione e gestire le risorse in modo efficiente.",
          items: [
            { name: "Action Plan", desc: "Presenta un insieme strutturato di passaggi strategici per l'implementazione." },
            { name: "Task Management", desc: "Gestisce gli incarichi, le loro interdipendenze e le responsabilità." },
            { name: "Competency Mapping & Matching", desc: "Definisce le competenze necessarie per il progetto e aiuta a trovare le risorse giuste." }
          ]
        },
        {
          id: "Finance",
          title: "Finance & Legal",
          icon: <LineChart className="w-6 h-6" />,
          description: "Garantire la sostenibilità economica e la conformità legale dei progetti.",
          items: [
            { name: "Financial Outlook", desc: "Scenari con business plan e cash flow; mostrano la sostenibilità economica e la resilienza a variazioni di mercato." },
            { name: "Legal", desc: "Comporta la preparazione e la finalizzazione dei moduli e degli accordi legali di un progetto." },
            { name: "Contributions", desc: "Mappa incentivi/contributi e condizioni; aiuta a ridurre il costo netto e a decidere più velocemente." },
            { name: "Equity Strategy", desc: "Definisce la strategia di partecipazione azionaria e incentivi per i dipendenti, allineando gli interessi a lungo termine." }
          ]
        },
        {
          id: "Brand",
          title: "Brand Development",
          icon: <Compass className="w-6 h-6" />,
          description: "Costruire un'identità forte e coerente per la destinazione.",
          items: [
            { name: "Positioning", desc: "Definisce la promessa distintiva e i proof point; rende facile comunicare internamente 'perché noi'." },
            { name: "Designing the Brand", desc: "CI (Corporate Identity): linee guida visual e tonali legate alle emozioni e ai proof point rilevanti per le personas." }
          ]
        },
        {
          id: "Marketing",
          title: "Marketing e PR",
          icon: <Megaphone className="w-6 h-6" />,
          description: "Comunicare il valore e misurare l'impatto sul mercato.",
          items: [
            { name: "Go-to-Market Strategy", desc: "Campagne orientate ai momenti della customer journey con metriche di impatto; facilita la misurazione del contributo alle vendite." },
            { name: "Content Production", desc: "Contenuti per educare, rassicurare e far emergere il valore; riduce le obiezioni tipiche e accelera i cicli di vendita." }
          ]
        }
      ]}
      bottomCtaTitle="Parte di un futuro migliore"
      bottomCtaSubtitle="Inizia il tuo prossimo progetto di trasformazione con Celestec. Velocità, Qualità e Sicurezza by design."
      bottomCtaText="Richiedi Accesso"
      bottomCtaLink={content.hero.calendarLink}
      bottomCtaAction={(e) => { onClose(); onOpenCalendar(e); }}
      onClose={onClose}
    />
  );
}

function DestinovaModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;

  return (
    <LandingPageTemplate
      badge="DESTINATION MANAGEMENT ACADEMY"
      title={<>Un nuovo ecosistema formativo digitale per i <span className="text-[#45e5ed]">Territori</span></>}
      description="Destinova è l'agenzia specializzata nell'accompagnare destinazioni e operatori turistici attraverso la trasformazione digitale, con un approccio umano e data-driven."
      ctaText="Visita il sito ufficiale"
      ctaLink="https://www.destinova.it"
      logo={
        <>
          <Globe className="w-8 h-8 text-[#45e5ed]" />
          <span className="font-display font-bold text-xl text-[#263647] md:text-white">Destinova</span>
        </>
      }
      features={[
        {
          icon: <Users className="w-6 h-6" />,
          title: "Accessibilità",
          subtitle: "FORMAZIONE DEMOCRATICA",
          description: "Democratizziamo la formazione, rendendola flessibile e accessibile a tutti gli operatori, ovunque si trovino."
        },
        {
          icon: <Target className="w-6 h-6" />,
          title: "Impatto",
          subtitle: "VALORE SUL TERRITORIO",
          description: "Forniamo le competenze per trasformare i fondi pubblici in impatto sociale misurabile e benessere per le comunità."
        },
        {
          icon: <BrainCircuit className="w-6 h-6" />,
          title: "Innovazione",
          subtitle: "TECNOLOGIA E AI",
          description: "Usiamo tecnologia e Intelligenza Artificiale per creare percorsi di apprendimento personalizzati, pratici ed efficaci."
        }
      ]}
      modulesTitle="La Nostra Metodologia"
      modulesSubtitle="Seguiamo l'intero processo, dalla ricerca fondi alla reportistica. Un approccio modulare per ogni esigenza."
      tabs={[
        {
          id: "Ricerca e Mappatura",
          title: "Analisi Strategica",
          icon: <Target className="w-6 h-6" />,
          description: "Partiamo dai vostri obiettivi e mappiamo i canali di finanziamento attivabili per voi.",
          items: [
            { name: "Obiettivi Politici", desc: "Allineamento con le direttive di sviluppo rurale e di mercato." },
            { name: "Mappatura Fondi", desc: "Identificazione di FSE+, LEADER, FUNT e Fondi Interprofessionali." },
            { name: "Studio di Fattibilità", desc: "Valutazione preliminare delle opportunità di successo." }
          ]
        },
        {
          id: "Piani su Misura",
          title: "Progettazione Finanziata",
          icon: <Briefcase className="w-6 h-6" />,
          description: "Disegniamo Piani Formativi su misura che trasformano i fondi da un problema a un'opportunità.",
          items: [
            { name: "Design dei Percorsi", desc: "Costruzione di percorsi efficaci per il territorio." },
            { name: "Sostenibilità", desc: "Piani pienamente sostenibili per l'ente." },
            { name: "Gestione Burocratica", desc: "Supporto completo nella preparazione della documentazione." }
          ]
        },
        {
          id: "Dati e Certificazioni",
          title: "Reportistica Avanzata",
          icon: <Database className="w-6 h-6" />,
          description: "Offerte per team, personalizzazione in white-label e certificazioni digitali.",
          items: [
            { name: "Dashboard Intuitive", desc: "Monitoraggio in tempo reale dei corsisti e dei progressi." },
            { name: "White-label", desc: "Personalizzazione della piattaforma con il vostro brand." },
            { name: "Certificazioni Digitali", desc: "Validazione delle competenze acquisite." }
          ]
        },
        {
          id: "Professionisti e Aziende",
          title: "Target B2C & B2B",
          icon: <Users className="w-6 h-6" />,
          description: "Soluzioni per la crescita individuale e la competitività aziendale.",
          items: [
            { name: "Singoli Corsi", desc: "Accesso flessibile per acquisire competenze pratiche." },
            { name: "Re-skilling", desc: "Percorsi mirati per aggiornare le competenze del team." },
            { name: "Up-skilling", desc: "Aumentare le performance e la competitività aziendale." }
          ]
        },
        {
          id: "Enti e PA",
          title: "Target B2G",
          icon: <Building className="w-6 h-6" />,
          description: "Progettazione su misura e gestione formazione per bandi PNRR.",
          items: [
            { name: "Bandi PNRR", desc: "Gestione completa della formazione legata ai fondi PNRR." },
            { name: "Impatto Sociale", desc: "Massimizzare il ritorno degli investimenti pubblici." },
            { name: "Soluzioni Integrate", desc: "Piattaforme dedicate per la Pubblica Amministrazione." }
          ]
        }
      ]}
      bottomCtaTitle="Pronto a trasformare la tua destinazione?"
      bottomCtaSubtitle="Scopri come l'ecosistema di Celestec può supportare il tuo territorio."
      bottomCtaText="Richiedi Accesso"
      bottomCtaLink={content.hero.calendarLink}
      onClose={onClose}
    />
  );
}

function TransformationEcosystem() {
  const orbits = [
    {
      id: "core",
      title: "Methodology & Skills",
      radius: 220, // Increased radius for better spacing
      color: "#0ea5e9", // Sky blue
      items: [
        { title: "Innovation", subtitle: "Adaptive & Generative", icon: <Sparkles className="w-6 h-6" />, angle: 0 },
        { title: "Data Intelligence", subtitle: "Analysis & Dashboards", icon: <LineChart className="w-6 h-6" />, angle: 120 },
        { title: "Project Management", subtitle: "Agile Processes", icon: <RefreshCw className="w-6 h-6" />, angle: 240 },
      ]
    },
    {
      id: "services",
      title: "Execution & Services",
      radius: 380, // Increased radius
      color: "#8b5cf6", // Purple
      items: [
        { title: "Consulting", subtitle: "Strategic Advisory", icon: <Briefcase className="w-6 h-6" />, angle: 45 },
        { title: "Coaching", subtitle: "Training & Empowerment", icon: <GraduationCap className="w-6 h-6" />, angle: 135 },
        { title: "Stakeholder Mgmt", subtitle: "Community Alignment", icon: <Users className="w-6 h-6" />, angle: 225 },
        { title: "Digital Tech", subtitle: "Technologies & Tools", icon: <Laptop className="w-6 h-6" />, angle: 315 },
      ]
    },
    {
      id: "impact",
      title: "Network & Vision",
      radius: 540, // Increased radius
      color: "#10b981", // Emerald
      items: [
        { title: "Network", subtitle: "Destinations & Partners", icon: <Globe className="w-6 h-6" />, angle: 90 },
        { title: "Territorial Impact", subtitle: "Sustainable Growth", icon: <MapIcon className="w-6 h-6" />, angle: 210 },
        { title: "Vision & Mission", subtitle: "The Why", icon: <Target className="w-6 h-6" />, angle: 330 },
      ]
    }
  ];

  return (
    <div className="relative w-full h-auto lg:h-[1300px] flex items-center justify-center lg:overflow-hidden py-12">
      
      {/* Mobile View */}
      <div className="lg:hidden w-full px-4 space-y-8">
        <div className="flex flex-col items-center text-center p-8 bg-[#263647] text-white rounded-3xl shadow-xl relative overflow-hidden">
           <div className="absolute inset-0 bg-gradient-to-br from-[#45e5ed]/20 to-transparent"></div>
           <div className="w-24 h-24 rounded-full bg-[#263647] border-4 border-[#45e5ed] flex items-center justify-center mb-4 relative z-10 shadow-[0_0_30px_rgba(69,229,237,0.3)]">
             <span className="text-3xl font-bold text-[#45e5ed]">MC</span>
           </div>
           <h3 className="text-2xl font-display font-bold relative z-10">Massimo Caria</h3>
           <p className="text-[#45e5ed] text-sm font-bold uppercase tracking-widest mt-2 relative z-10">Innovation Bridge</p>
        </div>

        <div className="space-y-6">
          {orbits.map((orbit) => (
            <div key={orbit.id} className="space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-widest border-b pb-2" style={{ color: orbit.color, borderColor: `${orbit.color}30` }}>
                {orbit.title}
              </h4>
              <div className="grid gap-3">
                {orbit.items.map((item, i) => (
                  <div 
                    key={i} 
                    className="flex items-center gap-4 p-4 rounded-2xl bg-white shadow-sm active:scale-95 transition-transform cursor-pointer"
                    style={{ border: `1px solid ${orbit.color}30` }}
                  >
                    <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: `${orbit.color}15`, color: orbit.color }}>
                      {item.icon}
                    </div>
                    <div>
                      <div className="font-bold text-[#263647]">{item.title}</div>
                      <div className="text-xs text-[#263647]/60">{item.subtitle}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Desktop View (Orbits) */}
      <div className="hidden lg:block relative w-[1200px] h-[1300px]">
        {/* Center */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 flex flex-col items-center justify-center w-56 h-56 rounded-full bg-[#263647] text-white shadow-[0_0_60px_rgba(38,54,71,0.3)] border-8 border-white">
          <div className="text-5xl font-bold text-[#45e5ed] mb-2">MC</div>
          <div className="font-display font-bold text-xl leading-none">Massimo Caria</div>
          <div className="text-xs font-bold uppercase tracking-widest text-[#45e5ed] mt-2">Innovation Bridge</div>
        </div>

        {/* Orbits */}
        {orbits.map((orbit, orbitIndex) => (
          <div 
            key={orbit.id}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
            style={{ 
              width: orbit.radius * 2, 
              height: orbit.radius * 2,
            }}
          >
            {/* Rotating Dashed Border */}
            <motion.div 
              className="absolute inset-0 rounded-full border border-dashed"
              style={{ borderColor: `${orbit.color}50` }}
              animate={{ rotate: orbitIndex % 2 === 0 ? 360 : -360 }}
              transition={{ duration: 100 + orbitIndex * 30, repeat: Infinity, ease: "linear" }}
            />

            {/* Orbit Label */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest whitespace-nowrap z-10" style={{ color: orbit.color, border: `1px solid ${orbit.color}50` }}>
              {orbit.title}
            </div>

            {/* Nodes */}
            {orbit.items.map((item, i) => {
              const radian = (item.angle * Math.PI) / 180;
              const x = orbit.radius * Math.cos(radian);
              const y = orbit.radius * Math.sin(radian);
              
              return (
                <motion.div
                  key={i}
                  className="absolute top-1/2 left-1/2 flex flex-col items-center justify-center w-40 h-40 bg-white rounded-3xl shadow-lg cursor-pointer pointer-events-auto transition-all z-20 group"
                  style={{ 
                    x: x - 80, // Center the 160px (w-40) element
                    y: y - 80,
                    border: `2px solid ${orbit.color}30`
                  }}
                  initial={{ y: y - 80 }}
                  animate={{ 
                    y: [y - 80 - 10, y - 80 + 10, y - 80 - 10],
                  }}
                  transition={{ 
                    duration: 3 + (i % 3), // Vary duration slightly for organic feel
                    repeat: Infinity,
                    ease: "easeInOut" 
                  }}
                  whileHover={{ scale: 1.05, zIndex: 50, borderColor: orbit.color, boxShadow: `0 20px 25px -5px ${orbit.color}40` }}
                >
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center mb-4 transition-colors duration-300"
                    style={{ backgroundColor: `${orbit.color}15`, color: orbit.color }}
                  >
                    {item.icon}
                  </div>
                  <div className="text-center px-4">
                    <div className="font-bold text-[#263647] text-base leading-tight mb-1.5">{item.title}</div>
                    <div className="text-[10px] text-[#263647]/50 font-medium uppercase tracking-wide leading-tight">{item.subtitle}</div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

function RadarChart({ scores }: { scores: Record<string, number> }) {
  const axes = [
    "Maturità Digitale",
    "Sostenibilità Sociale",
    "Integrazione AI",
    "Capitale Umano",
    "Visione Strategica"
  ];
  
  const size = 400;
  const center = size / 2;
  const radius = size * 0.35;
  
  const points = axes.map((axis, i) => {
    const angle = (i * 2 * Math.PI) / axes.length - Math.PI / 2;
    const score = scores[axis] || 1;
    const r = (score / 5) * radius;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
      labelX: center + (radius + 45) * Math.cos(angle),
      labelY: center + (radius + 45) * Math.sin(angle)
    };
  });
  
  const polygonPath = points.map(p => `${p.x},${p.y}`).join(" ");
  
  return (
    <div className="flex justify-center items-center py-4 w-full overflow-visible">
      <svg viewBox="0 0 400 400" className="w-full h-auto max-w-[400px] overflow-visible">
        {/* Background Circles */}
        {[1, 2, 3, 4, 5].map(level => (
          <circle
            key={level}
            cx={center}
            cy={center}
            r={(level / 5) * radius}
            fill="none"
            stroke="#d7d8d8"
            strokeWidth="1"
            strokeDasharray="4 4"
          />
        ))}
        
        {/* Axes Lines */}
        {axes.map((_, i) => {
          const angle = (i * 2 * Math.PI) / axes.length - Math.PI / 2;
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={center + radius * Math.cos(angle)}
              y2={center + radius * Math.sin(angle)}
              stroke="#d7d8d8"
              strokeWidth="1"
            />
          );
        })}
        
        {/* Data Polygon */}
        <polygon
          points={polygonPath}
          fill="rgba(69, 229, 237, 0.2)"
          stroke="#45e5ed"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        
        {/* Labels */}
        {points.map((p, i) => {
          const angle = (i * 2 * Math.PI) / axes.length - Math.PI / 2;
          let textAnchor = "middle";
          if (Math.cos(angle) > 0.1) textAnchor = "start";
          else if (Math.cos(angle) < -0.1) textAnchor = "end";
          
          return (
            <text
              key={i}
              x={p.labelX}
              y={p.labelY}
              textAnchor={textAnchor}
              dominantBaseline="middle"
              className="text-[10px] sm:text-[11px] font-semibold fill-[#263647] uppercase tracking-tighter"
            >
              {axes[i]}
            </text>
          );
        })}
      </svg>
    </div>
  );
}

function DigitalTwin() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'model', text: string }[]>([
    { role: 'model', text: "Ciao! Sono il Digital Twin di Massimo. Come posso aiutarti oggi nella tua trasformazione digitale?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMsg = input;
    setInput("");
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      if (!genAI) throw new Error("API Key missing");
      const chat = genAI.chats.create({
        model: GEMINI_MODEL,
        config: {
          systemInstruction: "Sei il Digital Twin di Massimo Caria, esperto di AI Strategy, Digital Transformation e Turismo. Il tuo tono è professionale, innovativo e abilitante. Rispondi in modo conciso e utile, basandoti sulla visione di Massimo: l'AI deve essere 'soft' e centrata sulle persone. Non inventare dati personali, ma parla delle competenze di Massimo: Celestec, 18 anni di esperienza, psicologia clinica. Se l'utente chiede di prenotare una call, indirizzalo al pulsante 'Prenota Call' o alla sezione contatti."
        }
      });

      const result = await chat.sendMessage({ message: userMsg });
      setMessages(prev => [...prev, { role: 'model', text: result.text || "Scusami, non sono riuscito a generare una risposta." }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'model', text: "Scusami, sto avendo un piccolo problema tecnico. Puoi contattare Massimo direttamente via LinkedIn!" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      {!isOpen ? (
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 rounded-full bg-[#263647] text-white flex items-center justify-center shadow-2xl border-4 border-white group"
        >
          <Sparkles className="w-8 h-8 group-hover:animate-pulse" />
        </motion.button>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="w-[calc(100vw-32px)] sm:w-[350px] h-[500px] bg-white rounded-3xl shadow-2xl border border-[#d7d8d8] flex flex-col overflow-hidden"
        >
          <div className="p-4 bg-[#263647] text-white flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#45e5ed]/20 flex items-center justify-center border border-[#45e5ed]">
                <span className="text-sm font-bold text-[#45e5ed]">MC</span>
              </div>
              <div>
                <div className="text-sm font-bold">Digital Twin</div>
                <div className="text-[10px] text-[#45e5ed] uppercase tracking-widest flex items-center gap-1">
                  Online
                  {!genAI && <span className="ml-2 text-amber-400 font-bold">(DEMO)</span>}
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/10 rounded-full transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#f8f9fa]">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${m.role === 'user' ? 'bg-[#45e5ed] text-[#263647] rounded-tr-none' : 'bg-white text-[#263647] border border-[#d7d8d8] rounded-tl-none'}`}>
                  {m.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white p-3 rounded-2xl border border-[#d7d8d8] rounded-tl-none">
                  <Loader2 className="w-4 h-4 animate-spin text-[#45e5ed]" />
                </div>
              </div>
            )}
          </div>
          
          <div className="p-4 border-t border-[#d7d8d8] bg-white flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Chiedi qualcosa..."
              className="flex-1 bg-[#f8f9fa] border border-[#d7d8d8] rounded-full px-4 py-2 text-sm focus:outline-none focus:border-[#45e5ed]"
            />
            <button 
              onClick={handleSend}
              disabled={isLoading}
              className="w-10 h-10 rounded-full bg-[#263647] text-white flex items-center justify-center hover:bg-[#263647]/90 disabled:opacity-50 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}

function AuditTool({ onOpenCalendar }: { onOpenCalendar: (e: React.MouseEvent) => void }) {
  const [hasStarted, setHasStarted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isFinished, setIsFinished] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState("");
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [customProfile, setCustomProfile] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [leadData, setLeadData] = useState({ name: "", email: "", company: "" });
  const [formError, setFormError] = useState("");
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);

  // Filter steps based on conditions
  const visibleSteps = content.audit.steps.filter(step => !step.condition || step.condition(answers));

  const handleOptionSelect = (option: any) => {
    if ((visibleSteps[currentStep].id === "profile" || visibleSteps[currentStep].id === "role_public" || visibleSteps[currentStep].id === "role_private") && option.text === "Altro") {
      setShowCustomInput(true);
      return;
    }
    
    const newAnswers = { ...answers, [visibleSteps[currentStep].id]: option.text };
    setAnswers(newAnswers);
    
    if (currentStep < visibleSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowLeadForm(true);
    }
  };

  const handleCustomProfileSubmit = () => {
    if (!customProfile.trim()) return;
    
    const newAnswers = { ...answers, [visibleSteps[currentStep].id]: `Altro: ${customProfile}` };
    setAnswers(newAnswers);
    setShowCustomInput(false);
    setCustomProfile("");
    
    if (currentStep < visibleSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowLeadForm(true);
    }
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    // Client-side validation
    if (!leadData.name.trim() || !leadData.email.trim() || !leadData.company.trim()) {
      setFormError("Per favore, compila tutti i campi obbligatori (Nome, Email e Azienda).");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(leadData.email)) {
      setFormError("Per favore, inserisci un indirizzo email valido.");
      return;
    }

    setIsSubmittingLead(true);
    
    // URL del Webhook (Sostituisci con l'URL del tuo Google Apps Script o Make.com)
    const webhookUrl = "https://script.google.com/macros/s/AKfycbxgl0uEK9Cj9qRzMNzSdHZOOOM7Ki6Te_U_pKKkN6LRCigRzpNuXcmsC1OGEXpvHuf-/exec";
    
    // Normalize answers to ensure all fields are present for Google Sheets mapping
    const normalizedAnswers: Record<string, string> = {};
    content.audit.steps.forEach(step => {
      normalizedAnswers[step.id] = answers[step.id] || "N/A";
    });

    try {
      // Invio dati al webhook (compatibile con Google Apps Script e Make.com)
      await fetch(webhookUrl, {
        method: "POST",
        // Usiamo text/plain per evitare problemi di CORS con Google Apps Script
        headers: {
          "Content-Type": "text/plain;charset=utf-8",
        },
        body: JSON.stringify({
          lead: leadData,
          answers: normalizedAnswers,
          source: "Audit Destinova"
        }),
      });
    } catch (error) {
      console.error("Error sending lead data:", error);
      // We continue anyway so the user gets their results
    }
    
    setIsSubmittingLead(false);
    setShowLeadForm(false);
    setIsFinished(true);
    generateAnalysis(answers);
  };

  const skipLeadForm = () => {
    setShowLeadForm(false);
    setIsFinished(true);
    generateAnalysis(answers);
  };

  const calculateScores = () => {
    const scores: Record<string, number[]> = {
      "Maturità Digitale": [],
      "Sostenibilità Sociale": [],
      "Integrazione AI": [],
      "Capitale Umano": [],
      "Visione Strategica": []
    };

    content.audit.steps.forEach(step => {
      const answerText = answers[step.id];
      if (answerText) {
        const option = step.options.find(o => o.text === answerText);
        if (option && option.category) {
          scores[option.category].push(option.value);
        }
      }
    });

    const finalScores: Record<string, number> = {};
    Object.keys(scores).forEach(key => {
      const vals = scores[key];
      finalScores[key] = vals.length > 0 ? vals.reduce((a, b) => a + b, 0) / vals.length : 3;
    });

    return finalScores;
  };

  const generateAnalysis = async (finalAnswers: any) => {
    setIsLoadingAi(true);
    try {
      if (!genAI) {
        setAiAnalysis("### Executive Summary (Demo Mode)\n\nIl tuo profilo mostra una propensione all'innovazione, ma con margini di miglioramento nell'integrazione dei dati. \n\n**Spunto di Riflessione**\nIl consolidamento delle basi digitali è il primo passo fondamentale prima di scalare verso l'AI predittiva.\n\n*Nota: Questa è un'analisi predefinita perché la chiave API non è configurata.*");
        return;
      }

      const prompt = `Analizza i risultati di questo audit strategico condotto da Massimo Caria (esperto di AI e Turismo) per una destinazione o azienda turistica:
      ${JSON.stringify(finalAnswers, null, 2)}
      
      Fornisci un "Executive Summary Preliminare" in formato Markdown. 
      ATTENZIONE: Sii cauto e professionale. Ricorda che questa è un'analisi basata su sole 13 domande, quindi offri spunti di riflessione ad alto livello e non sentenze definitive. L'obiettivo è incuriosire e spingere l'utente a prenotare una Call Strategica per approfondire.
      Usa il tono di Massimo: esperto, empatico (background in psicologia), focalizzato sulla 'Soft AI' e sul superamento dei colli di bottiglia.
      
      Struttura richiesta:
      1. **Fotografia Attuale**: Un brevissimo riassunto di dove si trova l'organizzazione oggi.
      2. **Spunto di Riflessione**: 1-2 punti chiave su cui lavorare (opportunità o colli di bottiglia).
      
      Sii conciso, diretto e usa un linguaggio che ispiri fiducia e azione. Non superare le 100-150 parole. Non aggiungere conclusioni o inviti all'azione, ci sarà un bottone dedicato sotto il tuo testo.`;

      const result = await genAI.models.generateContent({
        model: GEMINI_MODEL,
        contents: prompt
      });
      setAiAnalysis(result.text || "Analisi non disponibile.");
    } catch (error) {
      console.error(error);
      setAiAnalysis("Errore nella generazione dell'analisi AI. Consulta la roadmap qui sotto.");
    } finally {
      setIsLoadingAi(false);
    }
  };

  if (!hasStarted) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl border border-[#d7d8d8] shadow-2xl p-8 md:p-16 max-w-4xl mx-auto text-center relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#45e5ed]/10 rounded-full blur-[80px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#45e5ed]/10 rounded-full blur-[80px] pointer-events-none"></div>
        
        <div className="relative z-10 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#45e5ed]/10 text-[#263647] text-xs font-bold uppercase tracking-widest mb-8">
            <Sparkles className="w-4 h-4 text-[#45e5ed]" />
            Assessment Gratuito
          </div>
          
          <h2 className="text-3xl md:text-5xl font-display font-bold text-[#263647] mb-6">
            {content.audit.title}
          </h2>
          
          <p className="text-lg md:text-xl text-[#263647]/70 mb-10 leading-relaxed">
            Scopri il livello di maturità digitale della tua organizzazione in meno di 3 minuti. 
            Rispondi a poche semplici domande per ricevere un'analisi personalizzata e una roadmap strategica per il futuro della tua destinazione.
          </p>
          
          <button 
            onClick={() => setHasStarted(true)}
            className="px-8 py-4 rounded-full bg-[#263647] text-white font-medium hover:bg-[#263647]/90 transition-colors inline-flex items-center justify-center gap-2 group shadow-lg shadow-[#263647]/20 text-lg"
          >
            Scopri il tuo approccio
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </motion.div>
    );
  }

  if (showLeadForm) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl border border-[#d7d8d8] shadow-2xl p-8 md:p-12 max-w-2xl mx-auto text-center"
      >
        <div className="w-16 h-16 rounded-full bg-[#45e5ed]/10 flex items-center justify-center mx-auto mb-6">
          <Send className="w-8 h-8 text-[#45e5ed]" />
        </div>
        <h3 className="text-3xl font-display font-bold text-[#263647] mb-4">Assessment Completato!</h3>
        <p className="text-[#263647]/70 mb-8">
          Inserisci i tuoi dati per ricevere i risultati dell'analisi e scoprire il livello di maturità digitale della tua destinazione.
        </p>

        {formError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-medium">
            {formError}
          </div>
        )}
        
        <form onSubmit={handleLeadSubmit} className="space-y-4 text-left">
          <div>
            <label className="block text-sm font-bold text-[#263647] mb-2">Nome e Cognome *</label>
            <input 
              type="text" 
              required
              value={leadData.name}
              onChange={(e) => {
                setLeadData({...leadData, name: e.target.value});
                if (formError) setFormError("");
              }}
              className={`w-full p-4 rounded-xl border ${formError && !leadData.name.trim() ? 'border-red-300' : 'border-[#d7d8d8]'} focus:border-[#45e5ed] focus:ring-1 focus:ring-[#45e5ed] outline-none transition-all`}
              placeholder="Mario Rossi"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-[#263647] mb-2">Email *</label>
            <input 
              type="email" 
              required
              value={leadData.email}
              onChange={(e) => {
                setLeadData({...leadData, email: e.target.value});
                if (formError) setFormError("");
              }}
              className={`w-full p-4 rounded-xl border ${formError && (!leadData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(leadData.email)) ? 'border-red-300' : 'border-[#d7d8d8]'} focus:border-[#45e5ed] focus:ring-1 focus:ring-[#45e5ed] outline-none transition-all`}
              placeholder="mario.rossi@email.com"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-[#263647] mb-2">Ente / Azienda *</label>
            <input 
              type="text" 
              required
              value={leadData.company}
              onChange={(e) => {
                setLeadData({...leadData, company: e.target.value});
                if (formError) setFormError("");
              }}
              className={`w-full p-4 rounded-xl border ${formError && !leadData.company.trim() ? 'border-red-300' : 'border-[#d7d8d8]'} focus:border-[#45e5ed] focus:ring-1 focus:ring-[#45e5ed] outline-none transition-all`}
              placeholder="Nome della tua organizzazione"
            />
          </div>
          
          <div className="pt-4 flex flex-col sm:flex-row gap-4">
            <button 
              type="button"
              onClick={skipLeadForm}
              className="flex-1 py-4 px-6 rounded-xl border border-[#d7d8d8] text-[#263647] font-bold uppercase tracking-widest text-xs hover:bg-gray-50 transition-colors"
            >
              Salta e vedi i risultati
            </button>
            <button 
              type="submit"
              disabled={isSubmittingLead}
              className="flex-1 py-4 px-6 rounded-xl bg-[#263647] text-white font-bold uppercase tracking-widest text-xs hover:bg-[#263647]/90 transition-colors disabled:opacity-70 flex justify-center items-center gap-2"
            >
              {isSubmittingLead ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" /> Invio in corso...
                </>
              ) : (
                <>
                  Vedi Risultati <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    );
  }

  if (isFinished) {
    const scores = calculateScores();
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl border border-[#d7d8d8] shadow-2xl p-6 md:p-12 max-w-6xl mx-auto"
      >
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-start mb-12 md:mb-16">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#45e5ed]/10 text-[#263647] text-xs font-bold uppercase tracking-widest mb-6">
              <Target className="w-4 h-4" />
              Il Tuo Posizionamento
            </div>
            <h3 className="text-2xl md:text-3xl font-display font-bold mb-8">Analisi Strategica 2025</h3>
            <RadarChart scores={scores} />
          </div>
          
          <div className="bg-[#f8f9fa] p-6 md:p-8 rounded-3xl border border-[#d7d8d8]">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
              <div className="flex items-center gap-3">
                <Sparkles className="w-6 h-6 text-[#45e5ed] flex-shrink-0" />
                <h4 className="text-lg md:text-xl font-display font-bold">Executive Summary Preliminare</h4>
              </div>
              {!genAI && (
                <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-700 text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">Demo Mode</span>
              )}
            </div>
            {isLoadingAi ? (
              <div className="flex flex-col items-center justify-center py-12 gap-4">
                <Loader2 className="w-8 h-8 animate-spin text-[#45e5ed]" />
                <p className="text-sm text-gray-500 text-center">Il Digital Twin sta elaborando i tuoi dati...</p>
              </div>
            ) : (
              <>
                <div className="prose prose-sm prose-slate max-w-none text-[#263647]/80 mb-8 bg-white p-4 md:p-6 rounded-2xl border border-[#d7d8d8] shadow-sm">
                  <Markdown>{aiAnalysis}</Markdown>
                </div>
                <button 
                  onClick={onOpenCalendar}
                  className="w-full py-4 rounded-xl bg-[#263647] text-white font-bold uppercase tracking-widest text-sm hover:bg-[#263647]/90 transition-colors flex items-center justify-center gap-2 shadow-lg"
                >
                  <Calendar className="w-5 h-5" />
                  Approfondisci in Call
                </button>
              </>
            )}
          </div>
        </div>

        <h4 className="text-xl md:text-2xl font-display font-bold mb-8 text-center">La Tua Roadmap Strategica</h4>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: "Consolidamento Basi", icon: <ShieldCheck className="w-6 h-6" />, desc: "Audit tecnico e pulizia dei dati per creare fondamenta solide." },
            { title: "Empowerment Team", icon: <Users className="w-6 h-6" />, desc: "Workshop di Soft AI Introduction per abbattere le barriere culturali." },
            { title: "Integrazione AI", icon: <BrainCircuit className="w-6 h-6" />, desc: "Implementazione di strumenti predittivi e generativi mirati." },
            { title: "Scaling Ecosistema", icon: <Rocket className="w-6 h-6" />, desc: "Allineamento stakeholder e apertura verso modelli di business innovativi." }
          ].map((card, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-6 rounded-2xl border border-[#d7d8d8] bg-white hover:border-[#45e5ed] transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-[#f8f9fa] text-[#45e5ed] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                {card.icon}
              </div>
              <h5 className="font-bold mb-2">{card.title}</h5>
              <p className="text-xs text-gray-500 mb-6 leading-relaxed">{card.desc}</p>
              <div className="space-y-2">
                <a href={content.hero.calendarLink} onClick={onOpenCalendar} className="block w-full py-2 text-center text-[10px] font-bold uppercase tracking-widest bg-[#263647] text-white rounded-lg hover:bg-[#263647]/90 transition-colors">Coaching Live</a>
                <a href={`mailto:max@destinova.it?subject=Analisi Tecnica: ${card.title}`} target="_blank" rel="noopener noreferrer" className="block w-full py-2 text-center text-[10px] font-bold uppercase tracking-widest border border-[#d7d8d8] text-[#263647] rounded-lg hover:bg-gray-50 transition-colors">Analisi Tecnica</a>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <button onClick={() => { setHasStarted(false); setCurrentStep(0); setIsFinished(false); setAnswers({}); }} className="text-sm font-semibold text-[#45e5ed] hover:underline flex items-center justify-center gap-2 mx-auto">
            <RefreshCw className="w-4 h-4" />
            Ricomincia Audit
          </button>
        </div>
      </motion.div>
    );
  }

  const step = visibleSteps[currentStep];

  return (
    <div className="bg-white rounded-3xl border border-[#d7d8d8] shadow-xl p-8 md:p-12 max-w-4xl mx-auto relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#45e5ed]/10 rounded-full blur-[80px] pointer-events-none"></div>
      
      <div className="relative z-10">
        <div className="flex justify-between items-center mb-12">
          <div className="flex items-center gap-4">
            {currentStep > 0 && (
              <button onClick={() => setCurrentStep(currentStep - 1)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <ChevronLeft className="w-6 h-6 text-gray-400" />
              </button>
            )}
            <span className="text-sm font-bold text-[#45e5ed] uppercase tracking-widest">
              Step {currentStep + 1} di {visibleSteps.length}
            </span>
          </div>
          <div className="flex gap-0.5 sm:gap-1 flex-1 justify-end ml-4">
            {visibleSteps.map((_, idx) => (
              <div key={idx} className={`h-1.5 rounded-full transition-all duration-300 ${idx <= currentStep ? 'w-4 sm:w-6 bg-[#45e5ed]' : 'w-1.5 sm:w-2 bg-[#d7d8d8]'}`}></div>
            ))}
          </div>
        </div>
        
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="min-h-[350px]"
        >
          <h3 className="text-2xl md:text-4xl font-display font-bold mb-8 text-[#263647] leading-tight">
            {step.question}
          </h3>
          
          {showCustomInput ? (
            <div className="space-y-4">
              <input
                type="text"
                value={customProfile}
                onChange={(e) => setCustomProfile(e.target.value)}
                placeholder="Specifica il tuo profilo..."
                className="w-full p-6 rounded-2xl border-2 border-[#45e5ed] focus:outline-none text-lg"
                autoFocus
              />
              <div className="flex gap-4">
                <button
                  onClick={() => setShowCustomInput(false)}
                  className="flex-1 p-4 rounded-xl border border-[#d7d8d8] text-gray-500 font-bold uppercase tracking-widest text-xs"
                >
                  Annulla
                </button>
                <button
                  onClick={handleCustomProfileSubmit}
                  className="flex-1 p-4 rounded-xl bg-[#263647] text-white font-bold uppercase tracking-widest text-xs"
                >
                  Conferma
                </button>
              </div>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-3">
              {step.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleOptionSelect(option)}
                  className="text-left p-4 md:p-6 rounded-2xl border border-[#d7d8d8] hover:border-[#45e5ed] hover:bg-[#45e5ed]/5 transition-all duration-300 text-[#263647] font-medium group flex justify-between items-center hover:shadow-lg"
                >
                  <span className="text-base md:text-lg leading-tight">{option.text}</span>
                  <ArrowRight className="w-4 h-4 md:w-5 md:h-5 text-[#d7d8d8] group-hover:text-[#45e5ed] transition-transform group-hover:translate-x-1 flex-shrink-0" />
                </button>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default function App() {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isCelestecOpen, setIsCelestecOpen] = useState(false);
  const [isDestinovaOpen, setIsDestinovaOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleOpenCalendar = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsCalendarOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#ffffff] text-[#263647] selection:bg-[#45e5ed]/30 font-sans">
      <CalendarModal 
        isOpen={isCalendarOpen} 
        onClose={() => setIsCalendarOpen(false)} 
        url={content.hero.calendarLink} 
      />
      <CelestecModal 
        isOpen={isCelestecOpen} 
        onClose={() => setIsCelestecOpen(false)} 
        onOpenCalendar={(e) => {
          e.preventDefault();
          setIsCalendarOpen(true);
        }}
      />
      <DestinovaModal 
        isOpen={isDestinovaOpen} 
        onClose={() => setIsDestinovaOpen(false)} 
      />
      {/* Background Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#d7d8d8_1px,transparent_1px),linear-gradient(to_bottom,#d7d8d8_1px,transparent_1px)] bg-[size:40px_40px] opacity-20 mask-image:linear-gradient(to_bottom,white,transparent)"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-[#45e5ed]/10 rounded-full blur-[120px] opacity-50"></div>
      </div>

      <div className="relative z-10">
        {/* Navigation */}
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#d7d8d8]/50">
          <div className="container mx-auto px-6 py-4 flex justify-between items-center">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="font-display font-bold text-2xl tracking-tight flex items-center gap-1"
            >
              <a href="#hero">{content.hero.name.split(' ').map(n => n[0]).join('')}<span className="text-[#45e5ed]">.</span></a>
            </motion.div>
            
            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-[#263647]/80">
              <a href="#hero" className="hover:text-[#45e5ed] transition-colors">Hero</a>
              <a href="#assessment" className="text-[#45e5ed] font-bold hover:text-[#263647] transition-colors">Fai l'Audit gratuito</a>
              <a href="#ecosistema" className="hover:text-[#45e5ed] transition-colors">Ecosistema</a>
              <a href="#about" className="hover:text-[#45e5ed] transition-colors">Chi Sono</a>
              <a href="#servizi" className="hover:text-[#45e5ed] transition-colors">Servizi</a>
              <a href="#contact" className="hover:text-[#45e5ed] transition-colors">Contatti</a>
            </div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="hidden md:block"
            >
              <a 
                href={content.hero.calendarLink}
                onClick={handleOpenCalendar}
                className="px-6 py-2.5 rounded-full border border-[#d7d8d8] hover:border-[#263647] transition-colors text-sm font-medium flex items-center gap-2 bg-white"
              >
                <Calendar className="w-4 h-4" />
                <span className="hidden sm:inline">Prenota Call</span>
              </a>
            </motion.div>

            <div className="md:hidden flex items-center">
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-[#263647] p-2">
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-[#d7d8d8]/50 shadow-lg py-4 px-6 flex flex-col gap-4">
              <a href="#hero" onClick={() => setIsMobileMenuOpen(false)} className="text-[#263647] font-medium py-2 border-b border-gray-100">Hero</a>
              <a href="#assessment" onClick={() => setIsMobileMenuOpen(false)} className="text-[#45e5ed] font-bold py-2 border-b border-gray-100">Fai l'Audit gratuito</a>
              <a href="#ecosistema" onClick={() => setIsMobileMenuOpen(false)} className="text-[#263647] font-medium py-2 border-b border-gray-100">Ecosistema</a>
              <a href="#about" onClick={() => setIsMobileMenuOpen(false)} className="text-[#263647] font-medium py-2 border-b border-gray-100">Chi Sono</a>
              <a href="#servizi" onClick={() => setIsMobileMenuOpen(false)} className="text-[#263647] font-medium py-2 border-b border-gray-100">Servizi</a>
              <a href="#contact" onClick={() => setIsMobileMenuOpen(false)} className="text-[#263647] font-medium py-2 border-b border-gray-100">Contatti</a>
              <a 
                href={content.hero.calendarLink}
                onClick={(e) => { setIsMobileMenuOpen(false); handleOpenCalendar(e); }}
                className="mt-2 px-6 py-3 rounded-full bg-[#263647] text-white text-center font-medium flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                Prenota Call
              </a>
            </div>
          )}
        </nav>

        {/* Hero Section */}
        <section id="hero" className="container mx-auto px-6 pt-20 pb-32 md:pt-28 md:pb-40 flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gray-200 border border-transparent shadow-sm text-sm font-bold text-[#263647] mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-[#45e5ed] animate-pulse"></span>
            {content.hero.name} &mdash; {content.hero.role}
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
            className="text-4xl md:text-6xl lg:text-7xl font-display font-semibold tracking-tight leading-tight mb-8 max-w-5xl text-[#263647]"
          >
            {content.hero.headline}
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="text-lg md:text-xl text-[#263647]/70 max-w-3xl mb-12 font-light leading-relaxed"
          >
            {content.hero.subheadline}
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45, ease: "easeOut" }}
            className="flex flex-col sm:flex-row gap-4 mb-16"
          >
            <a 
              href={content.hero.calendarLink}
              onClick={handleOpenCalendar}
              className="px-8 py-4 rounded-full bg-[#263647] text-white font-medium hover:bg-[#263647]/90 transition-colors flex items-center justify-center gap-2 group shadow-lg shadow-[#263647]/20"
            >
              {content.hero.ctaPrimary}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
            <a 
              href="#assessment" 
              className="px-8 py-4 rounded-full bg-white border border-[#d7d8d8] text-[#263647] font-medium hover:border-[#263647] hover:bg-gray-50 transition-all flex items-center justify-center shadow-sm"
            >
              {content.hero.ctaSecondary}
            </a>
          </motion.div>

          {/* Mission Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="max-w-4xl mx-auto bg-white/50 backdrop-blur-sm border border-[#d7d8d8] rounded-3xl p-8 md:p-10 shadow-sm relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#45e5ed] to-transparent opacity-50"></div>
            <h3 className="text-xl font-display font-bold text-[#263647] mb-4 flex items-center justify-center gap-2">
              <Target className="w-5 h-5 text-[#45e5ed]" />
              {content.hero.missionTitle}
            </h3>
            <p className="text-lg text-[#263647]/80 leading-relaxed font-light">
              {content.hero.missionText}
            </p>
          </motion.div>
        </section>

        {/* Assessment Section (Audit Strategico) */}
        <section id="assessment" className="py-12 relative z-20 -mt-20 mb-12">
          <div className="container mx-auto px-6">
            <AuditTool onOpenCalendar={handleOpenCalendar} />
          </div>
        </section>

        {/* L'Ecosistema di Trasformazione */}
        <section id="ecosistema" className="py-32 border-t border-[#d7d8d8]/50 bg-[#f8f9fa] overflow-hidden">
          <div className="container mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-5xl font-display font-semibold mb-6">{content.ecosystem.title}</h2>
              <p className="text-[#263647]/70 text-lg font-light leading-relaxed">
                {content.ecosystem.subtitle}
              </p>
            </div>
            
            <TransformationEcosystem />
          </div>
        </section>

        {/* Competenze & Innovazione */}
        <section id="about" className="py-32 border-t border-[#d7d8d8]/50 relative bg-white">
          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-4xl mx-auto mb-20 text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#45e5ed]/10 text-[#263647] text-xs font-bold uppercase tracking-widest mb-6">
                <Sparkles className="w-3 h-3" />
                Expertise & Vision
              </div>
              <h2 className="text-4xl md:text-5xl font-display font-bold text-[#263647] mb-6">
                Leadership, <span className="text-[#45e5ed]">Innovazione</span> e Crescita Strategica
              </h2>
              <p className="text-xl text-[#263647]/70 font-light leading-relaxed">
                Diciotto anni di esperienza nel guidare la trasformazione digitale nel turismo, fondendo competenze manageriali, metodologie di crescita e tecnologie d'avanguardia per la competitività delle destinazioni.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-16 items-start">
              {/* Colonna Sinistra: Esperienze Chiave */}
              <div className="space-y-10">
                <h3 className="text-2xl font-display font-bold text-[#263647] mb-8 flex items-center gap-3">
                  <Briefcase className="w-6 h-6 text-[#45e5ed]" />
                  Percorso Professionale
                </h3>
                
                <div className="relative pl-8 border-l-2 border-[#d7d8d8] space-y-12">
                  <div className="relative">
                    <div className="absolute -left-[41px] top-0 w-5 h-5 rounded-full bg-[#45e5ed] border-4 border-white shadow-sm"></div>
                    <h4 className="text-lg font-bold text-[#263647]">Destinova</h4>
                    <p className="text-sm text-[#45e5ed] font-bold uppercase tracking-wider mb-2">Presente</p>
                    <p className="text-[#263647]/70 text-sm leading-relaxed">
                      Founder & Innovation Manager. Partner strategico per DMO e DMC nella digital transformation e nell'adozione di tecnologie esponenziali.
                    </p>
                  </div>

                  <div className="relative">
                    <div className="absolute -left-[41px] top-0 w-5 h-5 rounded-full bg-[#45e5ed] border-4 border-white shadow-sm"></div>
                    <h4 className="text-lg font-bold text-[#263647]">Celestec</h4>
                    <p className="text-sm text-[#45e5ed] font-bold uppercase tracking-wider mb-2">Presente</p>
                    <p className="text-[#263647]/70 text-sm leading-relaxed">
                      Business Developer Tourism. Sviluppo di ecosistemi di partnership strategiche e opportunità commerciali ad alto valore aggiunto.
                    </p>
                  </div>

                  <div className="relative">
                    <div className="absolute -left-[41px] top-0 w-5 h-5 rounded-full bg-[#45e5ed] border-4 border-white shadow-sm"></div>
                    <h4 className="text-lg font-bold text-[#263647]">Freelance Innovation Consultant</h4>
                    <p className="text-sm text-[#45e5ed] font-bold uppercase tracking-wider mb-2">Presente</p>
                    <p className="text-[#263647]/70 text-sm leading-relaxed">
                      Consulente Senior per l'Innovazione. Advisory strategico per enti e organizzazioni turistiche su progetti di sviluppo e digitalizzazione.
                    </p>
                  </div>

                  <div className="relative">
                    <div className="absolute -left-[41px] top-0 w-5 h-5 rounded-full bg-white border-4 border-[#d7d8d8]"></div>
                    <h4 className="text-lg font-bold text-[#263647]">Factory</h4>
                    <p className="text-sm text-[#263647]/40 font-bold uppercase tracking-wider mb-2">2022 - PRESENTE</p>
                    <p className="text-[#263647]/70 text-sm leading-relaxed">
                      Business Development Manager. Espansione dell'ecosistema digitale per destinazioni e gestione relazioni B2B/B2G.
                    </p>
                  </div>

                  <div className="relative">
                    <div className="absolute -left-[41px] top-0 w-5 h-5 rounded-full bg-white border-4 border-[#d7d8d8]"></div>
                    <h4 className="text-lg font-bold text-[#263647]">Zukunvt</h4>
                    <p className="text-sm text-[#263647]/40 font-bold uppercase tracking-wider mb-2">2019 - 2022</p>
                    <p className="text-[#263647]/70 text-sm leading-relaxed">
                      Head of Growth & Strategy. Creazione e gestione di reparti marketing data-driven per l'accelerazione di business turistici.
                    </p>
                  </div>

                  <div className="relative">
                    <div className="absolute -left-[41px] top-0 w-5 h-5 rounded-full bg-white border-4 border-[#d7d8d8]"></div>
                    <h4 className="text-lg font-bold text-[#263647]">Tooly.tips (Founder)</h4>
                    <p className="text-sm text-[#263647]/40 font-bold uppercase tracking-wider mb-2">2017 - 2019</p>
                    <p className="text-[#263647]/70 text-sm leading-relaxed">
                      Founder & CEO. Ideazione e lancio del primo marketplace italiano dedicato all'Hospitality Tech.
                    </p>
                  </div>

                  <div className="relative">
                    <div className="absolute -left-[41px] top-0 w-5 h-5 rounded-full bg-white border-4 border-[#d7d8d8]"></div>
                    <h4 className="text-lg font-bold text-[#263647]">Zeppelin Group</h4>
                    <p className="text-sm text-[#263647]/40 font-bold uppercase tracking-wider mb-2">2006 - 2017</p>
                    <p className="text-[#263647]/70 text-sm leading-relaxed">
                      Country Manager Italia e Direttore sviluppo Business soluzioni CRM. Progettazione di strategie digitali per l'indipendenza delle strutture ricettive dalle OTA.
                    </p>
                  </div>
                </div>
              </div>

              {/* Colonna Destra: Competenze & Tool */}
              <div className="space-y-12">
                {/* Approccio & Visione */}
                <div className="bg-[#263647] rounded-3xl p-8 text-white shadow-xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-[#45e5ed]/10 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/2 group-hover:bg-[#45e5ed]/20 transition-colors duration-500"></div>
                  
                  <h3 className="text-xl font-bold mb-8 flex items-center gap-3 relative z-10">
                    <BrainCircuit className="w-6 h-6 text-[#45e5ed]" />
                    Approccio & Visione
                  </h3>

                  <div className="space-y-8 relative z-10">
                    <div>
                      <h4 className="font-bold text-[#45e5ed] mb-2 flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        Leadership Empatica & Human-Centric
                      </h4>
                      <p className="text-sm text-white/80 leading-relaxed">
                        Un approccio che pone le persone al centro della trasformazione. Utilizzo la psicologia dinamica per allineare gli stakeholder e gestire il change management con efficacia.
                      </p>
                    </div>

                    <div>
                      <h4 className="font-bold text-[#45e5ed] mb-2 flex items-center gap-2">
                        <Rocket className="w-4 h-4" />
                        Strategia Agile & Data-Driven
                      </h4>
                      <p className="text-sm text-white/80 leading-relaxed">
                        Transizione da modelli intuitivi a processi decisionali basati sui dati. Adozione di metodologie Agile per garantire flessibilità e risultati misurabili.
                      </p>
                    </div>

                    <div>
                      <h4 className="font-bold text-[#45e5ed] mb-2 flex items-center gap-2">
                        <Network className="w-4 h-4" />
                        Visione Sistemica & Integrazione
                      </h4>
                      <p className="text-sm text-white/80 leading-relaxed">
                        Capacità di connettere silos funzionali (Marketing, Sales, Tech) per creare ecosistemi integrati e sbloccare valore latente.
                      </p>
                    </div>

                    <div>
                      <h4 className="font-bold text-[#45e5ed] mb-2 flex items-center gap-2">
                        <Target className="w-4 h-4" />
                        Imprenditorialità & Innovazione
                      </h4>
                      <p className="text-sm text-white/80 leading-relaxed">
                        Mentalità orientata al risultato forgiata dall'esperienza imprenditoriale. Trasformazione della complessità in opportunità di crescita scalabile.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Tech Stack & Tools */}
                <div>
                  <h3 className="text-xl font-bold text-[#263647] mb-6 flex items-center gap-3">
                    <Code className="w-6 h-6 text-[#45e5ed]" />
                    Tech Stack & Management Tools
                  </h3>

                  <p className="text-sm text-[#263647]/70 mb-8 leading-relaxed italic border-l-2 border-[#45e5ed] pl-4">
                    Gli strumenti elencati sono esempi illustrativi. Poiché la tecnologia digitale è in costante evoluzione, mantengo un'attenzione costante verso i nuovi sviluppi per integrare le soluzioni più efficaci.
                  </p>

                  <div className="mb-8 bg-[#f0f9ff] rounded-2xl p-6 border border-[#45e5ed]/20">
                    <h4 className="font-bold text-[#263647] mb-2 flex items-center gap-2">
                      <Globe className="w-5 h-5 text-[#45e5ed]" />
                      Tecnologie Verticali per Destinazioni
                    </h4>
                    <p className="text-sm text-[#263647]/80 mb-4 leading-relaxed">
                      Competenza specifica sulle piattaforme che abilitano l'ecosistema digitale turistico: dai sistemi cartografici ai TMS (Tourism Management Systems) e Master Data Management.
                    </p>
                    <div className="flex flex-wrap gap-2">
                       {[
                         "Digital Destination Ecosystem", 
                         "Map Systems", 
                         "Data Management Systems", 
                         "Tourism Chatbots", 
                         "Digital Concierge", 
                         "Feratel", 
                         "Hubcore", 
                         "Pimcore"
                       ].map((tool, i) => (
                        <span key={i} className="px-3 py-1.5 rounded-lg bg-white border border-[#45e5ed]/30 text-[#263647] text-xs font-bold hover:bg-[#45e5ed] hover:text-white transition-colors cursor-default shadow-sm">
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    {[
                      { category: "CRM & Sales", tools: ["HubSpot", "Pipedrive"] },
                      { category: "Analytics & Data", tools: ["Google Analytics 4", "Looker Studio", "Google Tag Manager", "Hotjar"] },
                      { category: "Marketing & Automation", tools: ["WordPress", "SEMrush", "UberSuggest", "Mailchimp", "PimCore", "Make", "Zapier"] },
                      { category: "AI & Innovation", tools: ["Gemini", "ChatGPT", "Claude", "Perplexity"] },
                      { category: "Project Management", tools: ["Miro", "Notion", "ClickUp", "Monday", "Asana", "Trello", "Mokapen"] },
                      { category: "Communication", tools: ["Slack", "Microsoft Teams"] }
                    ].map((group, i) => (
                      <div key={i}>
                        <h4 className="text-xs font-bold text-[#263647]/60 uppercase tracking-widest mb-3">{group.category}</h4>
                        <div className="flex flex-wrap gap-2">
                          {group.tools.map((tool, j) => (
                            <span key={j} className="px-3 py-1.5 rounded-lg bg-slate-50 border border-[#d7d8d8] text-[#263647] text-xs font-medium hover:border-[#45e5ed] hover:bg-white hover:shadow-sm transition-all cursor-default">
                              {tool}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>


              </div>
            </div>
          </div>
        </section>

        {/* Servizi Core */}
        <section id="servizi" className="py-32 border-t border-[#d7d8d8]/50 bg-[#f8f9fa]">
          <div className="container mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-20">
              <h2 className="text-3xl md:text-5xl font-display font-semibold mb-6">{content.services.title}</h2>
              <p className="text-[#263647]/70 text-lg font-light leading-relaxed">
                {content.services.subtitle}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {content.services.items.map((service, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="p-8 rounded-3xl border border-[#d7d8d8] bg-white hover:shadow-lg hover:shadow-[#263647]/5 hover:border-[#45e5ed]/50 transition-all duration-300 group"
                >
                  <div className="w-16 h-16 rounded-2xl bg-[#f8f9fa] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    {service.icon}
                  </div>
                  <h3 className="text-2xl font-display font-semibold mb-4">{service.title}</h3>
                  <p className="text-[#263647]/70 font-light leading-relaxed">
                    {service.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonianze - Temporaneamente disabilitate in attesa delle recensioni
        <section className="py-32 border-t border-[#d7d8d8]/50 bg-[#f8f9fa]">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl md:text-5xl font-display font-semibold mb-20 text-center">{content.testimonials.title}</h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              {content.testimonials.items.map((testimonial, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="p-8 rounded-3xl border border-[#d7d8d8] bg-white relative shadow-sm"
                >
                  <Quote className="w-10 h-10 text-[#45e5ed]/20 absolute top-6 right-6" />
                  <p className="text-[#263647]/80 font-light leading-relaxed mb-8 relative z-10 italic">
                    {testimonial.quote.includes("[Spazio riservato") ? (
                      <span className="text-[#263647]/50">{testimonial.quote}</span>
                    ) : (
                      `"${testimonial.quote}"`
                    )}
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#263647] flex items-center justify-center font-display font-medium text-white">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold text-[#263647]">{testimonial.name}</div>
                      <div className="text-sm text-[#263647]/60">{testimonial.role}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        */}

        {/* Footer/CTA Finale */}
        <footer id="contact" className="py-24 border-t border-[#d7d8d8]/50 relative overflow-hidden bg-[#f8f9fa]">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#45e5ed]/5 pointer-events-none"></div>
          
          <div className="container mx-auto px-6 relative z-10">
            <div className="text-center max-w-2xl mx-auto mb-20">
              <h2 className="text-4xl md:text-6xl font-display font-semibold mb-6">Pronti a <span className="text-[#45e5ed]">Trasformare</span> la Vostra Destinazione?</h2>
              <p className="text-xl text-[#263647]/70 font-light mb-10">
                Pianifichiamo insieme la roadmap per l'innovazione e la crescita sostenibile del vostro ecosistema turistico.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a 
                  href={content.hero.calendarLink}
                  onClick={handleOpenCalendar}
                  className="px-8 py-4 rounded-full bg-[#263647] text-white font-medium hover:bg-[#263647]/90 transition-transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 w-full sm:w-auto shadow-lg shadow-[#263647]/20"
                >
                  <Calendar className="w-5 h-5" />
                  Prenota Call Strategica
                </a>
                <a 
                  href={content.footer.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-4 rounded-full border border-[#d7d8d8] bg-white hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 w-full sm:w-auto font-medium"
                >
                  <Linkedin className="w-5 h-5" />
                  LinkedIn
                </a>
                <a 
                  href={content.footer.email}
                  className="px-8 py-4 rounded-full border border-[#d7d8d8] bg-white hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 w-full sm:w-auto font-medium"
                >
                  <Mail className="w-5 h-5" />
                  Email
                </a>
              </div>
            </div>

            {/* Ecosystem Cards */}
            <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-20">
              <button 
                onClick={() => setIsCelestecOpen(true)}
                className="group p-8 rounded-3xl bg-white border border-blue-500/30 hover:border-blue-500 hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300 text-left relative overflow-hidden flex flex-col h-full"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
                <Sparkles className="w-10 h-10 text-blue-600 mb-6 relative z-10 shrink-0" />
                <h3 className="text-2xl font-sans font-bold text-[#263647] mb-4 relative z-10 shrink-0">Celestec AI</h3>
                <p className="text-[#263647]/70 mb-8 relative z-10 text-base leading-relaxed flex-grow">Piattaforma Enterprise per la gestione collaborativa e l'innovazione sostenibile nelle destinazioni turistiche.</p>
                <div className="flex items-center gap-2 text-blue-600 font-bold text-sm uppercase tracking-widest relative z-10 shrink-0 mt-auto">
                  Scopri la piattaforma <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>

              <button 
                onClick={() => setIsDestinovaOpen(true)}
                className="group p-8 rounded-3xl bg-white border border-[#45e5ed] hover:shadow-xl hover:shadow-[#45e5ed]/10 transition-all duration-300 text-left relative overflow-hidden flex flex-col h-full"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#45e5ed]/10 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
                <Globe className="w-10 h-10 text-[#45e5ed] mb-6 relative z-10 shrink-0" />
                <h3 className="text-2xl font-sans font-bold text-[#263647] mb-4 relative z-10 shrink-0">Destinova | Academy</h3>
                <p className="text-[#263647]/70 mb-8 relative z-10 text-base leading-relaxed flex-grow">Il nuovo ecosistema formativo digitale interamente dedicato a destinazioni e territori.</p>
                <div className="flex items-center gap-2 text-[#45e5ed] font-bold text-sm uppercase tracking-widest relative z-10 shrink-0 mt-auto">
                  Esplora l'Academy <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>

              <a 
                href="https://factory.it/it/tourism"
                target="_blank"
                rel="noopener noreferrer"
                className="group p-8 rounded-3xl bg-white border border-[#E51346]/30 hover:border-[#E51346] hover:shadow-xl hover:shadow-[#E51346]/10 transition-all duration-300 text-left relative overflow-hidden flex flex-col h-full"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#E51346]/5 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
                <Code className="w-10 h-10 text-[#E51346] mb-6 relative z-10 shrink-0" />
                <h3 className="text-2xl font-sans font-bold text-[#263647] mb-4 relative z-10 shrink-0">Factory | Digital Trasformation Hub</h3>
                <p className="text-[#263647]/70 mb-8 relative z-10 text-base leading-relaxed flex-grow">Scopri l'ecosistema digitale che fornisce un framework integrato AI Driven per la gestione di dati ed esperienze all'interno delle destinazioni turistiche.</p>
                <div className="flex items-center gap-2 text-[#E51346] font-bold text-sm uppercase tracking-widest relative z-10 shrink-0 mt-auto">
                  Visita il sito <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </a>
            </div>
            
            <div className="pt-8 border-t border-[#d7d8d8] flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-[#263647]/60">
              <div>{content.footer.copyright}</div>
              <div className="flex items-center gap-6">
                <a href={content.footer.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-[#263647] transition-colors">LinkedIn</a>
                <a href={content.footer.email} className="hover:text-[#263647] transition-colors">Email</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
      <DigitalTwin />
    </div>
  );
}
