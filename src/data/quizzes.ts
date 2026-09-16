export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface CourseQuiz {
  courseId: string;
  title: string;
  passingScorePercent: number;
  questions: QuizQuestion[];
}

export const COURSE_QUIZZES: Record<string, CourseQuiz> = {
  'course-web-vapt': {
    courseId: 'course-web-vapt',
    title: 'Web Application Security & Pentesting Certification Exam',
    passingScorePercent: 80,
    questions: [
      {
        id: 'q1',
        question: 'Which of the following is the most robust mitigation against SQL Injection vulnerabilities?',
        options: [
          'Client-side JavaScript input validation',
          'Parameterized Queries / Prepared Statements',
          'Blacklisting SQL keywords like SELECT and UNION',
          'Base64 encoding all user inputs before querying'
        ],
        correctIndex: 1,
        explanation: 'Parameterized queries separate SQL code from user-supplied data, preventing attacker input from being interpreted as executable code.'
      },
      {
        id: 'q2',
        question: 'What is the primary difference between Stored XSS and Reflected XSS?',
        options: [
          'Stored XSS executes only in Google Chrome, whereas Reflected executes in any browser',
          'Stored XSS is permanently saved on the server database, affecting every user who views that data',
          'Reflected XSS requires administrative database credentials to trigger',
          'Stored XSS cannot steal authentication session cookies'
        ],
        correctIndex: 1,
        explanation: 'Stored XSS payload is permanently stored on the target server (e.g., database, forum post) and executes whenever victims request the affected resource.'
      },
      {
        id: 'q3',
        question: 'Which HTTP response header is specifically designed to stop DOM-based cross-site framing and clickjacking attacks?',
        options: [
          'X-Frame-Options or Content-Security-Policy frame-ancestors',
          'Access-Control-Allow-Origin',
          'Strict-Transport-Security (HSTS)',
          'X-Content-Type-Options: nosniff'
        ],
        correctIndex: 0,
        explanation: 'X-Frame-Options (DENY or SAMEORIGIN) and CSP frame-ancestors directive instruct the browser whether to allow rendering the page in an <iframe>.'
      },
      {
        id: 'q4',
        question: 'When analyzing a JWT (JSON Web Token), what does changing the header algorithm to "none" attempt to exploit?',
        options: [
          'SQL Injection in the JWT header',
          'Algorithm Confusion / Signature Bypass vulnerability',
          'Buffer Overflow in the web server kernel',
          'Cross-Site Request Forgery (CSRF)'
        ],
        correctIndex: 1,
        explanation: 'If a vulnerable JWT verification library accepts the "none" algorithm, it may treat unsigned tokens crafted by attackers as valid without checking signatures.'
      },
      {
        id: 'q5',
        question: 'What is the most effective defense against Cross-Site Request Forgery (CSRF)?',
        options: [
          'Using HTTP POST instead of GET for sensitive state-changing requests',
          'Unique, unpredictable Anti-CSRF Synchronizer Tokens & SameSite Cookie attributes',
          'Hashing passwords with MD5 before transmission',
          'Limiting user sessions to 10 minutes'
        ],
        correctIndex: 1,
        explanation: 'Cryptographically strong, per-request or per-session anti-CSRF tokens combined with SameSite=Lax/Strict cookie flags prevent cross-origin request forgery.'
      }
    ]
  },
  'course-soc-analyst': {
    courseId: 'course-soc-analyst',
    title: 'SOC & Blue Team Defense Certification Exam',
    passingScorePercent: 80,
    questions: [
      {
        id: 'soc-q1',
        question: 'What is the primary role of a SIEM (Security Information and Event Management) system in a SOC?',
        options: [
          'Replacing network firewalls with artificial intelligence',
          'Aggregating, normalizing, and correlating log events across enterprise assets for threat detection',
          'Encrypting employee workstations against unauthorized physical access',
          'Automatically deleting all phishing emails from mail servers'
        ],
        correctIndex: 1,
        explanation: 'A SIEM collects telemetry from multiple sources (endpoints, servers, firewalls), normalizes the data, and uses correlation rules to alert on suspicious patterns.'
      },
      {
        id: 'soc-q2',
        question: 'In the MITRE ATT&CK Framework, which tactic refers to an adversary attempting to move across systems in an internal network?',
        options: [
          'Initial Access (TA0001)',
          'Lateral Movement (TA0008)',
          'Exfiltration (TA0010)',
          'Defense Evasion (TA0005)'
        ],
        correctIndex: 1,
        explanation: 'Lateral Movement encompasses techniques adversaries use to extend access to other remote systems on a network (e.g., Pass-the-Hash, PsExec, RDP hijacking).'
      },
      {
        id: 'soc-q3',
        question: 'What is the first critical phase in the NIST SP 800-61 Incident Handling lifecycle?',
        options: [
          'Eradication & Recovery',
          'Preparation',
          'Post-Incident Activity / Lessons Learned',
          'Containment'
        ],
        correctIndex: 1,
        explanation: 'Preparation establishes incident response policies, builds detection capabilities, trains personnel, and secures tools before an incident occurs.'
      },
      {
        id: 'soc-q4',
        question: 'Which Windows Event ID indicates a successful account logon, critical for threat hunting?',
        options: [
          'Event ID 4624',
          'Event ID 1102',
          'Event ID 7045',
          'Event ID 4720'
        ],
        correctIndex: 0,
        explanation: 'Event ID 4624 is logged when an account successfully logs onto a Windows computer, providing logon type, user identity, and source IP address.'
      },
      {
        id: 'soc-q5',
        question: 'What does a high False Positive rate in a SOC most commonly cause for Tier 1 analysts?',
        options: [
          'Physical power outages',
          'Alert Fatigue, leading to missed real security incidents',
          'Hardware CPU degradation',
          'DNS cache poisoning'
        ],
        correctIndex: 1,
        explanation: 'Excessive false positive alerts overwhelm analysts with noise, creating Alert Fatigue that increases the likelihood of critical genuine attacks being overlooked.'
      }
    ]
  },
  'default': {
    courseId: 'default',
    title: 'CyberShieldPK Academic Competency Assessment',
    passingScorePercent: 80,
    questions: [
      {
        id: 'gen-q1',
        question: 'What constitutes the foundational CIA Triad in information security?',
        options: [
          'Central Intelligence Agency',
          'Confidentiality, Integrity, and Availability',
          'Cryptography, Inspection, and Authorization',
          'Compliance, Infrastructure, and Auditing'
        ],
        correctIndex: 1,
        explanation: 'Confidentiality, Integrity, and Availability represent the core security principles guiding protection of information and systems.'
      },
      {
        id: 'gen-q2',
        question: 'Which of the following describes Principle of Least Privilege (PoLP)?',
        options: [
          'Granting all employees full administrator rights to accelerate workflow',
          'Providing users only the minimum access rights necessary to perform their legitimate job duties',
          'Enforcing password changes every 24 hours',
          'Disabling all outbound internet connections for developers'
        ],
        correctIndex: 1,
        explanation: 'The Principle of Least Privilege minimizes risk by restricting user and process privileges to the absolute minimum necessary.'
      },
      {
        id: 'gen-q3',
        question: 'What type of social engineering attack targets high-profile executives specifically?',
        options: [
          'Whaling',
          'Typosquatting',
          'Shoulder Surfing',
          'Smishing'
        ],
        correctIndex: 0,
        explanation: 'Whaling is a targeted phishing attack directed at C-suite executives, senior management, or high-value individuals with access to sensitive assets.'
      },
      {
        id: 'gen-q4',
        question: 'Which port is standard for encrypted HTTPS web communications?',
        options: [
          'Port 21',
          'Port 80',
          'Port 443',
          'Port 3389'
        ],
        correctIndex: 2,
        explanation: 'Port 443 is the default network port for TLS/SSL encrypted HTTPS traffic.'
      },
      {
        id: 'gen-q5',
        question: 'What is the primary benefit of deploying Multi-Factor Authentication (MFA)?',
        options: [
          'Decreases server CPU usage',
          'Prevents account takeover even if passwords are leaked or compromised',
          'Encrypts hard drives automatically',
          'Replaces the need for firewall filtering'
        ],
        correctIndex: 1,
        explanation: 'MFA requires two or more verification factors (knowledge, possession, inherence), preventing unauthorized access even when password credentials are stolen.'
      }
    ]
  }
};

export function getQuizForCourse(courseId: string): CourseQuiz {
  return COURSE_QUIZZES[courseId] || {
    ...COURSE_QUIZZES['default'],
    courseId,
    title: `${courseId.replace('course-', '').replace(/-/g, ' ').toUpperCase()} Certification Assessment`
  };
}
