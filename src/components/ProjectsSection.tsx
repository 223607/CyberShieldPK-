import React, { useState } from 'react';
import { 
  Briefcase, 
  ExternalLink, 
  Github, 
  Layers, 
  CheckCircle2, 
  ArrowRight,
  Terminal,
  ShieldCheck,
  Code2
} from 'lucide-react';
import { PROJECTS } from '../data/projects';
import { Project } from '../types';

interface ProjectsSectionProps {
  onSelectProject: (project: Project) => void;
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({
  onSelectProject
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'SOC & SIEM Operations', 'Offensive Security & Automation', 'Malware Analysis & Forensics', 'Threat Intelligence & Honeypots', 'Systems Hardening & DevSecOps', 'Incident Response & Threat Hunting'];

  const filteredProjects = PROJECTS.filter(p => {
    if (selectedCategory === 'All') return true;
    return p.category === selectedCategory;
  });

  return (
    <section id="projects" className="py-20 bg-[#070e1c] border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase tracking-widest mb-2">
              <Briefcase className="w-4 h-4" />
              <span>Real-World Implementation</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Production Cybersecurity Projects
            </h2>
            <p className="mt-2 text-slate-400 text-sm sm:text-base max-w-2xl">
              End-to-end architectures and reproducible projects designed to showcase real defensive engineering, custom automation, and analytical capabilities.
            </p>
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-mono rounded-lg whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/60'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="rounded-2xl bg-[#0a1222] border border-slate-800 hover:border-cyan-500/40 p-6 flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 hover:shadow-xl group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-500/30 uppercase">
                    {project.category}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">
                    {project.difficulty}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors mb-2">
                  {project.title}
                </h3>

                <p className="text-xs text-slate-300 leading-relaxed mb-4 line-clamp-3">
                  {project.tagline}
                </p>

                {/* Tech stack badges */}
                <div className="space-y-1.5 mb-4">
                  <span className="text-[10px] font-mono text-slate-400 uppercase">Core Stack:</span>
                  <div className="flex flex-wrap gap-1">
                    {project.techStack.map((tech, idx) => (
                      <span key={idx} className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-900 text-cyan-300 border border-slate-800">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Key Deliverables */}
                <div className="space-y-1 py-3 px-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
                  <span className="text-[10px] font-mono text-slate-400 uppercase">Architecture Highlights:</span>
                  <p className="text-xs text-slate-300 line-clamp-2">
                    {project.architecture}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-800/80 mt-4 flex items-center justify-between">
                <button
                  onClick={() => onSelectProject(project)}
                  className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-cyan-400 group-hover:text-cyan-300 hover:underline cursor-pointer"
                >
                  <span>Architecture & Setup</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>

                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                    title="View Source on GitHub"
                  >
                    <Github className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
