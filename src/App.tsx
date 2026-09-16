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
  
  // Certificate & Celebration States
  const [certificateCourse, setCertificateCourse] = useState<Course | null>(null);
  const [showFallingStars, setShowFallingStars] = useState<boolean>(false);

  // User & Learning State with local persistence
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string; role?: string } | null>(() => {
    try {
      const saved = localStorage.getItem('cybershield_user');
      return saved ? JSON.parse(saved) : { name: 'Muhammad Zaib Zafar', email: 'zaibzafar936@gmail.com', role: 'Security Specialist' };
    } catch {
      return { name: 'Muhammad Zaib Zafar', email: 'zaibzafar936@gmail.com', role: 'Security Specialist' };
    }
  });

  const [enrolledCourseIds, setEnrolledCourseIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('cybershield_enrolled_courses');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('cybershield_completed_lessons');
      return saved ? JSON.parse(saved) : ['les-1-1'];
    } catch {
      return ['les-1-1'];
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

  // Smooth scroll handler
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const navOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
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
      return next;
    });
  };

  const handleStartCourse = (course: Course) => {
    const isVerified = localStorage.getItem('cybershield_verified_session') === 'true';
    if (!isVerified) {
      setPendingCourse(course);
      setAuthModalOpen(true);
    } else {
      setActiveCourse(course);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('cybershield_user');
    localStorage.removeItem('cybershield_verified_session');
    setCurrentUser(null);
    setDashboardModalOpen(false);
  };

  const handleDomainSelect = (domainId: string) => {
    const found = DOMAINS.find(d => d.id === domainId);
    if (found) {
      setActiveDomain(found);
    }
  };

  return (
    <div className="min-h-screen bg-[#050b14] text-slate-100 font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* 1. Global Navigation Bar */}
      <Navbar
        onOpenSearch={() => setSearchModalOpen(true)}
        onOpenAuth={() => setAuthModalOpen(true)}
        onOpenDashboard={() => setDashboardModalOpen(true)}
        onNavigateSection={scrollToSection}
        onSelectDomain={handleDomainSelect}
        onOpenSocSimulator={() => setSocModalOpen(true)}
        currentUser={currentUser}
      />

      <main>
        {/* 2. Hero Section - With Robust Permanent Heading Visibility */}
        <Hero
          onStartLearning={() => scrollToSection('academy')}
          onExploreLabs={() => scrollToSection('labs')}
          onOpenSoc={() => setSocModalOpen(true)}
        />

        {/* 3. Cybersecurity Domains */}
        <DomainsSection
          onSelectDomain={handleDomainSelect}
          onExploreLabsForDomain={(category) => {
            scrollToSection('labs');
          }}
        />

        {/* 4. Academy (Courses & Modules) */}
        <AcademySection
          onSelectCourse={(course) => handleStartCourse(course)}
          onUpgrade={(courseId) => setUpgradeModalCourseId(courseId || null)}
          isEnrolled={(courseId) => enrolledCourseIds.includes(courseId)}
          completedLessonIds={completedLessonIds}
          onGetCertificate={handleOpenCertificate}
        />

        {/* Live Daily Threat Feed & Upcoming Curriculums */}
        <DailyThreatFeedSection />

        {/* 5. Hands-on Cyber Labs */}
        <LabsSection
          onSelectLab={(lab) => setActiveLab(lab)}
        />

        {/* 6. Security Tools Directory */}
        <ToolsSection />

        {/* 7. Research Articles */}
        <ArticlesSection
          onSelectArticle={(article) => setActiveArticle(article)}
        />

        {/* 8. Production Projects */}
        <ProjectsSection
          onSelectProject={(project) => setActiveProject(project)}
        />

        {/* 9. Professional Services & Consulting */}
        <ServicesSection
          onRequestQuote={(service) => setActiveService(service)}
        />

        {/* 10. Resources & Cheat Sheets */}
        <ResourcesSection
          onSelectResource={(resource) => setActiveResource(resource)}
        />

        {/* 11. Portfolio & Founder Biography (Muhammad Zaib Zafar) */}
        <PortfolioSection />

        {/* 12. Final High-Impact CTA */}
        <FinalCtaSection
          onStartLearning={() => scrollToSection('academy')}
          onExploreLabs={() => scrollToSection('labs')}
          onOpenSoc={() => setSocModalOpen(true)}
        />
      </main>

      {/* 13. Global Footer */}
      <Footer
        onNavigateSection={scrollToSection}
        onOpenSoc={() => setSocModalOpen(true)}
      />

      {/* Interactive Modals */}
      {/* Course Experience Modal */}
      {activeCourse && (
        <CoursePlayerModal
          course={activeCourse}
          onClose={() => setActiveCourse(null)}
          onUpgrade={(cId) => setUpgradeModalCourseId(cId)}
          isEnrolled={enrolledCourseIds.includes(activeCourse.id)}
          completedLessonIds={completedLessonIds}
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
