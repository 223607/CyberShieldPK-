import React, { useState, useEffect, useRef } from 'react';
import { 
  Shield, 
  Search, 
  User, 
  Menu, 
  X, 
  ChevronDown, 
  Terminal, 
  Radio, 
  Cpu, 
  ExternalLink,
  BookOpen,
  FlaskConical,
  Wrench,
  FileText,
  Briefcase,
  Layers,
  Sparkles
} from 'lucide-react';
import { DOMAINS } from '../data/domains';

interface NavbarProps {
  onOpenSearch: () => void;
  onOpenAuth: () => void;
  onOpenDashboard: () => void;
  onNavigateSection: (sectionId: string) => void;
  onSelectDomain: (domainId: string) => void;
  onOpenSocSimulator: () => void;
  currentUser: { name: string; email: string } | null;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenSearch,
  onOpenAuth,
  onOpenDashboard,
  onNavigateSection,
  onSelectDomain,
  onOpenSocSimulator,
  currentUser
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [domainsDropdownOpen, setDomainsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
      if (domainsDropdownOpen) setDomainsDropdownOpen(false);
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDomainsDropdownOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [domainsDropdownOpen]);

  const navItems = [
    { label: 'Home', id: 'hero' },
    { label: 'Academy', id: 'academy' },
    { label: 'Threat Desk & Roadmaps', id: 'threat-feed' },
    { label: 'Labs', id: 'labs' },
    { label: 'Tools', id: 'tools' },
    { label: 'Articles', id: 'articles' },
    { label: 'Projects', id: 'projects' },
    { label: 'Services', id: 'services' },
    { label: 'Resources', id: 'resources' },
    { label: 'Portfolio', id: 'portfolio' }
  ];

  const handleNavClick = (id: string) => {
    onNavigateSection(id);
    setMobileMenuOpen(false);
    setDomainsDropdownOpen(false);
  };

  return (
    <header 
      id="main-navbar" 
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-200 ${
        isScrolled 
          ? 'bg-[#060c16]/90 backdrop-blur-md border-b border-cyan-500/20 shadow-lg shadow-black/50 py-3' 
          : 'bg-[#060c16]/75 backdrop-blur-sm border-b border-slate-800/60 py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand */}
        <div 
          onClick={() => handleNavClick('hero')} 
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/40 group-hover:border-cyan-400 group-hover:shadow-[0_0_15px_rgba(0,240,255,0.4)] transition-all">
            <Shield className="w-6 h-6 text-cyan-400 group-hover:scale-105 transition-transform" />
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse ring-2 ring-[#060c16]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-cyan-300 bg-clip-text text-transparent">
                CyberShield<span className="text-cyan-400">PK</span>
              </span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-500/30">
                v2.6
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono tracking-wider">
              LEARN • BUILD • DEFEND
            </p>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          <button
            onClick={() => handleNavClick('hero')}
            className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-cyan-400 hover:bg-slate-800/40 rounded transition-colors"
          >
            Home
          </button>

          {/* Domains Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDomainsDropdownOpen(!domainsDropdownOpen)}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-cyan-400 hover:bg-slate-800/40 rounded transition-colors"
              aria-expanded={domainsDropdownOpen}
            >
              <span>Domains</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${domainsDropdownOpen ? 'rotate-180 text-cyan-400' : ''}`} />
            </button>

            {domainsDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-72 bg-[#0c1527] border border-cyan-500/30 rounded-xl shadow-2xl p-2 z-50 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150">
                <div className="text-[10px] font-mono uppercase text-slate-400 px-3 py-1 border-b border-slate-800 flex justify-between">
                  <span>Cybersecurity Domains</span>
                  <span className="text-cyan-400">9 Tracks</span>
                </div>
                <div className="py-1 max-h-80 overflow-y-auto">
                  {DOMAINS.map((domain) => (
                    <button
                      key={domain.id}
                      onClick={() => {
                        onSelectDomain(domain.id);
                        setDomainsDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs rounded-lg hover:bg-cyan-950/40 hover:text-cyan-300 transition-colors flex items-center justify-between group"
                    >
                      <span className="text-slate-200 group-hover:text-cyan-300 font-medium">
                        {domain.title}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {domain.difficulty}
                      </span>
                    </button>
                  ))}
                </div>
                <div className="pt-2 border-t border-slate-800/80 mt-1">
                  <button
                    onClick={() => handleNavClick('domains')}
                    className="w-full text-center text-[11px] font-mono text-cyan-400 hover:text-cyan-300 py-1"
                  >
                    View All Domain Tracks →
                  </button>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => handleNavClick('academy')}
            className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-cyan-400 hover:bg-slate-800/40 rounded transition-colors"
          >
            Academy
          </button>
          <button
            onClick={() => handleNavClick('threat-feed')}
            className="px-2.5 py-1.5 text-xs font-medium text-red-300 hover:text-red-200 hover:bg-red-950/40 rounded transition-colors flex items-center gap-1 font-mono"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            <span>Threat Desk</span>
          </button>
          <button
            onClick={() => handleNavClick('labs')}
            className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-cyan-400 hover:bg-slate-800/40 rounded transition-colors"
          >
            Labs
          </button>
          <button
            onClick={() => handleNavClick('tools')}
            className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-cyan-400 hover:bg-slate-800/40 rounded transition-colors"
          >
            Tools
          </button>
          <button
            onClick={() => handleNavClick('articles')}
            className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-cyan-400 hover:bg-slate-800/40 rounded transition-colors"
          >
            Articles
          </button>
          <button
            onClick={() => handleNavClick('projects')}
            className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-cyan-400 hover:bg-slate-800/40 rounded transition-colors"
          >
            Projects
          </button>
          <button
            onClick={() => handleNavClick('services')}
            className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-cyan-400 hover:bg-slate-800/40 rounded transition-colors"
          >
            Services
          </button>
          <button
            onClick={() => handleNavClick('resources')}
            className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-cyan-400 hover:bg-slate-800/40 rounded transition-colors"
          >
            Resources
          </button>
          <button
            onClick={() => handleNavClick('portfolio')}
            className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-cyan-400 hover:bg-slate-800/40 rounded transition-colors"
          >
            Portfolio
          </button>
        </nav>

        {/* Right Actions: Search, SOC, Auth */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* SOC Simulator Button */}
          <button
            onClick={onOpenSocSimulator}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-mono text-emerald-400 bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-500/30 rounded-lg transition-all"
            title="Open Interactive SOC Simulator"
          >
            <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
            <span className="hidden md:inline">SOC SIMULATOR</span>
          </button>

          {/* Search Trigger */}
          <button
            id="nav-search-btn"
            onClick={onOpenSearch}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-mono text-slate-400 bg-slate-900/80 hover:bg-slate-800 border border-slate-700/60 rounded-lg hover:border-cyan-500/50 transition-all group"
            title="Search Platform (Ctrl+K)"
          >
            <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-400" />
            <span className="hidden md:inline text-[11px]">Search...</span>
            <kbd className="hidden lg:inline-block text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400 border border-slate-700">
              ⌘K
            </kbd>
          </button>

          {/* User / Auth Trigger */}
          {currentUser ? (
            <button
              onClick={onOpenDashboard}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-cyan-300 bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-500/40 rounded-lg transition-all"
            >
              <User className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline max-w-[100px] truncate">{currentUser.name}</span>
            </button>
          ) : (
            <button
              id="nav-auth-btn"
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-slate-950 bg-gradient-to-r from-cyan-400 to-blue-400 hover:from-cyan-300 hover:to-blue-300 rounded-lg shadow-[0_0_15px_rgba(0,240,255,0.25)] transition-all font-mono"
            >
              <User className="w-3.5 h-3.5" />
              <span>LOGIN</span>
            </button>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-300 hover:text-cyan-400 rounded-lg hover:bg-slate-800/60 transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0a1222] border-b border-cyan-500/30 px-4 pt-3 pb-6 space-y-3 mt-2 max-h-[80vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-2 pt-2 border-b border-slate-800 pb-3">
            <button
              onClick={onOpenSocSimulator}
              className="flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-mono text-emerald-400 bg-emerald-950/50 border border-emerald-500/40 rounded-lg"
            >
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              <span>SOC SIM</span>
            </button>
            <button
              onClick={() => {
                onOpenSearch();
                setMobileMenuOpen(false);
              }}
              className="flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-mono text-cyan-400 bg-cyan-950/50 border border-cyan-500/40 rounded-lg"
            >
              <Search className="w-3.5 h-3.5" />
              <span>SEARCH</span>
            </button>
          </div>

          <div className="space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className="w-full text-left px-3 py-2.5 text-sm font-medium text-slate-200 hover:text-cyan-400 hover:bg-slate-800/60 rounded-lg transition-colors flex items-center justify-between"
              >
                <span>{item.label}</span>
                <span className="text-xs text-slate-500">→</span>
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-800">
            <p className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-2 px-1">
              Domains Quick Access
            </p>
            <div className="grid grid-cols-1 gap-1">
              {DOMAINS.slice(0, 5).map((d) => (
                <button
                  key={d.id}
                  onClick={() => {
                    onSelectDomain(d.id);
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs text-slate-400 hover:text-cyan-300 hover:bg-slate-800/40 rounded transition-colors"
                >
                  {d.title}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
