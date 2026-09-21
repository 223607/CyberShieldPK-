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
  activeView?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenSearch,
  onOpenAuth,
  onOpenDashboard,
  onNavigateSection,
  onSelectDomain,
  onOpenSocSimulator,
  currentUser,
  activeView = 'all'
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [domainsDropdownOpen, setDomainsDropdownOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const moreDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
      if (domainsDropdownOpen) setDomainsDropdownOpen(false);
      if (moreDropdownOpen) setMoreDropdownOpen(false);
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDomainsDropdownOpen(false);
      }
      if (moreDropdownRef.current && !moreDropdownRef.current.contains(e.target as Node)) {
        setMoreDropdownOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [domainsDropdownOpen, moreDropdownOpen]);

  const navItems = [
    { label: 'Home', id: 'hero' },
    { label: 'Domains Tracks', id: 'domains' },
    { label: 'Academy', id: 'academy' },
    { label: 'Hands-on Labs', id: 'labs' },
    { label: 'Tools Directory', id: 'tools' },
    { label: 'Articles & Writeups', id: 'articles' },
    { label: 'Production Projects', id: 'projects' },
    { label: 'Security Services', id: 'services' },
    { label: 'Resources & Cheatsheets', id: 'resources' },
    { label: 'Founder Portfolio', id: 'portfolio' },
    { label: 'Threat Desk', id: 'threat-feed' },
    { label: 'Fellowship & Internship 2026', id: 'internship' }
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
            type="button"
            onClick={() => handleNavClick('hero')}
            className={`px-3 py-1.5 text-xs font-medium rounded transition-colors cursor-pointer ${
              activeView === 'hero' || activeView === 'all'
                ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 font-bold'
                : 'text-slate-300 hover:text-cyan-400 hover:bg-slate-800/40'
            }`}
          >
            Home
          </button>

          {/* Domains Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDomainsDropdownOpen(!domainsDropdownOpen)}
              className={`flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded transition-colors cursor-pointer ${
                activeView === 'domains'
                  ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 font-bold'
                  : 'text-slate-300 hover:text-cyan-400 hover:bg-slate-800/40'
              }`}
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
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onSelectDomain(domain.id);
                        setDomainsDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs rounded-lg hover:bg-cyan-950/40 hover:text-cyan-300 transition-colors flex items-center justify-between group cursor-pointer"
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
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick('domains');
                    }}
                    className="w-full text-center text-[11px] font-mono text-cyan-400 hover:text-cyan-300 py-1 cursor-pointer"
                  >
                    View All Domain Tracks →
                  </button>
                </div>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => handleNavClick('academy')}
            className={`px-3 py-1.5 text-xs font-medium rounded transition-colors cursor-pointer ${
              activeView === 'academy'
                ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 font-bold'
                : 'text-slate-300 hover:text-cyan-400 hover:bg-slate-800/40'
            }`}
          >
            Academy
          </button>
          <button
            type="button"
            onClick={() => handleNavClick('labs')}
            className={`px-3 py-1.5 text-xs font-medium rounded transition-colors cursor-pointer ${
              activeView === 'labs'
                ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 font-bold'
                : 'text-slate-300 hover:text-cyan-400 hover:bg-slate-800/40'
            }`}
          >
            Labs
          </button>
          {/* More Dropdown (Tools, Articles, Projects, Services, Resources, Portfolio) */}
          <div className="relative" ref={moreDropdownRef}>
            <button
              type="button"
              onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
              className={`px-2.5 py-1.5 text-xs font-medium rounded transition-colors flex items-center gap-1 cursor-pointer ${
                ['tools', 'articles', 'projects', 'services', 'resources', 'portfolio'].includes(activeView)
                  ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 font-bold'
                  : 'text-slate-300 hover:text-cyan-400 hover:bg-slate-800/40'
              }`}
            >
              <span>More</span>
              <ChevronDown className={`w-3 h-3 transition-transform ${moreDropdownOpen ? 'rotate-180 text-cyan-400' : 'text-slate-400'}`} />
            </button>

            {moreDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-64 rounded-xl bg-[#091120] border border-cyan-500/40 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="text-[10px] font-mono text-slate-400 px-3 py-1 uppercase tracking-wider border-b border-slate-800/80 mb-1">
                  Explore Platform
                </div>
                {[
                  { id: 'tools', label: 'Security Tools Directory', icon: Wrench, desc: 'Scanners & decoders' },
                  { id: 'articles', label: 'Threat Research Articles', icon: FileText, desc: 'CVEs & deep-dives' },
                  { id: 'projects', label: 'Production Projects', icon: Cpu, desc: 'Open source & blueprints' },
                  { id: 'services', label: 'Security Services', icon: Briefcase, desc: 'Audits & pentesting' },
                  { id: 'resources', label: 'Resources & Cheatsheets', icon: Layers, desc: 'Payloads & guides' },
                  { id: 'portfolio', label: 'Founder Portfolio', icon: User, desc: 'Muhammad Zaib Zafar' }
                ].map((item) => {
                  const Icon = item.icon;
                  const isActive = activeView === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        handleNavClick(item.id);
                        setMoreDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center gap-2.5 cursor-pointer ${
                        isActive
                          ? 'bg-cyan-950/70 text-cyan-300 border border-cyan-500/30'
                          : 'text-slate-300 hover:text-cyan-300 hover:bg-slate-800/60'
                      }`}
                    >
                      <Icon className={`w-3.5 h-3.5 flex-shrink-0 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                      <div className="min-w-0">
                        <div className="text-xs font-semibold truncate">{item.label}</div>
                        <div className="text-[10px] text-slate-400 truncate">{item.desc}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Dedicated Highlights: Threat Desk and Internship */}
          <button
            type="button"
            onClick={() => handleNavClick('threat-feed')}
            className={`px-2.5 py-1.5 text-xs font-medium rounded transition-colors flex items-center gap-1 font-mono cursor-pointer ${
              activeView === 'threat-feed'
                ? 'bg-red-950/90 text-red-300 border border-red-500/50 font-bold shadow-sm'
                : 'text-red-300 hover:text-red-200 hover:bg-red-950/40'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            <span>Threat Desk</span>
          </button>
          <button
            type="button"
            onClick={() => handleNavClick('internship')}
            className={`px-2.5 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1 font-mono cursor-pointer ${
              activeView === 'internship'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400 shadow-[0_0_12px_rgba(0,240,255,0.25)]'
                : 'text-cyan-300 hover:text-cyan-200 bg-cyan-950/50 hover:bg-cyan-900/50 border border-cyan-500/40'
            }`}
          >
            <span>Internship</span>
            <span className="text-[9px] px-1 bg-cyan-500/20 text-cyan-300 rounded font-bold">2026</span>
          </button>
        </nav>

        {/* Right Actions: Search, SOC, Auth */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* SOC Dashboard Button */}
          <button
            onClick={onOpenSocSimulator}
            className="hidden sm:flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-[11px] font-mono font-bold text-emerald-400 bg-emerald-950/50 hover:bg-emerald-900/60 border border-emerald-500/40 rounded-lg transition-all shadow-[0_0_12px_rgba(52,211,153,0.15)] cursor-pointer"
            title="Open Live SOC Operations Dashboard"
          >
            <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
            <span className="hidden xl:inline">LIVE SOC DASHBOARD</span>
            <span className="xl:hidden">SOC OPS</span>
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
              onClick={() => {
                onOpenSocSimulator();
                setMobileMenuOpen(false);
              }}
              className="flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-mono font-bold text-emerald-400 bg-emerald-950/50 border border-emerald-500/40 rounded-lg cursor-pointer"
            >
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              <span>SOC DASHBOARD</span>
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
                className={`w-full text-left px-3 py-2.5 text-sm font-medium rounded-lg transition-colors flex items-center justify-between cursor-pointer ${
                  activeView === item.id 
                    ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 font-bold'
                    : 'text-slate-200 hover:text-cyan-400 hover:bg-slate-800/60'
                }`}
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
