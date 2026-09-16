import React, { useState, useEffect } from 'react';
import { 
  X, 
  Play, 
  Lock, 
  CheckCircle2, 
  Circle, 
  FileText, 
  Download, 
  User, 
  Award, 
  BookOpen, 
  Video, 
  HelpCircle, 
  ShieldAlert, 
  Bookmark, 
  Save, 
  ExternalLink,
  Layers,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Sparkles,
  HelpCircle as QuizIcon,
  RefreshCw,
  Check,
  ArrowRight,
  ArrowLeft,
  CreditCard
} from 'lucide-react';
import { Course, Lesson } from '../types';
import { getQuizForCourse, CourseQuiz } from '../data/quizzes';

interface CoursePlayerModalProps {
  course: Course | null;
  onClose: () => void;
  onUpgrade: (courseId: string) => void;
  isEnrolled: boolean;
  completedLessonIds: string[];
  onToggleLessonCompletion: (lessonId: string) => void;
  userNotes: { [lessonId: string]: string };
  onSaveNote: (lessonId: string, noteText: string) => void;
  onGetCertificate?: (course: Course) => void;
  onTriggerFallingStars?: () => void;
  onCompleteAllLessons?: (lessonIds: string[]) => void;
  onResetCourseProgress?: (lessonIds: string[]) => void;
}

export const CoursePlayerModal: React.FC<CoursePlayerModalProps> = ({
  course,
  onClose,
  onUpgrade,
  isEnrolled,
  completedLessonIds,
  onToggleLessonCompletion,
  userNotes,
  onSaveNote,
  onGetCertificate,
  onTriggerFallingStars,
  onCompleteAllLessons,
  onResetCourseProgress
}) => {
  if (!course) return null;

  // Find all lessons and first lesson
  const allLessons = course.chapters.flatMap(c => c.lessons);
  const firstLesson = allLessons[0];

  const [activeLesson, setActiveLesson] = useState<Lesson>(firstLesson);
  const [activeTab, setActiveTab] = useState<'video' | 'notes' | 'resources' | 'quiz'>('video');
  const [currentNote, setCurrentNote] = useState<string>(userNotes[firstLesson?.id] || '');
  const [noteSavedFeedback, setNoteSavedFeedback] = useState(false);
  const [openChapterIds, setOpenChapterIds] = useState<string[]>(course.chapters.map(c => c.id));

  // Quiz state
  const courseQuiz: CourseQuiz = getQuizForCourse(course.id);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<number>(0);
  const [quizPassed, setQuizPassed] = useState<boolean>(() => {
    try {
      return localStorage.getItem(`cybershield_quiz_${course.id}`) === 'passed';
    } catch {
      return false;
    }
  });

  const completedCount = allLessons.filter(l => completedLessonIds.includes(l.id)).length;
  const progressPercent = Math.round((completedCount / allLessons.length) * 100);

  // Auto-switch to quiz tab when all lessons are completed if quiz not yet passed
  useEffect(() => {
    if (progressPercent === 100 && !quizPassed) {
      // Prompt quiz
    }
  }, [progressPercent, quizPassed]);

  // Determine if active lesson is accessible
  const isLessonUnlocked = (lesson: Lesson, chapterNumber: number) => {
    if (isEnrolled) return true;
    if (lesson.isFree) return true;
    if (chapterNumber <= 2 && lesson.isFree) return true;
    return false;
  };

  const handleSelectLesson = (lesson: Lesson) => {
    setActiveLesson(lesson);
    setCurrentNote(userNotes[lesson.id] || '');
    if (activeTab === 'quiz' && progressPercent < 100) {
      setActiveTab('video');
    }
  };

  const handleSaveNoteAction = () => {
    if (activeLesson) {
      onSaveNote(activeLesson.id, currentNote);
      setNoteSavedFeedback(true);
      setTimeout(() => setNoteSavedFeedback(false), 2000);
    }
  };

  const toggleChapter = (chapterId: string) => {
    if (openChapterIds.includes(chapterId)) {
      setOpenChapterIds(openChapterIds.filter(id => id !== chapterId));
    } else {
      setOpenChapterIds([...openChapterIds, chapterId]);
    }
  };

  const activeChapter = course.chapters.find(c => c.lessons.some(l => l.id === activeLesson?.id));
  const activeChapterNum = activeChapter ? activeChapter.chapterNumber : 1;
  const isCurrentLessonUnlocked = isLessonUnlocked(activeLesson, activeChapterNum);

  const currentLessonIndex = allLessons.findIndex(l => l.id === activeLesson?.id);
  const prevLesson = currentLessonIndex > 0 ? allLessons[currentLessonIndex - 1] : null;
  const nextLesson = currentLessonIndex >= 0 && currentLessonIndex < allLessons.length - 1 ? allLessons[currentLessonIndex + 1] : null;

  const handleCompleteAndAdvance = (targetLesson: Lesson) => {
    // 1. Mark current lesson completed if not already
    if (!completedLessonIds.includes(targetLesson.id)) {
      onToggleLessonCompletion(targetLesson.id);
    }

    // 2. Trigger one-time falling stars celebration!
    onTriggerFallingStars?.();

    // 3. Move automatically towards next session of course
    const currIdx = allLessons.findIndex(l => l.id === targetLesson.id);
    if (currIdx < allLessons.length - 1) {
      const next = allLessons[currIdx + 1];
      setTimeout(() => {
        setActiveLesson(next);
        setCurrentNote(userNotes[next.id] || '');
        if (activeTab === 'quiz') setActiveTab('video');
        const parentChap = course.chapters.find(c => c.lessons.some(l => l.id === next.id));
        if (parentChap && !openChapterIds.includes(parentChap.id)) {
          setOpenChapterIds(prev => [...prev, parentChap.id]);
        }
      }, 700);
    } else {
      // Last lecture reached! Transition smoothly to final exam
      setTimeout(() => {
        setActiveTab('quiz');
      }, 700);
    }
  };

  // Quiz Answer Selection
  const handleSelectAnswer = (questionId: string, optionIdx: number) => {
    if (quizSubmitted && quizPassed) return;
    setQuizAnswers(prev => ({ ...prev, [questionId]: optionIdx }));
  };

  const handleSubmitQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    let correctCount = 0;
    courseQuiz.questions.forEach(q => {
      if (quizAnswers[q.id] === q.correctIndex) {
        correctCount++;
      }
    });

    const scorePct = Math.round((correctCount / courseQuiz.questions.length) * 100);
    setQuizScore(scorePct);
    setQuizSubmitted(true);

    if (scorePct >= courseQuiz.passingScorePercent) {
      setQuizPassed(true);
      try {
        localStorage.setItem(`cybershield_quiz_${course.id}`, 'passed');
      } catch {
        // ignore
      }
      // AUTOMATIC FALLING STARS CELEBRATION
      onTriggerFallingStars?.();
    }
  };

  const handleResetQuiz = () => {
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizScore(0);
  };

  const canClaimCertificate = progressPercent === 100 && quizPassed;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-3 md:p-4 animate-in fade-in duration-200">
      {/* Container constrained to 92vh and max 860px to fit standard laptop screens comfortably */}
      <div className="bg-[#091120] border border-cyan-500/30 w-full max-w-6xl rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[92vh] max-h-[860px]">
        
        {/* Header Bar */}
        <div className="px-4 sm:px-6 py-3 bg-slate-950/95 border-b border-slate-800 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3 truncate mr-2">
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-cyan-950/90 text-cyan-300 border border-cyan-500/30 uppercase flex-shrink-0">
              {course.category}
            </span>
            <h2 className="text-xs sm:text-sm md:text-base font-bold text-white truncate">
              {course.title}
            </h2>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {/* Progress indicator */}
            <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-slate-300">
              <span>Progress:</span>
              <div className="w-20 md:w-28 h-2 rounded-full bg-slate-800 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span className={progressPercent === 100 ? "text-emerald-400 font-bold" : "text-cyan-400"}>
                {progressPercent}%
              </span>
            </div>

            {/* Quick Get Certificate CTA when Lessons 100% and Quiz Passed */}
            {canClaimCertificate && onGetCertificate && (
              <button
                onClick={() => {
                  onTriggerFallingStars?.();
                  onGetCertificate(course);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-yellow-300 hover:from-amber-300 hover:to-yellow-200 transition-all shadow-[0_0_15px_rgba(245,158,11,0.4)] animate-pulse cursor-pointer"
                title="View your official completion certificate"
              >
                <Award className="w-3.5 h-3.5" />
                <span>Get Certificate 🎓</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Content Layout: Player on Left, Curriculum Sidebar on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 min-h-0 overflow-hidden">
          
          {/* Left Column: Video & Tabs */}
          <div className="lg:col-span-8 flex flex-col h-full min-h-0 border-b lg:border-b-0 lg:border-r border-slate-800 overflow-y-auto p-3 sm:p-5">
            
            {/* Final Exam Prompt Banner when 100% lessons complete */}
            {progressPercent === 100 && !quizPassed && (
              <div className="mb-3 p-3 rounded-xl bg-gradient-to-r from-cyan-950/80 via-slate-900 to-cyan-950/80 border border-cyan-500/50 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 flex-shrink-0">
                    <QuizIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-cyan-300 font-mono">
                      Curriculum Finished! Final Step: Certification Exam
                    </div>
                    <p className="text-[11px] text-slate-300">
                      Score {courseQuiz.passingScorePercent}%+ to verify competencies and automatically unlock your credential.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab('quiz')}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-sky-400 hover:from-cyan-300 transition-all flex items-center gap-1 cursor-pointer flex-shrink-0"
                >
                  <span>Take Final Quiz</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Celebratory Banner when Quiz is Passed */}
            {canClaimCertificate && (
              <div className="mb-3 p-3 rounded-xl bg-gradient-to-r from-amber-950/80 via-slate-900 to-amber-950/80 border border-amber-500/60 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg animate-in fade-in duration-300">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 flex-shrink-0">
                    <Award className="w-5 h-5 animate-bounce" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-amber-300 font-mono">
                      🎉 Course & Final Examination Passed!
                    </div>
                    <p className="text-[11px] text-slate-300">
                      Your verifiable cryptographic certificate signed by Muhammad Zaib Zafar is ready.
                    </p>
                  </div>
                </div>

                {onGetCertificate && (
                  <button
                    onClick={() => {
                      onTriggerFallingStars?.();
                      onGetCertificate(course);
                    }}
                    className="px-4 py-1.5 rounded-lg text-xs font-mono font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-yellow-300 hover:from-amber-300 transition-all shadow-[0_0_15px_rgba(245,158,11,0.3)] flex items-center gap-1.5 cursor-pointer flex-shrink-0"
                  >
                    <Award className="w-3.5 h-3.5" />
                    <span>Get Certificate 🎓</span>
                  </button>
                )}
              </div>
            )}

            {/* Video Container (Responsive Height for Laptops) */}
            <div className="relative w-full aspect-video max-h-[34vh] sm:max-h-[300px] lg:max-h-[330px] rounded-xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center shadow-lg flex-shrink-0 mx-auto">
              {isCurrentLessonUnlocked ? (
                activeLesson?.videoUrl ? (
                  <iframe
                    src={activeLesson.videoUrl}
                    title={activeLesson.title}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <div className="p-6 text-center space-y-2">
                    <Video className="w-10 h-10 text-cyan-400 mx-auto opacity-75" />
                    <p className="text-xs font-mono text-slate-300">
                      Interactive Lecture Terminal: {activeLesson?.title}
                    </p>
                    <span className="inline-block px-2.5 py-0.5 rounded bg-cyan-950 text-cyan-400 text-[10px] font-mono border border-cyan-500/30">
                      Duration: {activeLesson?.duration}
                    </span>
                  </div>
                )
              ) : (
                <div className="p-6 text-center space-y-3 max-w-sm">
                  <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Full Course Access Required</h4>
                    <p className="text-xs text-slate-400 mt-1">
                      This advanced lesson is available with lifetime enrollment.
                    </p>
                  </div>
                  <button
                    onClick={() => onUpgrade(course.id)}
                    className="px-5 py-2.5 rounded-xl text-xs font-mono font-bold text-slate-950 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-300 hover:from-amber-300 transition-all cursor-pointer shadow-lg flex items-center justify-center gap-2 mx-auto"
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>Pay & Unlock Course (PKR {course.pricePKR.toLocaleString()})</span>
                  </button>
                </div>
              )}
            </div>

            {/* Lesson Title & Completion Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-3 border-b border-slate-800/80 flex-shrink-0">
              <div className="truncate">
                <span className="text-[10px] font-mono text-cyan-400">
                  Chapter {activeChapterNum} • {activeLesson?.duration}
                </span>
                <h3 className="text-sm sm:text-base font-bold text-white truncate">
                  {activeLesson?.title}
                </h3>
              </div>

              {isCurrentLessonUnlocked && (
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleCompleteAndAdvance(activeLesson)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-md"
                    title="Mark complete, show stars shower, and advance to next lesson"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>
                      {nextLesson ? 'Complete & Next Lesson →' : 'Complete & Take Final Exam →'}
                    </span>
                  </button>

                  <button
                    onClick={() => onToggleLessonCompletion(activeLesson.id)}
                    className={`p-1.5 rounded-xl text-xs font-mono transition-all cursor-pointer border ${
                      completedLessonIds.includes(activeLesson.id)
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50'
                        : 'bg-slate-900 text-slate-400 hover:text-white border-slate-800'
                    }`}
                    title={completedLessonIds.includes(activeLesson.id) ? 'Marked complete' : 'Mark without advancing'}
                  >
                    {completedLessonIds.includes(activeLesson.id) ? '✓ Done' : 'Mark'}
                  </button>
                </div>
              )}
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-slate-800 pt-2 gap-2 flex-shrink-0">
              <button
                onClick={() => setActiveTab('video')}
                className={`px-3 py-1.5 text-xs font-mono rounded-t-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'video'
                    ? 'border-b-2 border-cyan-400 text-cyan-300 font-semibold bg-slate-900/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Overview</span>
              </button>

              <button
                onClick={() => setActiveTab('notes')}
                className={`px-3 py-1.5 text-xs font-mono rounded-t-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'notes'
                    ? 'border-b-2 border-cyan-400 text-cyan-300 font-semibold bg-slate-900/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Lecture Notes</span>
              </button>

              <button
                onClick={() => setActiveTab('resources')}
                className={`px-3 py-1.5 text-xs font-mono rounded-t-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'resources'
                    ? 'border-b-2 border-cyan-400 text-cyan-300 font-semibold bg-slate-900/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>My Notes</span>
              </button>

              <button
                onClick={() => setActiveTab('quiz')}
                className={`px-3 py-1.5 text-xs font-mono rounded-t-lg transition-colors flex items-center gap-1.5 cursor-pointer relative ${
                  activeTab === 'quiz'
                    ? 'border-b-2 border-amber-400 text-amber-300 font-semibold bg-slate-900/40'
                    : 'text-slate-400 hover:text-amber-200'
                }`}
              >
                <QuizIcon className="w-3.5 h-3.5 text-amber-400" />
                <span>Final Exam 📝</span>
                {progressPercent === 100 && !quizPassed && (
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping absolute -top-0.5 -right-0.5" />
                )}
              </button>
            </div>

            {/* Tab Contents: Scrollable */}
            <div className="pt-3 text-xs sm:text-sm text-slate-300 flex-1">
              
              {/* TAB 1: OVERVIEW */}
              {activeTab === 'video' && (
                <div className="space-y-3">
                  <p className="leading-relaxed text-xs sm:text-sm text-slate-300">
                    {activeLesson?.summary}
                  </p>

                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-start gap-3">
                    <div className="w-9 h-9 rounded-full bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-bold text-xs flex-shrink-0">
                      MZ
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-xs">{course.instructor.name}</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 bg-cyan-950 text-cyan-300 rounded border border-cyan-500/30">
                          Lead Instructor
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">{course.instructor.title}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: LECTURE NOTES */}
              {activeTab === 'notes' && (
                <div className="space-y-3">
                  <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
                    <h4 className="text-xs font-mono font-bold text-cyan-400 mb-1">
                      Key Technical Takeaways:
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {activeLesson?.summary}
                    </p>
                  </div>
                </div>
              )}

              {/* TAB 3: MY NOTES */}
              {activeTab === 'resources' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                    <span>Personal Technical Logbook</span>
                    {noteSavedFeedback && (
                      <span className="text-emerald-400 font-bold animate-pulse">
                        Saved to browser storage ✓
                      </span>
                    )}
                  </div>
                  <textarea
                    rows={4}
                    value={currentNote}
                    onChange={(e) => setCurrentNote(e.target.value)}
                    placeholder="Document specific payload syntax, tool flags, or conceptual notes here..."
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
                  />
                  <button
                    onClick={handleSaveNoteAction}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-xs font-semibold bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-colors cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Note</span>
                  </button>
                </div>
              )}

              {/* TAB 4: FINAL CERTIFICATION QUIZ */}
              {activeTab === 'quiz' && (
                <div className="space-y-4">
                  {/* Quiz Header & Status */}
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-amber-400" />
                        <h4 className="text-xs sm:text-sm font-bold text-white font-mono">
                          {courseQuiz.title}
                        </h4>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {courseQuiz.questions.length} Scenario Questions • Passing Requirement: {courseQuiz.passingScorePercent}%
                      </p>
                    </div>

                    {quizSubmitted && (
                      <div className={`px-3 py-1 rounded-lg text-xs font-mono font-bold border flex items-center gap-1.5 ${
                        quizPassed
                          ? 'bg-emerald-950 text-emerald-300 border-emerald-500/50'
                          : 'bg-rose-950 text-rose-300 border-rose-500/50'
                      }`}>
                        {quizPassed ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            <span>PASSED ({quizScore}%)</span>
                          </>
                        ) : (
                          <>
                            <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                            <span>SCORE: {quizScore}% (Retry Needed)</span>
                          </>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Pass Banner & Claim Action */}
                  {quizPassed && (
                    <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/80 via-slate-900 to-amber-950/80 border border-amber-500/60 text-center space-y-2 animate-in fade-in duration-300">
                      <div className="text-sm font-bold text-amber-300 font-mono">
                        🎉 Examination Complete & Verified!
                      </div>
                      <p className="text-xs text-slate-300 max-w-lg mx-auto">
                        You demonstrated practical mastery of the required security competencies. Your official certificate is generated and ready to download.
                      </p>
                      {onGetCertificate && (
                        <button
                          onClick={() => {
                            onTriggerFallingStars?.();
                            onGetCertificate(course);
                          }}
                          className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-mono font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-yellow-300 hover:from-amber-300 transition-all shadow-[0_0_20px_rgba(245,158,11,0.4)] cursor-pointer mt-1"
                        >
                          <Award className="w-4 h-4" />
                          <span>View & Download Certificate 🎓</span>
                        </button>
                      )}
                    </div>
                  )}

                  {/* Question List Form */}
                  <form onSubmit={handleSubmitQuiz} className="space-y-4">
                    {courseQuiz.questions.map((q, qIndex) => {
                      const selectedIdx = quizAnswers[q.id];
                      const isAnswered = selectedIdx !== undefined;
                      const isCorrect = selectedIdx === q.correctIndex;

                      return (
                        <div
                          key={q.id}
                          className={`p-4 rounded-xl border transition-all ${
                            quizSubmitted
                              ? isCorrect
                                ? 'bg-emerald-950/20 border-emerald-500/40'
                                : 'bg-rose-950/20 border-rose-500/40'
                              : 'bg-slate-950/60 border-slate-800'
                          }`}
                        >
                          <div className="flex items-start gap-2 mb-3">
                            <span className="w-5 h-5 rounded bg-slate-900 text-cyan-400 font-mono text-xs font-bold flex items-center justify-center flex-shrink-0 border border-slate-800">
                              {qIndex + 1}
                            </span>
                            <h5 className="text-xs sm:text-sm font-semibold text-white leading-snug">
                              {q.question}
                            </h5>
                          </div>

                          <div className="space-y-2 pl-7">
                            {q.options.map((opt, optIndex) => {
                              const isThisSelected = selectedIdx === optIndex;
                              const isThisCorrect = q.correctIndex === optIndex;

                              let optStyle = 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700';
                              if (quizSubmitted) {
                                if (isThisCorrect) {
                                  optStyle = 'bg-emerald-950/80 border-emerald-500/60 text-emerald-200 font-semibold';
                                } else if (isThisSelected && !isThisCorrect) {
                                  optStyle = 'bg-rose-950/80 border-rose-500/60 text-rose-200';
                                }
                              } else if (isThisSelected) {
                                optStyle = 'bg-cyan-950/80 border-cyan-400 text-cyan-200 font-semibold shadow-sm';
                              }

                              return (
                                <button
                                  type="button"
                                  key={optIndex}
                                  onClick={() => handleSelectAnswer(q.id, optIndex)}
                                  disabled={quizSubmitted && quizPassed}
                                  className={`w-full text-left p-2.5 rounded-lg border text-xs font-mono transition-all flex items-center justify-between gap-2 cursor-pointer ${optStyle}`}
                                >
                                  <span>{opt}</span>
                                  {quizSubmitted && isThisCorrect && (
                                    <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                                  )}
                                </button>
                              );
                            })}
                          </div>

                          {quizSubmitted && (
                            <div className="mt-3 pl-7 pt-2 border-t border-slate-800/80 text-[11px] font-mono">
                              <span className="text-cyan-400 font-bold">Explanation: </span>
                              <span className="text-slate-300">{q.explanation}</span>
                            </div>
                          )}
                        </div>
                      );
                    })}

                    <div className="flex items-center justify-between pt-2">
                      <button
                        type="button"
                        onClick={handleResetQuiz}
                        className="px-3 py-2 rounded-lg text-xs font-mono text-slate-400 hover:text-white bg-slate-900 border border-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Reset Answers</span>
                      </button>

                      {(!quizSubmitted || !quizPassed) && (
                        <button
                          type="submit"
                          className="px-5 py-2 rounded-xl text-xs font-mono font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-yellow-300 hover:from-amber-300 transition-all cursor-pointer shadow-md"
                        >
                          Submit & Verify Exam
                        </button>
                      )}
                    </div>
                  </form>
                </div>
              )}

            </div>

            {/* Beginner-Friendly Session Navigator Footer */}
            {isCurrentLessonUnlocked && (
              <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2 text-xs font-mono flex-shrink-0 bg-slate-950/60 p-2.5 rounded-xl">
                <button
                  type="button"
                  disabled={!prevLesson}
                  onClick={() => {
                    if (prevLesson) {
                      setActiveLesson(prevLesson);
                      setCurrentNote(userNotes[prevLesson.id] || '');
                      if (activeTab === 'quiz') setActiveTab('video');
                      const parentChap = course.chapters.find(c => c.lessons.some(l => l.id === prevLesson.id));
                      if (parentChap && !openChapterIds.includes(parentChap.id)) {
                        setOpenChapterIds(prev => [...prev, parentChap.id]);
                      }
                    }
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                    prevLesson
                      ? 'bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 cursor-pointer'
                      : 'bg-slate-950 text-slate-600 border border-slate-900 cursor-not-allowed'
                  }`}
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Previous Lesson</span>
                  <span className="sm:hidden">Prev</span>
                </button>

                <div className="text-center px-2">
                  <span className="text-[11px] text-cyan-300 font-bold block">
                    Lesson {currentLessonIndex + 1} of {allLessons.length}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    Chapter {activeChapterNum}
                  </span>
                </div>

                {nextLesson ? (
                  <button
                    type="button"
                    onClick={() => handleCompleteAndAdvance(activeLesson)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-cyan-400 to-sky-400 hover:from-cyan-300 hover:to-sky-300 text-slate-950 font-bold transition-all cursor-pointer shadow-md"
                    title="Mark done, celebrate with stars, and load next session"
                  >
                    <span className="hidden sm:inline">Complete & Next Session</span>
                    <span className="sm:hidden">Next</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleCompleteAndAdvance(activeLesson)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-400 to-yellow-300 hover:from-amber-300 hover:to-yellow-200 text-slate-950 font-bold transition-all cursor-pointer shadow-md"
                    title="Mark done, celebrate with stars, and open final exam"
                  >
                    <span>Final Exam 📝</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Right Column: Curriculum Outline & Certificate Verification */}
          <div className="lg:col-span-4 flex flex-col h-full min-h-0 bg-slate-950/40 p-3 sm:p-4 overflow-y-auto border-t lg:border-t-0">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-3 flex-shrink-0">
              <span className="text-xs font-mono font-semibold text-slate-300 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                <span>Curriculum Modules</span>
              </span>
              <span className="text-[11px] font-mono text-slate-500">
                {completedCount} of {allLessons.length} done
              </span>
            </div>

            {/* Chapters Accordion */}
            <div className="space-y-2 mb-4 flex-1">
              {course.chapters.map((chapter) => {
                const isOpen = openChapterIds.includes(chapter.id);
                return (
                  <div 
                    key={chapter.id} 
                    className="border border-slate-800/80 rounded-xl overflow-hidden bg-slate-900/40"
                  >
                    <button
                      onClick={() => toggleChapter(chapter.id)}
                      className="w-full px-3 py-2 bg-slate-950/60 flex items-center justify-between text-left hover:bg-slate-900/60 transition-colors"
                    >
                      <div className="truncate pr-2">
                        <span className="text-[10px] font-mono text-cyan-400 uppercase">
                          Chapter {chapter.chapterNumber}
                        </span>
                        <h4 className="text-xs font-bold text-white truncate">
                          {chapter.title}
                        </h4>
                      </div>
                      {isOpen ? (
                        <ChevronUp className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      )}
                    </button>

                    {isOpen && (
                      <div className="divide-y divide-slate-800/50">
                        {chapter.lessons.map((lesson) => {
                          const isUnlocked = isLessonUnlocked(lesson, chapter.chapterNumber);
                          const isCurrent = activeLesson?.id === lesson.id;
                          const isDone = completedLessonIds.includes(lesson.id);

                          return (
                            <button
                              key={lesson.id}
                              onClick={() => handleSelectLesson(lesson)}
                              className={`w-full px-3 py-2 flex items-center justify-between text-left text-xs transition-colors cursor-pointer ${
                                isCurrent
                                  ? 'bg-cyan-950/50 text-cyan-300 font-semibold'
                                  : 'text-slate-300 hover:bg-slate-900/80'
                              }`}
                            >
                              <div className="flex items-center gap-2 truncate pr-2">
                                {isDone ? (
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                                ) : isUnlocked ? (
                                  <Play className="w-3 h-3 text-slate-400 flex-shrink-0" />
                                ) : (
                                  <Lock className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                                )}
                                <span className="truncate">{lesson.title}</span>
                              </div>

                              <div className="flex items-center gap-1.5 text-[10px] font-mono flex-shrink-0">
                                {lesson.isFree && (
                                  <span className="px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                                    FREE
                                  </span>
                                )}
                                <span className="text-slate-500">{lesson.duration}</span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Certificate Status & Exam Card */}
            <div className={`p-3.5 rounded-xl border mt-auto transition-all flex-shrink-0 ${
              canClaimCertificate
                ? 'bg-gradient-to-b from-amber-950/70 via-slate-900 to-amber-950/50 border-amber-500/60 shadow-[0_0_20px_rgba(245,158,11,0.2)]'
                : 'bg-slate-900/90 border-slate-800'
            }`}>
              <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                <div className="flex items-center gap-1.5">
                  <Award className={`w-4 h-4 ${canClaimCertificate ? 'text-amber-400 animate-pulse' : 'text-slate-400'}`} />
                  <span className="font-semibold text-white">Course Certificate</span>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  canClaimCertificate
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40' 
                    : progressPercent === 100
                    ? 'bg-amber-950 text-amber-300 border border-amber-500/40'
                    : 'bg-slate-800 text-cyan-400'
                }`}>
                  {canClaimCertificate ? 'READY' : progressPercent === 100 ? 'EXAM PENDING' : `${progressPercent}%`}
                </span>
              </div>

              <p className="text-[11px] text-slate-300 leading-relaxed mb-2.5">
                {canClaimCertificate
                  ? 'Requirements verified! Your credential signed by Muhammad Zaib Zafar is available.'
                  : progressPercent === 100
                  ? 'All lessons done. Take and pass the Final Exam in the Exam tab to claim certificate.'
                  : `Complete all ${allLessons.length} lessons and pass the final exam to unlock your certificate.`}
              </p>

              {canClaimCertificate ? (
                <button
                  onClick={() => {
                    onTriggerFallingStars?.();
                    onGetCertificate?.(course);
                  }}
                  className="w-full py-2 px-3 rounded-xl text-xs font-mono font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-yellow-300 hover:from-amber-300 transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer animate-pulse"
                >
                  <Award className="w-4 h-4" />
                  <span>Claim & View Certificate 🎓</span>
                </button>
              ) : progressPercent === 100 ? (
                <button
                  onClick={() => setActiveTab('quiz')}
                  className="w-full py-2 px-3 rounded-xl text-xs font-mono font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-sky-400 hover:from-cyan-300 transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <QuizIcon className="w-3.5 h-3.5" />
                  <span>Take Certification Exam 📝</span>
                </button>
              ) : (
                <div className="space-y-1.5">
                  {onCompleteAllLessons && (
                    <button
                      onClick={() => {
                        const allIds = allLessons.map(l => l.id);
                        onCompleteAllLessons(allIds);
                        setActiveTab('quiz');
                      }}
                      className="w-full py-1.5 px-2.5 rounded-lg text-[11px] font-mono text-cyan-300 bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-500/40 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                      title="Quickly complete all lessons to test final exam & certificate"
                    >
                      <span>⚡ Mark All Lessons Done (Test Exam)</span>
                    </button>
                  )}
                </div>
              )}

              {onResetCourseProgress && progressPercent > 0 && (
                <button
                  onClick={() => {
                    onResetCourseProgress(allLessons.map(l => l.id));
                    setQuizSubmitted(false);
                    setQuizPassed(false);
                    try {
                      localStorage.removeItem(`cybershield_quiz_${course.id}`);
                    } catch {
                      // ignore
                    }
                  }}
                  className="w-full text-center text-[10px] font-mono text-slate-500 hover:text-slate-400 pt-1.5 transition-colors cursor-pointer"
                >
                  Reset Progress (Test Again)
                </button>
              )}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
