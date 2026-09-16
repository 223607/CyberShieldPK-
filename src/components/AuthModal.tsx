import React, { useState } from 'react';
import { 
  X, 
  User, 
  Lock, 
  Mail, 
  ShieldCheck, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface AuthModalProps {
  onClose: () => void;
  onLoginSuccess: (user: { name: string; email: string; role?: string }) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  onClose,
  onLoginSuccess
}) => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    const userObj = {
      name: name.trim() || email.split('@')[0],
      email: email.trim(),
      role: 'Cybersecurity Student / Analyst'
    };

    localStorage.setItem('cybershield_user', JSON.stringify(userObj));
    onLoginSuccess(userObj);
    onClose();
  };

  const handleQuickDemoLogin = () => {
    const demoUser = {
      name: 'Zaib (Demo Analyst)',
      email: 'analyst@cybershield.org',
      role: 'Junior SOC Analyst'
    };
    localStorage.setItem('cybershield_user', JSON.stringify(demoUser));
    onLoginSuccess(demoUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-[#091120] border border-cyan-500/30 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-cyan-400" />
            <span className="font-bold text-white text-sm font-mono tracking-tight">
              CYBERSHIELD<span className="text-cyan-400">PK</span> AUTH
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="grid grid-cols-2 border-b border-slate-800 bg-slate-950/40 text-xs font-mono">
          <button
            onClick={() => setMode('signin')}
            className={`py-3 text-center transition-colors ${
              mode === 'signin'
                ? 'text-cyan-300 border-b-2 border-cyan-400 font-semibold bg-slate-900/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setMode('signup')}
            className={`py-3 text-center transition-colors ${
              mode === 'signup'
                ? 'text-cyan-300 border-b-2 border-cyan-400 font-semibold bg-slate-900/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {mode === 'signup' && (
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
                  placeholder="e.g. Asim Raza"
                  className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="analyst@domain.com"
                className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
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
                className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 px-4 rounded-xl font-mono text-xs font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 to-sky-400 hover:from-cyan-300 hover:to-sky-300 transition-all cursor-pointer flex items-center justify-center gap-2 mt-2"
          >
            <span>{mode === 'signin' ? 'Sign In to Portal' : 'Register Account'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          {/* Quick Demo Login Option */}
          <div className="pt-3 border-t border-slate-800 text-center">
            <button
              type="button"
              onClick={handleQuickDemoLogin}
              className="w-full py-2 px-3 rounded-lg text-xs font-mono text-cyan-300 bg-cyan-950/40 hover:bg-cyan-900/40 border border-cyan-500/30 transition-colors flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Instant Demo Account Sign-In</span>
            </button>
            <p className="text-[10px] text-slate-500 font-mono mt-1.5">
              Instant access without password requirements
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
