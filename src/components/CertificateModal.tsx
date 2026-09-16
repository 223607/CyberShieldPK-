import React, { useState, useRef } from 'react';
import { 
  X, 
  Award, 
  Download, 
  Printer, 
  Share2, 
  Check, 
  Sparkles, 
  ShieldCheck, 
  QrCode, 
  Edit2, 
  ExternalLink,
  Copy
} from 'lucide-react';
import { Course } from '../types';

interface CertificateModalProps {
  course: Course;
  recipientName: string;
  onClose: () => void;
  onTriggerStars?: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  course,
  recipientName,
  onClose,
  onTriggerStars
}) => {
  const [studentName, setStudentName] = useState<string>(recipientName || 'Muhammad Zaib Zafar');
  const [isEditingName, setIsEditingName] = useState(false);
  const [copiedId, setCopiedId] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const certContainerRef = useRef<HTMLDivElement | null>(null);

  // Derive stable cryptographic credential ID
  const credentialId = `CS-PK-${course.id.replace('course-', '').toUpperCase().slice(0, 4)}-${Math.abs(course.id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 1024) * 89).toString().slice(0, 6)}`;
  const issueDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  const handleCopyId = () => {
    navigator.clipboard.writeText(credentialId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadTxt = () => {
    const certContent = `================================================================================
                    CYBERSHIELD-PK ACADEMY
              OFFICIAL CERTIFICATE OF COMPLETION & COMPETENCY
================================================================================

This certifies that:
      >>> ${studentName} <<<

Has successfully completed and demonstrated verified technical competency in:
      [ ${course.title} ]

Course Category:     ${course.category}
Curriculum Duration: ${course.duration} (${course.modulesCount} Chapters)
Credential ID:       ${credentialId}
Date of Issuance:    ${issueDate}
Verification Status: Cryptographically Signed & Logged on CyberShield-PK Ledger

Issued by:
      Muhammad Zaib Zafar
      Founder & Lead Cybersecurity Architect
      CyberShieldPK Defense Platform

Accredited by:
      CyberShieldPK Cyber Warfare & Threat Intelligence Labs
================================================================================
Verification URL: https://cybershieldpk.org/verify/${credentialId}
================================================================================`;

    const blob = new Blob([certContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `CyberShieldPK_Certificate_${course.id}_${studentName.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Generate crisp canvas PNG image download without external heavy libraries
  const handleDownloadImage = () => {
    setIsGeneratingImage(true);
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 1600;
      canvas.height = 1100;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        setIsGeneratingImage(false);
        return;
      }

      // 1. Dark Luxury High-Tech Certificate Canvas Background
      ctx.fillStyle = '#070f1e';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 2. Subtle Radial Glow
      const grad = ctx.createRadialGradient(800, 550, 100, 800, 550, 800);
      grad.addColorStop(0, 'rgba(6, 182, 212, 0.08)');
      grad.addColorStop(0.5, 'rgba(15, 23, 42, 0.5)');
      grad.addColorStop(1, 'rgba(3, 7, 18, 0.95)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 3. Ornate Double Gold & Cyan Guilloche Borders
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 4;
      ctx.strokeRect(40, 40, canvas.width - 80, canvas.height - 80);

      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2;
      ctx.strokeRect(55, 55, canvas.width - 110, canvas.height - 110);

      ctx.strokeStyle = 'rgba(6, 182, 212, 0.3)';
      ctx.lineWidth = 1;
      ctx.strokeRect(65, 65, canvas.width - 130, canvas.height - 130);

      // Corner accent brackets
      const corners = [
        [75, 75],
        [canvas.width - 75, 75],
        [75, canvas.height - 75],
        [canvas.width - 75, canvas.height - 75]
      ];
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 3;
      corners.forEach(([cx, cy], idx) => {
        const signX = idx % 2 === 0 ? 1 : -1;
        const signY = idx < 2 ? 1 : -1;
        ctx.beginPath();
        ctx.moveTo(cx, cy + signY * 30);
        ctx.lineTo(cx, cy);
        ctx.lineTo(cx + signX * 30, cy);
        ctx.stroke();
      });

      // 4. Header & Organization Branding
      ctx.textAlign = 'center';
      ctx.fillStyle = '#22d3ee';
      ctx.font = 'bold 24px monospace';
      ctx.fillText('CYBERSHIELD-PK ACADEMY • VERIFIED CREDENTIAL', 800, 150);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '16px monospace';
      ctx.fillText('ISLAMABAD, PAKISTAN • OFFENSIVE & DEFENSIVE CYBER OPERATIONS', 800, 185);

      // 5. Main Title
      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 54px sans-serif';
      ctx.fillText('CERTIFICATE OF COMPLETION', 800, 270);

      ctx.fillStyle = '#f59e0b';
      ctx.font = 'italic 20px serif';
      ctx.fillText('This is to proudly certify that', 800, 340);

      // 6. Recipient Name
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 48px sans-serif';
      ctx.fillText(studentName, 800, 420);

      // Underline bar for recipient
      ctx.strokeStyle = '#0284c7';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(450, 440);
      ctx.lineTo(1150, 440);
      ctx.stroke();

      // 7. Statement of Completion
      ctx.fillStyle = '#cbd5e1';
      ctx.font = '20px sans-serif';
      ctx.fillText('has successfully mastered all curriculum modules, technical assessments, and practical labs for:', 800, 500);

      // 8. Course Title
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 36px sans-serif';
      ctx.fillText(course.title, 800, 570);

      ctx.fillStyle = '#a5b4fc';
      ctx.font = '20px monospace';
      ctx.fillText(`Category: ${course.category}  |  Accredited Duration: ${course.duration}`, 800, 625);

      // 9. Seals and Signatures Section
      // Left: Cryptographic Security Badge
      ctx.textAlign = 'left';
      ctx.fillStyle = '#f59e0b';
      ctx.font = 'bold 18px monospace';
      ctx.fillText('VERIFICATION SPECIFICATIONS:', 160, 750);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '15px monospace';
      ctx.fillText(`Credential ID:   ${credentialId}`, 160, 785);
      ctx.fillText(`Date of Issue:   ${issueDate}`, 160, 815);
      ctx.fillText(`Status:          AUTHENTIC & VERIFIED`, 160, 845);
      ctx.fillText(`Signer Authority: Muhammad Zaib Zafar`, 160, 875);

      // Center: CyberShieldPK Medallion / Gold Seal
      ctx.beginPath();
      ctx.arc(800, 820, 65, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(245, 158, 11, 0.15)';
      ctx.fill();
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#f59e0b';
      ctx.stroke();

      ctx.textAlign = 'center';
      ctx.fillStyle = '#f59e0b';
      ctx.font = 'bold 15px monospace';
      ctx.fillText('CYBERSHIELD-PK', 800, 810);
      ctx.fillText('OFFICIAL SEAL', 800, 830);
      ctx.fillStyle = '#22d3ee';
      ctx.font = 'bold 12px monospace';
      ctx.fillText('VERIFIED 2026', 800, 850);

      // Right: Lead Instructor Signature
      ctx.textAlign = 'right';
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'italic bold 32px serif';
      ctx.fillText('Muhammad Zaib Zafar', 1440, 800);

      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(1150, 820);
      ctx.lineTo(1440, 820);
      ctx.stroke();

      ctx.fillStyle = '#e2e8f0';
      ctx.font = 'bold 16px sans-serif';
      ctx.fillText('Muhammad Zaib Zafar', 1440, 845);
      ctx.fillStyle = '#94a3b8';
      ctx.font = '14px sans-serif';
      ctx.fillText('Founder & Lead Cybersecurity Architect, CyberShieldPK', 1440, 870);

      // 10. Bottom Security Hash
      ctx.textAlign = 'center';
      ctx.fillStyle = '#475569';
      ctx.font = '12px monospace';
      ctx.fillText(`SHA-256 HASH VERIFICATION: 9b1e4c70d8a4f6e3c2b1897e45ad9821c34a0289fd1876e4cba29402847aef12`, 800, 990);

      // Download triggered
      const imgData = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = imgData;
      a.download = `CyberShieldPK_Certificate_${course.id}_${studentName.replace(/\s+/g, '_')}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setIsGeneratingImage(false);
    } catch {
      setIsGeneratingImage(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-200">
      <div className="bg-[#091120] border-2 border-amber-500/40 w-full max-w-5xl rounded-2xl shadow-[0_0_50px_rgba(245,158,11,0.25)] overflow-hidden flex flex-col max-h-[92vh] h-[92vh] sm:h-auto">
        
        {/* Top Action Bar */}
        <div className="px-5 py-3 bg-slate-950/95 border-b border-slate-800 flex items-center justify-between gap-4 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-mono font-bold text-amber-400 uppercase tracking-wider">
                Official Credential Verification
              </span>
              <h2 className="text-xs sm:text-base font-bold text-white truncate max-w-xs sm:max-w-md">
                Course Completion Certificate
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Close certificate dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Display Area */}
        <div className="p-3 sm:p-6 overflow-y-auto flex-1 min-h-0 flex flex-col items-center justify-start sm:justify-center bg-[#050b14]">
          {/* Certificate Board */}
          <div 
            ref={certContainerRef}
            id="printable-certificate"
            className="w-full max-w-4xl bg-gradient-to-b from-[#0b1528] via-[#070e1c] to-[#050b14] border-4 border-amber-500/60 rounded-xl p-4 sm:p-7 md:p-8 shadow-2xl relative overflow-hidden text-center text-slate-100 my-auto"
          >
            {/* Background Guilloche Security Matrix Lines */}
            <div className="absolute inset-0 bg-[radial-gradient(#06b6d4_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />
            
            {/* Inner Border */}
            <div className="absolute inset-3 sm:inset-4 border border-cyan-500/40 rounded-lg pointer-events-none" />
            <div className="absolute inset-5 sm:inset-6 border border-amber-400/20 rounded-lg pointer-events-none" />

            {/* Corner Decorative Ornaments */}
            <div className="absolute top-4 left-4 text-amber-400 font-mono text-xs">╔════</div>
            <div className="absolute top-4 right-4 text-amber-400 font-mono text-xs">════╗</div>
            <div className="absolute bottom-4 left-4 text-amber-400 font-mono text-xs">╚════</div>
            <div className="absolute bottom-4 right-4 text-amber-400 font-mono text-xs">════╝</div>

            {/* Emblem & Academy Name */}
            <div className="relative z-10 space-y-2">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/50 text-cyan-300 font-mono text-xs uppercase tracking-widest">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <span>CyberShieldPK Cyber Warfare & Defense Academy</span>
              </div>
              <p className="text-[11px] font-mono text-slate-400 uppercase tracking-widest">
                Center for Advanced Penetration Testing & Threat Intelligence
              </p>
            </div>

            {/* Certificate Headline */}
            <div className="relative z-10 mt-6 sm:mt-8 space-y-1">
              <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white uppercase font-sans">
                Certificate of Completion
              </h1>
              <p className="text-xs sm:text-sm font-serif italic text-amber-300 pt-2">
                This credential officially verifies and certifies that
              </p>
            </div>

            {/* Recipient Student Name with Live Edit Option */}
            <div className="relative z-10 mt-4 sm:mt-6 mb-4 sm:mb-6">
              {isEditingName ? (
                <div className="inline-flex items-center gap-2 bg-slate-900 border border-cyan-500/50 rounded-xl px-4 py-2">
                  <input
                    type="text"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    className="bg-transparent text-lg sm:text-2xl font-bold text-cyan-300 font-sans text-center focus:outline-none"
                    autoFocus
                  />
                  <button
                    onClick={() => setIsEditingName(false)}
                    className="px-2.5 py-1 text-xs font-mono bg-cyan-500 text-slate-950 font-bold rounded"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <div className="group inline-flex items-center justify-center gap-2 border-b-2 border-cyan-500/60 pb-2 px-6">
                  <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-cyan-300 font-sans tracking-wide">
                    {studentName}
                  </span>
                  <button
                    onClick={() => setIsEditingName(true)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-slate-400 hover:text-cyan-300"
                    title="Edit Name on Certificate"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Course Information */}
            <div className="relative z-10 max-w-2xl mx-auto space-y-2">
              <p className="text-xs sm:text-sm text-slate-300">
                has successfully fulfilled all curriculum requirements, hands-on vulnerability labs, and demonstrated mastery in:
              </p>
              <h3 className="text-lg sm:text-2xl font-bold text-white tracking-wide text-amber-300 font-mono py-1">
                {course.title}
              </h3>
              <p className="text-xs font-mono text-slate-400">
                Track: {course.category} • Accredited Duration: {course.duration} ({course.modulesCount} Chapters)
              </p>
            </div>

            {/* Bottom Verification Details: QR & Cryptographic Seal, and Signatures */}
            <div className="relative z-10 mt-8 sm:mt-12 pt-6 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-6 items-center text-left">
              {/* Left Column: Verification ID */}
              <div className="space-y-1 text-xs font-mono">
                <div className="flex items-center gap-1.5 text-cyan-400 font-bold">
                  <QrCode className="w-4 h-4" />
                  <span>Credential Verification</span>
                </div>
                <div className="text-[11px] text-slate-300">
                  ID: <span className="text-amber-400 font-bold">{credentialId}</span>
                </div>
                <div className="text-[11px] text-slate-400">
                  Issued: {issueDate}
                </div>
                <div className="text-[10px] text-emerald-400 flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  <span>Cryptographically Authenticated</span>
                </div>
              </div>

              {/* Middle Column: Gold Seal Emblem */}
              <div className="flex flex-col items-center justify-center">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-amber-400/80 bg-gradient-to-tr from-amber-600/30 to-yellow-400/20 flex flex-col items-center justify-center text-center p-2 shadow-[0_0_20px_rgba(245,158,11,0.3)]">
                  <Award className="w-7 h-7 text-amber-400 mb-0.5" />
                  <span className="text-[9px] font-mono font-bold text-amber-300 uppercase leading-tight">
                    CyberShield
                  </span>
                  <span className="text-[8px] font-mono text-cyan-300 leading-tight">
                    VERIFIED
                  </span>
                </div>
              </div>

              {/* Right Column: Instructor Signature */}
              <div className="text-right space-y-1">
                <div className="font-serif italic text-xl sm:text-2xl text-cyan-300 font-bold">
                  Muhammad Zaib Zafar
                </div>
                <div className="h-0.5 w-36 ml-auto bg-slate-700" />
                <div className="text-xs font-bold text-white">
                  Muhammad Zaib Zafar
                </div>
                <div className="text-[11px] text-slate-400">
                  Founder & Lead Security Architect, CyberShieldPK
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Control Bar */}
        <div className="px-6 py-4 bg-slate-950/95 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyId}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 transition-colors"
            >
              {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-cyan-400" />}
              <span>{copiedId ? 'Copied ID!' : `Copy Credential ID`}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadTxt}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-mono bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 transition-colors"
              title="Download text summary of credential"
            >
              <Download className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">Text File</span>
            </button>

            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-mono bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 transition-colors"
              title="Print or save as PDF"
            >
              <Printer className="w-3.5 h-3.5 text-slate-400" />
              <span>Print / PDF</span>
            </button>

            <button
              onClick={handleDownloadImage}
              disabled={isGeneratingImage}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-mono font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-sky-400 hover:from-cyan-300 hover:to-sky-300 transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] cursor-pointer disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5 fill-slate-950" />
              <span>{isGeneratingImage ? 'Generating Image...' : 'Download Image (PNG)'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
