import { Project } from '../types';

export const PROJECTS: Project[] = [
  {
    id: 'proj-wazuh-compliance',
    title: 'Wazuh Compliance Monitoring & Log Triage',
    category: 'Blue Team & SIEM',
    tagline: 'Enterprise-grade SIEM cluster engineering & automated CIS benchmark auditing',
    description: 'Centralized enterprise SIEM deployment utilizing Wazuh Manager, OpenSearch Indexer, and customized XML decoders to audit CIS benchmarks across multi-OS endpoints.',
    difficulty: 'Advanced',
    techStack: ['Wazuh SIEM', 'OpenSearch', 'Linux auditd', 'Sysmon', 'Bash', 'CIS Benchmark'],
    technologies: ['Wazuh SIEM', 'OpenSearch', 'Linux auditd', 'Sysmon', 'Bash', 'CIS Benchmark'],
    skills: ['SIEM Architecture', 'Regulatory Compliance', 'Log Enrichment', 'False Positive Tuning'],
    objective: 'Establish automated compliance auditing and real-time detection of privilege escalation, lateral movement, and unauthorized file modifications across 20+ servers.',
    status: 'IN_PRODUCTION',
    evidenceLink: 'https://www.linkedin.com/posts/muhammadzaibzafar_vulnerability-research-and-analysis-using-activity-7344977843585519616-sT0u',
    githubUrl: 'https://github.com/cybershieldpk',
    architecture: 'Lightweight Wazuh agents deployed on Windows Server and Ubuntu endpoints feeding encrypted JSON event streams to an isolated Wazuh Manager cluster on AWS VPC with automated Slack incident dispatch.',
    architectureDetails: 'Lightweight Wazuh agents deployed on Windows Server and Ubuntu endpoints feeding encrypted JSON event streams to an isolated Wazuh Manager cluster on AWS VPC with automated Slack incident dispatch.',
    keyFindings: [
      'Engineered 35+ custom XML decoders for internal proprietary applications.',
      'Configured File Integrity Monitoring (FIM) across critical root paths (/etc, /bin, C:\\Windows\\System32).',
      'Reduced false-positive alert volume by 68% through regex whitelisting of scheduled maintenance cronjobs.'
    ],
    deliverables: [
      'Production Wazuh cluster deployment configuration',
      'Custom XML decoders and correlation ruleset',
      'CIS Benchmark audit report and tuning playbook'
    ],
    toolsUsed: ['Wazuh', 'Elasticsearch', 'Sysmon', 'Logstash', 'Kibana']
  },
  {
    id: 'proj-threat-hunting-lab',
    title: 'Adversary Emulation & Threat Hunting Lab',
    category: 'Threat Hunting',
    tagline: 'Active Directory cyber range with real adversary telemetry mapped to MITRE ATT&CK',
    description: 'An isolated virtualized cyber range simulating enterprise Active Directory environments subjected to adversary attack techniques mapped against MITRE ATT&CK.',
    difficulty: 'Advanced',
    techStack: ['Active Directory', 'Atomic Red Team', 'Sysmon', 'Splunk', 'PowerShell'],
    technologies: ['Active Directory', 'Atomic Red Team', 'Sysmon', 'Splunk', 'PowerShell'],
    skills: ['Threat Hunting', 'MITRE ATT&CK Mapping', 'Adversary Simulation', 'Kerberoasting Detection'],
    objective: 'Generate real-world attack telemetry (Pass-the-Hash, Kerberoasting, Golden Ticket) using Atomic Red Team scripts and author Splunk detection searches.',
    status: 'COMPLETED',
    evidenceLink: 'https://www.linkedin.com/in/muhammadzaibzafar',
    githubUrl: 'https://github.com/cybershieldpk',
    architecture: 'Domain Controller running Windows Server 2022, two domain-joined Windows 11 workstations, and an offensive Kali Linux pivot host on an isolated hypervisor vSwitch.',
    architectureDetails: 'Domain Controller running Windows Server 2022, two domain-joined Windows 11 workstations, and an offensive Kali Linux pivot host on an isolated hypervisor vSwitch.',
    keyFindings: [
      'Documented high-fidelity detection rules for Event ID 4769 (Kerberos Service Ticket Operations with RC4 encryption).',
      'Created custom dashboards correlating process creation parent-child anomalies (cmd.exe spawned by excel.exe).',
      'Demonstrated complete kill chain defense from initial access to lateral movement isolation.'
    ],
    deliverables: [
      'Automated Atomic Red Team simulation scripts',
      'Splunk Enterprise threat hunting dashboards',
      'Step-by-step AD attack and defense lab manual'
    ],
    toolsUsed: ['Atomic Red Team', 'Splunk Enterprise', 'Mimikatz', 'PowerView', 'BloodHound']
  },
  {
    id: 'proj-web-app-pentest',
    title: 'Web Application Pentesting & Vulnerability Assessment',
    category: 'Offensive Security',
    tagline: 'End-to-end VAPT engagement revealing high-severity business logic and injection flaws',
    description: 'Comprehensive vulnerability assessment and penetration testing (VAPT) performed on WordPress and custom REST API architectures using Burp Suite Pro.',
    difficulty: 'Intermediate',
    techStack: ['Burp Suite Pro', 'OWASP ZAP', 'SQLmap', 'Postman', 'ffuf', 'WordPress'],
    technologies: ['Burp Suite Pro', 'OWASP ZAP', 'SQLmap', 'Postman', 'ffuf', 'WordPress'],
    skills: ['OWASP Top 10 Auditing', 'API Security', 'Business Logic Flaw Discovery', 'CVSS 3.1 Scoring'],
    objective: 'Identify high and critical security flaws in authentication flows, input handling, and authorization checks prior to production deployment.',
    status: 'COMPLETED',
    evidenceLink: 'https://www.linkedin.com/posts/muhammadzaibzafar_web-app-hacking-burp-suite-analysis-report-activity-7417118419231281152-t5W4',
    githubUrl: 'https://github.com/cybershieldpk',
    architecture: 'Full black-box and grey-box security assessment including network boundary testing, SSL/TLS protocol inspection, and deep manual API endpoint tampering.',
    architectureDetails: 'Full black-box and grey-box security assessment including network boundary testing, SSL/TLS protocol inspection, and deep manual API endpoint tampering.',
    keyFindings: [
      'Discovered Broken Access Control (IDOR) permitting unauthorized invoice retrieval.',
      'Identified Blind SQL Injection in custom database search endpoint and validated PoC.',
      'Produced detailed technical remediation reports with exact code patch recommendations.'
    ],
    deliverables: [
      'Executive vulnerability assessment report',
      'Technical vulnerability proof-of-concepts (PoCs)',
      'Remediation guide for engineering team'
    ],
    toolsUsed: ['Burp Suite Professional', 'OWASP ZAP', 'SQLmap', 'WPScan', 'Nmap']
  },
  {
    id: 'proj-dark-web-forensics',
    title: 'Dark Web Intelligence & OSINT Investigation',
    category: 'OSINT & Intelligence',
    tagline: 'Adversary infrastructure tracking and breach data triangulation on the Tor network',
    description: 'Threat intelligence research mapping adversary infrastructure, credential exposure, and ransomware double-extortion leak sites on the Tor network.',
    difficulty: 'Advanced',
    techStack: ['Tor Network', 'Whonix', 'Python', 'Maltego', 'Hunchly', 'Spiderfoot'],
    technologies: ['Tor Network', 'Whonix', 'Python', 'Maltego', 'Hunchly', 'Spiderfoot'],
    skills: ['Darknet Navigation', 'OPSEC Discipline', 'Threat Actor Profiling', 'Breach Data Triangulation'],
    objective: 'Provide early-warning threat intelligence by monitoring dark web leak directories for exposed organizational domain credentials and intellectual property.',
    status: 'ACTIVE_RESEARCH',
    evidenceLink: 'https://www.linkedin.com/posts/muhammadzaibzafar_dark-web-awareness-a-professional-educational-activity-7445067915495768066-JVoY',
    githubUrl: 'https://github.com/cybershieldpk',
    architecture: 'Air-gapped non-persistent Whonix virtual workstation utilizing Tor gateway isolation with DNS leak prevention and hardened browser settings.',
    architectureDetails: 'Air-gapped non-persistent Whonix virtual workstation utilizing Tor gateway isolation with DNS leak prevention and hardened browser settings.',
    keyFindings: [
      'Monitored 15+ ransomware leak sites and correlated compromised vendor lists with regional supply chains.',
      'Authored technical awareness advisories detailing adversary tactics, techniques, and procedures (TTPs).',
      'Demonstrated proactive defensive measures based on darknet threat intelligence telemetry.'
    ],
    deliverables: [
      'OSINT threat intelligence dossier',
      'Automated darknet leak scraping script in Python',
      'Executive advisory on credential stuffing defense'
    ],
    toolsUsed: ['Whonix', 'Tor Browser Hardened', 'Maltego', 'theHarvester', 'Shodan']
  },
  {
    id: 'proj-digital-forensics-investigation',
    title: 'Digital Forensics & Artifact Timeline Reconstruction',
    category: 'Digital Forensics',
    tagline: 'Post-breach memory acquisition and chronological disk artifact reconstruction',
    description: 'Post-incident analysis of a compromised enterprise endpoint: memory dump acquisition, MFT parsing, and malicious execution artifact timeline.',
    difficulty: 'Advanced',
    techStack: ['Volatility 3', 'Autopsy', 'FTK Imager', 'KAPE', 'Plaso'],
    technologies: ['Volatility 3', 'Autopsy', 'FTK Imager', 'KAPE', 'Plaso'],
    skills: ['Memory Forensics', 'File System Artifacts', 'Prefetch Analysis', 'Chain of Custody'],
    objective: 'Reconstruct the chronological order of adversary actions from initial phishing execution to data exfiltration staging.',
    status: 'COMPLETED',
    evidenceLink: 'https://www.linkedin.com/in/muhammadzaibzafar',
    githubUrl: 'https://github.com/cybershieldpk',
    architecture: '4GB raw memory image and E01 forensic disk image investigated in an isolated digital forensics laboratory environment.',
    architectureDetails: '4GB raw memory image and E01 forensic disk image investigated in an isolated digital forensics laboratory environment.',
    keyFindings: [
      'Recovered unmapped injected DLL payloads using Volatility 3 windows.malfind.',
      'Correlated Windows Prefetch files (C:\\Windows\\Prefetch) to prove execution timestamps of Cobalt Strike beacon.',
      'Identified exfiltration archive staged in hidden user AppData directory.'
    ],
    deliverables: [
      'Forensic case investigation report',
      'Timeline analysis sheet (Plaso/Log2Timeline)',
      'IOC list for endpoint detection agents'
    ],
    toolsUsed: ['Volatility 3', 'Autopsy', 'KAPE', 'CyberChef', 'Wireshark']
  },
  {
    id: 'proj-soc-dashboard-wazuh',
    title: 'SOC Analyst Operations Dashboard',
    category: 'SOC Engineering',
    tagline: 'Real-time telemetry triage portal with automated IP reputation and MITRE correlation',
    description: 'Custom security operations center interface providing consolidated threat feeds, automated IP reputation lookups, and analyst escalation triage.',
    difficulty: 'Intermediate',
    techStack: ['React', 'Tailwind CSS', 'Wazuh REST API', 'AlienVault OTX API', 'TypeScript'],
    technologies: ['React', 'Tailwind CSS', 'Wazuh REST API', 'AlienVault OTX API', 'TypeScript'],
    skills: ['SOC Tooling', 'API Integration', 'UI/UX for Security Analysts', 'Threat Intel Feeds'],
    objective: 'Empower Tier-1 SOC analysts to accelerate alert triage times from 15 minutes down to under 3 minutes per high-severity incident.',
    status: 'IN_PRODUCTION',
    evidenceLink: 'https://www.linkedin.com/in/muhammadzaibzafar',
    githubUrl: 'https://github.com/cybershieldpk',
    architecture: 'Unified web client interfacing with Wazuh API and external threat feeds (AlienVault OTX, VirusTotal) with automated MITRE ATT&CK categorization.',
    architectureDetails: 'Unified web client interfacing with Wazuh API and external threat feeds (AlienVault OTX, VirusTotal) with automated MITRE ATT&CK categorization.',
    keyFindings: [
      'Interactive alert viewer with automated WHOIS, GeoIP, and reputation scoring.',
      'Built-in containment playbook checklists for standard malware and credential stuffing alerts.'
    ],
    deliverables: [
      'Production-ready React/TypeScript web interface',
      'Wazuh REST API proxy integration service',
      'Analyst triage workflow documentation'
    ],
    toolsUsed: ['React', 'Wazuh API', 'OpenSearch', 'REST APIs']
  }
];
