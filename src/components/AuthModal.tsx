import React, { useState } from 'react';
import { 
  X, 
  User, 
  Lock, 
  Mail, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  RefreshCw,
  KeyRound
} from 'lucide-react';
import { Course } from '../types';
import { supabase } from '../lib/supabase';

interface AuthModalProps {
  onClose: () => void;
  onLoginSuccess: (user: { name: string; email: string; role?: string }) => void;
  targetCourse?: Course | null;
  initialMode?: 'signin' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  onClose,
  onLoginSuccess,
  targetCourse,
  initialMode = 'signin'
}) => {
  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot' | 'verify-notice'>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Resend verification cooldown
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resendStatus, setResendStatus] = useState<string | null>(null);

  // Friendly error formatter
  const formatAuthError = (err: any): string => {
    if (!err) return 'An unexpected error occurred. Please try again.';
    const msg = typeof err === 'string' ? err : err.message || '';
    
    if (msg.toLowerCase().includes('email not confirmed')) {
      return 'Your email has not been verified yet. Please check your inbox for the confirmation link.';
    }
    if (msg.toLowerCase().includes('invalid login credentials')) {
      return 'Incorrect email or password. Please try again.';
    }
    if (msg.toLowerCase().includes('user already registered')) {
      return 'An account with this email already exists. Please log in.';
    }
    if (msg.toLowerCase().includes('password should be at least')) {
      return 'Password must be at least 6 characters.';
    }
    if (msg.toLowerCase().includes('network') || msg.toLowerCase().includes('fetch')) {
      return 'Connection error. Please check your internet connection.';
    }
    return msg;
  };

  // LOGIN HANDLER
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const cleanEmail = email.trim();
    if (!cleanEmail || !password) {
      setErrorMessage('Please enter both your email and password.');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: password,
      });

      if (error) {
        if (error.message.toLowerCase().includes('email not confirmed')) {
          setMode('verify-notice');
          setLoading(false);
          return;
        }
        setErrorMessage(formatAuthError(error));
        setLoading(false);
        return;
      }

      if (data?.user) {
        let displayName = data.user.user_metadata?.full_name || 
                          data.user.user_metadata?.name || 
                          cleanEmail.split('@')[0];
        let role = data.user.user_metadata?.role || 'student';

        // Fetch custom profile if present
        try {
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name, role')
            .eq('id', data.user.id)
            .maybeSingle();

          if (profile?.full_name) displayName = profile.full_name;
          if (profile?.role) role = profile.role;
        } catch {
          // Non-blocking fallback
        }

        const authUser = {
          name: displayName,
          email: data.user.email || cleanEmail,
          role: role
        };

        localStorage.setItem('cybershield_user', JSON.stringify(authUser));
        onLoginSuccess(authUser);
        onClose();
      }
    } catch (err: any) {
      setErrorMessage(formatAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  // SIGNUP HANDLER
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const cleanName = name.trim();
    const cleanEmail = email.trim();

    if (!cleanName) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!cleanEmail) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password: password,
        options: {
          data: {
            full_name: cleanName,
            name: cleanName,
            role: 'student',
          },
        },
      });

      if (error) {
        setErrorMessage(formatAuthError(error));
        setLoading(false);
        return;
      }

      // If user profile record can be stored
      if (data?.user) {
        try {
          await supabase.from('profiles').upsert({
            id: data.user.id,
            full_name: cleanName,
            email: cleanEmail,
            role: 'student',
          });
        } catch {
          // Handled gracefully if profiles table is not yet migrated
        }
      }

      // If session is immediately returned (email confirmation disabled in Supabase project)
      if (data?.session && data.user) {
        const authUser = {
          name: cleanName,
          email: cleanEmail,
          role: 'student'
        };
        localStorage.setItem('cybershield_user', JSON.stringify(authUser));
        onLoginSuccess(authUser);
        onClose();
        return;
      }

      // Otherwise show real Email Verification Notice screen
      setMode('verify-notice');
    } catch (err: any) {
      setErrorMessage(formatAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  // FORGOT PASSWORD HANDLER
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setErrorMessage('Please enter your email address.');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
        redirectTo: window.location.origin,
      });

      if (error) {
        setErrorMessage(formatAuthError(error));
      } else {
        setSuccessMessage('We sent a password reset link to your email.');
      }
    } catch (err: any) {
      setErrorMessage(formatAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  // RESEND VERIFICATION EMAIL
  const handleResendVerification = async () => {
    if (resendCooldown > 0) return;
    setResendStatus(null);
    setErrorMessage(null);

    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setErrorMessage('Please enter your email address.');
      return;
    }

    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: cleanEmail,
      });

      if (error) {
        setErrorMessage(formatAuthError(error));
      } else {
        setResendStatus('Verification email sent! Please check your inbox.');
        setResendCooldown(60);
        const timer = setInterval(() => {
          setResendCooldown((prev) => {
            if (prev <= 1) {
              clearInterval(timer);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }
    } catch (err: any) {
      setErrorMessage(formatAuthError(err));
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-[#091120] border border-cyan-500/30 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950/80 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-cyan-400" />
            <span className="font-bold text-white text-sm font-mono tracking-tight">
              CYBERSHIELD<span className="text-cyan-400">PK</span>
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {targetCourse && mode !== 'verify-notice' && (
          <div className="px-6 py-2.5 bg-cyan-950/30 border-b border-cyan-500/20 flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-cyan-400 flex-shrink-0" />
            <p className="text-xs text-cyan-200 font-mono truncate">
              Accessing: <span className="font-semibold text-white">{targetCourse.title}</span>
            </p>
          </div>
        )}

        {/* 1. LOGIN FORM */}
        {mode === 'signin' && (
          <div className="p-6 space-y-4">
            <div>
              <h2 className="text-xl font-bold text-white font-mono">Welcome Back</h2>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-red-950/50 border border-red-500/40 text-red-300 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-3.5">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">
                  Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    autoComplete="email"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-mono text-slate-300">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setErrorMessage(null);
                      setSuccessMessage(null);
                      setMode('forgot');
                    }}
                    className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300 cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    autoComplete="current-password"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 rounded-xl font-mono text-xs font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 to-sky-400 hover:from-cyan-300 hover:to-sky-300 transition-all cursor-pointer flex items-center justify-center gap-2 mt-4 shadow-md disabled:opacity-50"
              >
                {loading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>Login</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>

              <div className="text-center pt-2">
                <span className="text-xs text-slate-400 font-mono">Don't have an account? </span>
                <button
                  type="button"
                  onClick={() => {
                    setErrorMessage(null);
                    setSuccessMessage(null);
                    setMode('signup');
                  }}
                  className="text-xs text-cyan-400 hover:text-cyan-300 font-mono font-semibold cursor-pointer underline"
                >
                  Create Account
                </button>
              </div>
            </form>
          </div>
        )}

        {/* 2. CREATE ACCOUNT FORM */}
        {mode === 'signup' && (
          <div className="p-6 space-y-4">
            <div>
              <h2 className="text-xl font-bold text-white font-mono">Create Account</h2>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-red-950/50 border border-red-500/40 text-red-300 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSignUp} className="space-y-3">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your Full Name"
                    autoComplete="name"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">
                  Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    autoComplete="email"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
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
                    autoComplete="new-password"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••••••"
                    autoComplete="new-password"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 rounded-xl font-mono text-xs font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 to-sky-400 hover:from-cyan-300 hover:to-sky-300 transition-all cursor-pointer flex items-center justify-center gap-2 mt-4 shadow-md disabled:opacity-50"
              >
                {loading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>

              <div className="text-center pt-2">
                <span className="text-xs text-slate-400 font-mono">Already have an account? </span>
                <button
                  type="button"
                  onClick={() => {
                    setErrorMessage(null);
                    setSuccessMessage(null);
                    setMode('signin');
                  }}
                  className="text-xs text-cyan-400 hover:text-cyan-300 font-mono font-semibold cursor-pointer underline"
                >
                  Login
                </button>
              </div>
            </form>
          </div>
        )}

        {/* 3. EMAIL VERIFICATION SCREEN */}
        {mode === 'verify-notice' && (
          <div className="p-6 space-y-5 text-center">
            <div className="w-12 h-12 rounded-full bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center mx-auto text-cyan-400">
              <Mail className="w-6 h-6" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-bold text-white font-mono">Check Your Email</h2>
              <p className="text-xs text-slate-300 leading-relaxed max-w-xs mx-auto">
                We sent a verification email to your email address:
              </p>
              <div className="text-xs font-mono font-semibold text-cyan-300 bg-slate-950 py-2 px-3 rounded-lg border border-slate-800 break-all">
                {email || 'your email address'}
              </div>
              <p className="text-[11px] text-slate-400">
                Click the confirmation link inside the email to complete your registration.
              </p>
            </div>

            {resendStatus && (
              <div className="p-2.5 rounded-lg bg-emerald-950/50 border border-emerald-500/30 text-emerald-300 text-xs font-mono flex items-center justify-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{resendStatus}</span>
              </div>
            )}

            {errorMessage && (
              <div className="p-2.5 rounded-lg bg-red-950/50 border border-red-500/30 text-red-300 text-xs font-mono">
                {errorMessage}
              </div>
            )}

            <div className="space-y-2.5 pt-2">
              <button
                type="button"
                onClick={handleResendVerification}
                disabled={resendCooldown > 0}
                className="w-full py-2.5 px-4 rounded-xl font-mono text-xs font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 to-sky-400 hover:from-cyan-300 hover:to-sky-300 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60 shadow-md"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${resendCooldown > 0 ? 'animate-spin' : ''}`} />
                <span>{resendCooldown > 0 ? `Resend Email in ${resendCooldown}s` : 'Resend Email'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setErrorMessage(null);
                  setSuccessMessage(null);
                  setMode('signin');
                }}
                className="w-full py-2 px-4 rounded-xl font-mono text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                Back to Login
              </button>
            </div>
          </div>
        )}

        {/* 4. FORGOT PASSWORD FORM */}
        {mode === 'forgot' && (
          <div className="p-6 space-y-4">
            <div>
              <h2 className="text-xl font-bold text-white font-mono">Reset Password</h2>
              <p className="text-xs text-slate-400 mt-1">
                Enter your email address to receive a password reset link.
              </p>
            </div>

            {successMessage ? (
              <div className="space-y-4 text-center py-2">
                <div className="p-3.5 rounded-xl bg-emerald-950/50 border border-emerald-500/40 text-emerald-300 text-xs flex items-start gap-2 text-left">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>{successMessage}</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSuccessMessage(null);
                    setMode('signin');
                  }}
                  className="w-full py-2.5 px-4 rounded-xl font-mono text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 transition-colors cursor-pointer"
                >
                  Back to Login
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotPassword} className="space-y-3.5">
                {errorMessage && (
                  <div className="p-3 rounded-xl bg-red-950/50 border border-red-500/40 text-red-300 text-xs flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      autoComplete="email"
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-4 rounded-xl font-mono text-xs font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 to-sky-400 hover:from-cyan-300 hover:to-sky-300 transition-all cursor-pointer flex items-center justify-center gap-2 mt-4 shadow-md disabled:opacity-50"
                >
                  {loading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <span>Send Reset Link</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setErrorMessage(null);
                      setSuccessMessage(null);
                      setMode('signin');
                    }}
                    className="text-xs text-slate-400 hover:text-white font-mono cursor-pointer"
                  >
                    Back to Login
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
