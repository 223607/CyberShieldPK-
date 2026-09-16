import React from 'react';
import { 
  Shield, 
  Mail, 
  Linkedin, 
  Github, 
  ExternalLink, 
  Heart, 
  AlertTriangle,
  Radio,
  BookOpen,
  FlaskConical,
  Wrench,
  FileText,
  Briefcase,
  Layers,
  FolderDown
} from 'lucide-react';

interface FooterProps {
  onNavigateSection: (sectionId: string) => void;
  onOpenSoc: () => void;
  onOpenPrivacyModal?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigateSection,
  onOpenSoc,
  onOpenPrivacyModal
}) => {
  return (
    <footer className="bg-[#040810] text-slate-400 border-t border-slate-800/80 pt-16 pb-12 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Main Footer Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Col 1: Brand & Identity */}
          <div className="lg:col-span-2 space-y-4">
            <div 
              onClick={() => onNavigateSection('hero')} 
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                <Shield className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-xl text-white tracking-tight">
                CyberShield<span className="text-cyan-400">PK</span>
              </span>
            </div>

            <p className="text-xs font-mono text-cyan-400 font-semibold tracking-wider">
              LEARN • BUILD • DEFEND
            </p>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Pakistan's premier cybersecurity learning, research, and defensive capability platform. Founded by <strong>Muhammad Zaib Zafar</strong> to bridge the gap between theoretical knowledge and real-world adversarial defense.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href="mailto:contact@cybershieldpk.org"
                className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 hover:border-cyan-500/50 flex items-center justify-center text-slate-400 hover:text-cyan-400 transition-colors"
                title="Email Us"
              >
                <Mail className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 hover:border-cyan-500/50 flex items-center justify-center text-slate-400 hover:text-cyan-400 transition-colors"
                title="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 hover:border-cyan-500/50 flex items-center justify-center text-slate-400 hover:text-cyan-400 transition-colors"
                title="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Navigation Tracks */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-semibold text-white uppercase tracking-wider">
              Platform Tracks
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button 
                  onClick={() => onNavigateSection('domains')} 
                  className="hover:text-cyan-400 transition-colors"
                >
                  Cyber Domains (9)
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigateSection('academy')} 
                  className="hover:text-cyan-400 transition-colors"
                >
                  Academy Courses
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigateSection('labs')} 
                  className="hover:text-cyan-400 transition-colors"
                >
                  Hands-on Cyber Labs
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigateSection('tools')} 
                  className="hover:text-cyan-400 transition-colors"
                >
                  Security Tools Directory
                </button>
              </li>
              <li>
                <button 
                  onClick={onOpenSoc} 
                  className="text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1 font-mono"
                >
                  <Radio className="w-3 h-3 animate-pulse" />
                  <span>SOC Simulator</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Research & Services */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-semibold text-white uppercase tracking-wider">
              Research & Services
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button 
                  onClick={() => onNavigateSection('articles')} 
                  className="hover:text-cyan-400 transition-colors"
                >
                  Technical Articles
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigateSection('projects')} 
                  className="hover:text-cyan-400 transition-colors"
                >
                  Production Projects
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigateSection('services')} 
                  className="hover:text-cyan-400 transition-colors"
                >
                  Security Consulting & VAPT
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigateSection('resources')} 
                  className="hover:text-cyan-400 transition-colors"
                >
                  Cheat Sheets & Checklists
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigateSection('portfolio')} 
                  className="hover:text-cyan-400 transition-colors"
                >
                  About Founder
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Operational Status */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-semibold text-white uppercase tracking-wider">
              Operational Status
            </h4>
            <div className="space-y-2 text-xs font-mono">
              <div className="flex items-center gap-2 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>All Defense Systems OK</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Wazuh Decoders: 4,110 Active
              </p>
              <p className="text-[11px] text-slate-500">
                OWASP ASVS 4.0 Standard
              </p>
              <p className="text-[11px] text-slate-500">
                Built with React, Vite & Tailwind
              </p>
            </div>
          </div>
        </div>

        {/* Ethical & Lawful Disclaimer Notice */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 text-[11px] text-slate-400 leading-relaxed flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <strong className="text-slate-300">Lawful Security Notice & Ethical Defense Mandate:</strong> All materials, lab scenarios, command tutorials, and tools provided on CyberShieldPK are strictly intended for educational study, authorized penetration testing, and defensive engineering. Performing security testing against networks, applications, or devices without explicit written permission is illegal under Pakistan's Prevention of Electronic Crimes Act (PECA) and international cyber laws.
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-500">
          <div>
            © {new Date().getFullYear()} CyberShieldPK. Founded by Muhammad Zaib Zafar. All rights reserved.
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Version 2.6.0-stable</span>
            <span>•</span>
            <span>Defend the Digital World</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
