import { Lab } from '../types';

export const LABS: Lab[] = [
  {
    id: 'lab-sqli-bypass',
    title: 'SQL Injection: Authentication Bypass & Table Dumping',
    category: 'Web Security',
    objective: 'Exploit an unsanitized login parameter to authenticate as administrator and dump customer records from MySQL.',
    difficulty: 'Beginner',
    estimatedTime: '45 mins',
    skills: ['SQL Injection', 'Burp Suite Repeater', 'Payload Crafting', 'Hash Extraction'],
    environment: 'Containerized Ubuntu + Vulnerable PHP/MySQL Microservice',
    status: 'AVAILABLE',
    scenario: 'Target corporate intranet portal at http://sec-portal.internal/login.php accepts user input without prepared statements. Your mission is to bypass the password check and extract the secret API key in the admin table.',
    tasks: [
      { id: 't1', instruction: 'Intercept login POST request in Burp Suite and identify parameter boundaries.', hint: "Observe username and password fields; test ' OR 1=1-- -" },
      { id: 't2', instruction: 'Craft an inline SQL comment injection payload to bypass the password hash verification.', hint: "admin' -- " },
      { id: 't3', instruction: 'Determine the column count using ORDER BY 1, 2, 3...', hint: "Increment until HTTP 500 error occurs." },
      { id: 't4', instruction: 'Execute UNION SELECT to retrieve schema names and extract the flag from flag_storage.', hint: "UNION SELECT 1, flag_val, 3 FROM secrets--" }
    ],
    terminalPrompt: 'analyst@cybershield-lab:~$',
    sampleLogOrOutput: `[+] Target URL: http://sec-portal.internal/api/auth
[+] Parameter 'username' is vulnerable to Error-based SQLi (MySQL >= 5.7)
[+] Successfully injected: admin' OR '1'='1' -- 
[+] Admin Dashboard unlocked! Session Cookie: CS_SESS_936_AUTH_VALID
[+] FLAG: CS{SQL1_BYP4SS_AUTH_SUCCESS_2026}`
  },
  {
    id: 'lab-wazuh-siem',
    title: 'SOC Investigation: Brute Force & Lateral Movement',
    category: 'SOC',
    objective: 'Analyze Wazuh SIEM security alerts triggered by repeated SSH failed logins followed by successful privilege escalation.',
    difficulty: 'Intermediate',
    estimatedTime: '60 mins',
    skills: ['Wazuh Dashboard', 'Log Correlation', 'Syslog Analysis', 'MITRE ATT&CK T1110'],
    environment: 'Simulated Wazuh SIEM 4.7 Cluster + Linux Server Endpoint',
    status: 'AVAILABLE',
    scenario: 'At 02:14 UTC, external IP 198.51.100.44 initiated high-frequency SSH authentication attempts against internal bastion server (srv-jump-01). Correlate the alerts to identify if an account was compromised and determine actions taken.',
    tasks: [
      { id: 't1', instruction: 'Filter Wazuh security alerts for rule.id: 5710 (SSH unauthorized attempts).', hint: 'Look for the spike in failed authentications within a 5-minute window.' },
      { id: 't2', instruction: 'Identify the compromised user account and the subsequent rule 5715 (Successful logon).', hint: 'Check the dstuser field on the successful logon log.' },
      { id: 't3', instruction: 'Trace the commands executed under sudo by reviewing rule 5402 in auditd telemetry.', hint: 'Look for /bin/bash or chmod +s executed under root privileges.' },
      { id: 't4', instruction: 'Classify the MITRE ATT&CK technique and submit the containment recommendation.', hint: 'T1110.001 (Brute Force: Password Guessing) and T1548 (Privilege Escalation).' }
    ],
    terminalPrompt: 'soc-analyst@wazuh-terminal:~$',
    sampleLogOrOutput: `** Alert 1715482400.198302: - pam,syslog,authentication_failure
2026-09-15 02:14:18 (srv-jump-01) 10.0.1.50->/var/log/auth.log
Rule: 5710 (level 10) -> 'Multiple failed SSH logins from single IP.'
Src IP: 198.51.100.44
Dst User: devops_lead
Status: ALERT_RESOLVED_CONTAINED`
  },
  {
    id: 'lab-idor-privilege',
    title: 'Broken Object Reference & Account Takeover',
    category: 'Web Security',
    objective: 'Identify an insecure direct object reference in a modern REST API and escalate to unauthorized account modification.',
    difficulty: 'Intermediate',
    estimatedTime: '40 mins',
    skills: ['API Pentesting', 'JSON Tampering', 'Access Control Validation'],
    environment: 'Node.js Express REST API + React SPA Client',
    status: 'AVAILABLE',
    scenario: 'The user profile endpoint /api/v1/users/me returns a JSON object with user_id: 1042. Changing the parameter in /api/v1/users/1042/settings allows updating arbitrary user profiles due to missing server-side authorization checks.',
    tasks: [
      { id: 't1', instruction: 'Map the REST API endpoints during normal user profile updating.', hint: 'Inspect HTTP PUT requests sent to /api/v1/users/:id' },
      { id: 't2', instruction: 'Test horizontal IDOR by changing user_id parameter to another tenant ID (e.g. 1043).', hint: 'Check if the server responds with HTTP 200 and updated data.' },
      { id: 't3', instruction: 'Test vertical privilege escalation by appending role: "admin" in the JSON payload.', hint: 'Watch for mass assignment vulnerability.' }
    ],
    terminalPrompt: 'tester@cybershield-api:~$',
    sampleLogOrOutput: `PUT /api/v1/users/1001/roles HTTP/1.1
Host: api.targetbank.internal
Authorization: Bearer test_user_token_abc
Content-Type: application/json

{"role": "SuperAdmin", "status": "active"}

HTTP/1.1 200 OK
{"success": true, "user": {"id": 1001, "role": "SuperAdmin"}}
FLAG: CS{ID0R_PR1V1L3G3_3SC4L4T1ON}`
  },
  {
    id: 'lab-wireshark-pcap',
    title: 'PCAP Analysis: Malware C2 Beaconing & Exfiltration',
    category: 'Network Security',
    objective: 'Inspect a raw packet capture to detect Cobalt Strike beaconing intervals, decrypt TLS metadata, and uncover exfiltrated data.',
    difficulty: 'Intermediate',
    estimatedTime: '50 mins',
    skills: ['Wireshark', 'Packet Filtering', 'DNS Analysis', 'Protocol Forensics'],
    environment: 'Wireshark Cloud Desktop + Preloaded forensic.pcapng',
    status: 'AVAILABLE',
    scenario: 'An infected Windows workstation was quarantined after generating abnormal outbound traffic. Analyze the provided network trace to extract the C2 domain, jitter interval, and the specific files staged for exfiltration.',
    tasks: [
      { id: 't1', instruction: 'Open forensic.pcapng and inspect protocol hierarchy statistics.', hint: 'Statistics > Protocol Hierarchy' },
      { id: 't2', instruction: 'Identify abnormal periodic HTTP GET/POST requests with consistent jitter.', hint: 'Filter: http.request and observe delta times between requests.' },
      { id: 't3', instruction: 'Inspect DNS queries for high-entropy subdomains indicating DNS tunneling.', hint: 'Look for long base64 strings prepended to domain names.' }
    ],
    terminalPrompt: 'analyst@pcap-sandbox:~$',
    sampleLogOrOutput: `Frame 410: 104 bytes on wire, 104 bytes captured
Internet Protocol Version 4, Src: 192.168.10.15, Dst: 45.33.32.156
Transmission Control Protocol, Src Port: 49182, Dst Port: 443
TLSv1.2 Record Layer: Handshake Protocol: Client Hello
SNI Server Name: c2-command.external-telemetry.org
Beacon Interval Detected: 45.2s (Jitter 15%)`
  },
  {
    id: 'lab-memory-dump',
    title: 'Volatile Memory Forensics: Injected Meterpreter Extraction',
    category: 'Digital Forensics',
    objective: 'Analyze an infected Windows 10 RAM dump using Volatility 3 to extract injected shellcode and determine process ancestry.',
    difficulty: 'Advanced',
    estimatedTime: '75 mins',
    skills: ['Volatility 3', 'Process Injections', 'Memory Carving', 'Malfind'],
    environment: 'Linux DFIR Workstation + 4GB win10_infected.raw Dump',
    status: 'AVAILABLE',
    scenario: 'Endpoint detected a suspicious svchost.exe running from an abnormal parent process. Analyze memory dump to recover the injection payload and cryptographic keys.',
    tasks: [
      { id: 't1', instruction: 'List running processes using windows.pstree and locate orphaned svchost.exe instances.', hint: 'Real svchost.exe always has services.exe as its parent PID.' },
      { id: 't2', instruction: 'Execute windows.malfind to detect PAGE_EXECUTE_READWRITE memory regions.', hint: 'Look for MZ header or standard shellcode opcode patterns (FC E8...).' },
      { id: 't3', instruction: 'Dump the injected VAD region to disk for static analysis.', hint: 'python3 vol.py -f dump.raw windows.dumpfiles --pid <PID>' }
    ],
    terminalPrompt: 'forensics@dfir-node:~$',
    sampleLogOrOutput: `Volatility 3 Framework 2.5.0
PID: 4892 (svchost.exe) PPID: 1844 (powershell.exe) <-- ANOMALY!
VAD: 0x24a0000 - 0x24b2000 Protection: PAGE_EXECUTE_READWRITE
Malfind Hexdump:
0x024a0000:  fc e8 82 00 00 00 60 89  e5 31 c0 64 8b 50 30 8b  ......\`..1.d.P0.
FLAG: CS{M3M0RY_1NJ3CT10N_CARV3D_SUCC3SS}`
  },
  {
    id: 'lab-cloud-iam',
    title: 'Cloud Security: AWS IAM Privilege Escalation Chaining',
    category: 'Cloud Security',
    objective: 'Exploit iam:CreatePolicyVersion misconfiguration on a low-privilege IAM user to escalate to full AdministratorAccess.',
    difficulty: 'Advanced',
    estimatedTime: '60 mins',
    skills: ['AWS CLI', 'IAM Policy Auditing', 'Privilege Escalation'],
    environment: 'LocalStack AWS Emulation + Cloud Pentest CLI',
    status: 'COMING SOON',
    scenario: 'Auditing contractor credentials with limited read permissions. Discover policy creation privileges that allow authoring a new default policy version with Action: * and Resource: *.',
    tasks: [
      { id: 't1', instruction: 'Enumerate attached inline and managed policies for the current AWS identity.' },
      { id: 't2', instruction: 'Identify CreatePolicyVersion capability without restriction.' },
      { id: 't3', instruction: 'Deploy new default policy version granting administrator privileges.' }
    ],
    terminalPrompt: 'cloud-auditor@aws-sandbox:~$',
    sampleLogOrOutput: `[!] Lab status: Scheduled for production release in Phase 2.`
  }
];
