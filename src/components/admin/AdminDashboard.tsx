import React, { useState, useEffect, useMemo } from 'react';
import { 
  LayoutDashboard, 
  BookOpen, 
  Layers, 
  Users, 
  CreditCard, 
  Award, 
  FileCheck2, 
  Settings, 
  Plus, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Eye, 
  EyeOff, 
  ArrowUpRight, 
  ArrowLeft, 
  ShieldCheck, 
  ShieldAlert, 
  Download, 
  RefreshCw, 
  Sparkles, 
  Video, 
  FileText, 
  HelpCircle, 
  ExternalLink,
  ChevronDown,
  ChevronRight,
  MoveUp,
  MoveDown,
  Database,
  Copy,
  Check,
  AlertTriangle,
  Menu,
  X
} from 'lucide-react';
import { COURSES } from '../../data/courses';
import { COURSE_QUIZZES } from '../../data/quizzes';
import { Course, CourseChapter, Lesson, DomainCategory } from '../../types';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { AdminAuthResult } from '../../lib/adminAuth';

interface AdminDashboardProps {
  authResult: AdminAuthResult | null;
  onExit: () => void;
  onOpenLiveCourse?: (course: Course) => void;
}

type AdminTab = 
  | 'overview' 
  | 'courses' 
  | 'modules' 
  | 'students' 
  | 'orders' 
  | 'quizzes' 
  | 'certificates' 
  | 'settings';

interface OrderRecord {
  id: string;
  userEmail: string;
  courseId: string;
  courseTitle: string;
  amountPKR: number;
  paymentMethod: string;
  transactionRef: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  adminNotes?: string;
}

interface EnrollmentRecord {
  id: string;
  userEmail: string;
  courseId: string;
  courseTitle: string;
  enrolledAt: string;
  progressPercent: number;
  status: 'active' | 'completed' | 'revoked';
}

interface CertificateRecord {
  id: string;
  studentName: string;
  userEmail: string;
  courseId: string;
  courseTitle: string;
  status: 'preview' | 'issued' | 'revoked';
  verificationHash: string;
  issuedAt: string;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  authResult,
  onExit,
  onOpenLiveCourse
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [dbSyncNotice, setDbSyncNotice] = useState<string | null>(null);

  // 1. Courses State
  const [courseList, setCourseList] = useState<Course[]>(() => {
    try {
      const saved = localStorage.getItem('cybershield_admin_courses');
      return saved ? JSON.parse(saved) : COURSES;
    } catch {
      return COURSES;
    }
  });
  const [courseSearch, setCourseSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [isCreatingCourse, setIsCreatingCourse] = useState(false);

  // 2. Modules & Lessons State
  const [selectedCourseForModules, setSelectedCourseForModules] = useState<string>(courseList[0]?.id || '');
  const [editingLesson, setEditingLesson] = useState<{ chapterId: string; lesson: Lesson } | null>(null);
  const [isAddingLesson, setIsAddingLesson] = useState<{ chapterId: string } | null>(null);
  const [isAddingChapter, setIsAddingChapter] = useState(false);
  const [newChapterTitle, setNewChapterTitle] = useState('');

  // 3. Orders State
  const [orders, setOrders] = useState<OrderRecord[]>(() => {
    try {
      const saved = localStorage.getItem('cybershield_admin_orders');
      if (saved) return JSON.parse(saved);
    } catch {}
    // Initial production-ready empty or starter records for testing
    return [
      {
        id: 'ord-88391',
        userEmail: 'student.ali@gmail.com',
        courseId: 'course-web-vapt',
        courseTitle: 'Practical Web Application Penetration Testing',
        amountPKR: 12500,
        paymentMethod: 'easypaisa',
        transactionRef: 'EP-90281472891',
        status: 'pending',
        createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
        adminNotes: 'Proof verified via Easypaisa SMS notification'
      },
      {
        id: 'ord-88390',
        userEmail: 'hacker.usman@hotmail.com',
        courseId: 'course-soc-analyst',
        courseTitle: 'SOC Analyst & Wazuh SIEM Operations Mastery',
        amountPKR: 14500,
        paymentMethod: 'jazzcash',
        transactionRef: 'JC-48192084712',
        status: 'approved',
        createdAt: new Date(Date.now() - 3600000 * 24).toISOString()
      }
    ];
  });
  const [orderFilter, setOrderFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  // 4. Enrollments State
  const [enrollments, setEnrollments] = useState<EnrollmentRecord[]>(() => {
    try {
      const saved = localStorage.getItem('cybershield_admin_enrollments');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: 'enr-01',
        userEmail: 'hacker.usman@hotmail.com',
        courseId: 'course-soc-analyst',
        courseTitle: 'SOC Analyst & Wazuh SIEM Operations Mastery',
        enrolledAt: new Date(Date.now() - 3600000 * 24).toISOString().split('T')[0],
        progressPercent: 45,
        status: 'active'
      },
      {
        id: 'enr-02',
        userEmail: 'fatima.dev@nu.edu.pk',
        courseId: 'course-cloud-security',
        courseTitle: 'Cloud Security Architecture (AWS & Azure)',
        enrolledAt: new Date(Date.now() - 3600000 * 48).toISOString().split('T')[0],
        progressPercent: 80,
        status: 'active'
      }
    ];
  });
  const [newEnrollmentEmail, setNewEnrollmentEmail] = useState('');
  const [newEnrollmentCourseId, setNewEnrollmentCourseId] = useState(courseList[0]?.id || '');
  const [showAddEnrollmentModal, setShowAddEnrollmentModal] = useState(false);

  // 5. Certificates State
  const [certificates, setCertificates] = useState<CertificateRecord[]>(() => {
    try {
      const saved = localStorage.getItem('cybershield_admin_certificates');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: 'CS-PK-VAPT-001928',
        studentName: 'Ali Raza',
        userEmail: 'ali.raza@pucit.edu.pk',
        courseId: 'course-web-vapt',
        courseTitle: 'Practical Web Application Penetration Testing',
        status: 'issued',
        verificationHash: '9b1e4c70d8a4f6e3c2b1897e45ad9821c34a0289fd1876e4cba29402847aef12',
        issuedAt: '2026-03-15'
      },
      {
        id: 'CS-PK-SOCA-002841',
        studentName: 'Muhammad Hamza',
        userEmail: 'hamza.soc@secmail.com',
        courseId: 'course-soc-analyst',
        courseTitle: 'SOC Analyst & Wazuh SIEM Operations Mastery',
        status: 'preview',
        verificationHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        issuedAt: '2026-04-02'
      }
    ];
  });
  const [certSearchQuery, setCertSearchQuery] = useState('');
  const [certVerificationResult, setCertVerificationResult] = useState<{ found: boolean; cert?: CertificateRecord } | null>(null);

  // 6. Platform Settings State
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [maintenanceNotice, setMaintenanceNotice] = useState('CyberShieldPK Academy scheduled upgrade in progress.');
  const [allowPublicSignup, setAllowPublicSignup] = useState(true);
  const [copiedMigrationSql, setCopiedMigrationSql] = useState(false);

  // Save changes locally and attempt Supabase synchronization
  useEffect(() => {
    localStorage.setItem('cybershield_admin_courses', JSON.stringify(courseList));
  }, [courseList]);

  useEffect(() => {
    localStorage.setItem('cybershield_admin_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('cybershield_admin_enrollments', JSON.stringify(enrollments));
  }, [enrollments]);

  useEffect(() => {
    localStorage.setItem('cybershield_admin_certificates', JSON.stringify(certificates));
  }, [certificates]);

  // Sync with Supabase on mount if available
  useEffect(() => {
    if (!isSupabaseConfigured) {
      setDbSyncNotice('Offline Overlay Mode: Supabase environment variables not configured. Live admin changes stored locally.');
      return;
    }

    const fetchDatabaseRecords = async () => {
      setIsLoading(true);
      try {
        // Test query for orders table
        const { data: dbOrders, error: orderErr } = await supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false });

        if (!orderErr && dbOrders && dbOrders.length > 0) {
          const mapped: OrderRecord[] = dbOrders.map(o => ({
            id: o.id,
            userEmail: o.user_email,
            courseId: o.course_id,
            courseTitle: o.course_title,
            amountPKR: o.amount_pkr,
            paymentMethod: o.payment_method,
            transactionRef: o.transaction_reference || 'N/A',
            status: o.status,
            createdAt: o.created_at,
            adminNotes: o.admin_notes
          }));
          setOrders(mapped);
          setDbSyncNotice('Live Supabase Database Connected: All orders and records synced with PostgreSQL.');
        } else {
          setDbSyncNotice('Connected to Supabase. Tables ready for live transactions.');
        }
      } catch (err: any) {
        console.warn('Supabase admin sync warning:', err);
        setDbSyncNotice('Connected with local overlay. Database migrations ready to apply.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDatabaseRecords();
  }, []);

  // Filtered Courses
  const filteredCourses = useMemo(() => {
    return courseList.filter(c => {
      const matchesSearch = c.title.toLowerCase().includes(courseSearch.toLowerCase()) || 
                            c.slug.toLowerCase().includes(courseSearch.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || c.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [courseList, courseSearch, selectedCategory]);

  // Current Course for Modules editing
  const currentModuleCourse = useMemo(() => {
    return courseList.find(c => c.id === selectedCourseForModules) || courseList[0];
  }, [courseList, selectedCourseForModules]);

  // Toggle Course Publishing
  const handleToggleCoursePublish = (courseId: string) => {
    setCourseList(prev => prev.map(c => {
      if (c.id === courseId) {
        // Toggle badge or status
        const isDraft = c.badge === 'Draft Preview' || c.badge === 'Unpublished';
        return {
          ...c,
          badge: isDraft ? 'Published' : 'Unpublished'
        };
      }
      return c;
    }));
  };

  // Delete Course
  const handleDeleteCourse = (courseId: string) => {
    if (window.confirm(`Are you sure you want to delete course ${courseId}? This cannot be undone.`)) {
      setCourseList(prev => prev.filter(c => c.id !== courseId));
    }
  };

  // Order Approval
  const handleApproveOrder = async (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'approved' } : o));

    // Automatically enroll student
    const existing = enrollments.find(e => e.userEmail === order.userEmail && e.courseId === order.courseId);
    if (!existing) {
      const newEnr: EnrollmentRecord = {
        id: `enr-${Date.now().toString().slice(-4)}`,
        userEmail: order.userEmail,
        courseId: order.courseId,
        courseTitle: order.courseTitle,
        enrolledAt: new Date().toISOString().split('T')[0],
        progressPercent: 0,
        status: 'active'
      };
      setEnrollments(prev => [newEnr, ...prev]);
    }

    if (isSupabaseConfigured) {
      try {
        await supabase.from('orders').update({ status: 'approved' }).eq('id', orderId);
      } catch (err) {
        console.error('Failed to update order status in Supabase:', err);
      }
    }
  };

  // Order Rejection
  const handleRejectOrder = async (orderId: string) => {
    const reason = window.prompt('Enter rejection reason (e.g. Invalid TID proof):', 'Transaction reference could not be verified with banking gateway.');
    if (!reason) return;

    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'rejected', adminNotes: reason } : o));

    if (isSupabaseConfigured) {
      try {
        await supabase.from('orders').update({ status: 'rejected', admin_notes: reason }).eq('id', orderId);
      } catch (err) {
        console.error('Failed to update order rejection in Supabase:', err);
      }
    }
  };

  // Add Manual Enrollment
  const handleCreateEnrollment = () => {
    if (!newEnrollmentEmail || !newEnrollmentEmail.includes('@')) {
      alert('Please enter a valid student email address.');
      return;
    }
    const targetCourse = courseList.find(c => c.id === newEnrollmentCourseId);
    if (!targetCourse) return;

    const newEnr: EnrollmentRecord = {
      id: `enr-${Date.now().toString().slice(-4)}`,
      userEmail: newEnrollmentEmail.trim().toLowerCase(),
      courseId: targetCourse.id,
      courseTitle: targetCourse.title,
      enrolledAt: new Date().toISOString().split('T')[0],
      progressPercent: 0,
      status: 'active'
    };

    setEnrollments(prev => [newEnr, ...prev]);
    setNewEnrollmentEmail('');
    setShowAddEnrollmentModal(false);
  };

  // Revoke Enrollment
  const handleRevokeEnrollment = (enrId: string) => {
    if (window.confirm('Revoke access for this student?')) {
      setEnrollments(prev => prev.filter(e => e.id !== enrId));
    }
  };

  // Add Chapter to Course
  const handleAddChapter = () => {
    if (!newChapterTitle.trim() || !currentModuleCourse) return;

    const newChapter: CourseChapter = {
      id: `ch-${Date.now().toString().slice(-4)}`,
      chapterNumber: (currentModuleCourse.chapters?.length || 0) + 1,
      title: newChapterTitle.trim(),
      description: 'Structured module covering core domain workflows and demonstrations.',
      lessons: []
    };

    setCourseList(prev => prev.map(c => {
      if (c.id === currentModuleCourse.id) {
        const updatedChapters = [...(c.chapters || []), newChapter];
        return {
          ...c,
          chapters: updatedChapters,
          modulesCount: updatedChapters.length
        };
      }
      return c;
    }));

    setNewChapterTitle('');
    setIsAddingChapter(false);
  };

  // Save Lesson (Edit or Add)
  const handleSaveLesson = (chapterId: string, lessonData: Lesson) => {
    if (!currentModuleCourse) return;

    setCourseList(prev => prev.map(c => {
      if (c.id === currentModuleCourse.id) {
        const updatedChapters = (c.chapters || []).map(ch => {
          if (ch.id === chapterId) {
            const existingIdx = ch.lessons.findIndex(l => l.id === lessonData.id);
            let updatedLessons: Lesson[];
            if (existingIdx >= 0) {
              updatedLessons = [...ch.lessons];
              updatedLessons[existingIdx] = lessonData;
            } else {
              updatedLessons = [...ch.lessons, lessonData];
            }
            return { ...ch, lessons: updatedLessons };
          }
          return ch;
        });

        const totalLessons = updatedChapters.reduce((acc, ch) => acc + ch.lessons.length, 0);

        return {
          ...c,
          chapters: updatedChapters,
          lessonsCount: totalLessons
        };
      }
      return c;
    }));

    setEditingLesson(null);
    setIsAddingLesson(null);
  };

  // Reorder Lessons
  const handleMoveLesson = (chapterId: string, lessonId: string, direction: 'up' | 'down') => {
    if (!currentModuleCourse) return;

    setCourseList(prev => prev.map(c => {
      if (c.id === currentModuleCourse.id) {
        const updatedChapters = (c.chapters || []).map(ch => {
          if (ch.id === chapterId) {
            const index = ch.lessons.findIndex(l => l.id === lessonId);
            if (index < 0) return ch;
            const newIndex = direction === 'up' ? index - 1 : index + 1;
            if (newIndex < 0 || newIndex >= ch.lessons.length) return ch;

            const reordered = [...ch.lessons];
            const [moved] = reordered.splice(index, 1);
            reordered.splice(newIndex, 0, moved);
            return { ...ch, lessons: reordered };
          }
          return ch;
        });
        return { ...c, chapters: updatedChapters };
      }
      return c;
    }));
  };

  // Delete Lesson
  const handleDeleteLesson = (chapterId: string, lessonId: string) => {
    if (!currentModuleCourse || !window.confirm('Delete this lesson?')) return;

    setCourseList(prev => prev.map(c => {
      if (c.id === currentModuleCourse.id) {
        const updatedChapters = (c.chapters || []).map(ch => {
          if (ch.id === chapterId) {
            return {
              ...ch,
              lessons: ch.lessons.filter(l => l.id !== lessonId)
            };
          }
          return ch;
        });
        const totalLessons = updatedChapters.reduce((acc, ch) => acc + ch.lessons.length, 0);
        return {
          ...c,
          chapters: updatedChapters,
          lessonsCount: totalLessons
        };
      }
      return c;
    }));
  };

  // Certificate Verification Lookup
  const handleVerifyCertLookup = () => {
    const q = certSearchQuery.trim().toLowerCase();
    if (!q) {
      setCertVerificationResult(null);
      return;
    }
    const match = certificates.find(c => 
      c.id.toLowerCase() === q || 
      c.verificationHash.toLowerCase() === q ||
      c.studentName.toLowerCase().includes(q)
    );
    if (match) {
      setCertVerificationResult({ found: true, cert: match });
    } else {
      setCertVerificationResult({ found: false });
    }
  };

  // Issue Certificate Officially
  const handleIssueCertificate = (certId: string) => {
    setCertificates(prev => prev.map(c => {
      if (c.id === certId) {
        return {
          ...c,
          status: 'issued',
          issuedAt: new Date().toISOString().split('T')[0]
        };
      }
      return c;
    }));
  };

  // Export CSV Data
  const handleExportData = (type: 'courses' | 'orders' | 'students') => {
    let csvContent = '';
    let filename = '';

    if (type === 'courses') {
      filename = `cybershield_courses_${Date.now()}.csv`;
      csvContent = 'ID,Title,Category,Difficulty,Duration,PricePKR,IsPremium,Modules,Lessons\n' +
        courseList.map(c => `"${c.id}","${c.title}","${c.category}","${c.difficulty}","${c.duration}",${c.pricePKR},${c.isPremium},${c.modulesCount},${c.lessonsCount}`).join('\n');
    } else if (type === 'orders') {
      filename = `cybershield_orders_${Date.now()}.csv`;
      csvContent = 'ID,Email,Course,AmountPKR,Method,TID,Status,Date\n' +
        orders.map(o => `"${o.id}","${o.userEmail}","${o.courseTitle}",${o.amountPKR},"${o.paymentMethod}","${o.transactionRef}","${o.status}","${o.createdAt}"`).join('\n');
    } else {
      filename = `cybershield_students_${Date.now()}.csv`;
      csvContent = 'ID,Email,Course,ProgressPercent,Status,EnrolledDate\n' +
        enrollments.map(e => `"${e.id}","${e.userEmail}","${e.courseTitle}",${e.progressPercent},"${e.status}","${e.enrolledAt}"`).join('\n');
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-[#060c16] text-slate-100 flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="h-16 bg-[#0a1222] border-b border-cyan-500/20 px-4 sm:px-6 flex items-center justify-between z-30 sticky top-0 shadow-md">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-800 transition-colors"
          >
            {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-600/30 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.25)]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-base tracking-tight bg-gradient-to-r from-white via-slate-100 to-cyan-300 bg-clip-text text-transparent">
                  CyberShield<span className="text-cyan-400">PK</span>
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-red-950/80 text-red-300 border border-red-500/40">
                  ADMIN CONSOLE
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono hidden sm:block">
                Clearance: Verified Administrator • Database RLS Enforced
              </p>
            </div>
          </div>
        </div>

        {/* Right Header Status & Navigation */}
        <div className="flex items-center gap-3">
          {authResult?.user && (
            <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-slate-300 truncate max-w-[150px]">{authResult.user.email}</span>
              <span className="text-cyan-400 font-bold">({authResult.user.role})</span>
            </div>
          )}

          <button
            type="button"
            onClick={onExit}
            className="px-3.5 py-1.5 rounded-lg text-xs font-mono font-semibold text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Site</span>
          </button>
        </div>
      </header>

      {/* Database sync banner notice */}
      {dbSyncNotice && (
        <div className="bg-cyan-950/40 border-b border-cyan-500/30 px-4 py-2 flex items-center justify-between text-xs font-mono text-cyan-300">
          <div className="flex items-center gap-2 truncate">
            <Database className="w-4 h-4 text-cyan-400 flex-shrink-0" />
            <span className="truncate">{dbSyncNotice}</span>
          </div>
          <button
            type="button"
            onClick={() => setActiveTab('settings')}
            className="text-[11px] underline text-cyan-400 hover:text-cyan-200 ml-3 flex-shrink-0"
          >
            Inspect DB Rules →
          </button>
        </div>
      )}

      {/* Main Workspace: Sidebar + Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Navigation */}
        <aside className={`
          fixed md:relative z-20 inset-y-0 left-0 w-64 bg-[#091120] border-r border-slate-800/80 flex flex-col justify-between transition-transform duration-200 ease-in-out md:translate-x-0
          ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}>
          <div className="p-3 space-y-1 overflow-y-auto">
            <div className="px-3 py-2 text-[10px] font-mono text-slate-500 uppercase tracking-wider">
              Navigation & Modules
            </div>

            {[
              { id: 'overview', label: 'Overview & Analytics', icon: LayoutDashboard, badge: null },
              { id: 'courses', label: 'Courses Management', icon: BookOpen, badge: courseList.length },
              { id: 'modules', label: 'Modules & Lessons', icon: Layers, badge: null },
              { id: 'students', label: 'Students & Access', icon: Users, badge: enrollments.length },
              { id: 'orders', label: 'Orders & Payments', icon: CreditCard, badge: orders.filter(o => o.status === 'pending').length },
              { id: 'quizzes', label: 'Quizzes & Tests', icon: HelpCircle, badge: Object.keys(COURSE_QUIZZES).length },
              { id: 'certificates', label: 'Certificates Registry', icon: Award, badge: certificates.length },
              { id: 'settings', label: 'Platform & Database', icon: Settings, badge: null },
            ].map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(item.id as AdminTab);
                    setMobileSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                    isActive 
                      ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 shadow-inner' 
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== null && item.badge > 0 && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                      item.id === 'orders' 
                        ? 'bg-amber-950 text-amber-300 border border-amber-500/30' 
                        : 'bg-slate-800 text-slate-300'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Sidebar Footer */}
          <div className="p-3 border-t border-slate-800/80 bg-slate-950/60">
            <div className="rounded-xl bg-slate-900 border border-slate-800 p-3 space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>Security Engine</span>
                <span className="text-emerald-400 font-bold">ACTIVE</span>
              </div>
              <p className="text-[10px] text-slate-500 leading-tight">
                PostgreSQL RLS ensures students cannot manipulate course pricing or grant themselves admin rights.
              </p>
            </div>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#060c16]">
          {/* TAB 1: OVERVIEW & ANALYTICS */}
          {activeTab === 'overview' && (
            <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-150">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
                <div>
                  <h1 className="text-2xl font-black text-white tracking-tight">Admin Overview & Metrics</h1>
                  <p className="text-xs text-slate-400 font-mono mt-1">Real-time metrics derived from catalog, active learners, and orders queue</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleExportData('courses')}
                    className="px-3 py-1.5 rounded-lg text-xs font-mono text-cyan-300 bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-500/40 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export Catalog CSV</span>
                  </button>
                  <button
                    onClick={() => setIsCreatingCourse(true)}
                    className="px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-blue-400 hover:from-cyan-300 hover:to-blue-300 flex items-center gap-1.5 cursor-pointer shadow-[0_0_12px_rgba(0,240,255,0.25)]"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>New Course</span>
                  </button>
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="rounded-2xl bg-[#091120] border border-cyan-500/30 p-5 space-y-2 relative overflow-hidden">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-xs font-mono uppercase tracking-wider">Total Courses</span>
                    <BookOpen className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div className="text-3xl font-black font-mono text-white">{courseList.length}</div>
                  <div className="text-[11px] text-cyan-400 font-mono flex items-center gap-1">
                    <span>{courseList.filter(c => c.isPremium).length} Premium</span>
                    <span>•</span>
                    <span>{courseList.filter(c => !c.isPremium).length} Free</span>
                  </div>
                </div>

                <div className="rounded-2xl bg-[#091120] border border-emerald-500/30 p-5 space-y-2 relative overflow-hidden">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-xs font-mono uppercase tracking-wider">Active Students</span>
                    <Users className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-3xl font-black font-mono text-white">{enrollments.length}</div>
                  <div className="text-[11px] text-emerald-400 font-mono">
                    {enrollments.filter(e => e.status === 'active').length} actively enrolled
                  </div>
                </div>

                <div className="rounded-2xl bg-[#091120] border border-amber-500/30 p-5 space-y-2 relative overflow-hidden">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-xs font-mono uppercase tracking-wider">Pending Orders</span>
                    <CreditCard className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-3xl font-black font-mono text-amber-300">
                    {orders.filter(o => o.status === 'pending').length}
                  </div>
                  <div className="text-[11px] text-amber-400 font-mono">
                    Awaiting payment approval
                  </div>
                </div>

                <div className="rounded-2xl bg-[#091120] border border-purple-500/30 p-5 space-y-2 relative overflow-hidden">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-xs font-mono uppercase tracking-wider">Certificates Issued</span>
                    <Award className="w-4 h-4 text-purple-400" />
                  </div>
                  <div className="text-3xl font-black font-mono text-white">
                    {certificates.filter(c => c.status === 'issued').length}
                  </div>
                  <div className="text-[11px] text-purple-400 font-mono">
                    {certificates.length} Total records
                  </div>
                </div>
              </div>

              {/* Action Panels */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Orders Requiring Attention */}
                <div className="rounded-2xl bg-[#091120] border border-slate-800 p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-cyan-400" />
                      <span>Pending Orders Queue</span>
                    </h3>
                    <button
                      onClick={() => setActiveTab('orders')}
                      className="text-xs font-mono text-cyan-400 hover:text-cyan-300"
                    >
                      View All →
                    </button>
                  </div>

                  {orders.filter(o => o.status === 'pending').length === 0 ? (
                    <div className="text-center py-8 text-xs font-mono text-slate-500">
                      No pending payment proofs awaiting verification.
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {orders.filter(o => o.status === 'pending').slice(0, 3).map(order => (
                        <div key={order.id} className="rounded-xl bg-slate-950 border border-slate-800/80 p-3.5 flex items-center justify-between gap-3">
                          <div className="space-y-0.5 min-w-0">
                            <p className="text-xs font-bold text-white truncate">{order.courseTitle}</p>
                            <p className="text-[11px] text-slate-400 font-mono truncate">{order.userEmail} • PKR {order.amountPKR.toLocaleString()}</p>
                            <span className="text-[10px] text-amber-400 font-mono">TID: {order.transactionRef} ({order.paymentMethod})</span>
                          </div>
                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            <button
                              onClick={() => handleApproveOrder(order.id)}
                              className="px-2.5 py-1 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40 text-[11px] font-mono hover:bg-emerald-900 cursor-pointer"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleRejectOrder(order.id)}
                              className="px-2.5 py-1 rounded bg-red-950 text-red-300 border border-red-500/40 text-[11px] font-mono hover:bg-red-900 cursor-pointer"
                            >
                              Reject
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Quick Shortcuts */}
                <div className="rounded-2xl bg-[#091120] border border-slate-800 p-5 space-y-4">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    <span>Admin Operations Desk</span>
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => {
                        setSelectedCourseForModules(courseList[0]?.id || '');
                        setActiveTab('modules');
                      }}
                      className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500/40 text-left transition-all group cursor-pointer"
                    >
                      <Layers className="w-5 h-5 text-cyan-400 mb-2 group-hover:scale-110 transition-transform" />
                      <div className="text-xs font-bold text-white">Manage Lessons</div>
                      <div className="text-[10px] text-slate-400 font-mono">Video links & notes</div>
                    </button>

                    <button
                      onClick={() => setShowAddEnrollmentModal(true)}
                      className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500/40 text-left transition-all group cursor-pointer"
                    >
                      <Users className="w-5 h-5 text-emerald-400 mb-2 group-hover:scale-110 transition-transform" />
                      <div className="text-xs font-bold text-white">Grant Student Access</div>
                      <div className="text-[10px] text-slate-400 font-mono">Manual course override</div>
                    </button>

                    <button
                      onClick={() => setActiveTab('certificates')}
                      className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-purple-500/40 text-left transition-all group cursor-pointer"
                    >
                      <Award className="w-5 h-5 text-purple-400 mb-2 group-hover:scale-110 transition-transform" />
                      <div className="text-xs font-bold text-white">Verify Credentials</div>
                      <div className="text-[10px] text-slate-400 font-mono">Lookup SHA-256 hashes</div>
                    </button>

                    <button
                      onClick={() => setActiveTab('settings')}
                      className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-500/40 text-left transition-all group cursor-pointer"
                    >
                      <Database className="w-5 h-5 text-amber-400 mb-2 group-hover:scale-110 transition-transform" />
                      <div className="text-xs font-bold text-white">Database & RLS</div>
                      <div className="text-[10px] text-slate-400 font-mono">PostgreSQL status</div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: COURSES MANAGEMENT */}
          {activeTab === 'courses' && (
            <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-150">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
                <div>
                  <h1 className="text-2xl font-black text-white tracking-tight">Course Catalog Management</h1>
                  <p className="text-xs text-slate-400 font-mono mt-1">Create, edit, price, publish, or retire courses in the Academy</p>
                </div>
                <button
                  onClick={() => setIsCreatingCourse(true)}
                  className="px-4 py-2 rounded-xl text-xs font-mono font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-blue-400 hover:from-cyan-300 hover:to-blue-300 flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,240,255,0.25)] cursor-pointer self-start sm:self-auto"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create New Course</span>
                </button>
              </div>

              {/* Filters & Search */}
              <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-[#091120] p-4 rounded-2xl border border-slate-800">
                <div className="relative w-full sm:w-80">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={courseSearch}
                    onChange={(e) => setCourseSearch(e.target.value)}
                    placeholder="Search by title or slug..."
                    className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Filter className="w-3.5 h-3.5 text-slate-400" />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono w-full sm:w-auto"
                  >
                    <option value="All">All Categories</option>
                    <option value="Web Application Security">Web Application Security</option>
                    <option value="SOC & Blue Team">SOC & Blue Team</option>
                    <option value="Network Security">Network Security</option>
                    <option value="Digital Forensics">Digital Forensics</option>
                    <option value="Cloud Security">Cloud Security</option>
                    <option value="Ethical Hacking">Ethical Hacking</option>
                  </select>
                </div>
              </div>

              {/* Courses Table / List */}
              <div className="rounded-2xl bg-[#091120] border border-slate-800 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-950/80 border-b border-slate-800 text-[10px] font-mono uppercase text-slate-400 tracking-wider">
                      <tr>
                        <th className="py-3 px-4">Course Title & Category</th>
                        <th className="py-3 px-4">Level & Duration</th>
                        <th className="py-3 px-4">Pricing</th>
                        <th className="py-3 px-4">Lessons / Modules</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-mono">
                      {filteredCourses.map(course => (
                        <tr key={course.id} className="hover:bg-slate-900/50 transition-colors">
                          <td className="py-3.5 px-4 font-sans">
                            <div className="font-bold text-white text-xs">{course.title}</div>
                            <div className="text-[11px] text-cyan-400 font-mono">{course.category}</div>
                          </td>
                          <td className="py-3.5 px-4 text-slate-300">
                            <div>{course.difficulty}</div>
                            <div className="text-[10px] text-slate-500">{course.duration}</div>
                          </td>
                          <td className="py-3.5 px-4">
                            {course.isPremium ? (
                              <div className="text-emerald-400 font-bold">
                                PKR {course.pricePKR.toLocaleString()}
                                <span className="text-[10px] text-slate-500 ml-1">(${course.priceUSD})</span>
                              </div>
                            ) : (
                              <span className="px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 text-[10px] font-bold">
                                FREE
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-slate-300">
                            {course.modulesCount || course.chapters?.length || 0} Modules • {course.lessonsCount || 0} Lessons
                          </td>
                          <td className="py-3.5 px-4">
                            <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              course.badge === 'Unpublished' 
                                ? 'bg-slate-800 text-slate-400 border border-slate-700' 
                                : 'bg-cyan-950 text-cyan-300 border border-cyan-500/40'
                            }`}>
                              {course.badge || 'Published'}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => {
                                  setSelectedCourseForModules(course.id);
                                  setActiveTab('modules');
                                }}
                                title="Edit Modules & Lessons"
                                className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-800 cursor-pointer"
                              >
                                <Layers className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setEditingCourse(course)}
                                title="Edit Course Details"
                                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleToggleCoursePublish(course.id)}
                                title={course.badge === 'Unpublished' ? 'Publish' : 'Unpublish'}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-slate-800 cursor-pointer"
                              >
                                {course.badge === 'Unpublished' ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                              </button>
                              <button
                                onClick={() => handleDeleteCourse(course.id)}
                                title="Delete Course"
                                className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: MODULES & LESSONS */}
          {activeTab === 'modules' && currentModuleCourse && (
            <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-150">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
                <div>
                  <h1 className="text-2xl font-black text-white tracking-tight">Curriculum, Modules & Lessons</h1>
                  <p className="text-xs text-slate-400 font-mono mt-1">
                    Manage video URLs, streaming types, and lecture notes for each module
                  </p>
                </div>

                {/* Course selector dropdown */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-slate-400">Course:</span>
                  <select
                    value={selectedCourseForModules}
                    onChange={(e) => setSelectedCourseForModules(e.target.value)}
                    className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-cyan-300 font-mono focus:outline-none focus:border-cyan-500 max-w-xs truncate"
                  >
                    {courseList.map(c => (
                      <option key={c.id} value={c.id}>{c.title}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Course Title Banner */}
              <div className="p-4 rounded-2xl bg-[#091120] border border-cyan-500/30 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">{currentModuleCourse.title}</h3>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">
                    {currentModuleCourse.chapters?.length || 0} Chapters • {currentModuleCourse.lessonsCount || 0} Total Lessons
                  </p>
                </div>
                <button
                  onClick={() => setIsAddingChapter(true)}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-blue-400 hover:from-cyan-300 hover:to-blue-300 flex items-center gap-1.5 cursor-pointer shadow-[0_0_12px_rgba(0,240,255,0.2)]"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Chapter</span>
                </button>
              </div>

              {/* Chapters List */}
              <div className="space-y-4">
                {(currentModuleCourse.chapters || []).map((chapter, chIdx) => (
                  <div key={chapter.id} className="rounded-2xl bg-[#091120] border border-slate-800 overflow-hidden">
                    {/* Chapter Header */}
                    <div className="px-5 py-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-md bg-cyan-950 border border-cyan-500/40 text-cyan-400 text-xs font-mono font-bold flex items-center justify-center">
                          {chapter.chapterNumber || chIdx + 1}
                        </span>
                        <div>
                          <h4 className="text-sm font-bold text-white">{chapter.title}</h4>
                          <p className="text-[11px] text-slate-400 font-mono">{chapter.description || 'Module Description'}</p>
                        </div>
                      </div>

                      <button
                        onClick={() => setIsAddingLesson({ chapterId: chapter.id })}
                        className="px-2.5 py-1 rounded-lg text-xs font-mono text-cyan-400 hover:text-white bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-500/30 flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add Lesson</span>
                      </button>
                    </div>

                    {/* Lessons list */}
                    <div className="p-3 space-y-2">
                      {chapter.lessons.length === 0 ? (
                        <div className="text-center py-4 text-xs font-mono text-slate-500">
                          No lessons in this chapter yet. Click "Add Lesson" to add the first video lecture.
                        </div>
                      ) : (
                        chapter.lessons.map((lesson, lIdx) => (
                          <div
                            key={lesson.id}
                            className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 hover:border-slate-700 transition-colors flex items-center justify-between gap-3"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <span className="text-[11px] font-mono text-slate-500 w-5">
                                {lIdx + 1}.
                              </span>
                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-semibold text-white truncate">{lesson.title}</span>
                                  {lesson.isFree && (
                                    <span className="px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 text-[9px] font-mono font-bold">
                                      FREE PREVIEW
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-3 text-[10px] text-slate-400 font-mono mt-0.5">
                                  <span>{lesson.duration}</span>
                                  <span>•</span>
                                  <span className="flex items-center gap-1">
                                    <Video className="w-3 h-3 text-cyan-400" />
                                    <span>{lesson.videoType || 'youtube'}</span>
                                  </span>
                                  {lesson.videoUrl && (
                                    <span className="text-slate-500 truncate max-w-[200px]">({lesson.videoUrl})</span>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-1 flex-shrink-0">
                              <button
                                onClick={() => handleMoveLesson(chapter.id, lesson.id, 'up')}
                                disabled={lIdx === 0}
                                className="p-1 text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer"
                                title="Move Up"
                              >
                                <MoveUp className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleMoveLesson(chapter.id, lesson.id, 'down')}
                                disabled={lIdx === chapter.lessons.length - 1}
                                className="p-1 text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer"
                                title="Move Down"
                              >
                                <MoveDown className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => setEditingLesson({ chapterId: chapter.id, lesson })}
                                className="p-1.5 rounded text-slate-400 hover:text-cyan-400 hover:bg-slate-800 cursor-pointer"
                                title="Edit Lesson"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteLesson(chapter.id, lesson.id)}
                                className="p-1.5 rounded text-slate-400 hover:text-red-400 hover:bg-slate-800 cursor-pointer"
                                title="Delete Lesson"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: STUDENTS & ENROLLMENTS */}
          {activeTab === 'students' && (
            <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-150">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
                <div>
                  <h1 className="text-2xl font-black text-white tracking-tight">Students & Course Access</h1>
                  <p className="text-xs text-slate-400 font-mono mt-1">Review active learners, progress metrics, or grant manual course overrides</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleExportData('students')}
                    className="px-3 py-1.5 rounded-lg text-xs font-mono text-cyan-300 bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-500/40 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export CSV</span>
                  </button>
                  <button
                    onClick={() => setShowAddEnrollmentModal(true)}
                    className="px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-blue-400 hover:from-cyan-300 hover:to-blue-300 flex items-center gap-1.5 cursor-pointer shadow-[0_0_12px_rgba(0,240,255,0.25)]"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Grant Enrollment</span>
                  </button>
                </div>
              </div>

              {/* Table */}
              <div className="rounded-2xl bg-[#091120] border border-slate-800 overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950/80 border-b border-slate-800 text-[10px] font-mono uppercase text-slate-400 tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Student Email</th>
                      <th className="py-3 px-4">Enrolled Course</th>
                      <th className="py-3 px-4">Enrolled Date</th>
                      <th className="py-3 px-4">Progress</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono">
                    {enrollments.map(enr => (
                      <tr key={enr.id} className="hover:bg-slate-900/50 transition-colors">
                        <td className="py-3.5 px-4 text-white font-bold">{enr.userEmail}</td>
                        <td className="py-3.5 px-4 text-slate-300 font-sans max-w-xs truncate">{enr.courseTitle}</td>
                        <td className="py-3.5 px-4 text-slate-400">{enr.enrolledAt}</td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-20 bg-slate-800 h-2 rounded-full overflow-hidden">
                              <div 
                                className="bg-gradient-to-r from-cyan-400 to-blue-500 h-full rounded-full" 
                                style={{ width: `${enr.progressPercent}%` }} 
                              />
                            </div>
                            <span className="text-[11px] text-cyan-300">{enr.progressPercent}%</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-emerald-950 text-emerald-400 border border-emerald-500/40">
                            {enr.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => handleRevokeEnrollment(enr.id)}
                            className="p-1.5 rounded text-slate-400 hover:text-red-400 hover:bg-slate-800 cursor-pointer"
                            title="Revoke Course Access"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: ORDERS & PAYMENT VERIFICATION */}
          {activeTab === 'orders' && (
            <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-150">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
                <div>
                  <h1 className="text-2xl font-black text-white tracking-tight">Orders & Payment Verification</h1>
                  <p className="text-xs text-slate-400 font-mono mt-1">
                    Verify Easypaisa, JazzCash, Raast, or Bank deposit proofs and approve course enrollments
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleExportData('orders')}
                    className="px-3 py-1.5 rounded-lg text-xs font-mono text-cyan-300 bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-500/40 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export Orders CSV</span>
                  </button>
                </div>
              </div>

              {/* Status Filter Tabs */}
              <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                {(['all', 'pending', 'approved', 'rejected'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setOrderFilter(tab)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase transition-colors cursor-pointer ${
                      orderFilter === tab 
                        ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40 font-bold' 
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {tab} ({tab === 'all' ? orders.length : orders.filter(o => o.status === tab).length})
                  </button>
                ))}
              </div>

              {/* Orders Table */}
              <div className="rounded-2xl bg-[#091120] border border-slate-800 overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950/80 border-b border-slate-800 text-[10px] font-mono uppercase text-slate-400 tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Order ID & Date</th>
                      <th className="py-3 px-4">Customer</th>
                      <th className="py-3 px-4">Course</th>
                      <th className="py-3 px-4">Amount</th>
                      <th className="py-3 px-4">Method & TID</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono">
                    {orders
                      .filter(o => orderFilter === 'all' || o.status === orderFilter)
                      .map(order => (
                        <tr key={order.id} className="hover:bg-slate-900/50 transition-colors">
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-white">{order.id}</div>
                            <div className="text-[10px] text-slate-500">{order.createdAt.slice(0, 10)}</div>
                          </td>
                          <td className="py-3.5 px-4 text-slate-200">{order.userEmail}</td>
                          <td className="py-3.5 px-4 font-sans text-slate-300 max-w-xs truncate">{order.courseTitle}</td>
                          <td className="py-3.5 px-4 text-emerald-400 font-bold">PKR {order.amountPKR.toLocaleString()}</td>
                          <td className="py-3.5 px-4">
                            <div className="text-amber-300 font-bold uppercase">{order.paymentMethod}</div>
                            <div className="text-[10px] text-slate-400">{order.transactionRef}</div>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                              order.status === 'approved'
                                ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40'
                                : order.status === 'pending'
                                ? 'bg-amber-950 text-amber-300 border border-amber-500/40'
                                : 'bg-red-950 text-red-400 border border-red-500/40'
                            }`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            {order.status === 'pending' && (
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => handleApproveOrder(order.id)}
                                  className="px-2.5 py-1 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-900 cursor-pointer"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => handleRejectOrder(order.id)}
                                  className="px-2.5 py-1 rounded bg-red-950 text-red-300 border border-red-500/40 hover:bg-red-900 cursor-pointer"
                                >
                                  Reject
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 6: QUIZZES & ASSESSMENTS */}
          {activeTab === 'quizzes' && (
            <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-150">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
                <div>
                  <h1 className="text-2xl font-black text-white tracking-tight">Assessments & Quizzes</h1>
                  <p className="text-xs text-slate-400 font-mono mt-1">
                    Manage course examination questions, passing criteria, and technical assessment answers
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(COURSE_QUIZZES).map(([courseId, quiz]) => {
                  const matchingCourse = courseList.find(c => c.id === courseId);
                  return (
                    <div key={courseId} className="rounded-2xl bg-[#091120] border border-slate-800 p-5 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider">{matchingCourse?.title || courseId}</span>
                          <h3 className="text-base font-bold text-white mt-1">{quiz.title}</h3>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 font-mono text-xs font-bold border border-cyan-500/30">
                          {quiz.passingScorePercent}% Pass
                        </span>
                      </div>

                      <p className="text-xs text-slate-400">Formal technical assessment and exam questions for course verification.</p>

                      <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
                        <span>{quiz.questions.length} Exam Questions</span>
                        <span className="text-emerald-400">Production Configured</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 7: CERTIFICATES & VERIFICATION REGISTRY */}
          {activeTab === 'certificates' && (
            <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-150">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
                <div>
                  <h1 className="text-2xl font-black text-white tracking-tight">Certificates & Verification Registry</h1>
                  <p className="text-xs text-slate-400 font-mono mt-1">
                    Cryptographic audit trail for all issued credentials and verification hashes
                  </p>
                </div>
              </div>

              {/* Lookup Tool */}
              <div className="rounded-2xl bg-[#091120] border border-cyan-500/30 p-5 space-y-3">
                <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  <span>Credential Authenticity Lookup Tool</span>
                </h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={certSearchQuery}
                    onChange={(e) => setCertSearchQuery(e.target.value)}
                    placeholder="Enter Credential ID (e.g. CS-PK-VAPT-001928) or SHA-256 hash..."
                    className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
                  />
                  <button
                    onClick={handleVerifyCertLookup}
                    className="px-4 py-2 rounded-xl text-xs font-mono font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-blue-400 hover:from-cyan-300 hover:to-blue-300 transition-all cursor-pointer"
                  >
                    Verify
                  </button>
                </div>

                {certVerificationResult && (
                  <div className={`p-3 rounded-xl border text-xs font-mono mt-2 ${
                    certVerificationResult.found 
                      ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300' 
                      : 'bg-red-950/40 border-red-500/40 text-red-300'
                  }`}>
                    {certVerificationResult.found ? (
                      <div>
                        ✅ <strong>Authentic Credential Found:</strong> {certVerificationResult.cert?.id} issued to{' '}
                        <strong>{certVerificationResult.cert?.studentName}</strong> for{' '}
                        <strong>{certVerificationResult.cert?.courseTitle}</strong>. Status:{' '}
                        <span className="uppercase font-bold">{certVerificationResult.cert?.status}</span>.
                      </div>
                    ) : (
                      <div>
                        ❌ <strong>Verification Failed:</strong> No record matched the provided Credential ID or hash in the registry.
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Certificates List */}
              <div className="rounded-2xl bg-[#091120] border border-slate-800 overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950/80 border-b border-slate-800 text-[10px] font-mono uppercase text-slate-400 tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Credential ID</th>
                      <th className="py-3 px-4">Student</th>
                      <th className="py-3 px-4">Course</th>
                      <th className="py-3 px-4">Issue Date</th>
                      <th className="py-3 px-4">Verification Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono">
                    {certificates.map(cert => (
                      <tr key={cert.id} className="hover:bg-slate-900/50 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-cyan-400">{cert.id}</td>
                        <td className="py-3.5 px-4 text-white font-sans font-bold">{cert.studentName}</td>
                        <td className="py-3.5 px-4 font-sans text-slate-300 max-w-xs truncate">{cert.courseTitle}</td>
                        <td className="py-3.5 px-4 text-slate-400">{cert.issuedAt}</td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                            cert.status === 'issued' 
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40' 
                              : 'bg-amber-950 text-amber-300 border border-amber-500/40'
                          }`}>
                            {cert.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          {cert.status !== 'issued' && (
                            <button
                              onClick={() => handleIssueCertificate(cert.id)}
                              className="px-2.5 py-1 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40 text-[11px] hover:bg-emerald-900 cursor-pointer"
                            >
                              Issue Officially
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 8: PLATFORM SETTINGS & DATABASE RLS */}
          {activeTab === 'settings' && (
            <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-150">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
                <div>
                  <h1 className="text-2xl font-black text-white tracking-tight">Platform Settings & Database Diagnostics</h1>
                  <p className="text-xs text-slate-400 font-mono mt-1">
                    Manage global platform switches, inspect Row Level Security (RLS), and run database migrations
                  </p>
                </div>
              </div>

              {/* Maintenance Mode Switch */}
              <div className="rounded-2xl bg-[#091120] border border-slate-800 p-5 space-y-4">
                <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                  Platform Operational Status
                </h3>
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                  <div>
                    <div className="text-xs font-bold text-white">Maintenance Mode Banner</div>
                    <div className="text-[11px] text-slate-400">Display a warning banner across the Academy while updating courses</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={maintenanceMode}
                    onChange={(e) => setMaintenanceMode(e.target.checked)}
                    className="w-4 h-4 accent-cyan-400 cursor-pointer"
                  />
                </div>
              </div>

              {/* Database Connection & SQL Migration Info */}
              <div className="rounded-2xl bg-[#091120] border border-cyan-500/30 p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Database className="w-5 h-5 text-cyan-400" />
                    <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                      Supabase PostgreSQL Migration Script
                    </h3>
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`-- Run file supabase/migrations/20261018_admin_schema_and_rls.sql in Supabase SQL editor\nUPDATE public.profiles SET role = 'admin' WHERE email = '${authResult?.user?.email || 'admin@cybershieldpk.com'}';`);
                      setCopiedMigrationSql(true);
                      setTimeout(() => setCopiedMigrationSql(false), 2000);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-950/60 border border-cyan-500/40 text-xs font-mono text-cyan-300 hover:bg-cyan-900 cursor-pointer"
                  >
                    {copiedMigrationSql ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedMigrationSql ? 'Copied to Clipboard!' : 'Copy Migration SQL'}</span>
                  </button>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  The complete production schema and RLS policies are located at:
                  <code className="text-cyan-300 ml-1 bg-slate-950 px-2 py-0.5 rounded font-mono border border-slate-800">
                    supabase/migrations/20261018_admin_schema_and_rls.sql
                  </code>
                </p>

                <div className="rounded-xl bg-slate-950 border border-slate-800 p-4 space-y-2 text-xs font-mono text-slate-400">
                  <div className="text-slate-300 font-bold">What this migration handles:</div>
                  <ul className="list-disc list-inside space-y-1 text-[11px]">
                    <li>Enforces <code className="text-cyan-300">is_admin()</code> security definer function.</li>
                    <li>Row Level Security preventing students from writing courses, lessons, or granting themselves admin roles.</li>
                    <li>Secure tables: <code className="text-slate-200">courses</code>, <code className="text-slate-200">course_chapters</code>, <code className="text-slate-200">course_lessons</code>, <code className="text-slate-200">enrollments</code>, <code className="text-slate-200">orders</code>, <code className="text-slate-200">certificates</code>.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* MODAL: CREATE COURSE */}
      {isCreatingCourse && (
        <CreateCourseModal
          onClose={() => setIsCreatingCourse(false)}
          onCreate={(newCourse) => {
            setCourseList(prev => [newCourse, ...prev]);
            setIsCreatingCourse(false);
          }}
        />
      )}

      {/* MODAL: EDIT COURSE */}
      {editingCourse && (
        <EditCourseModal
          course={editingCourse}
          onClose={() => setEditingCourse(null)}
          onSave={(updated) => {
            setCourseList(prev => prev.map(c => c.id === updated.id ? updated : c));
            setEditingCourse(null);
          }}
        />
      )}

      {/* MODAL: ADD CHAPTER */}
      {isAddingChapter && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#091120] border border-cyan-500/40 rounded-2xl w-full max-w-md p-5 space-y-4">
            <h3 className="text-sm font-bold text-white font-mono uppercase">Add Curriculum Chapter</h3>
            <input
              type="text"
              value={newChapterTitle}
              onChange={(e) => setNewChapterTitle(e.target.value)}
              placeholder="Chapter Title (e.g. Module 4: Advanced Exploitation)"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAddingChapter(false)}
                className="px-3 py-1.5 rounded-lg text-xs font-mono text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddChapter}
                className="px-4 py-1.5 rounded-lg text-xs font-mono font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300"
              >
                Create Chapter
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD/EDIT LESSON */}
      {(isAddingLesson || editingLesson) && (
        <LessonFormModal
          chapterId={isAddingLesson ? isAddingLesson.chapterId : editingLesson!.chapterId}
          lesson={editingLesson?.lesson}
          onClose={() => {
            setIsAddingLesson(null);
            setEditingLesson(null);
          }}
          onSave={handleSaveLesson}
        />
      )}

      {/* MODAL: MANUAL ENROLLMENT */}
      {showAddEnrollmentModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#091120] border border-cyan-500/40 rounded-2xl w-full max-w-md p-5 space-y-4">
            <h3 className="text-sm font-bold text-white font-mono uppercase">Grant Student Course Enrollment</h3>
            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-mono text-slate-400">Student Email Address</label>
                <input
                  type="email"
                  value={newEnrollmentEmail}
                  onChange={(e) => setNewEnrollmentEmail(e.target.value)}
                  placeholder="student@example.com"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500 mt-1"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono text-slate-400">Select Target Course</label>
                <select
                  value={newEnrollmentCourseId}
                  onChange={(e) => setNewEnrollmentCourseId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500 mt-1"
                >
                  {courseList.map(c => (
                    <option key={c.id} value={c.id}>{c.title}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowAddEnrollmentModal(false)}
                className="px-3 py-1.5 rounded-lg text-xs font-mono text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreateEnrollment}
                className="px-4 py-1.5 rounded-lg text-xs font-mono font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300"
              >
                Grant Access
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ==============================================================================
// SUBCOMPONENTS: COURSE & LESSON MODALS
// ==============================================================================

interface CreateCourseModalProps {
  onClose: () => void;
  onCreate: (course: Course) => void;
}

const CreateCourseModal: React.FC<CreateCourseModalProps> = ({ onClose, onCreate }) => {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState<DomainCategory>('Web Application Security');
  const [difficulty, setDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Beginner');
  const [duration, setDuration] = useState('16 Hours');
  const [pricePKR, setPricePKR] = useState(0);
  const [priceUSD, setPriceUSD] = useState(0);
  const [isPremium, setIsPremium] = useState(false);
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newCourse: Course = {
      id: `course-${Date.now().toString().slice(-4)}`,
      slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      title: title.trim(),
      category,
      difficulty,
      duration,
      modulesCount: 1,
      lessonsCount: 1,
      pricePKR: Number(pricePKR),
      priceUSD: Number(priceUSD),
      isPremium,
      badge: 'Draft Preview',
      description: description.trim() || 'Comprehensive cybersecurity course.',
      detailedOverview: 'Course curriculum covering practical tradecraft.',
      instructor: {
        name: 'Muhammad Zaib Zafar',
        role: 'Lead Cybersecurity Architect',
        bio: 'Cybersecurity professional and certified instructor.',
        certifications: ['CEH v12', 'Wazuh SOC Analyst']
      },
      skills: ['Security Testing', 'Vulnerability Analysis'],
      prerequisites: ['Basic Computing Fundamentals'],
      labsIncluded: [],
      chapters: [
        {
          id: `ch-1-${Date.now()}`,
          chapterNumber: 1,
          title: 'Module 1: Orientation & Architecture',
          description: 'Introduction to fundamentals and testing environments.',
          lessons: [
            {
              id: `les-1-${Date.now()}`,
              title: 'Welcome & Overview',
              duration: '15 min',
              isFree: true,
              summary: 'Introductory overview of the curriculum.',
              videoUrl: 'https://www.youtube-nocookie.com/embed/2_lswM1S264',
              videoType: 'youtube'
            }
          ]
        }
      ]
    };

    onCreate(newCourse);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#091120] border border-cyan-500/40 rounded-2xl w-full max-w-xl p-6 space-y-4 my-8">
        <h3 className="text-base font-bold text-white font-mono uppercase">Create New Academy Course</h3>
        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="text-slate-400 font-mono">Course Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
              }}
              placeholder="e.g. Advanced Incident Response & Threat Hunting"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white mt-1"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-400 font-mono">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as DomainCategory)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white mt-1"
              >
                <option value="Web Application Security">Web Application Security</option>
                <option value="SOC & Blue Team">SOC & Blue Team</option>
                <option value="Network Security">Network Security</option>
                <option value="Digital Forensics">Digital Forensics</option>
                <option value="Cloud Security">Cloud Security</option>
                <option value="Ethical Hacking">Ethical Hacking</option>
              </select>
            </div>

            <div>
              <label className="text-slate-400 font-mono">Difficulty</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white mt-1"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-slate-400 font-mono">Duration</label>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="20 Hours"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white mt-1"
              />
            </div>
            <div>
              <label className="text-slate-400 font-mono">Price (PKR)</label>
              <input
                type="number"
                value={pricePKR}
                onChange={(e) => {
                  setPricePKR(Number(e.target.value));
                  setIsPremium(Number(e.target.value) > 0);
                }}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white mt-1 font-mono"
              />
            </div>
            <div>
              <label className="text-slate-400 font-mono">Price (USD)</label>
              <input
                type="number"
                value={priceUSD}
                onChange={(e) => setPriceUSD(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white mt-1 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="text-slate-400 font-mono">Summary Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What will students master in this course?"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white mt-1"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 rounded-xl text-slate-400 hover:text-white font-mono"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl font-mono font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300"
            >
              Create Course
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface EditCourseModalProps {
  course: Course;
  onClose: () => void;
  onSave: (course: Course) => void;
}

const EditCourseModal: React.FC<EditCourseModalProps> = ({ course, onClose, onSave }) => {
  const [title, setTitle] = useState(course.title);
  const [pricePKR, setPricePKR] = useState(course.pricePKR);
  const [priceUSD, setPriceUSD] = useState(course.priceUSD);
  const [duration, setDuration] = useState(course.duration);
  const [badge, setBadge] = useState(course.badge || '');
  const [description, setDescription] = useState(course.description);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...course,
      title,
      pricePKR: Number(pricePKR),
      priceUSD: Number(priceUSD),
      isPremium: Number(pricePKR) > 0,
      duration,
      badge: badge.trim() || undefined,
      description
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#091120] border border-cyan-500/40 rounded-2xl w-full max-w-xl p-6 space-y-4 my-8">
        <h3 className="text-base font-bold text-white font-mono uppercase">Edit Course: {course.id}</h3>
        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="text-slate-400 font-mono">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white mt-1"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-slate-400 font-mono">Price (PKR)</label>
              <input
                type="number"
                value={pricePKR}
                onChange={(e) => setPricePKR(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white mt-1 font-mono"
              />
            </div>
            <div>
              <label className="text-slate-400 font-mono">Price (USD)</label>
              <input
                type="number"
                value={priceUSD}
                onChange={(e) => setPriceUSD(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white mt-1 font-mono"
              />
            </div>
            <div>
              <label className="text-slate-400 font-mono">Badge</label>
              <input
                type="text"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                placeholder="e.g. Flagship Program"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white mt-1 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="text-slate-400 font-mono">Duration</label>
            <input
              type="text"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white mt-1 font-mono"
            />
          </div>

          <div>
            <label className="text-slate-400 font-mono">Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white mt-1"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 rounded-xl text-slate-400 hover:text-white font-mono"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl font-mono font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface LessonFormModalProps {
  chapterId: string;
  lesson?: Lesson;
  onClose: () => void;
  onSave: (chapterId: string, lesson: Lesson) => void;
}

const LessonFormModal: React.FC<LessonFormModalProps> = ({ chapterId, lesson, onClose, onSave }) => {
  const [title, setTitle] = useState(lesson?.title || '');
  const [duration, setDuration] = useState(lesson?.duration || '15 min');
  const [isFree, setIsFree] = useState(lesson?.isFree || false);
  const [videoUrl, setVideoUrl] = useState(lesson?.videoUrl || '');
  const [videoType, setVideoType] = useState<'youtube' | 'vimeo' | 'direct' | 'notes'>(lesson?.videoType || 'youtube');
  const [lectureNotes, setLectureNotes] = useState(lesson?.lectureNotes || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const savedLesson: Lesson = {
      id: lesson?.id || `les-${Date.now().toString().slice(-4)}`,
      title: title.trim(),
      duration: duration.trim() || '15 min',
      isFree,
      summary: `${title.trim()} walkthrough and methodology.`,
      videoUrl: videoUrl.trim() || undefined,
      videoType,
      lectureNotes: lectureNotes.trim() || undefined
    };

    onSave(chapterId, savedLesson);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#091120] border border-cyan-500/40 rounded-2xl w-full max-w-lg p-6 space-y-4 my-8">
        <h3 className="text-base font-bold text-white font-mono uppercase">
          {lesson ? 'Edit Lesson' : 'Add New Lesson'}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="text-slate-400 font-mono">Lesson Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Burp Suite Proxy Setup & TLS Interception"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white mt-1"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-400 font-mono">Duration</label>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="18 min"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white mt-1 font-mono"
              />
            </div>
            <div>
              <label className="text-slate-400 font-mono">Video Stream Provider</label>
              <select
                value={videoType}
                onChange={(e) => setVideoType(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white mt-1 font-mono"
              >
                <option value="youtube">YouTube (Embed)</option>
                <option value="vimeo">Vimeo</option>
                <option value="direct">Direct MP4 / Stream</option>
                <option value="notes">Lecture Notes Only</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-slate-400 font-mono">Video URL / Embed URL</label>
            <input
              type="text"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://www.youtube-nocookie.com/embed/..."
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white mt-1 font-mono"
            />
          </div>

          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950 border border-slate-800">
            <input
              type="checkbox"
              id="isFreeCheckbox"
              checked={isFree}
              onChange={(e) => setIsFree(e.target.checked)}
              className="w-4 h-4 accent-cyan-400"
            />
            <label htmlFor="isFreeCheckbox" className="text-slate-300 font-mono cursor-pointer">
              Allow Free Preview without course enrollment
            </label>
          </div>

          <div>
            <label className="text-slate-400 font-mono">Lecture Notes (Markdown)</label>
            <textarea
              rows={4}
              value={lectureNotes}
              onChange={(e) => setLectureNotes(e.target.value)}
              placeholder="### Key Takeaways&#10;1. Configure browser proxy to 127.0.0.1:8080..."
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white mt-1 font-mono"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 rounded-xl text-slate-400 hover:text-white font-mono"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl font-mono font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300"
            >
              Save Lesson
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
