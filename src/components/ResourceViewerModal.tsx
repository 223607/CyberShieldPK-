import React, { useState } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  Download, 
  FolderDown, 
  FileText,
  ExternalLink,
  Layers
} from 'lucide-react';
import { ResourceItem } from '../types';

interface ResourceViewerModalProps {
  resource: ResourceItem | null;
  onClose: () => void;
}

export const ResourceViewerModal: React.FC<ResourceViewerModalProps> = ({
  resource,
  onClose
}) => {
  if (!resource) return null;

  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (resource.internalDataPreview) {
      navigator.clipboard.writeText(resource.internalDataPreview);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadMarkdown = () => {
    const content = `# ${resource.title}\n\nCategory: ${resource.category}\nFormat: ${resource.format}\n\n${resource.description}\n\n---\n\n${resource.internalDataPreview || ''}`;
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${resource.id}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-[#091120] border border-cyan-500/30 w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30 uppercase">
              {resource.category}
            </span>
            <h3 className="text-base font-bold text-white truncate max-w-md">
              {resource.title}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1">
          <div>
            <h2 className="text-xl font-bold text-white mb-2">{resource.title}</h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {resource.description}
            </p>
          </div>

          <div className="flex items-center justify-between text-xs font-mono text-slate-400 p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span>Format: <strong className="text-cyan-300">{resource.format}</strong></span>
            {resource.badge && <span>Tag: <strong className="text-emerald-400">{resource.badge}</strong></span>}
          </div>

          {resource.internalDataPreview && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-semibold text-slate-300 uppercase tracking-wider">
                  Resource Blueprint / Syntax:
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-mono text-cyan-300 rounded-lg transition-colors cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                  <button
                    onClick={handleDownloadMarkdown}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-cyan-500 hover:bg-cyan-400 text-xs font-mono font-semibold text-slate-950 rounded-lg transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download (.md)</span>
                  </button>
                </div>
              </div>

              <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-cyan-200 overflow-x-auto whitespace-pre-wrap select-text leading-relaxed">
                <code>{resource.internalDataPreview}</code>
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
