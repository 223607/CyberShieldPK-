import { SecurityTool } from '../types';

export const SECURITY_TOOLS: SecurityTool[] = [
  {
    id: 'tool-nmap',
    name: 'Nmap (Network Mapper)',
    category: 'Reconnaissance & Port Scanning',
    purpose: 'Industry-standard open source utility for network discovery, port scanning, OS detection, and vulnerability scripting with NSE.',
    difficulty: 'Beginner',
    platform: 'Linux / macOS / Windows',
    learningResource: 'Nmap Network Scanning by Gordon Lyon & CyberShieldPK Recon Lab',
    officialWebsite: 'https://nmap.org',
    quickCheatSyntax: 'nmap -sS -sV -sC -T4 -p- target.com',
    keyFlagExplanations: [
      { flag: '-sS', desc: 'Stealthy TCP SYN Scan (half-open, does not complete 3-way handshake)' },
      { flag: '-sV', desc: 'Probe open ports to determine service version information' },
      { flag: '-sC', desc: 'Run default NSE (Nmap Scripting Engine) scripts' },
      { flag: '-p-', desc: 'Scan all 65,535 TCP ports instead of top 1,000' }
    ]
  },
  {
    id: 'tool-burp',
    name: 'Burp Suite Professional / Community',
    category: 'Web Application Security',
    purpose: 'Premier graphical web vulnerability interception proxy, crawler, automated scanner, and payload tamper tool.',
    difficulty: 'Intermediate',
    platform: 'Cross-platform Java (Linux, macOS, Windows)',
    learningResource: 'PortSwigger Web Security Academy & CyberShieldPK Web VAPT Course',
    officialWebsite: 'https://portswigger.net/burp',
    quickCheatSyntax: 'Proxy > Intercept On > Tamper Request > Send to Repeater (Ctrl+R)',
    keyFlagExplanations: [
      { flag: 'Proxy', desc: 'Intercept and modify raw HTTP/HTTPS and WebSocket packets on the fly' },
      { flag: 'Repeater', desc: 'Manually resend and tweak individual requests without reloading browser' },
      { flag: 'Intruder', desc: 'Automated fuzzing and dictionary attacks using Sniper, Cluster Bomb, etc.' },
      { flag: 'Decoder', desc: 'Convert Base64, URL encoding, Hex, HTML entities, and hashes instantly' }
    ]
  },
  {
    id: 'tool-zap',
    name: 'OWASP ZAP (Zed Attack Proxy)',
    category: 'Web Application Security',
    purpose: 'World’s most widely used free and open-source web application security scanner maintained by the OWASP community.',
    difficulty: 'Beginner',
    platform: 'Linux / macOS / Windows',
    learningResource: 'OWASP ZAP User Guide & Automated CI/CD DevSecOps Tutorials',
    officialWebsite: 'https://www.zaproxy.org',
    quickCheatSyntax: 'zap-cli quick-scan -s xss,sqli -u https://target.com',
    keyFlagExplanations: [
      { flag: 'Active Scan', desc: 'Sends live malicious payloads to verify known vulnerabilities automatically' },
      { flag: 'Passive Scan', desc: 'Inspects HTTP responses without altering requests (safe on production)' },
      { flag: 'Spider', desc: 'Automatically crawls hyperlinks and forms to discover target endpoints' },
      { flag: 'API Automation', desc: 'Integrate directly into GitHub Actions or GitLab CI pipelines' }
    ]
  },
  {
    id: 'tool-wazuh',
    name: 'Wazuh SIEM & XDR Platform',
    category: 'SOC & Blue Team',
    purpose: 'Unified open source security platform providing endpoint detection (EDR), log analysis, file integrity monitoring (FIM), and compliance auditing.',
    difficulty: 'Intermediate',
    platform: 'Linux (Server) / Linux, Windows, macOS (Agents)',
    learningResource: 'Wazuh Official Documentation & CyberShieldPK SOC Training',
    officialWebsite: 'https://wazuh.com',
    quickCheatSyntax: '/var/ossec/bin/wazuh-control status',
    keyFlagExplanations: [
      { flag: 'Log Decoders', desc: 'Extracts regex fields from raw syslog, Windows events, and web servers' },
      { flag: 'Rules Engine', desc: 'Correlates events to trigger alert levels from 0 to 16' },
      { flag: 'FIM', desc: 'Monitors critical system files against unauthorized checksum changes' },
      { flag: 'Active Response', desc: 'Automatically triggers firewall bans or script execution upon alert' }
    ]
  },
  {
    id: 'tool-wireshark',
    name: 'Wireshark',
    category: 'Network Security & Traffic Analysis',
    purpose: 'The world’s foremost network protocol analyzer that captures live packet data and provides microscopic packet inspection.',
    difficulty: 'Intermediate',
    platform: 'Linux / macOS / Windows',
    learningResource: 'Wireshark Official Documentation & CyberShieldPK PCAP Analysis',
    officialWebsite: 'https://www.wireshark.org',
    quickCheatSyntax: 'tshark -i eth0 -f "tcp port 80" -w capture.pcap',
    keyFlagExplanations: [
      { flag: 'Display Filters', desc: 'Refine visible packets in real time (e.g. ip.addr == 10.0.0.1)' },
      { flag: 'Follow TCP Stream', desc: 'Reconstruct complete conversational payload between client and server' },
      { flag: 'Expert Info', desc: 'Automated warnings for TCP window updates, checksum errors, resets' },
      { flag: 'Export Objects', desc: 'Extract transferred files (HTTP images, documents, executables) from stream' }
    ]
  },
  {
    id: 'tool-sqlmap',
    name: 'SQLmap',
    category: 'Vulnerability Exploitation',
    purpose: 'Automatic SQL injection and database takeover tool capable of fingerprinting databases, dumping tables, and running remote shell commands.',
    difficulty: 'Intermediate',
    platform: 'Python CLI (Linux, macOS, Windows)',
    learningResource: 'SQLmap GitHub Documentation & CyberShieldPK Injection Lab',
    officialWebsite: 'https://sqlmap.org',
    quickCheatSyntax: 'sqlmap -u "https://target.com/item?id=1" --batch --dbs',
    keyFlagExplanations: [
      { flag: '-u', desc: 'Specify target URL containing vulnerable parameters' },
      { flag: '--dbs', desc: 'Enumerate all available database names' },
      { flag: '--dump', desc: 'Dump all table entries and crack password hashes with dictionary' },
      { flag: '--os-shell', desc: 'Attempt to spawn an interactive OS shell if database privileges permit' }
    ]
  },
  {
    id: 'tool-wpscan',
    name: 'WPScan',
    category: 'Web Application Security',
    purpose: 'Black box WordPress vulnerability scanner for detecting vulnerable core versions, plugins, themes, and usernames.',
    difficulty: 'Beginner',
    platform: 'Ruby CLI / Docker',
    learningResource: 'WPScan Vulnerability Database & CyberShieldPK WordPress Security Guide',
    officialWebsite: 'https://wpscan.com',
    quickCheatSyntax: 'wpscan --url https://target-wp.com --enumerate vp,vt,u',
    keyFlagExplanations: [
      { flag: '--url', desc: 'The URL of the target WordPress installation' },
      { flag: '--enumerate vp', desc: 'Enumerate vulnerable plugins only' },
      { flag: '--enumerate u', desc: 'Enumerate WordPress author usernames via author archives' },
      { flag: '--api-token', desc: 'Provide WPScan token for live CVE vulnerability enrichment' }
    ]
  },
  {
    id: 'tool-nessus',
    name: 'Tenable Nessus',
    category: 'Vulnerability Management',
    purpose: 'Enterprise vulnerability assessment scanner providing compliance checks, malware detection, and patch auditing across hosts.',
    difficulty: 'Intermediate',
    platform: 'Linux / Windows / macOS',
    learningResource: 'Tenable University & Compliance Auditing Guidelines',
    officialWebsite: 'https://www.tenable.com/products/nessus',
    quickCheatSyntax: 'Configure Discovery > Basic Network Scan > Authenticated Credentials',
    keyFlagExplanations: [
      { flag: 'Plugin Database', desc: 'Over 170,000 vulnerability detection plugins updated daily' },
      { flag: 'Credentialed Scans', desc: 'Logs into target servers to inspect patch levels and misconfigurations' },
      { flag: 'Compliance Audits', desc: 'Verifies systems against CIS Benchmarks and PCI-DSS requirements' },
      { flag: 'CVSS Scoring', desc: 'Provides industry-standard severity ratings from Low to Critical' }
    ]
  },
  {
    id: 'tool-metasploit',
    name: 'Metasploit Framework',
    category: 'Exploitation & Post-Exploitation',
    purpose: 'The world’s most used penetration testing framework, providing thousands of verified exploits, payloads, encoders, and listener modules.',
    difficulty: 'Intermediate',
    platform: 'Linux / macOS / Windows',
    learningResource: 'Metasploit Unleashed (Offensive Security) & CyberShieldPK Bootcamp',
    officialWebsite: 'https://www.metasploit.com',
    quickCheatSyntax: 'msfconsole -q; use exploit/multi/handler',
    keyFlagExplanations: [
      { flag: 'msfconsole', desc: 'Interactive centralized command console for all framework modules' },
      { flag: 'meterpreter', desc: 'Advanced in-memory reflective DLL payload that leaves no disk footprint' },
      { flag: 'msfvenom', desc: 'Standalone payload generator and encoder for cross-platform reverse shells' },
      { flag: 'auxiliary', desc: 'Scanning, fuzzing, and reconnaissance modules without explicit payloads' }
    ]
  },
  {
    id: 'tool-gobuster',
    name: 'Gobuster',
    category: 'Reconnaissance & Directory Brute Forcing',
    purpose: 'High-speed directory, DNS subdomain, and vhost brute-forcer written in Go, optimized for speed and low CPU utilization.',
    difficulty: 'Beginner',
    platform: 'Go CLI (Linux, macOS, Windows)',
    learningResource: 'Gobuster GitHub Documentation & Asset Enumeration Labs',
    officialWebsite: 'https://github.com/OJ/gobuster',
    quickCheatSyntax: 'gobuster dir -u https://target.com -w common.txt -t 40',
    keyFlagExplanations: [
      { flag: 'dir', desc: 'Enumerate directories and files on a web server' },
      { flag: 'dns', desc: 'Enumerate subdomains using DNS lookup wordlists' },
      { flag: 'vhost', desc: 'Identify virtual hosts by fuzzing the HTTP Host header' },
      { flag: '-t', desc: 'Number of concurrent threads (default is 10, typically 40-50)' }
    ]
  },
  {
    id: 'tool-dirsearch',
    name: 'Dirsearch',
    category: 'Web Path Enumeration',
    purpose: 'Advanced command-line tool designed to brute force directories and files in webservers with recursive search and status code filtering.',
    difficulty: 'Beginner',
    platform: 'Python CLI (Linux, macOS, Windows)',
    learningResource: 'Dirsearch GitHub Documentation & Web Pentesting Methodology',
    officialWebsite: 'https://github.com/maurosoria/dirsearch',
    quickCheatSyntax: 'dirsearch -u https://target.com -e php,html,js -x 404,403',
    keyFlagExplanations: [
      { flag: '-e', desc: 'Comma-separated extensions to test (e.g. php,asp,json,txt)' },
      { flag: '-x', desc: 'Exclude specific HTTP response status codes (e.g. 404, 500)' },
      { flag: '-r', desc: 'Recursively brute-force discovered subdirectories' },
      { flag: '--random-agent', desc: 'Rotate HTTP User-Agent headers to avoid simple bot blockers' }
    ]
  }
];
