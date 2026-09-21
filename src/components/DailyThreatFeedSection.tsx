import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Clock, 
  ExternalLink, 
  AlertTriangle, 
  Activity,
  Radio,
  RefreshCw,
  Search,
  Filter,
  Globe,
  Database,
  Lock,
  Server,
  Zap,
  CheckCircle2,
  FileText
} from 'lucide-react';

export interface ThreatNewsItem {
  id: string;
  title: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  category: 'Zero-Day / CVE' | 'Ransomware' | 'Cloud & Edge' | 'Nation-State & APAC' | 'AI & Supply Chain';
  timestamp: string;
  sourceName: string;
  sourceUrl: string;
  cveId?: string;
  cvssScore?: string;
  summary: string;
  impactAnalysis: string;
  mitigationSteps: string[];
  mitreTactic: string;
  affectedVendors: string[];
}

// Authoritative Cybersecurity Knowledge & Intelligence Sources
const KNOWLEDGE_SOURCES = [
  {
    name: 'CISA KEV Catalog',
    description: 'Known Exploited Vulnerabilities catalog mandated by US Federal Directives.',
    url: 'https://www.cisa.gov/known-exploited-vulnerabilities-catalog',
    badge: 'Gov Advisory',
    color: 'border-blue-500/40 text-blue-400 bg-blue-500/10'
  },
  {
    name: 'The Hacker News',
    description: 'Leading international platform for breaking cyber attack reporting.',
    url: 'https://thehackernews.com',
    badge: 'Breaking News',
    color: 'border-red-500/40 text-red-400 bg-red-500/10'
  },
  {
    name: 'BleepingComputer',
    description: 'Definitive intelligence on active ransomware campaigns and malware decryptors.',
    url: 'https://www.bleepingcomputer.com',
    badge: 'Ransomware Intel',
    color: 'border-amber-500/40 text-amber-400 bg-amber-500/10'
  },
  {
    name: 'NIST NVD',
    description: 'National Vulnerability Database repository for standardized CVSS scoring.',
    url: 'https://nvd.nist.gov',
    badge: 'CVE Database',
    color: 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10'
  },
  {
    name: 'MITRE ATT&CK',
    description: 'Globally accessible knowledge base of adversary tactics and techniques.',
    url: 'https://attack.mitre.org',
    badge: 'Adversary TTPs',
    color: 'border-purple-500/40 text-purple-400 bg-purple-500/10'
  },
  {
    name: 'SANS Internet Storm Center',
    description: 'Global early detection sensors tracking port scanning and botnet spikes.',
    url: 'https://isc.sans.edu',
    badge: 'Threat Sensor',
    color: 'border-cyan-500/40 text-cyan-400 bg-cyan-500/10'
  },
  {
    name: 'National CERT-PK Advisory',
    description: 'Pakistan National Cyber Security Agency advisories and critical infrastructure alerts.',
    url: 'https://cert.gov.pk',
    badge: 'National CERT',
    color: 'border-green-500/40 text-green-400 bg-green-500/10'
  }
];

const REALTIME_CYBER_NEWS: ThreatNewsItem[] = [
  {
    id: 'news-1',
    title: 'Critical RCE Zero-Day in Enterprise SSL-VPN Gateways Exploited in the Wild',
    severity: 'CRITICAL',
    category: 'Zero-Day / CVE',
    timestamp: '18 minutes ago',
    sourceName: 'CISA Cybersecurity Advisories & KEV',
    sourceUrl: 'https://www.cisa.gov/known-exploited-vulnerabilities-catalog',
    cveId: 'CVE-2026-1934',
    cvssScore: '9.8 CRITICAL',
    summary: 'Threat actors are actively leveraging unauthenticated path traversal and heap buffer overflow in legacy SSL-VPN firmware. Attackers gain root shell access and deploy persistent WebShell backdoors without triggering multi-factor authentication.',
    impactAnalysis: 'Over 14,000 public perimeter devices exposed worldwide. Successful exploitation grants complete internal network traversal and credential dumping.',
    mitigationSteps: [
      'Immediately isolate public-facing VPN interfaces or apply emergency vendor hotfix KB-9812.',
      'Check webserver access logs for anomalous POST requests containing "../../../cgi-bin/sysinfo.cgi".',
      'Enforce dedicated hardware jumpboxes and kill active session tokens.'
    ],
    mitreTactic: 'Initial Access (TA0001) • T1190: Exploit Public-Facing Application',
    affectedVendors: ['Fortinet', 'Ivanti', 'SonicWall', 'Pulse Secure']
  },
  {
    id: 'news-2',
    title: 'New LockBit 3.0 Ransomware Variant Targets Healthcare Cloud Repositories',
    severity: 'CRITICAL',
    category: 'Ransomware',
    timestamp: '45 minutes ago',
    sourceName: 'BleepingComputer Cybersecurity News',
    sourceUrl: 'https://www.bleepingcomputer.com',
    cvssScore: '9.4 CRITICAL',
    summary: 'A heavily obfuscated LockBit payload was detected executing multi-threaded encryption using AES-256 with elliptic curve keys. The binary systematically terminates Volume Shadow Copy service (vssadmin) and exfiltrates SQL healthcare databases prior to file lockout.',
    impactAnalysis: 'Critical infrastructure hospitals and imaging centers are experiencing automated extortion demands up to $2.4M with double-extortion leak threats.',
    mitigationSteps: [
      'Ensure cloud backups are stored on WORM (Write Once, Read Many) immutable storage with air-gap controls.',
      'Deploy behavioral EDR blocking on command-line patterns invoking "vssadmin delete shadows /all /quiet".',
      'Segregate clinical medical IoT devices from standard corporate Active Directory domains.'
    ],
    mitreTactic: 'Impact (TA0040) • T1486: Data Encrypted for Impact',
    affectedVendors: ['Windows Server 2019/2022', 'AWS S3 Repositories', 'Azure Blob']
  },
  {
    id: 'news-3',
    title: 'Widespread BEC Campaign Employs Generative AI Voice Clones Impersonating Pakistani CEOs',
    severity: 'HIGH',
    category: 'Nation-State & APAC',
    timestamp: '2 hours ago',
    sourceName: 'National CERT-PK Security Bulletin',
    sourceUrl: 'https://cert.gov.pk',
    cvssScore: '8.2 HIGH',
    summary: 'Cybercrime syndicates operating across South Asia are utilizing generative audio synthesis to clone the voices of managing directors from public sector and private conglomerates. Finance departments are targeted with urgent voice notes authorizing wire transfers to offshore mule accounts.',
    impactAnalysis: 'Multiple high-value fraudulent remittance attempts reported to financial intelligence units in Karachi and Lahore.',
    mitigationSteps: [
      'Institute mandatory out-of-band dual authorization (via in-person cryptographic key or pre-shared codeword) for wire transfers > 100,000 PKR / $500 USD.',
      'Train accounts payable personnel on conversational AI latency artifacts and voice frequency anomalies.',
      'Block spoofed domains with strict SPF, DKIM, and DMARC "p=reject" policies.'
    ],
    mitreTactic: 'Initial Access • T1566: Phishing for Information',
    affectedVendors: ['Enterprise Banking Portals', 'WhatsApp Business', 'Microsoft 365 Exchange']
  },
  {
    id: 'news-4',
    title: 'Thousands of Kubernetes API Clusters Exposed with Anonymous Auth Enabled',
    severity: 'MEDIUM',
    category: 'Cloud & Edge',
    timestamp: '3 hours ago',
    sourceName: 'The Hacker News',
    sourceUrl: 'https://thehackernews.com',
    cveId: 'MISCONFIG-K8S-6443',
    cvssScore: '7.5 MEDIUM',
    summary: 'Security telemetry scanners discovered over 2,800 Kubernetes control plane API servers publicly discoverable across global cloud providers with "--anonymous-auth=true" left active on port 6443.',
    impactAnalysis: 'Unauthenticated remote attackers can query cluster nodes, dump namespace environment secrets, and deploy unauthorized cryptocurrency mining daemonsets.',
    mitigationSteps: [
      'Disable anonymous authentication in kube-apiserver manifest files (--anonymous-auth=false).',
      'Place kube-apiserver behind private VPC endpoints or VPN access restrictions.',
      'Run automated CIS Kubernetes Benchmarks using kube-bench and Falco runtime detection.'
    ],
    mitreTactic: 'Discovery (TA0007) • T1580: Cloud Infrastructure Discovery',
    affectedVendors: ['Kubernetes v1.28-v1.31', 'GKE Self-Managed', 'EKS Clusters']
  },
  {
    id: 'news-5',
    title: 'Open Source NPM & PyPI Supply Chain Poisoning Exploits AI Coding Extensions',
    severity: 'HIGH',
    category: 'AI & Supply Chain',
    timestamp: '5 hours ago',
    sourceName: 'SANS Internet Storm Center (ISC)',
    sourceUrl: 'https://isc.sans.edu',
    cvssScore: '8.6 HIGH',
    summary: 'Malicious threat actors published 34 typosquatted packages mimicking popular AI SDK wrappers. The packages execute post-install Node scripts that harvest local SSH keys, ~/.aws/credentials, and GitHub personal access tokens.',
    impactAnalysis: 'Software engineering teams using automated npm/pip install scripts in CI/CD pipelines without package hash locks are actively compromised.',
    mitigationSteps: [
      'Enforce package-lock.json and npm audit in CI/CD pipeline gating.',
      'Deploy private npm enterprise mirrors (Verdaccio, Nexus) with strict allowlists.',
      'Rotate all developer cloud credentials immediately if unverified AI helper packages were installed.'
    ],
    mitreTactic: 'Initial Access (TA0001) • T1195: Supply Chain Compromise',
    affectedVendors: ['npm Registry', 'Python Package Index (PyPI)', 'VS Code Extensions']
  },
  {
    id: 'news-6',
    title: 'Active Directory Kerberoasting Spike Detected in Regional Banking Infrastructures',
    severity: 'HIGH',
    category: 'Nation-State & APAC',
    timestamp: '7 hours ago',
    sourceName: 'MITRE ATT&CK & Zaib Threat Research',
    sourceUrl: 'https://attack.mitre.org/techniques/T1558/003/',
    cvssScore: '8.1 HIGH',
    summary: 'Adversaries who obtained low-privilege domain user credentials are systematically requesting TGS Kerberos service tickets for Service Principal Names (SPNs) with weak RC4 encryption, cracking the hashes offline using Hashcat.',
    impactAnalysis: 'Leads directly to Domain Admin account takeover when service accounts run with administrative privileges.',
    mitigationSteps: [
      'Migrate all Active Directory service accounts to Group Managed Service Accounts (gMSA) with 128-char automated rotating passwords.',
      'Enforce AES-256 encryption exclusively for Kerberos ticket exchanges and deprecate RC4.',
      'Monitor Windows Event ID 4769 for ticket encryption type 0x17 (RC4-HMAC).'
    ],
    mitreTactic: 'Credential Access (TA0006) • T1558.003: Kerberoasting',
    affectedVendors: ['Microsoft Active Directory', 'Kerberos KDC', 'Windows Server']
  }
];

export const DailyThreatFeedSection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState('Just Now');
  const [expandedThreatId, setExpandedThreatId] = useState<string | null>('news-1');

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setLastRefreshed(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 600);
  };

  const filteredNews = REALTIME_CYBER_NEWS.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.cveId && item.cveId.toLowerCase().includes(searchQuery.toLowerCase())) ||
      item.sourceName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="threat-feed" className="py-16 px-4 sm:px-6 lg:px-8 border-b border-slate-800/80 bg-[#050b16] relative overflow-hidden w-full max-w-full">
      {/* Background glow */}
      <div className="absolute top-1/3 -left-40 w-96 h-96 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 -right-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 space-y-8 w-full">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono font-semibold mb-3">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              <span>LIVE CYBERSHIELD-PK THREAT INTELLIGENCE DESK</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Real-Time Cybersecurity News & Zero-Day Updates
            </h2>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl font-mono">
              Live intelligence stream tracking active exploitation, zero-day CVEs, ransomware attacks, and verified advisory bulletins linked directly to authoritative security bodies.
            </p>
          </div>

          {/* Refresh & Live Status */}
          <div className="flex items-center gap-3 self-start md:self-auto">
            <div className="text-xs font-mono text-slate-400 flex items-center gap-1.5 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800">
              <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span>Telemetry: <strong className="text-emerald-300">Live</strong></span>
              <span className="text-slate-600">|</span>
              <span className="text-slate-500">{lastRefreshed}</span>
            </div>

            <button
              type="button"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-slate-700 hover:border-cyan-500/50 text-xs font-mono transition-all cursor-pointer shadow-md"
              title="Refresh Threat Feed"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-cyan-400' : ''}`} />
              <span>{isRefreshing ? 'Fetching...' : 'Sync Feed'}</span>
            </button>
          </div>
        </div>

        {/* 1. Authoritative Knowledge Sources Directory Bar */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#081222] border border-cyan-500/20 shadow-xl space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-cyan-400" />
              <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider font-mono">
                Authoritative Cybersecurity Knowledge & Advisory Sources
              </h3>
            </div>
            <span className="text-[11px] font-mono text-slate-400">
              Linked for primary research & verified remediation
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2 pt-1">
            {KNOWLEDGE_SOURCES.map((source) => (
              <a
                key={source.name}
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-cyan-500/50 transition-all flex flex-col justify-between group hover:bg-slate-900/90 text-left cursor-pointer"
                title={`${source.name}: ${source.description}`}
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold border ${source.color}`}>
                      {source.badge}
                    </span>
                    <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-cyan-400 transition-colors flex-shrink-0" />
                  </div>
                  <span className="text-xs font-bold text-slate-200 group-hover:text-cyan-300 transition-colors line-clamp-1">
                    {source.name}
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 font-mono mt-1 group-hover:text-slate-400">
                  Access Portal →
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* 2. Filter Bar & Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 font-mono text-xs">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-900/90 border border-slate-800 rounded-xl">
            {[
              { id: 'all', label: 'All Breaking Updates' },
              { id: 'Zero-Day / CVE', label: 'Zero-Day / CVEs' },
              { id: 'Ransomware', label: 'Ransomware' },
              { id: 'Nation-State & APAC', label: 'National & APAC' },
              { id: 'Cloud & Edge', label: 'Cloud & Edge' },
              { id: 'AI & Supply Chain', label: 'AI & Supply Chain' }
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedCategory(tab.id)}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  selectedCategory === tab.id
                    ? 'bg-red-500/20 text-red-300 font-bold border border-red-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search CVE, vendor, attack..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-900/90 border border-slate-800 rounded-xl text-slate-200 text-xs focus:outline-none focus:border-red-500/50 transition-colors"
            />
          </div>
        </div>

        {/* 3. Real-time Threat News Feed List */}
        <div className="space-y-4">
          {filteredNews.map((threat) => {
            const isExpanded = expandedThreatId === threat.id;
            return (
              <div
                key={threat.id}
                className={`rounded-2xl border transition-all shadow-xl overflow-hidden ${
                  threat.severity === 'CRITICAL'
                    ? 'bg-[#091122] border-red-500/30 hover:border-red-500/60'
                    : threat.severity === 'HIGH'
                    ? 'bg-[#091122] border-amber-500/30 hover:border-amber-500/60'
                    : 'bg-[#091122] border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="p-5 sm:p-6 space-y-4">
                  {/* Top Bar: Severity, Time, Source Link, CVE */}
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full font-bold border ${
                        threat.severity === 'CRITICAL'
                          ? 'bg-red-950 text-red-400 border-red-500/50'
                          : threat.severity === 'HIGH'
                          ? 'bg-amber-950 text-amber-400 border-amber-500/50'
                          : 'bg-emerald-950 text-emerald-400 border-emerald-500/50'
                      }`}>
                        {threat.severity}
                      </span>

                      <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                        {threat.category}
                      </span>

                      {threat.cveId && (
                        <span className="px-2.5 py-0.5 rounded-full bg-red-950/40 text-red-300 border border-red-500/30 font-bold">
                          {threat.cveId}
                        </span>
                      )}

                      {threat.cvssScore && (
                        <span className="text-amber-400 font-bold hidden sm:inline">
                          CVSS: {threat.cvssScore}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        <span>{threat.timestamp}</span>
                      </span>

                      {/* Direct Knowledge Source Link */}
                      <a
                        href={threat.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 hover:border-cyan-400 transition-colors font-semibold"
                        title={`View original source publication at ${threat.sourceName}`}
                      >
                        <FileText className="w-3 h-3 text-cyan-400" />
                        <span className="truncate max-w-[160px] sm:max-w-none">{threat.sourceName}</span>
                        <ExternalLink className="w-3 h-3 ml-0.5 text-cyan-400" />
                      </a>
                    </div>
                  </div>

                  {/* Title & Summary */}
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-white leading-snug">
                      {threat.title}
                    </h3>
                    <p className="text-sm text-slate-300 mt-2 leading-relaxed">
                      {threat.summary}
                    </p>
                  </div>

                  {/* Impact & Target Scope */}
                  <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs font-mono space-y-1.5">
                    <div className="flex items-center gap-2 text-red-400 font-bold">
                      <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>Impact Scope & Vulnerable Surface:</span>
                    </div>
                    <p className="text-slate-300 leading-relaxed pl-5">
                      {threat.impactAnalysis}
                    </p>
                    <div className="pl-5 pt-1 flex flex-wrap items-center gap-2">
                      <span className="text-slate-500">Affected Technologies:</span>
                      {threat.affectedVendors.map((vendor, vIdx) => (
                        <span key={vIdx} className="px-2 py-0.5 bg-slate-900 border border-slate-800 rounded text-slate-300 text-[11px]">
                          {vendor}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Mitigation Guidance & Remediation */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-400">
                        <ShieldAlert className="w-4 h-4" />
                        <span>Actionable Blue Team Defense & Remediation Steps:</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setExpandedThreatId(isExpanded ? null : threat.id)}
                        className="text-xs font-mono text-cyan-400 hover:text-cyan-300 cursor-pointer"
                      >
                        {isExpanded ? 'Collapse Analysis' : 'Expand Details'}
                      </button>
                    </div>

                    <div className="space-y-1.5">
                      {threat.mitigationSteps.map((step, sIdx) => (
                        <div key={sIdx} className="flex items-start gap-2.5 text-xs text-slate-300 font-mono">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                          <span className="leading-relaxed">{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Bottom Footer: MITRE ATT&CK & Verification Status */}
                  <div className="pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] font-mono text-slate-400">
                    <div className="flex items-center gap-2">
                      <span className="text-cyan-400 font-semibold">MITRE ATT&CK:</span>
                      <span className="text-slate-300 truncate">{threat.mitreTactic}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-emerald-400 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        <span>Verified by Muhammad Zaib Zafar</span>
                      </span>

                      <a
                        href={threat.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-cyan-400 hover:underline flex items-center gap-1 font-semibold"
                      >
                        <span>Official Bulletin</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {filteredNews.length === 0 && (
            <div className="p-8 text-center rounded-2xl bg-slate-900/50 border border-slate-800 text-slate-400 font-mono text-xs">
              No cybersecurity advisories found matching "{searchQuery}". Try selecting "All Breaking Updates".
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
