import { Article } from '../types';

export const ARTICLES: Article[] = [
  {
    id: 'art-wazuh-compliance',
    slug: 'wazuh-compliance-monitoring-and-soc-triage',
    title: 'Deploying Wazuh for Real-Time Compliance Monitoring & Threat Triage',
    category: 'SOC & Blue Team',
    difficulty: 'Intermediate',
    readingTime: '9 min read',
    date: 'March 2026',
    featured: true,
    summary: 'A field guide to configuring Wazuh SIEM decoders, mapping MITRE ATT&CK techniques, and auditing CIS benchmark compliance on hybrid infrastructure.',
    author: {
      name: 'Muhammad Zaib Zafar',
      title: 'Security Researcher & Penetration Tester'
    },
    tags: ['Wazuh', 'SIEM', 'SOC', 'Compliance', 'Blue Team'],
    tableOfContents: [
      { id: 'sec-intro', title: '1. Why Centralized SIEM Matters' },
      { id: 'sec-arch', title: '2. Wazuh Architecture & Communication Flow' },
      { id: 'sec-decoders', title: '3. Custom Rules & Decoders in Practice' },
      { id: 'sec-fim', title: '4. File Integrity Monitoring (FIM) Enforcement' },
      { id: 'sec-summary', title: '5. Key Incident Triage Takeaways' }
    ],
    contentSections: [
      {
        id: 'sec-intro',
        heading: '1. Why Centralized SIEM Matters',
        paragraphs: [
          'In modern threat landscapes, individual server logs are frequently the first casualty during an intrusion. When threat actors gain root access, clearing /var/log/auth.log or disabling the Windows Event Log service is trivial if telemetry remains localized.',
          'Wazuh solves this by continuously shipping cryptographically authenticated event streams to an isolated manager node. Events are parsed, normalized, evaluated against correlation rules, and indexed into OpenSearch in sub-second intervals.'
        ]
      },
      {
        id: 'sec-arch',
        heading: '2. Wazuh Architecture & Communication Flow',
        paragraphs: [
          'The platform relies on three distinct layers: the lightweight Wazuh Agent (running on target endpoints), the Wazuh Manager cluster (which runs the analysis and active response engines), and the Wazuh Indexer (distributed search engine for long-term retention).',
          'Agent-to-manager communications utilize port 1514 (TCP/UDP with AES encryption), while agent registration and certificate enrollment use port 1515.'
        ],
        codeSnippet: {
          language: 'bash',
          title: 'Wazuh Agent Health & Status Verification',
          code: `# Check agent daemon status on Linux endpoint
systemctl status wazuh-agent

# Verify agent registration on manager
/var/ossec/bin/agent_control -l
# ID: 001, Name: web-prod-01, IP: 10.0.1.15, Active`
        }
      },
      {
        id: 'sec-decoders',
        heading: '3. Custom Rules & Decoders in Practice',
        paragraphs: [
          'While default rulesets detect thousands of common CVEs and brute-force attempts, organization-specific attacks require custom XML rule engineering. Wazuh allows child rules that inherit properties from parent rule IDs.',
          'Here is an example rule designed to flag abnormal privilege escalation attempts via sudo on non-standard binaries:'
        ],
        codeSnippet: {
          language: 'xml',
          title: 'Custom Wazuh Rule: Suspicious Sudo Invocation',
          code: `<group name="local,syslog,sudo,">
  <rule id="100020" level="12">
    <if_sid>5402</if_sid>
    <match>COMMAND=/usr/bin/python|COMMAND=/usr/bin/perl|COMMAND=/bin/nc</match>
    <description>Suspicious living-off-the-land command executed via sudo.</description>
    <mitre>
      <id>T1548.003</id>
    </mitre>
  </rule>
</group>`
        }
      },
      {
        id: 'sec-fim',
        heading: '4. File Integrity Monitoring (FIM) Enforcement',
        paragraphs: [
          'File Integrity Monitoring (syscheck) tracks modifications to critical files like /etc/passwd, /etc/shadow, and webroot directories (/var/www/html).',
          'Whenever an unauthorized modification occurs, Wazuh captures the exact diff, the user who triggered the modification, and the process hash.'
        ],
        keyTakeaway: 'Always enable real-time FIM on authentication files and webroot directories to catch webshell installations instantly.'
      },
      {
        id: 'sec-summary',
        heading: '5. Key Incident Triage Takeaways',
        paragraphs: [
          'Deploying Wazuh elevates team visibility from blind panic to structured timeline analysis. Correlate alert severity with asset criticality and always verify network egress logs alongside endpoint alerts.'
        ]
      }
    ]
  },
  {
    id: 'art-burp-suite-methodology',
    slug: 'burp-suite-professional-pentesting-methodology',
    title: 'Burp Suite Professional: Offensive API & Web Pentesting Methodology',
    category: 'Web Application Security',
    difficulty: 'Intermediate',
    readingTime: '11 min read',
    date: 'February 2026',
    featured: true,
    summary: 'A technical walkthrough of intercepting complex JWT authentication flows, configuring automated match-and-replace rules, and bypassing client-side validation.',
    author: {
      name: 'Muhammad Zaib Zafar',
      title: 'Security Researcher & Penetration Tester'
    },
    tags: ['Burp Suite', 'Web Security', 'OWASP', 'API Pentesting', 'VAPT'],
    tableOfContents: [
      { id: 'burp-scope', title: '1. Defining Rigorous Testing Scope' },
      { id: 'burp-proxy', title: '2. Proxy Tricks & Match/Replace Rules' },
      { id: 'burp-jwt', title: '3. JWT Attack Workflows in Repeater' },
      { id: 'burp-extensions', title: '4. High-Impact BApp Extensions' }
    ],
    contentSections: [
      {
        id: 'burp-scope',
        heading: '1. Defining Rigorous Testing Scope',
        paragraphs: [
          'Before sending a single payload, defining the Target Scope in Burp Suite is mandatory. Failing to properly configure scope risks sending aggressive fuzzing payloads to third-party analytics trackers, payment gateways, or cloud providers.',
          'Use advanced regular expressions to include exact target subdomains while explicitly dropping CDN domains (like cdnjs or googleapis).'
        ]
      },
      {
        id: 'burp-proxy',
        heading: '2. Proxy Tricks & Match/Replace Rules',
        paragraphs: [
          'Under Proxy > Options > Match and Replace, you can dynamically tamper with HTTP requests before they leave your machine. For instance, disabling Content-Security-Policy (CSP) headers in responses makes validating DOM-based XSS substantially faster in modern browsers.'
        ],
        codeSnippet: {
          language: 'http',
          title: 'Header Tampering Demonstration',
          code: `// Burp Match and Replace Rule
Type: Response header
Match: Content-Security-Policy: (.*)
Replace: (leave empty)`
        }
      },
      {
        id: 'burp-jwt',
        heading: '3. JWT Attack Workflows in Repeater',
        paragraphs: [
          'JSON Web Tokens (JWT) are ubiquitous in modern single-page applications. Common vulnerabilities include algorithm confusion (changing RS256 to HS256 and signing with the public key), the "none" algorithm flaw, and lack of token expiry verification.',
          'Always decode the token header, inspect the jku and kid parameters for path traversal opportunities, and verify if the signature is validated server-side on critical mutation endpoints.'
        ],
        keyTakeaway: 'Never trust claims in a JWT without verifying that the backend cryptographically enforces signature verification on every protected route.'
      },
      {
        id: 'burp-extensions',
        heading: '4. High-Impact BApp Extensions',
        paragraphs: [
          'Supercharge Burp Suite with community extensions: Autorize (automatic broken access control testing), Turbo Intruder (ultra-fast HTTP pipelining for race conditions), and JSON Web Tokens Killer.'
        ]
      }
    ]
  },
  {
    id: 'art-dark-web-forensics',
    slug: 'dark-web-osint-threat-intelligence-methodology',
    title: 'Dark Web OSINT: Threat Intelligence & Adversary Tracking',
    category: 'OSINT & Threat Intelligence',
    difficulty: 'Advanced',
    readingTime: '8 min read',
    date: 'January 2026',
    featured: true,
    summary: 'How security analysts safely map Tor hidden services, monitor ransomware leak portals, and correlate leaked credentials without risking operational security.',
    author: {
      name: 'Muhammad Zaib Zafar',
      title: 'Security Researcher & Penetration Tester'
    },
    tags: ['OSINT', 'Dark Web', 'Threat Intelligence', 'OPSEC', 'Ransomware'],
    tableOfContents: [
      { id: 'dw-opsec', title: '1. Operational Security (OPSEC) Foundations' },
      { id: 'dw-tor', title: '2. Tor Hidden Service Architecture (.onion)' },
      { id: 'dw-ransom', title: '3. Tracking Ransomware Data Leaks' },
      { id: 'dw-intel', title: '4. Translating Darknet Findings into Defenses' }
    ],
    contentSections: [
      {
        id: 'dw-opsec',
        heading: '1. Operational Security (OPSEC) Foundations',
        paragraphs: [
          'Conducting investigations on the dark web carries intrinsic risks. Analysts must never use personal hardware or work networks without isolated virtualization, non-persistent operating systems (Tails or Whonix), and strict separation of personas.',
          'Disable browser JavaScript, avoid full-screen browser window sizing to defeat canvas fingerprinting, and never log into clearweb accounts while connected to dark web circuits.'
        ]
      },
      {
        id: 'dw-tor',
        heading: '2. Tor Hidden Service Architecture (.onion)',
        paragraphs: [
          'Tor v3 onion addresses consist of 56 base32 characters representing the ed25519 public key of the service. Unlike clearweb domains that rely on DNS and BGP routing, Tor services utilize rendezvous points and distributed hash tables (DHT).'
        ]
      },
      {
        id: 'dw-ransom',
        heading: '3. Tracking Ransomware Data Leaks',
        paragraphs: [
          'Modern double-extortion ransomware groups (e.g. LockBit, BlackCat/ALPHV variants) operate public PR and leak blogs on Tor. Threat analysts monitor these channels to detect supply-chain compromises weeks before formal breach disclosures occur.'
        ],
        keyTakeaway: 'Dark web threat intelligence allows proactive credential revoking and perimeter patch prioritization before exposed data is weaponized.'
      },
      {
        id: 'dw-intel',
        heading: '4. Translating Darknet Findings into Defenses',
        paragraphs: [
          'Raw intelligence is meaningless without action. Ingest exposed corporate domain hashes into Active Directory credential filters to force password resets on compromised user accounts.'
        ]
      }
    ]
  },
  {
    id: 'art-sql-injection-modern',
    slug: 'deep-dive-sql-injection-bypass-modern-frameworks',
    title: 'Deep Dive: Bypassing Modern Web Application Firewalls in SQLi',
    category: 'Web Application Security',
    difficulty: 'Advanced',
    readingTime: '12 min read',
    date: 'January 2026',
    featured: false,
    summary: 'Technical breakdown of whitespace alternate encodings, inline comment trickery, and second-order injection in ORM abstraction layers.',
    author: {
      name: 'Muhammad Zaib Zafar',
      title: 'Security Researcher & Penetration Tester'
    },
    tags: ['SQL Injection', 'WAF Bypass', 'Web Pentesting'],
    tableOfContents: [
      { id: 'sqli-orm', title: '1. Misconceptions around ORMs' },
      { id: 'sqli-waf', title: '2. WAF Obfuscation Techniques' },
      { id: 'sqli-defense', title: '3. Parameterized Query Enforcement' }
    ],
    contentSections: [
      {
        id: 'sqli-orm',
        heading: '1. Misconceptions around ORMs',
        paragraphs: [
          'Many engineering teams assume that employing an Object-Relational Mapper (such as Hibernate, Sequelize, or Prisma) automatically immunizes an application against SQL injection.',
          'In reality, raw query escape hatches (e.g. sequelize.query() with template string literals) and dynamic ORDER BY sorting clauses frequently re-introduce classical vulnerabilities.'
        ]
      },
      {
        id: 'sqli-waf',
        heading: '2. WAF Obfuscation Techniques',
        paragraphs: [
          'Cloud firewalls inspect requests for explicit keywords like "UNION SELECT". Attackers leverage URL encoding, multipart/form-data boundary evasion, and inline comments (/*!50000SELECT*/) to bypass heuristic string matchers.'
        ],
        codeSnippet: {
          language: 'sql',
          title: 'MySQL Inline Comment Obfuscation',
          code: `-- Normal flagged query:
UNION SELECT 1, @@version, 3

-- Obfuscated payload executed by MySQL parser but missed by basic regex:
/*!50000%55NION*//*!50000%53ELECT*/1,/*!50000@@version*/,3`
        }
      },
      {
        id: 'sqli-defense',
        heading: '3. Parameterized Query Enforcement',
        paragraphs: [
          'The only bulletproof mitigation for SQL injection is parameterization: separating data from the query code. When parameters are sent out-of-band via database wire protocols, input is treated strictly as literal data, rendering syntactic attacks impossible.'
        ]
      }
    ]
  },
  {
    id: 'art-memory-forensics-volatility',
    slug: 'hunting-fileless-malware-with-memory-forensics',
    title: 'Hunting Fileless Malware: Volatility 3 Analysis Masterclass',
    category: 'Digital Forensics',
    difficulty: 'Advanced',
    readingTime: '10 min read',
    date: 'December 2025',
    featured: false,
    summary: 'Extracting unmapped reflective DLLs, hollowed processes, and raw memory artifacts using Volatility 3.',
    author: {
      name: 'Muhammad Zaib Zafar',
      title: 'Security Researcher & Penetration Tester'
    },
    tags: ['Forensics', 'Volatility 3', 'Malware', 'DFIR'],
    tableOfContents: [
      { id: 'vol-intro', title: '1. What is Fileless Malware?' },
      { id: 'vol-malfind', title: '2. Understanding Malfind Output' },
      { id: 'vol-carving', title: '3. Carving Payloads for Ghidra' }
    ],
    contentSections: [
      {
        id: 'vol-intro',
        heading: '1. What is Fileless Malware?',
        paragraphs: [
          'Fileless malware resides strictly within volatile system memory (RAM), avoiding disk writes to circumvent traditional endpoint signature scanners.',
          'Techniques like Process Hollowing and DLL Injection unmap legitimate image code from memory and overwrite it with weaponized shellcode.'
        ]
      },
      {
        id: 'vol-malfind',
        heading: '2. Understanding Malfind Output',
        paragraphs: [
          'The windows.malfind plugin scans Virtual Address Descriptors (VADs) for pages that have executable permissions (PAGE_EXECUTE_READWRITE) without being mapped to an on-disk PE binary.'
        ]
      },
      {
        id: 'vol-carving',
        heading: '3. Carving Payloads for Ghidra',
        paragraphs: [
          'Once a suspicious memory segment is pinpointed, windows.dumpfiles extracts the binary stream for static decompilation in Ghidra to extract hardcoded C2 addresses and persistence keys.'
        ]
      }
    ]
  },
  {
    id: 'art-cybersecurity-fundamentals-roadmap',
    slug: 'complete-cybersecurity-career-roadmap-2026',
    title: 'The Practical Cybersecurity Career Roadmap (2026 Edition)',
    category: 'Cybersecurity Fundamentals',
    difficulty: 'Beginner',
    readingTime: '7 min read',
    date: 'March 2026',
    featured: false,
    summary: 'A structured blueprint for students and transitioners: essential networking fundamentals, Linux commands, hands-on lab platforms, and industry certifications.',
    author: {
      name: 'Muhammad Zaib Zafar',
      title: 'Security Researcher & Penetration Tester'
    },
    tags: ['Career', 'Roadmap', 'Fundamentals', 'Beginners'],
    tableOfContents: [
      { id: 'rm-fnd', title: '1. Phase 1: Foundational Pillars' },
      { id: 'rm-labs', title: '2. Phase 2: Building Practical Lab Skills' },
      { id: 'rm-certs', title: '3. Phase 3: Certifications That Actually Matter' },
      { id: 'rm-portfolio', title: '4. Phase 4: Proving Your Worth with Proof of Work' }
    ],
    contentSections: [
      {
        id: 'rm-fnd',
        heading: '1. Phase 1: Foundational Pillars',
        paragraphs: [
          'Before touching Kali Linux or Metasploit, you must understand the systems you intend to secure. Master TCP/IP routing, DNS resolution, HTTP request headers, and basic bash and Python scripting.'
        ]
      },
      {
        id: 'rm-labs',
        heading: '2. Phase 2: Building Practical Lab Skills',
        paragraphs: [
          'Theoretical reading without hands-on testing creates paper certifications. Practice relentlessly on hands-on platforms, configure home labs with virtual machines, and dissect live packet captures.'
        ]
      },
      {
        id: 'rm-certs',
        heading: '3. Phase 3: Certifications That Actually Matter',
        paragraphs: [
          'Prioritize practical hands-on exams (e.g. eJPT, OSCP, Wazuh Specialist, Security+) over purely multiple-choice knowledge tests.'
        ]
      },
      {
        id: 'rm-portfolio',
        heading: '4. Phase 4: Proving Your Worth with Proof of Work',
        paragraphs: [
          'Document every lab you complete. Publish technical writeups, contribute to open source security tools, and build a demonstrable track record.'
        ]
      }
    ]
  },
  {
    id: 'art-malware-ghidra-triage',
    slug: 'static-pe-triage-ghidra-decompilation-field-guide',
    title: 'Static PE Header Triage & Ghidra Decompilation Field Guide',
    category: 'Malware Analysis',
    difficulty: 'Advanced',
    readingTime: '13 min read',
    date: 'March 2026',
    featured: true,
    summary: 'A practitioner walkthrough of inspecting PE sections, calculating Shannon entropy to spot crypters, reversing obfuscated strings, and decompiling native C2 stagers with Ghidra.',
    author: {
      name: 'Muhammad Zaib Zafar',
      title: 'Security Researcher & Penetration Tester'
    },
    tags: ['Malware Analysis', 'Ghidra', 'Reverse Engineering', 'PE Headers', 'YARA'],
    tableOfContents: [
      { id: 'mal-pe', title: '1. PE Header Inspection & Entropy Calculation' },
      { id: 'mal-ghidra', title: '2. Decompiling Stripped Binaries in Ghidra' },
      { id: 'mal-yara', title: '3. Crafting Resilient YARA Signatures' }
    ],
    contentSections: [
      {
        id: 'mal-pe',
        heading: '1. PE Header Inspection & Entropy Calculation',
        paragraphs: [
          'When analyzing untrusted Windows executables, dynamic execution should never be the first step. Static analysis begins with inspecting the Portable Executable (PE) header format using PEStudio or pestr.',
          'Calculate the Shannon entropy of each section (.text, .rdata, .data, .rsrc). Normal compiled code sections exhibit an entropy between 5.8 and 6.8. When entropy exceeds 7.2, the section is virtually guaranteed to be packed, compressed, or encrypted with a custom stub.'
        ],
        codeSnippet: {
          language: 'bash',
          title: 'Section Entropy Inspection with Python pefile',
          code: `import pefile
pe = pefile.PE("sample.exe")
for section in pe.sections:
    print(f"{section.Name.decode().strip()}: Entropy = {section.get_entropy():.2f}")
# .text: Entropy = 6.42 (Normal)
# .rsrc: Entropy = 7.89 (SUSPICIOUS: Packed payload detected)`
        }
      },
      {
        id: 'mal-ghidra',
        heading: '2. Decompiling Stripped Binaries in Ghidra',
        paragraphs: [
          'Modern threat actors strip symbol tables to hinder reverse engineering. In Ghidra, locate the Windows subsystem entry point (mainCRTStartup) and trace arguments down to the true user main() function.',
          'Identify API imports resolved dynamically via LoadLibraryA and GetProcAddress to defeat simple import address table (IAT) scanners.'
        ],
        keyTakeaway: 'Always cross-reference (XREF) string decryptor loops in Ghidra to uncover hidden C2 URLs and command beacons.'
      },
      {
        id: 'mal-yara',
        heading: '3. Crafting Resilient YARA Signatures',
        paragraphs: [
          'Write YARA rules that target invariant code structures and unique assembly sequences rather than volatile file hashes or mutable C2 domain strings.'
        ],
        codeSnippet: {
          language: 'yaml',
          title: 'High-Fidelity YARA Detection Rule',
          code: `rule Suspicious_Process_Hollowing_Stager {
    meta:
        author = "Muhammad Zaib Zafar"
        description = "Detects unmapped PE section injection routines"
    strings:
        $api1 = "VirtualAllocEx" ascii
        $api2 = "WriteProcessMemory" ascii
        $api3 = "CreateRemoteThread" ascii
        $xor_key = { 8A 04 0E 34 5A 88 04 0E }
    condition:
        uint16(0) == 0x5A4D and all of ($api*) and $xor_key
}`
        }
      }
    ]
  },
  {
    id: 'art-cryptography-tls-pqc',
    slug: 'applied-modern-cryptography-tls-pqc-field-guide',
    title: 'Applied Modern Cryptography: TLS 1.3, Elliptic Curves & Post-Quantum Transition',
    category: 'Cryptography',
    difficulty: 'Intermediate',
    readingTime: '11 min read',
    date: 'February 2026',
    featured: true,
    summary: 'Understanding modern cryptographic primitives: authenticated AES-GCM, ECDHE key exchange security, why RSA 2048 is being phased out, and preparing enterprise infrastructure for NIST post-quantum standards.',
    author: {
      name: 'Muhammad Zaib Zafar',
      title: 'Security Researcher & Penetration Tester'
    },
    tags: ['Cryptography', 'TLS 1.3', 'AES-GCM', 'PKI', 'Post-Quantum'],
    tableOfContents: [
      { id: 'cry-aead', title: '1. Why AEAD (AES-GCM) is Mandatory' },
      { id: 'cry-tls13', title: '2. TLS 1.3 Architecture & Zero-RTT Risks' },
      { id: 'cry-pqc', title: '3. Transitioning to Post-Quantum Cryptography (ML-KEM)' }
    ],
    contentSections: [
      {
        id: 'cry-aead',
        heading: '1. Why AEAD (AES-GCM) is Mandatory',
        paragraphs: [
          'Historically, encryption algorithms focused purely on confidentiality, leaving message integrity to separate hashes. This separation led to catastrophic vulnerabilities like CBC padding oracle attacks (POODLE, Lucky Thirteen).',
          'Modern protocols mandate Authenticated Encryption with Associated Data (AEAD), such as AES-GCM or ChaCha20-Poly1305. These algorithms produce a cryptographic authentication tag over both the ciphertext and unencrypted header metadata, guaranteeing that any bit tampering results in immediate handshake termination.'
        ]
      },
      {
        id: 'cry-tls13',
        heading: '2. TLS 1.3 Architecture & Zero-RTT Risks',
        paragraphs: [
          'TLS 1.3 deprecated static RSA key exchange, CBC ciphers, and SHA-1 signatures. All key exchanges now enforce Ephemeral Diffie-Hellman (ECDHE or DHE), providing Perfect Forward Secrecy: even if a server private key is compromised years later, previously recorded traffic cannot be decrypted.',
          'However, the 0-RTT (early data) resumption feature carries replay attack hazards. Engineers must restrict 0-RTT strictly to idempotent GET requests to avoid financial transaction replay vulnerabilities.'
        ],
        keyTakeaway: 'Never enable TLS 1.3 0-RTT early data for state-modifying API endpoints (POST/PUT/DELETE) without server-side anti-replay cache validation.'
      },
      {
        id: 'cry-pqc',
        heading: '3. Transitioning to Post-Quantum Cryptography (ML-KEM)',
        paragraphs: [
          'Shor algorithm will break classical discrete logarithm and integer factorization schemes (RSA, ECC, Diffie-Hellman) once cryptographically relevant quantum computers emerge. Organizations must adopt hybrid key encapsulation mechanisms (e.g. X25519 combined with Kyber / ML-KEM) to defend against "Harvest Now, Decrypt Later" espionage.'
        ]
      }
    ]
  },
  {
    id: 'art-network-wireshark-threat-hunting',
    slug: 'deep-packet-threat-hunting-wireshark-c2-beacons',
    title: 'Deep Packet Threat Hunting: Dissecting C2 Beacons & DNS Tunneling in Wireshark',
    category: 'Network Security',
    difficulty: 'Intermediate',
    readingTime: '10 min read',
    date: 'February 2026',
    featured: false,
    summary: 'Field analysis of packet capture streams: isolating Cobalt Strike sleeping beacons, identifying DNS data exfiltration through subdomain entropy, and writing surgical Wireshark display filters.',
    author: {
      name: 'Muhammad Zaib Zafar',
      title: 'Security Researcher & Penetration Tester'
    },
    tags: ['Network Security', 'Wireshark', 'Packet Analysis', 'DNS Tunneling', 'Threat Hunting'],
    tableOfContents: [
      { id: 'net-filter', title: '1. Surgical Display Filters for Threat Hunters' },
      { id: 'net-dns', title: '2. Identifying DNS Tunneling & Exfiltration' },
      { id: 'net-beacon', title: '3. Timing Delta Analysis for C2 Beacons' }
    ],
    contentSections: [
      {
        id: 'net-filter',
        heading: '1. Surgical Display Filters for Threat Hunters',
        paragraphs: [
          'Analyzing multi-gigabyte PCAP files requires precise filter syntax. Rather than scrolling through millions of noise frames, filter for abnormal protocol behaviors and handshake anomalies.',
          'Common starting filters include unencrypted credential transmissions, abnormal TCP RST floods, and non-standard high-port HTTP traffic.'
        ],
        codeSnippet: {
          language: 'wireshark',
          title: 'Threat Hunter Wireshark Filter Cheat Sheet',
          code: `# Find high port cleartext HTTP traffic
http and tcp.port > 1024 and not tcp.port in {80, 8080, 8443}

# Detect suspect file downloads via HTTP
http.response.code == 200 and (http.content_type contains "application/octet-stream" or http.content_type contains "x-dosexec")

# High-frequency DNS queries indicating tunneling
dns.flags.response == 0 and dns.qry.name.len > 40`
        }
      },
      {
        id: 'net-dns',
        heading: '2. Identifying DNS Tunneling & Exfiltration',
        paragraphs: [
          'Adversaries utilize DNS queries to bypass strict egress firewalls because port 53 is almost universally permitted to corporate resolvers. Tools like dnscat2 or iodine encode stolen files into lengthy, high-entropy subdomain labels (e.g., base32-encoded chunks prepended to an attacker-controlled authoritative name server).',
          'Calculate the ratio of TXT queries to standard A/AAAA records and inspect response payload sizes to pinpoint rogue tunneling tunnels.'
        ]
      },
      {
        id: 'net-beacon',
        heading: '3. Timing Delta Analysis for C2 Beacons',
        paragraphs: [
          'Command-and-Control malware checks in at periodic intervals. While attackers introduce jitter (e.g. 20% random sleep variance) to evade naive delta checks, statistical delta clustering in Wireshark Conversation statistics immediately reveals the persistent heartbeat.'
        ],
        keyTakeaway: 'Export packet time deltas to CSV and compute the standard deviation of inter-arrival times to expose beaconing implants reliably.'
      }
    ]
  },
  {
    id: 'art-cloud-aws-iam-privesc',
    slug: 'aws-iam-privilege-escalation-cloudtrail-forensics',
    title: 'AWS IAM Privilege Escalation Vectors & CloudTrail Incident Forensics',
    category: 'Cloud Security',
    difficulty: 'Advanced',
    readingTime: '12 min read',
    date: 'January 2026',
    featured: false,
    summary: 'Auditing 21 high-risk AWS IAM privilege escalation paths, dissecting PassRole abuse, and querying CloudTrail lake logs using Athena to trace lateral movement.',
    author: {
      name: 'Muhammad Zaib Zafar',
      title: 'Security Researcher & Penetration Tester'
    },
    tags: ['Cloud Security', 'AWS', 'IAM', 'CloudTrail', 'Athena', 'DevSecOps'],
    tableOfContents: [
      { id: 'cloud-iam', title: '1. The Anatomy of AWS IAM Privilege Escalation' },
      { id: 'cloud-passrole', title: '2. The iam:PassRole & ec2:RunInstances Attack Chain' },
      { id: 'cloud-athena', title: '3. Investigating Intrusions with CloudTrail & Athena' }
    ],
    contentSections: [
      {
        id: 'cloud-iam',
        heading: '1. The Anatomy of AWS IAM Privilege Escalation',
        paragraphs: [
          'Cloud penetration tests frequently reveal users assigned seemingly benign permissions that secretly enable full AdministratorAccess escalation. Permissions such as iam:CreatePolicyVersion, iam:AttachUserPolicy, or iam:SetDefaultPolicyVersion allow an attacker to rewrite their own effective policy.'
        ]
      },
      {
        id: 'cloud-passrole',
        heading: '2. The iam:PassRole & ec2:RunInstances Attack Chain',
        paragraphs: [
          'A classic cloud escalation vector pairs iam:PassRole with ec2:RunInstances or lambda:CreateFunction. If a developer has permission to pass a highly privileged role (e.g., an EC2 instance profile with S3 full access or DynamoDB write rights) to an EC2 instance, they can launch a micro instance with a reverse shell user-data script and steal the attached role temporary STS credentials.'
        ],
        codeSnippet: {
          language: 'json',
          title: 'Dangerous Over-Permissioned IAM Policy Snippet',
          code: `{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "iam:PassRole",
        "ec2:RunInstances"
      ],
      "Resource": "*"
    }
  ]
}`
        },
        keyTakeaway: 'Never grant iam:PassRole with wildcard (*) Resource blocks. Scope PassRole strictly to specific, non-administrative role ARNs.'
      },
      {
        id: 'cloud-athena',
        heading: '3. Investigating Intrusions with CloudTrail & Athena',
        paragraphs: [
          'When an IAM breach occurs, CloudTrail logs every API invocation. Use Amazon Athena to query S3 log buckets for eventName in (GetSessionToken, AssumeRole, AttachUserPolicy) grouped by sourceIPAddress and userAgent to map adversary activity.'
        ]
      }
    ]
  },
  {
    id: 'art-ethical-hacking-ad-kerberoasting',
    slug: 'active-directory-kerberoasting-bloodhound-privilege-graphs',
    title: 'Active Directory Pentesting: Kerberoasting, AS-REP Roasting & BloodHound',
    category: 'Ethical Hacking',
    difficulty: 'Advanced',
    readingTime: '14 min read',
    date: 'January 2026',
    featured: true,
    summary: 'A comprehensive methodology for attacking enterprise Active Directory environments: requesting Service Principal Name (SPN) tickets, cracking TGS hashes offline with Hashcat, and visualizing shortest attack paths with BloodHound.',
    author: {
      name: 'Muhammad Zaib Zafar',
      title: 'Security Researcher & Penetration Tester'
    },
    tags: ['Active Directory', 'Ethical Hacking', 'Kerberoasting', 'BloodHound', 'Red Team'],
    tableOfContents: [
      { id: 'ad-kerberos', title: '1. Kerberos Ticket Granting Service (TGS) Mechanics' },
      { id: 'ad-kerberoast', title: '2. Executing Kerberoasting with Impacket & Rubeus' },
      { id: 'ad-bloodhound', title: '3. Mapping Shortest Domain Admin Paths in BloodHound' }
    ],
    contentSections: [
      {
        id: 'ad-kerberos',
        heading: '1. Kerberos Ticket Granting Service (TGS) Mechanics',
        paragraphs: [
          'In Active Directory, when a valid domain user requests access to a service (e.g. MSSQL, IIS), they request a Ticket Granting Service (TGS) ticket from the Key Distribution Center (KDC).',
          'The KDC encrypts this ticket using the NTLM hash of the service account registered to the Service Principal Name (SPN). Because any authenticated domain user can request a TGS for any valid SPN, attackers can request tickets and crack them offline without generating network noise on the target server.'
        ]
      },
      {
        id: 'ad-kerberoast',
        heading: '2. Executing Kerberoasting with Impacket & Rubeus',
        paragraphs: [
          'Using Impacket GetUserSPNs.py from Linux or Rubeus on Windows, enumerate all accounts with registered SPNs and request Kerberos tickets formatted for Hashcat mode 13100.'
        ],
        codeSnippet: {
          language: 'bash',
          title: 'Extracting and Cracking Kerberoasting Hashes',
          code: `# 1. Request SPN tickets from domain controller
GetUserSPNs.py corp.local/johndoe:Password123 -dc-ip 10.10.10.5 -request -outputfile kerberoast_hashes.txt

# 2. Crack RC4-HMAC TGS ticket offline with Hashcat (mode 13100)
hashcat -m 13100 -a 0 kerberoast_hashes.txt /usr/share/wordlists/rockyou.txt --force`
        },
        keyTakeaway: 'Defend against Kerberoasting by enforcing Group Managed Service Accounts (gMSA) with 128-character complex passwords and rotating Kerberos krbtgt account keys.'
      },
      {
        id: 'ad-bloodhound',
        heading: '3. Mapping Shortest Domain Admin Paths in BloodHound',
        paragraphs: [
          'Ingest Active Directory domain data using SharpHound and query BloodHound for shortest paths to Domain Admins or High Value Targets. Common lethal paths include GenericAll on security groups, WriteDacl over user objects, and unconstrained Kerberos delegation.'
        ]
      }
    ]
  }
];
