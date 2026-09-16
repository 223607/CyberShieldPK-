import React, { useState } from 'react';
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
  AlertCircle
} from 'lucide-react';
import { Course, Lesson } from '../types';

interface CoursePlayerModalProps {
  course: Course | null;
  onClose: () => void;
  onUpgrade: (courseId: string) => void;
  isEnrolled: boolean;
  completedLessonIds: string[];
  onToggleLessonCompletion: (lessonId: string) => void;
  userNotes: { [lessonId: string]: string };
  onSaveNote: (lessonId: string, noteText: string) => void;
}

export const CoursePlayerModal: React.FC<CoursePlayerModalProps> = ({
  course,
  onClose,
  onUpgrade,
  isEnrolled,
  completedLessonIds,
  onToggleLessonCompletion,
  userNotes,
  onSaveNote
}) => {
  if (!course) return null;

  // Find first available lesson
  const allLessons = course.chapters.flatMap(c => c.lessons);
  const firstLesson = allLessons[0];

  const [activeLesson, setActiveLesson] = useState<Lesson>(firstLesson);
  const [activeTab, setActiveTab] = useState<'video' | 'notes' | 'resources'>('video');
  const [currentNote, setCurrentNote] = useState<string>(userNotes[firstLesson?.id] || '');
  const [noteSavedFeedback, setNoteSavedFeedback] = useState(false);
  const [openChapterIds, setOpenChapterIds] = useState<string[]>(course.chapters.map(c => c.id));

  // Determine if active lesson is accessible
  // Rule: first 2 chapters or isFree or isEnrolled
  const isLessonUnlocked = (lesson: Lesson, chapterNumber: number) => {
    if (isEnrolled) return true;
    if (lesson.isFree) return true;
    if (chapterNumber <= 2 && lesson.isFree) return true;
    return false;
  };

  const handleSelectLesson = (lesson: Lesson, chapterNum: number) => {
    setActiveLesson(lesson);
    setCurrentNote(userNotes[lesson.id] || '');
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

  const completedCount = allLessons.filter(l => completedLessonIds.includes(l.id)).length;
  const progressPercent = Math.round((completedCount / allLessons.length) * 100);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-200">
      <div className="bg-[#091120] border border-cyan-500/30 w-full max-w-6xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header Bar */}
        <div className="px-5 py-3.5 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-950/90 text-cyan-300 border border-cyan-500/30 uppercase">
              {course.category}
            </span>
            <h2 className="text-sm sm:text-base font-bold text-white truncate max-w-md sm:max-w-xl">
              {course.title}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {/* Progress indicator */}
            <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-slate-300">
              <span>Progress:</span>
              <div className="w-24 h-2 rounded-full bg-slate-800 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span className="text-cyan-400">{progressPercent}%</span>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Content Layout: Player on Left, Curriculum Sidebar on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-hidden">
          {/* Left Column: Video & Lesson Content */}
          <div className="lg:col-span-8 flex flex-col overflow-y-auto p-4 sm:p-6 border-b lg:border-b-0 lg:border-r border-slate-800">
            {/* Player Container */}
            <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center shadow-lg">
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
                  <div className="p-8 text-center space-y-3">
                    <Video className="w-12 h-12 text-cyan-400 mx-auto opacity-80" />
                    <h4 className="text-base font-semibold text-white">Lecture Notes & Architecture Walkthrough</h4>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto">
                      This lesson utilizes interactive technical documentation and reproducible code blocks provided below.
                    </p>
                  </div>
                )
              ) : (
                /* LOCKED LESSON SCREEN - NEVER THROWS JSON ERROR, CLEAN UPGRADE CTA */
                <div className="p-6 text-center space-y-4 max-w-md">
                  <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
                    <Lock className="w-7 h-7" />
                  </div>
                  <div>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-500/40 uppercase">
                      Premium Chapter Lesson
                    </span>
                    <h4 className="text-lg font-bold text-white mt-2">
                      {activeLesson?.title || 'Locked Lecture Content'}
                    </h4>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      {activeLesson?.summary || 'Enroll in this course or activate a Pro membership to unlock full chapter videos, downloadable slides, and instructor lab solutions.'}
                    </p>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => onUpgrade(course.id)}
                      className="px-6 py-2.5 rounded-xl font-mono text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all cursor-pointer"
                    >
                      Unlock Course Access (PKR {course.pricePKR.toLocaleString()})
                    </button>
                    <p className="text-[11px] text-slate-500 font-mono mt-2">
                      Includes lifetime updates & verification certificate
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Lesson Title & Completion Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 border-b border-slate-800/80">
              <div>
                <span className="text-[11px] font-mono text-cyan-400">
                  Chapter {activeChapterNum} • {activeLesson?.duration}
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-white mt-0.5">
                  {activeLesson?.title}
                </h3>
              </div>

              {isCurrentLessonUnlocked && (
                <button
                  onClick={() => onToggleLessonCompletion(activeLesson.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono transition-all ${
                    completedLessonIds.includes(activeLesson.id)
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50'
                      : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
                  }`}
                >
                  {completedLessonIds.includes(activeLesson.id) ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Completed</span>
                    </>
                  ) : (
                    <>
                      <Circle className="w-4 h-4 text-slate-500" />
                      <span>Mark Complete</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Tabs: Video Details / Lecture Notes / Student Notes */}
            <div className="flex border-b border-slate-800 pt-3 gap-2">
              <button
                onClick={() => setActiveTab('video')}
                className={`px-3 py-2 text-xs font-mono rounded-t-lg transition-colors flex items-center gap-1.5 ${
                  activeTab === 'video'
                    ? 'border-b-2 border-cyan-400 text-cyan-300 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Overview & Instructor</span>
              </button>
              <button
                onClick={() => setActiveTab('notes')}
                className={`px-3 py-2 text-xs font-mono rounded-t-lg transition-colors flex items-center gap-1.5 ${
                  activeTab === 'notes'
                    ? 'border-b-2 border-cyan-400 text-cyan-300 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Lecture Notes</span>
              </button>
              <button
                onClick={() => setActiveTab('resources')}
                className={`px-3 py-2 text-xs font-mono rounded-t-lg transition-colors flex items-center gap-1.5 ${
                  activeTab === 'resources'
                    ? 'border-b-2 border-cyan-400 text-cyan-300 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>My Notes</span>
              </button>
            </div>

            {/* Tab Contents */}
            <div className="py-4 text-xs sm:text-sm text-slate-300 space-y-4">
              {activeTab === 'video' && (
                <div className="space-y-4">
                  <p className="leading-relaxed">
                    {activeLesson?.summary}
                  </p>

                  {/* Instructor Bio Card */}
                  <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-bold flex-shrink-0">
                      MZ
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">{course.instructor.name}</span>
                        <span className="text-[10px] font-mono px-2 py-0.2 bg-cyan-950 text-cyan-300 rounded border border-cyan-500/30">
                          Lead Instructor
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">{course.instructor.role}</p>
                      <p className="text-xs text-slate-300 mt-2">{course.instructor.bio}</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'notes' && (
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs whitespace-pre-wrap leading-relaxed text-slate-200">
                  {activeLesson?.lectureNotes || `# ${activeLesson?.title}\n\nKey Concepts for this lecture:\n- Review target environment parameters\n- Validate authentication and session cookies\n- Document reproducible attack paths`}
                </div>
              )}

              {activeTab === 'resources' && (
                <div className="space-y-3">
                  <p className="text-xs text-slate-400">
                    Add persistent personal study notes for this lesson. Notes are saved to your account profile.
                  </p>
                  <textarea
                    value={currentNote}
                    onChange={(e) => setCurrentNote(e.target.value)}
                    placeholder="Enter your key takeaways, command syntax, or questions..."
                    className="w-full h-32 p-3 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-500 focus:outline-none text-xs font-mono text-slate-200 resize-none"
                  />
                  <div className="flex items-center justify-between">
                    <button
                      onClick={handleSaveNoteAction}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 transition-colors"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Notes</span>
                    </button>
                    {noteSavedFeedback && (
                      <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Saved to profile
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Interactive Curriculum Outline */}
          <div className="lg:col-span-4 bg-slate-950/60 overflow-y-auto flex flex-col p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-mono font-semibold text-white uppercase tracking-wider">
                Curriculum ({course.chapters.length} Chapters)
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                {completedCount}/{allLessons.length} Done
              </span>
            </div>

            {/* Chapters Accordion List */}
            <div className="space-y-2">
              {course.chapters.map((chapter) => {
                const isOpen = openChapterIds.includes(chapter.id);
                return (
                  <div 
                    key={chapter.id}
                    className="rounded-xl border border-slate-800/80 bg-slate-900/40 overflow-hidden"
                  >
                    {/* Chapter Header */}
                    <button
                      onClick={() => toggleChapter(chapter.id)}
                      className="w-full p-3 text-left flex items-center justify-between hover:bg-slate-800/40 transition-colors"
                    >
                      <div>
                        <div className="text-[10px] font-mono text-cyan-400 uppercase">
                          Chapter {chapter.chapterNumber}
                        </div>
                        <div className="text-xs font-semibold text-slate-200 line-clamp-1">
                          {chapter.title}
                        </div>
                      </div>
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      )}
                    </button>

                    {/* Lesson Items */}
                    {isOpen && (
                      <div className="border-t border-slate-800/60 divide-y divide-slate-800/40">
                        {chapter.lessons.map((lesson) => {
                          const unlocked = isLessonUnlocked(lesson, chapter.chapterNumber);
                          const isSelected = activeLesson?.id === lesson.id;
                          const isCompleted = completedLessonIds.includes(lesson.id);

                          return (
                            <button
                              key={lesson.id}
                              onClick={() => handleSelectLesson(lesson, chapter.chapterNumber)}
                              className={`w-full text-left p-2.5 text-xs transition-colors flex items-center justify-between ${
                                isSelected 
                                  ? 'bg-cyan-950/60 text-cyan-300 border-l-2 border-cyan-400' 
                                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
                              }`}
                            >
                              <div className="flex items-center gap-2.5 truncate pr-2">
                                {isCompleted ? (
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                                ) : unlocked ? (
                                  <Play className={`w-3 h-3 flex-shrink-0 ${isSelected ? 'fill-cyan-400 text-cyan-400' : 'text-slate-500'}`} />
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

            {/* Certificate Status Box */}
            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 mt-auto">
              <div className="flex items-center gap-2 text-xs font-mono text-slate-300 mb-1">
                <Award className="w-4 h-4 text-amber-400" />
                <span className="font-semibold text-white">Course Certificate</span>
              </div>
              <p className="text-[11px] text-slate-400">
                {progressPercent === 100 
                  ? 'Congratulations! Complete course requirements verified. Your certificate is active in your dashboard.' 
                  : `Complete all lessons to generate your verifiable cryptographic completion certificate (${progressPercent}% completed).`}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
