/**
 * CyberShieldPK - Professional Cybersecurity Learning & Services Platform
 * Brand: CyberShieldPK (Learn • Build • Defend)
 * Founder: Muhammad Zaib Zafar
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { DomainsSection } from './components/DomainsSection';
import { AcademySection } from './components/AcademySection';
import { CoursePlayerModal } from './components/CoursePlayerModal';
import { LabsSection } from './components/LabsSection';
import { LabDetailModal } from './components/LabDetailModal';
import { ToolsSection } from './components/ToolsSection';
import { ArticlesSection } from './components/ArticlesSection';
import { ArticleReaderModal } from './components/ArticleReaderModal';
import { ProjectsSection } from './components/ProjectsSection';
import { ProjectDetailModal } from './components/ProjectDetailModal';
import { ServicesSection } from './components/ServicesSection';
import { ServiceQuoteModal } from './components/ServiceQuoteModal';
import { ResourcesSection } from './components/ResourcesSection';
import { ResourceViewerModal } from './components/ResourceViewerModal';
import { PortfolioSection } from './components/PortfolioSection';
import { FinalCtaSection } from './components/FinalCtaSection';
import { Footer } from './components/Footer';
import { DomainDetailModal } from './components/DomainDetailModal';
import { SocSimulatorModal } from './components/SocSimulatorModal';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { AuthModal } from './components/AuthModal';
import { UserDashboardModal } from './components/UserDashboardModal';
import { UpgradeModal } from './components/UpgradeModal';
import { CertificateModal } from './components/CertificateModal';
import { FallingStarsCelebration } from './components/FallingStarsCelebration';
import { DailyThreatFeedSection } from './components/DailyThreatFeedSection';
import { ComingSoonAndRoadmapsSection } from './components/ComingSoonAndRoadmapsSection';
import { InternshipSection } from './components/InternshipSection';
import { InternshipModal } from './components/InternshipModal';
import { SocSimulatorSection } from './components/SocSimulatorSection';

import { DOMAINS } from './data/domains';
import { Course, Lab, Article, Project, SecurityService, ResourceItem, DomainInfo } from './types';

export default function App() {
  // Navigation & Modals State
  const [activeCourse, setActiveCourse] = useState<Course | null>(null);
  const [pendingCourse, setPendingCourse] = useState<Course | null>(null);
  const [activeLab, setActiveLab] = useState<Lab | null>(null);
  const [activeArticle, setActiveArticle] = useState<Article | null>(null);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [activeService, setActiveService] = useState<SecurityService | null>(null);
  const [activeResource, setActiveResource] = useState<ResourceItem | null>(null);
  const [activeDomain, setActiveDomain] = useState<DomainInfo | null>(null);

  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [socModalOpen, setSocModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [dashboardModalOpen, setDashboardModalOpen] = useState(false);
  const [upgradeModalCourseId, setUpgradeModalCourseId] = useState<string | null>(null);
  const [internshipModalOpen, setInternshipModalOpen] = useState(false);
  const [selectedInternshipTrack, setSelectedInternshipTrack] = useState<string | undefined>(undefined);
  const [activeView, setActiveView] = useState<string>('all');
  
  // Certificate & Celebration States
  const [certificateCourse, setCertificateCourse] = useState<Course | null>(null);
  const [showFallingStars, setShowFallingStars] = useState<boolean>(false);

  // User & Learning State with local persistence and verified session check
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string; role?: string } | null>(() => {
    try {
      const isVerified = localStorage.getItem('cybershield_verified_session') === 'true';
      const saved = localStorage.getItem('cybershield_user');
      if (isVerified && saved) {
        return JSON.parse(saved);
      }
      return null;
    } catch {
      return null;
    }
  });

  const [enrolledCourseIds, setEnrolledCourseIds] = useState<string[]>(() => {
    try {
      const isVerified = localStorage.getItem('cybershield_verified_session') === 'true';
      if (!isVerified) return [];
      const saved = localStorage.getItem('cybershield_enrolled_courses');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>(() => {
    try {
      const isVerified = localStorage.getItem('cybershield_verified_session') === 'true';
      if (!isVerified) return [];
      const saved = localStorage.getItem('cybershield_completed_lessons');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [completedLabIds, setCompletedLabIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('cybershield_completed_labs');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [userNotes, setUserNotes] = useState<{ [lessonId: string]: string }>(() => {
    try {
      const saved = localStorage.getItem('cybershield_user_notes');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Global Keyboard Shortcut (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchModalOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setSearchModalOpen(false);
        setActiveCourse(null);
        setActiveLab(null);
        setActiveArticle(null);
        setActiveProject(null);
        setActiveService(null);
        setActiveResource(null);
        setActiveDomain(null);
        setSocModalOpen(false);
        setAuthModalOpen(false);
        setDashboardModalOpen(false);
        setUpgradeModalCourseId(null);
        setCertificateCourse(null);
        setShowFallingStars(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Direct page / view navigation handler: switches instantly to relevant page with zero scroll-up lag!
  const handleNavigate = (id: string) => {
    // 1. If clicking a domain ID (e.g. ethical-hacking, cloud-security, etc.), open directly!
    const matchingDomain = DOMAINS.find(d => d.id === id);
    if (matchingDomain) {
      setActiveDomain(matchingDomain);
      return;
    }

    // 2. Direct page switching
    if (id === 'hero' || id === 'home') {
      setActiveView('all');
    } else {
      setActiveView(id);
    }

    // 3. Instant top alignment without jumpy scroll animations
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  };

  const VIEW_METADATA: Record<string, { title: string; subtitle: string; tag: string }> = {
    'academy': {
      title: 'CyberShieldPK Academy',
      subtitle: 'Structured courses, practical modules, and verified industry-standard certificates.',
      tag: 'ACADEMY COURSES'
    },
    'threat-feed': {
      title: 'Live Threat Intelligence Desk & Breaking Cyber News',
      subtitle: 'Real-time CVE zero-day alerts, active exploitation telemetry, ransomware intelligence, and direct links to authoritative knowledge sources.',
      tag: 'THREAT INTELLIGENCE'
    },
    'soc-simulator': {
      title: 'Wazuh SIEM & Enterprise SOC Simulator',
      subtitle: 'Real-time defensive operations, active agent telemetry, Sysmon alerts, and MITRE ATT&CK mitigation.',
      tag: 'TIER-1 / TIER-2 SOC'
    },
    'internship': {
      title: 'CyberShieldPK Fellowship & Internship 2026',
      subtitle: 'Immersive remote mentorship, real-world incident simulations, and recommendation letter from founder Muhammad Zaib Zafar.',
      tag: 'CAREER OPPORTUNITY'
    },
    'labs': {
      title: 'Hands-on Cybersecurity Labs',
      subtitle: 'Interactive virtual environments for Web Exploitation, Cryptography, Reverse Engineering, and Network Defense.',
      tag: 'VIRTUAL LABS'
    },
    'tools': {
      title: 'Security Tools Directory',
      subtitle: 'Curated repository of elite defensive, offensive, digital forensics, and OSINT toolkits.',
      tag: 'TOOL DIRECTORY'
    },
    'articles': {
      title: 'Research Articles & Incident Writeups',
      subtitle: 'Deep technical analysis of vulnerabilities, exploitation methodologies, and blue team defense.',
      tag: 'RESEARCH & WRITEUPS'
    },
    'projects': {
      title: 'Production Security Projects',
      subtitle: 'Real-world blueprints, open-source security software, and enterprise architectures.',
      tag: 'PRODUCTION PROJECTS'
    },
    'services': {
      title: 'Professional Security Services',
      subtitle: 'Penetration testing, source code audits, compliance assessments, and adversary emulation consulting.',
      tag: 'SECURITY SERVICES'
    },
    'resources': {
      title: 'Security Resources & Cheat Sheets',
      subtitle: 'Comprehensive reference sheets, payload checklists, and study blueprints.',
      tag: 'RESOURCES'
    },
    'portfolio': {
      title: 'Founder Portfolio — Muhammad Zaib Zafar',
      subtitle: 'Lead Security Researcher, Penetration Tester, and Founder of CyberShieldPK.',
      tag: 'FOUNDER BIOGRAPHY'
    },
    'domains': {
      title: 'Cybersecurity Domains & Specializations',
      subtitle: 'Nine structured learning domains spanning offensive, defensive, and cloud security.',
      tag: 'DOMAIN TRACKS'
    }
  };

  // Learning progress updates
  const handleToggleLessonCompletion = (lessonId: string) => {
    setCompletedLessonIds(prev => {
      const next = prev.includes(lessonId) 
        ? prev.filter(id => id !== lessonId) 
        : [...prev, lessonId];
      localStorage.setItem('cybershield_completed_lessons', JSON.stringify(next));

      // Trigger falling stars celebration if this completed the entire course
      if (activeCourse) {
        const allCourseLessons = activeCourse.chapters.flatMap(c => c.lessons);
        const willBeComplete = allCourseLessons.length > 0 && allCourseLessons.every(l => next.includes(l.id));
        if (willBeComplete && !prev.includes(lessonId)) {
          setShowFallingStars(true);
        }
      }

      return next;
    });
  };

  const handleCompleteAllLessons = (lessonIds: string[]) => {
    setCompletedLessonIds(prev => {
      const combined = Array.from(new Set([...prev, ...lessonIds]));
      localStorage.setItem('cybershield_completed_lessons', JSON.stringify(combined));
      return combined;
    });
    setShowFallingStars(true);
  };

  const handleResetCourseProgress = (lessonIds: string[]) => {
    setCompletedLessonIds(prev => {
      const filtered = prev.filter(id => !lessonIds.includes(id));
      localStorage.setItem('cybershield_completed_lessons', JSON.stringify(filtered));
      return filtered;
    });
  };

  const handleOpenCertificate = (course: Course) => {
    setCertificateCourse(course);
    setShowFallingStars(true);
  };

  const handleTriggerFallingStars = () => {
    setShowFallingStars(false);
    setTimeout(() => {
      setShowFallingStars(true);
    }, 30);
  };

  const handleCompleteLab = (labId: string) => {
    setCompletedLabIds(prev => {
      const next = prev.includes(labId) ? prev : [...prev, labId];
      localStorage.setItem('cybershield_completed_labs', JSON.stringify(next));
      return next;
    });
  };

  const handleSaveNote = (lessonId: string, noteText: string) => {
    setUserNotes(prev => {
      const next = { ...prev, [lessonId]: noteText };
      localStorage.setItem('cybershield_user_notes', JSON.stringify(next));
      return next;
    });
  };

  const handleEnrollSuccess = (courseId: string) => {
    setEnrolledCourseIds(prev => {
      const next = prev.includes(courseId) ? prev : [...prev, courseId];
      localStorage.setItem('cybershield_enrolled_courses', JSON.stringify(next));
      if (currentUser?.email) {
        localStorage.setItem(`cybershield_enrolled_${currentUser.email}`, JSON.stringify(next));
      }
      return next;
    });
  };

  const handleStartCourse = (course: Course) => {
    setActiveCourse(course);
  };

  const handleLogout = () => {
    localStorage.removeItem('cybershield_user');
    localStorage.removeItem('cybershield_verified_session');
    localStorage.removeItem('cybershield_enrolled_courses');
    localStorage.removeItem('cybershield_completed_lessons');
    localStorage.removeItem('cybershield_completed_labs');
    setCurrentUser(null);
    setEnrolledCourseIds([]);
    setCompletedLessonIds([]);
    setCompletedLabIds([]);
    setDashboardModalOpen(false);
    setActiveCourse(null);
  };

  const isUserEnrolled = (courseId: string) => {
    if (!currentUser) return false;
    return enrolledCourseIds.includes(courseId);
  };

  const handleDomainSelect = (domainId: string) => {
    const found = DOMAINS.find(d => d.id === domainId);
    if (found) {
      setActiveDomain(found);
    }
  };

  return (
    <div className="min-h-screen bg-[#050b14] text-slate-100 font-sans selection:bg-cyan-500/30 selection:text-cyan-200 w-full max-w-full overflow-x-hidden">
      {/* 1. Global Navigation Bar */}
      <Navbar
        onOpenSearch={() => setSearchModalOpen(true)}
        onOpenAuth={() => setAuthModalOpen(true)}
        onOpenDashboard={() => setDashboardModalOpen(true)}
        onNavigateSection={handleNavigate}
        onSelectDomain={handleDomainSelect}
        onOpenSocSimulator={() => setSocModalOpen(true)}
        currentUser={currentUser}
        activeView={activeView}
      />

      {/* When a specific menu view is selected, directly show its focused page with breadcrumb header */}
      {activeView !== 'all' && (
        <div className="pt-24 pb-6 bg-[#070e1c] border-b border-cyan-500/20 px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
                <button 
                  type="button"
                  onClick={() => handleNavigate('all')}
                  className="hover:underline text-slate-400 hover:text-white cursor-pointer"
                >
                  Home
                </button>
                <span>/</span>
                <span className="text-cyan-300 font-bold">{VIEW_METADATA[activeView]?.tag || 'VIEW'}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                {VIEW_METADATA[activeView]?.title || 'CyberShieldPK'}
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
                {VIEW_METADATA[activeView]?.subtitle}
              </p>
            </div>

            <button
              type="button"
              onClick={() => handleNavigate('all')}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-slate-700 hover:border-cyan-500/50 text-xs font-mono transition-all flex items-center gap-2 cursor-pointer shadow-md"
            >
              <span>← View Full Platform Overview</span>
            </button>
          </div>
        </div>
      )}

      <main className="w-full max-w-full overflow-x-hidden">
        {/* CONDITIONAL RENDERING: EITHER DIRECT VIEW OR FULL PLATFORM */}

        {/* --- 1. DIRECT VIEW: ACADEMY --- */}
        {activeView === 'academy' && (
          <AcademySection
            onSelectCourse={(course) => handleStartCourse(course)}
            onUpgrade={(courseId) => setUpgradeModalCourseId(courseId || null)}
            isEnrolled={isUserEnrolled}
            completedLessonIds={currentUser ? completedLessonIds : []}
            onGetCertificate={handleOpenCertificate}
            currentUser={currentUser}
            onOpenAuth={() => setAuthModalOpen(true)}
          />
        )}

        {/* --- 2. DIRECT VIEW: THREAT DESK --- */}
        {activeView === 'threat-feed' && (
          <DailyThreatFeedSection />
        )}

        {/* --- 3. DIRECT VIEW: SOC SIMULATOR --- */}
        {activeView === 'soc-simulator' && (
          <SocSimulatorSection
            onOpenSocModal={() => setSocModalOpen(true)}
          />
        )}

        {/* --- 4. DIRECT VIEW: INTERNSHIP --- */}
        {activeView === 'internship' && (
          <InternshipSection
            onApply={(track) => {
              setSelectedInternshipTrack(track);
              setInternshipModalOpen(true);
            }}
          />
        )}

        {/* --- 5. DIRECT VIEW: LABS --- */}
        {activeView === 'labs' && (
          <LabsSection
            onSelectLab={(lab) => setActiveLab(lab)}
          />
        )}

        {/* --- 6. DIRECT VIEW: TOOLS --- */}
        {activeView === 'tools' && (
          <ToolsSection />
        )}

        {/* --- 7. DIRECT VIEW: ARTICLES --- */}
        {activeView === 'articles' && (
          <ArticlesSection
            onSelectArticle={(article) => setActiveArticle(article)}
          />
        )}

        {/* --- 8. DIRECT VIEW: PROJECTS --- */}
        {activeView === 'projects' && (
          <ProjectsSection
            onSelectProject={(project) => setActiveProject(project)}
          />
        )}

        {/* --- 9. DIRECT VIEW: SERVICES --- */}
        {activeView === 'services' && (
          <ServicesSection
            onRequestQuote={(service) => setActiveService(service)}
          />
        )}

        {/* --- 10. DIRECT VIEW: RESOURCES --- */}
        {activeView === 'resources' && (
          <ResourcesSection
            onSelectResource={(resource) => setActiveResource(resource)}
          />
        )}

        {/* --- 11. DIRECT VIEW: PORTFOLIO --- */}
        {activeView === 'portfolio' && (
          <PortfolioSection />
        )}

        {/* --- 12. DIRECT VIEW: DOMAINS --- */}
        {activeView === 'domains' && (
          <DomainsSection
            onSelectDomain={handleDomainSelect}
            onExploreLabsForDomain={() => handleNavigate('labs')}
          />
        )}

        {/* --- FULL COMPREHENSIVE PLATFORM VIEW (activeView === 'all') --- */}
        {activeView === 'all' && (
          <>
            {/* 1. Hero Section */}
            <Hero
              onStartLearning={() => handleNavigate('academy')}
              onExploreLabs={() => handleNavigate('labs')}
              onOpenSoc={() => setSocModalOpen(true)}
            />

            {/* 2. Cybersecurity Domains */}
            <DomainsSection
              onSelectDomain={handleDomainSelect}
              onExploreLabsForDomain={() => handleNavigate('labs')}
            />

            {/* 3. Academy (Courses & Modules) */}
            <AcademySection
              onSelectCourse={(course) => handleStartCourse(course)}
              onUpgrade={(courseId) => setUpgradeModalCourseId(courseId || null)}
              isEnrolled={isUserEnrolled}
              completedLessonIds={currentUser ? completedLessonIds : []}
              onGetCertificate={handleOpenCertificate}
              currentUser={currentUser}
              onOpenAuth={() => setAuthModalOpen(true)}
            />

            {/* 3.5. Coming Soon Courses & Skill Roadmaps (Displayed on Home menu option) */}
            <ComingSoonAndRoadmapsSection
              onNavigateToAcademy={() => handleNavigate('academy')}
              onNavigateToLabs={() => handleNavigate('labs')}
            />

            {/* 4. Hands-on Cyber Labs */}
            <LabsSection
              onSelectLab={(lab) => setActiveLab(lab)}
            />

            {/* 5. Security Tools Directory */}
            <ToolsSection />

            {/* 6. Research Articles */}
            <ArticlesSection
              onSelectArticle={(article) => setActiveArticle(article)}
            />

            {/* 7. Production Projects */}
            <ProjectsSection
              onSelectProject={(project) => setActiveProject(project)}
            />

            {/* 8. Professional Services & Consulting */}
            <ServicesSection
              onRequestQuote={(service) => setActiveService(service)}
            />

            {/* 9. Resources & Cheat Sheets */}
            <ResourcesSection
              onSelectResource={(resource) => setActiveResource(resource)}
            />

            {/* 10. Portfolio & Founder Biography (Muhammad Zaib Zafar) */}
            <PortfolioSection />

            {/* --- SECTIONS PLACED IN THE LAST (as user requested: "all these like soc simulator internship and threat desk willl be show in the last set it complete") --- */}
            
            {/* 11. Live Threat Desk & Skill Roadmaps */}
            <DailyThreatFeedSection />

            {/* 12. Enterprise SOC & Wazuh SIEM Simulator */}
            <SocSimulatorSection
              onOpenSocModal={() => setSocModalOpen(true)}
            />

            {/* 13. Fellowship & Internship Program 2026 (With Available / Off Controller) */}
            <InternshipSection
              onApply={(track) => {
                setSelectedInternshipTrack(track);
                setInternshipModalOpen(true);
              }}
            />

            {/* 14. Final High-Impact CTA */}
            <FinalCtaSection
              onStartLearning={() => handleNavigate('academy')}
              onExploreLabs={() => handleNavigate('labs')}
              onOpenSoc={() => setSocModalOpen(true)}
            />
          </>
        )}
      </main>

      {/* Global Footer */}
      <Footer
        onNavigateSection={handleNavigate}
        onOpenSoc={() => setSocModalOpen(true)}
        onOpenInternship={() => {
          setSelectedInternshipTrack(undefined);
          setInternshipModalOpen(true);
        }}
      />

      {/* Interactive Modals */}
      {/* Course Experience Modal */}
      {activeCourse && (
        <CoursePlayerModal
          course={activeCourse}
          onClose={() => setActiveCourse(null)}
          onUpgrade={(cId) => setUpgradeModalCourseId(cId)}
          isEnrolled={isUserEnrolled(activeCourse.id)}
          completedLessonIds={currentUser ? completedLessonIds : []}
          onToggleLessonCompletion={handleToggleLessonCompletion}
          userNotes={userNotes}
          onSaveNote={handleSaveNote}
          onGetCertificate={handleOpenCertificate}
          onTriggerFallingStars={handleTriggerFallingStars}
          onCompleteAllLessons={handleCompleteAllLessons}
          onResetCourseProgress={handleResetCourseProgress}
        />
      )}

      {/* Lab Simulation Modal */}
      {activeLab && (
        <LabDetailModal
          lab={activeLab}
          onClose={() => setActiveLab(null)}
          isCompleted={completedLabIds.includes(activeLab.id)}
          onCompleteLab={handleCompleteLab}
        />
      )}

      {/* Article Reader Modal */}
      {activeArticle && (
        <ArticleReaderModal
          article={activeArticle}
          onClose={() => setActiveArticle(null)}
          onSelectArticle={(art) => setActiveArticle(art)}
        />
      )}

      {/* Project Detail Modal */}
      {activeProject && (
        <ProjectDetailModal
          project={activeProject}
          onClose={() => setActiveProject(null)}
        />
      )}

      {/* Service Consultation / Quote Modal */}
      {activeService && (
        <ServiceQuoteModal
          service={activeService}
          onClose={() => setActiveService(null)}
        />
      )}

      {/* Resource Viewer Modal */}
      {activeResource && (
        <ResourceViewerModal
          resource={activeResource}
          onClose={() => setActiveResource(null)}
        />
      )}

      {/* Domain Track Detail Modal */}
      {activeDomain && (
        <DomainDetailModal
          domain={activeDomain}
          onClose={() => setActiveDomain(null)}
          onSelectCourse={(c) => handleStartCourse(c)}
          onSelectLab={(l) => setActiveLab(l)}
          onSelectArticle={(art) => setActiveArticle(art)}
        />
      )}

      {/* Wazuh SOC Simulator Modal */}
      {socModalOpen && (
        <SocSimulatorModal
          onClose={() => setSocModalOpen(false)}
        />
      )}

      {/* Global Search Modal */}
      {searchModalOpen && (
        <GlobalSearchModal
          onClose={() => setSearchModalOpen(false)}
          onSelectCourse={(c) => handleStartCourse(c)}
          onSelectLab={(l) => setActiveLab(l)}
          onSelectArticle={(a) => setActiveArticle(a)}
          onSelectProject={(p) => setActiveProject(p)}
          onSelectResource={(r) => setActiveResource(r)}
        />
      )}

      {/* Authentication & 6-Digit OTP Verification Modal */}
      {authModalOpen && (
        <AuthModal
          targetCourse={pendingCourse}
          onClose={() => {
            setAuthModalOpen(false);
            setPendingCourse(null);
          }}
          onLoginSuccess={(user) => {
            setCurrentUser(user);
            try {
              const userSavedCourses = localStorage.getItem(`cybershield_enrolled_${user.email}`);
              if (userSavedCourses) {
                const parsed = JSON.parse(userSavedCourses);
                setEnrolledCourseIds(parsed);
                localStorage.setItem('cybershield_enrolled_courses', JSON.stringify(parsed));
              } else {
                setEnrolledCourseIds([]);
              }
              const userSavedLessons = localStorage.getItem(`cybershield_completed_${user.email}`);
              if (userSavedLessons) {
                const parsed = JSON.parse(userSavedLessons);
                setCompletedLessonIds(parsed);
                localStorage.setItem('cybershield_completed_lessons', JSON.stringify(parsed));
              } else {
                setCompletedLessonIds([]);
              }
            } catch {
              setEnrolledCourseIds([]);
              setCompletedLessonIds([]);
            }
            if (pendingCourse) {
              setActiveCourse(pendingCourse);
              setPendingCourse(null);
            }
          }}
        />
      )}

      {/* User Dashboard Modal */}
      {dashboardModalOpen && currentUser && (
        <UserDashboardModal
          user={currentUser}
          onClose={() => setDashboardModalOpen(false)}
          onLogout={handleLogout}
          enrolledCourseIds={enrolledCourseIds}
          completedLessonIds={completedLessonIds}
          completedLabIds={completedLabIds}
          userNotes={userNotes}
          onSelectCourse={(c) => setActiveCourse(c)}
          onViewCertificate={handleOpenCertificate}
          onTriggerStars={handleTriggerFallingStars}
        />
      )}

      {/* Course Enrollment / Upgrade Modal */}
      {upgradeModalCourseId && (
        <UpgradeModal
          courseId={upgradeModalCourseId}
          onClose={() => setUpgradeModalCourseId(null)}
          onEnrollSuccess={(cId) => handleEnrollSuccess(cId)}
        />
      )}

      {/* Internship Application Modal */}
      {internshipModalOpen && (
        <InternshipModal
          selectedTrack={selectedInternshipTrack}
          onClose={() => {
            setInternshipModalOpen(false);
            setSelectedInternshipTrack(undefined);
          }}
        />
      )}

      {/* Official Cryptographic Course Certificate Modal */}
      {certificateCourse && (
        <CertificateModal
          course={certificateCourse}
          recipientName={currentUser?.name || 'Muhammad Zaib Zafar'}
          onClose={() => setCertificateCourse(null)}
          onTriggerStars={handleTriggerFallingStars}
        />
      )}

      {/* Falling Colorful Stars Celebration: Auto-plays once and closes automatically */}
      {showFallingStars && (
        <FallingStarsCelebration
          onClose={() => setShowFallingStars(false)}
          durationMs={2800}
          autoClose={true}
        />
      )}
    </div>
  );
}
