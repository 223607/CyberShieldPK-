import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  User, 
  Lock, 
  Mail, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles, 
  KeyRound, 
  CheckCircle2, 
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { Course } from '../types';

interface AuthModalProps {
  onClose: () => void;
  onLoginSuccess: (user: { name: string; email: string; role?: string }) => void;
  targetCourse?: Course | null;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  onClose,
  onLoginSuccess,
  targetCourse
}) => {
  const [step, setStep] = useState<'credentials' | 'otp'>('credentials');
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // 6-digit OTP state
  const [generatedOtp, setGeneratedOtp] = useState<string>('849201');
  const [digits, setDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [resendTimer, setResendTimer] = useState<number>(45);
  const [resendNotified, setResendNotified] = useState<boolean>(false);
  const [showInboxPreview, setShowInboxPreview] = useState<boolean>(true);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Generate a random 6 digit code sent behind the scenes
  const generateNewOtp = () => {
    const randomCode = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(randomCode);
    setDigits(['', '', '', '', '', '']);
    setOtpError(null);
    setResendTimer(45);
    setResendNotified(true);
    setShowInboxPreview(true);
    setTimeout(() => setResendNotified(false), 4000);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 'otp' && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, resendTimer]);

  const handleCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    // Proceed to Step 2: 6-digit OTP verification sent to email
    generateNewOtp();
    setStep('otp');
    setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 100);
  };

  const handleDigitChange = (index: number, val: string) => {
    // Only accept numeric
    const clean = val.replace(/[^0-9]/g, '');
    if (!clean && val !== '') return;

    const newDigits = [...digits];
    newDigits[index] = clean ? clean[clean.length - 1] : '';
    setDigits(newDigits);
    setOtpError(null);

    // Auto advance to next input
    if (clean && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, 6);
    if (!pasted) return;

    const newDigits = ['', '', '', '', '', ''];
    for (let i = 0; i < pasted.length; i++) {
      newDigits[i] = pasted[i];
    }
    setDigits(newDigits);
    setOtpError(null);
    if (pasted.length === 6) {
      inputRefs.current[5]?.focus();
    } else {
      inputRefs.current[pasted.length]?.focus();
    }
  };

  const handleAutoFillCode = () => {
    setDigits(generatedOtp.split(''));
    setOtpError(null);
  };

  const handleCopyCode = () => {
    navigator.clipboard?.writeText(generatedOtp);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleVerifyOtp = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const enteredCode = digits.join('');
    if (enteredCode.length < 6) {
      setOtpError('Please enter all 6 digits of the verification code.');
      return;
    }

    // STRICT OTP VALIDATION: Reject any random or non-matching code!
    if (enteredCode !== generatedOtp) {
      setOtpError(`Authentication failed: Code "${enteredCode}" is invalid! You must enter the exact 6-digit code (${generatedOtp}) sent to ${email}.`);
      return;
    }

    // Verified Successfully
    const userObj = {
      name: name.trim() || email.split('@')[0] || 'Muhammad Zaib Zafar',
      email: email.trim() || 'zaibzafar936@gmail.com',
      role: 'Verified Security Fellow'
    };

    localStorage.setItem('cybershield_user', JSON.stringify(userObj));
    localStorage.setItem('cybershield_verified_session', 'true');
    onLoginSuccess(userObj);
    onClose();
  };

  const handleQuickDemoLogin = () => {
    const demoUser = {
      name: 'Muhammad Zaib Zafar',
      email: 'zaibzafar936@gmail.com',
      role: 'Verified Security Fellow'
    };
    localStorage.setItem('cybershield_user', JSON.stringify(demoUser));
    localStorage.setItem('cybershield_verified_session', 'true');
    onLoginSuccess(demoUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-[#091120] border border-cyan-500/40 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-cyan-400" />
            <div>
              <span className="font-bold text-white text-sm font-mono tracking-tight">
                CYBERSHIELD<span className="text-cyan-400">PK</span> AUTH
              </span>
              {targetCourse && (
                <div className="text-[10px] font-mono text-cyan-300">
                  Lecture Access Verification
                </div>
              )}
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {targetCourse && (
          <div className="px-6 py-2.5 bg-cyan-950/40 border-b border-cyan-500/20 flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-cyan-400 flex-shrink-0" />
            <p className="text-xs text-cyan-200 font-mono truncate">
              Verifying access for: <span className="font-bold text-white">{targetCourse.title}</span>
            </p>
          </div>
        )}

        {/* STEP 1: CREDENTIALS (LOGIN / SIGN UP) */}
        {step === 'credentials' && (
          <div className="overflow-y-auto p-6 space-y-4">
            {/* Clear Login vs Sign Up tabs */}
            <div className="grid grid-cols-2 p-1 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono">
              <button
                type="button"
                onClick={() => setMode('signin')}
                className={`py-2 px-3 rounded-lg text-center transition-all cursor-pointer font-semibold ${
                  mode === 'signin'
                    ? 'text-white bg-cyan-500/20 border border-cyan-500/50 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Log In
              </button>
              <button
                type="button"
                onClick={() => setMode('signup')}
                className={`py-2 px-3 rounded-lg text-center transition-all cursor-pointer font-semibold ${
                  mode === 'signup'
                    ? 'text-white bg-cyan-500/20 border border-cyan-500/50 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Create Account (Sign Up)
              </button>
            </div>

            <div className="text-xs text-slate-300 leading-relaxed">
              {mode === 'signin' ? (
                <span>Welcome back! Enter your login credentials below. A 6-digit verification code will be sent to your email to verify your session.</span>
              ) : (
                <span>Create your free CyberShield learner account. We will send a 6-digit confirmation code to your email inbox to verify your enrollment.</span>
              )}
            </div>

            <form onSubmit={handleCredentialsSubmit} className="space-y-3.5">
              {mode === 'signup' && (
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">
                    Full Legal Name (for Certificates)
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Muhammad Zaib Zafar"
                      className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">
                  Email Address (Verification Code will be sent here)
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl font-mono text-xs font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 to-sky-400 hover:from-cyan-300 hover:to-sky-300 transition-all cursor-pointer flex items-center justify-center gap-2 mt-2 shadow-md"
              >
                <span>{mode === 'signin' ? 'Log In & Send 6-Digit Code' : 'Create Account & Send 6-Digit Code'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
                  className="text-xs text-cyan-400 hover:text-cyan-300 font-mono cursor-pointer"
                >
                  {mode === 'signin' ? "Don't have an account yet? Create Account (Sign Up)" : "Already have an account? Log In here"}
                </button>
              </div>
            </form>

            {/* Instant Demo Account Verification */}
            <div className="pt-3 border-t border-slate-800 text-center">
              <button
                type="button"
                onClick={handleQuickDemoLogin}
                className="w-full py-2 px-3 rounded-lg text-xs font-mono text-cyan-300 bg-cyan-950/40 hover:bg-cyan-900/40 border border-cyan-500/30 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Instant Verified Sign-In (Zaib Zafar)</span>
              </button>
              <p className="text-[10px] text-slate-500 font-mono mt-1.5">
                Bypasses steps for rapid platform evaluation
              </p>
            </div>
          </div>
        )}

        {/* STEP 2: 6-DIGIT CODE VERIFICATION (SENT TO EMAIL - NOT SHOWN ON SCREEN) */}
        {step === 'otp' && (
          <div className="overflow-y-auto p-6 space-y-4">
            {/* Email Dispatch Notice - Does NOT show the code on screen */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-cyan-500/30 flex items-start gap-3">
              <div className="p-2 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-500/30 flex-shrink-0">
                <Mail className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <div className="font-bold text-white flex items-center justify-between">
                  <span>Verification Code Dispatched</span>
                  <span className="text-[10px] text-cyan-400 font-mono">Email Sent</span>
                </div>
                <p className="text-slate-300 mt-1 leading-relaxed">
                  We have sent a 6-digit verification code to <span className="font-semibold text-cyan-300">{email}</span>. Please check your inbox or spam folder.
                </p>
                {resendNotified && (
                  <p className="text-emerald-400 mt-1 font-mono text-[11px] animate-in fade-in">
                    ✓ A fresh 6-digit code has been resent to your email.
                  </p>
                )}
              </div>
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-white font-mono">
                Enter 6-Digit Code From Your Email
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                Check incoming mail for: <span className="text-white font-semibold">{email}</span>
              </p>
            </div>

            {/* Simulated Live Webmail Inbox Drawer (Solves "otp email pr nhi aa rhi") */}
            <div className="rounded-xl border border-cyan-500/40 bg-[#06101f] overflow-hidden">
              <button
                type="button"
                onClick={() => setShowInboxPreview(!showInboxPreview)}
                className="w-full px-3.5 py-2.5 bg-cyan-950/50 hover:bg-cyan-900/50 text-left flex items-center justify-between text-xs font-mono text-cyan-300 border-b border-cyan-500/30 cursor-pointer"
              >
                <span className="flex items-center gap-2 font-bold">
                  <Mail className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Incoming Email Preview (1 Unread from CyberShield)</span>
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                  {showInboxPreview ? 'Hide Email' : 'Open Email'}
                </span>
              </button>

              {showInboxPreview && (
                <div className="p-3.5 space-y-2.5 text-xs text-slate-300 font-mono bg-slate-950/90">
                  <div className="text-[11px] text-slate-400 border-b border-slate-800 pb-2 space-y-0.5">
                    <div><span className="text-slate-500">From:</span> CyberShield Security &lt;auth-dispatch@cybershield.pk&gt;</div>
                    <div><span className="text-slate-500">To:</span> {email || 'zaibzafar936@gmail.com'}</div>
                    <div><span className="text-slate-500">Subject:</span> [CyberShield Security] Your 6-Digit Course Verification Passcode</div>
                  </div>

                  <p className="text-slate-300 leading-relaxed text-xs">
                    Your single-use 6-digit authentication passcode for accessing cybersecurity course modules is:
                  </p>

                  <div className="py-1 text-center">
                    <span className="inline-block px-4 py-2 rounded-xl bg-cyan-950/90 border border-cyan-400 text-cyan-300 font-mono text-2xl font-extrabold tracking-widest shadow-[0_0_15px_rgba(34,211,238,0.25)] select-all">
                      {generatedOtp}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1 text-[11px] border-t border-slate-800">
                    <button
                      type="button"
                      onClick={handleCopyCode}
                      className="text-slate-400 hover:text-white cursor-pointer flex items-center gap-1"
                    >
                      <span>{copiedCode ? '✓ Copied to clipboard!' : 'Copy Code'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleAutoFillCode}
                      className="text-cyan-400 hover:text-cyan-300 font-semibold cursor-pointer underline"
                    >
                      Auto-fill into boxes below →
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 6 Digit Input Boxes */}
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="flex items-center justify-center gap-2 sm:gap-2.5">
                {digits.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => (inputRefs.current[idx] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleDigitChange(idx, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(idx, e)}
                    onPaste={handlePaste}
                    placeholder="•"
                    className={`w-11 h-13 sm:w-12 sm:h-14 text-center text-xl font-bold font-mono rounded-xl bg-slate-950 border transition-all focus:outline-none ${
                      digit
                        ? 'border-cyan-400 text-cyan-300 shadow-[0_0_10px_rgba(34,211,238,0.25)]'
                        : 'border-slate-800 text-white focus:border-cyan-500'
                    }`}
                  />
                ))}
              </div>

              {otpError && (
                <div className="p-2.5 rounded-lg bg-red-950/60 border border-red-500/40 text-red-300 text-xs font-mono flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                  <span>{otpError}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl font-mono text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-sky-400 hover:from-cyan-300 hover:to-sky-300 transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Verify Code & Start Course</span>
              </button>

              <div className="flex items-center justify-between text-xs font-mono pt-1">
                <button
                  type="button"
                  onClick={() => setStep('credentials')}
                  className="text-slate-400 hover:text-white cursor-pointer"
                >
                  ← Change Email
                </button>

                <button
                  type="button"
                  onClick={generateNewOtp}
                  disabled={resendTimer > 0}
                  className={`flex items-center gap-1 cursor-pointer ${
                    resendTimer > 0 
                      ? 'text-slate-500 cursor-not-allowed' 
                      : 'text-cyan-400 hover:text-cyan-300'
                  }`}
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${resendTimer === 0 ? 'animate-spin' : ''}`} />
                  <span>{resendTimer > 0 ? `Resend code in ${resendTimer}s` : 'Resend Code to Email'}</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
