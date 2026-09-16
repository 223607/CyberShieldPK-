import { SecurityService } from '../types';

export const SECURITY_SERVICES: SecurityService[] = [
  {
    id: 'srv-web-vapt',
    title: 'Web Application Security Assessment (VAPT)',
    tagline: 'Comprehensive vulnerability assessment and manual penetration testing for modern web apps & APIs.',
    description: 'Rigorous manual and automated testing aligned with the OWASP Top 10 and ASVS standards. We identify security vulnerabilities such as injection flaws, broken access control, business logic oversights, and authentication flaws before malicious actors do.',
    deliverables: [
      'Detailed Technical Vulnerability Report with CVSS 3.1 severity scores',
      'Executive Summary for C-level leadership & non-technical stakeholders',
      'Step-by-step Proof of Concept (PoC) reproduction scripts & payloads',
      'Actionable remediation code snippets & developer mitigation guidance',
      'Complimentary re-testing of remediated findings within 30 days'
    ],
    methodology: [
      'Scoping & Rules of Engagement definition',
      'Reconnaissance & attack surface mapping',
      'Automated vulnerability scanning & manual verification',
      'Deep manual business logic & authentication testing',
      'Risk quantification & structured reporting'
    ],
    estimatedTurnaround: '5 – 10 Business Days',
    suitableFor: 'SaaS platforms, eCommerce businesses, Fintech platforms, and customer-facing web applications.'
  },
  {
    id: 'srv-wordpress-audit',
    title: 'WordPress Security Review & Hardening',
    tagline: 'In-depth audit of WordPress core, installed plugins, themes, database configurations, and server permissions.',
    description: 'WordPress powers over 40% of the web and is a frequent target for automated bots, brute-force attacks, and malicious plugin backdoors. We conduct rigorous code reviews, plugin CVE checks, and implement bulletproof hardening.',
    deliverables: [
      'Full plugin & theme CVE vulnerability audit',
      'Database prefix & wp-config.php permission hardening',
      'Brute-force protection & two-factor authentication (2FA) deployment',
      'Malware & webshell scanning report',
      'Web Application Firewall (WAF) rule recommendation'
    ],
    methodology: [
      'Static analysis of active themes & custom functions.php',
      'Dynamic testing of REST API and XML-RPC endpoints',
      'File integrity baseline verification',
      'Hardening implementation & administrative access restriction'
    ],
    estimatedTurnaround: '3 – 5 Business Days',
    suitableFor: 'Corporate WordPress sites, media publications, WooCommerce stores, and agency clients.'
  },
  {
    id: 'srv-config-review',
    title: 'Security Configuration Review & CIS Auditing',
    tagline: 'Ensure servers, firewalls, and cloud infrastructure align with Center for Internet Security (CIS) benchmarks.',
    description: 'Misconfigurations represent over 80% of security breaches. We audit Linux, Windows Server, and cloud settings against internationally accepted CIS benchmarks and industry best practices.',
    deliverables: [
      'CIS Benchmark Compliance Scorecard & gap analysis',
      'SSH, RDP, and remote administration hardening checklist',
      'Firewall rule table audit & port exposure report',
      'Automated hardening scripts tailored to your OS distribution'
    ],
    methodology: [
      'Configuration file extraction & automated auditing',
      'Privilege & service permission inspection',
      'Unnecessary service disabling & attack surface reduction'
    ],
    estimatedTurnaround: '4 – 7 Business Days',
    suitableFor: 'Enterprise infrastructure teams, DevOps pipelines, and cloud-hosted servers.'
  },
  {
    id: 'srv-soc-setup',
    title: 'SOC Setup Guidance & Wazuh SIEM Deployment',
    tagline: 'End-to-end guidance for standing up an in-house Security Operations Center using open source Wazuh SIEM.',
    description: 'Transform passive log storage into an active threat monitoring capability. We assist organizations in architecting, installing, tuning, and operating Wazuh SIEM clusters with custom detection rules and alert pipelines.',
    deliverables: [
      'Wazuh Manager, Indexer & Dashboard deployment architecture',
      'Endpoint agent roll-out strategy (Windows & Linux)',
      'Custom alert rules tailored to organizational risks',
      'Slack/Email automated incident dispatch integration',
      'SOC Tier-1 analyst playbook & triage procedures'
    ],
    methodology: [
      'Infrastructure capacity planning & network design',
      'Server installation & SSL certificate clustering',
      'Rule tuning to minimize false-positive alert fatigue',
      'Analyst training and handover simulation'
    ],
    estimatedTurnaround: '2 – 3 Weeks',
    suitableFor: 'Mid-sized enterprises, tech startups, and MSPs building internal defensive monitoring.'
  },
  {
    id: 'srv-digital-forensics',
    title: 'Digital Forensics & Incident Response Support',
    tagline: 'Rapid analysis of security compromises, volatile memory extraction, and root-cause reconstruction.',
    description: 'When suspected security breaches occur, preserving forensic integrity is critical. We assist in volatile RAM acquisition, disk artifact carving, and event log correlation to determine breach timelines.',
    deliverables: [
      'Cryptographically verified forensic image preservation',
      'Adversary intrusion timeline & initial compromise vector identification',
      'Extracted Indicators of Compromise (IoCs) list',
      'Containment & eradication strategic guidance'
    ],
    methodology: [
      'Order of volatility evidence collection (RFC 3227)',
      'Memory & disk artifact carving (Volatility, Autopsy)',
      'Timeline correlation & root-cause reporting'
    ],
    estimatedTurnaround: 'Incident Specific / Rapid Response',
    suitableFor: 'Organizations experiencing active unauthorized access, ransomware, or internal data leaks.'
  },
  {
    id: 'srv-security-awareness',
    title: 'Cybersecurity Awareness Training & Consultation',
    tagline: 'Empower developers, system administrators, and staff with practical defensive cyber hygiene.',
    description: 'Human error remains the top entry point for cyber adversaries. We deliver engaging, technical and non-technical workshops covering phishing recognition, password hygiene, credential stuffing, and secure coding practices.',
    deliverables: [
      'Customized slide decks, cheat sheets, and recording access',
      'Simulated phishing campaign assessment & baseline metrics',
      'Interactive Q&A and practical defense exercises',
      'Post-training evaluation & employee risk score report'
    ],
    methodology: [
      'Pre-training threat profile assessment',
      'Tailored workshop delivery (remote or onsite)',
      'Phishing simulation & metric analysis'
    ],
    estimatedTurnaround: '1 – 3 Days per workshop',
    suitableFor: 'Corporate teams, educational institutions, development teams, and executive leadership.'
  }
];
