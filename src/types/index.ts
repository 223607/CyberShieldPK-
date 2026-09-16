export type DomainCategory = 
  | 'Ethical Hacking'
  | 'Web Application Security'
  | 'Network Security'
  | 'SOC & Blue Team'
  | 'Digital Forensics'
  | 'Malware Analysis'
  | 'Cloud Security'
  | 'Cryptography'
  | 'OSINT & Threat Intelligence';

export interface DomainInfo {
  id: string;
  title: DomainCategory;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
  skillsCovered: string[];
  visualType: string;
  accentColor: string;
  icon: string;
  coreTools: string[];
  keyConcepts: string[];
}

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  isFree: boolean;
  summary: string;
  videoUrl?: string;
  videoType?: 'youtube' | 'vimeo' | 'direct' | 'notes';
  lectureNotes?: string;
  resources?: { name: string; url: string; size?: string }[];
}

export interface CourseChapter {
  id: string;
  chapterNumber: number;
  title: string;
  description: string;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  slug: string;
  title: string;
  category: DomainCategory;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  modulesCount: number;
  lessonsCount: number;
  description: string;
  detailedOverview: string;
  instructor: {
    name: string;
    role: string;
    bio: string;
    certifications: string[];
  };
  skills: string[];
  prerequisites: string[];
  labsIncluded: string[];
  isPremium: boolean;
  pricePKR: number;
  priceUSD: number;
  badge?: string;
  chapters: CourseChapter[];
}

export interface Lab {
  id: string;
  title: string;
  category: string;
  objective: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  estimatedTime: string;
  skills: string[];
  environment: string;
  status: 'AVAILABLE' | 'COMING SOON' | 'LOCKED';
  scenario: string;
  tasks: { id: string; instruction: string; hint?: string }[];
  terminalPrompt?: string;
  sampleLogOrOutput?: string;
}

export interface SecurityTool {
  id: string;
  name: string;
  category: string;
  purpose: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  platform: string;
  learningResource: string;
  officialWebsite: string;
  quickCheatSyntax: string;
  keyFlagExplanations: { flag: string; desc: string }[];
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  category: DomainCategory | 'Cybersecurity Fundamentals';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  readingTime: string;
  date: string;
  featured: boolean;
  summary: string;
  tableOfContents: { id: string; title: string }[];
  contentSections: {
    id: string;
    heading: string;
    paragraphs: string[];
    codeSnippet?: { language: string; code: string; title?: string };
    keyTakeaway?: string;
  }[];
  tags: string[];
  author: {
    name: string;
    title: string;
  };
  relatedArticleSlugs?: string[];
}

export interface Project {
  id: string;
  title: string;
  description: string;
  category?: string;
  tagline?: string;
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
  techStack?: string[];
  technologies: string[];
  skills: string[];
  objective: string;
  status: 'COMPLETED' | 'IN_PRODUCTION' | 'ACTIVE_RESEARCH';
  evidenceLink?: string;
  githubUrl?: string;
  architectureDetails?: string;
  architecture?: string;
  keyFindings?: string[];
  deliverables?: string[];
  toolsUsed: string[];
  codeSnippet?: string;
}

export interface SecurityService {
  id: string;
  title: string;
  tagline: string;
  description: string;
  deliverables: string[];
  methodology: string[];
  estimatedTurnaround: string;
  suitableFor: string;
}

export interface ResourceItem {
  id: string;
  title: string;
  category: 'Cheat Sheets' | 'Learning Roadmaps' | 'Security Checklists' | 'Cybersecurity Books' | 'Useful Websites' | 'Practice Platforms';
  type: string;
  description: string;
  externalLink?: string;
  internalDataPreview?: string;
  format: string;
  badge?: string;
}

export interface SocAlert {
  id: string;
  timestamp: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  ruleName: string;
  sourceIp: string;
  destinationIp: string;
  endpoint: string;
  mitreTechnique: string;
  status: 'INVESTIGATING' | 'CONTAINED' | 'ESCALATED' | 'RESOLVED' | 'NEW';
  logPayload: string;
}

export interface SocEndpoint {
  id: string;
  hostname: string;
  ip: string;
  os: string;
  wazuhStatus: 'Active' | 'Disconnected' | 'Pending';
  lastKeepAlive: string;
  agentId: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  membershipTier: 'Free' | 'Student' | 'Pro' | 'Career';
  enrolledCourses: string[]; // course ids
  completedLessons: string[]; // lesson ids
  completedLabs: string[]; // lab ids
  bookmarkedArticles: string[]; // article ids
  notes: { [lessonId: string]: string };
  certificates: {
    id: string;
    certificateNumber: string;
    courseId: string;
    courseTitle: string;
    issuedTo: string;
    issueDate: string;
    verificationHash: string;
  }[];
}
