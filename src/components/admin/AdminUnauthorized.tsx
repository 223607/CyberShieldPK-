import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Lock, 
  ArrowLeft, 
  LogIn, 
  Terminal, 
  Database, 
  Copy, 
  Check, 
  ExternalLink,
  AlertTriangle 
} from 'lucide-react';
import { AdminAuthResult } from '../../lib/adminAuth';

interface AdminUnauthorizedProps {
  authResult: AdminAuthResult | null;
  onOpenAuth: () => void;
  onGoHome: () => void;
  onRetry: () => void;
}

export const AdminUnauthorized: React.FC<AdminUnauthorizedProps> = ({
  authResult,
  onOpenAuth,
  onGoHome,
  onRetry
}) => {
  const [copiedSql, setCopiedSql] = useState(false);
  const [showSqlGuide, setShowSqlGuide] = useState(false);

  const sqlSnippet = `-- 1. In Supabase SQL Editor, run migration: supabase/migrations/20261018_admin_schema_and_rls.sql
-- 2. Grant administrator role to your verified account:
UPDATE public.profiles 
SET role = 'admin' 
WHERE email = '${authResult?.user?.email || 'your-admin-email@cybershieldpk.com'}';`;

  const handleCopySql = () => {
    navigator.clipboard.writeText(sqlSnippet);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#060c16] text-slate-100 flex items-center justify-center p-4 sm:p-6 font-sans">
      <div className="w-full max-w-2xl bg-[#0a1222] border border-red-500/30 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden backdrop-blur-xl">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Security Header */}
        <div className="flex items-center gap-4 border-b border-slate-800 pb-5">
          <div className="w-12 h-12 rounded-xl bg-red-950/80 border border-red-500/40 flex items-center justify-center text-red-400 shadow-[0_0_20px_rgba(239,68,68,0.2)] flex-shrink-0">
            <ShieldAlert className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-950/80 border border-red-500/30 text-red-300 font-mono text-[10px] uppercase tracking-wider mb-1">
              <Lock className="w-3 h-3" />
              <span>Restricted Clearance Level 5</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Access Denied — Administrator Console
            </h1>
          </div>
        </div>

        {/* Diagnostics & Explanation */}
        <div className="py-6 space-y-4">
          <p className="text-sm text-slate-300 leading-relaxed">
            The requested route <code className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-cyan-300 font-mono text-xs">/admin</code> is strictly reserved for verified platform administrators. Access is enforced by server-side PostgreSQL Row Level Security (RLS) policies.
          </p>

          {/* Current Identity Box */}
          <div className="rounded-xl bg-slate-950 border border-slate-800/80 p-4 space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
              Active Session Status:
            </span>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="space-y-0.5">
                <p className="text-sm font-semibold text-white">
                  {authResult?.user?.email ? authResult.user.email : 'Unauthenticated Visitor'}
                </p>
                <p className="text-xs text-slate-400 font-mono">
                  Role: <span className="text-amber-400 font-bold">{authResult?.user?.role || 'Guest (no session)'}</span>
                </p>
              </div>
              <div className="text-right">
                <span className={`inline-block px-2 py-1 rounded text-[11px] font-mono uppercase font-bold border ${
                  authResult?.isAdmin 
                    ? 'bg-emerald-950 text-emerald-400 border-emerald-500/40' 
                    : 'bg-red-950/60 text-red-400 border-red-500/30'
                }`}>
                  {authResult?.isAdmin ? 'Authorized' : 'Unauthorized'}
                </span>
              </div>
            </div>

            {authResult?.errorMessage && (
              <p className="text-xs text-red-300/90 pt-2 border-t border-slate-900 font-mono">
                {authResult.errorMessage}
              </p>
            )}
          </div>

          {/* Special Guidance: Database Migration or Elevation Needed */}
          {authResult?.reason === 'database_pending' && (
            <div className="rounded-xl bg-amber-950/30 border border-amber-500/40 p-4 space-y-2">
              <div className="flex items-center gap-2 text-amber-300 font-semibold text-xs font-mono">
                <Database className="w-4 h-4 text-amber-400" />
                <span>Action Required: Run Database Migration in Supabase</span>
              </div>
              <p className="text-xs text-slate-300 leading-normal">
                Your database connection is active, but the <code className="text-amber-300">profiles</code> table hasn't been created yet. Run the migration script in your Supabase SQL Editor.
              </p>
            </div>
          )}

          {/* Instructions accordion */}
          <div>
            <button
              type="button"
              onClick={() => setShowSqlGuide(!showSqlGuide)}
              className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>{showSqlGuide ? 'Hide' : 'Show'} Supabase Admin Activation Instructions</span>
            </button>

            {showSqlGuide && (
              <div className="mt-3 rounded-xl bg-slate-950 border border-cyan-500/30 p-3.5 space-y-2.5">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-mono text-[11px]">SQL Command to Grant Admin Rights:</span>
                  <button
                    onClick={handleCopySql}
                    className="flex items-center gap-1 text-[11px] font-mono text-cyan-400 hover:text-cyan-300 px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/40"
                  >
                    {copiedSql ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedSql ? 'Copied!' : 'Copy SQL'}</span>
                  </button>
                </div>
                <pre className="text-[11px] font-mono text-cyan-300/90 bg-[#060c16] p-3 rounded-lg overflow-x-auto border border-slate-800">
                  {sqlSnippet}
                </pre>
                <p className="text-[11px] text-slate-400">
                  After running the query in your Supabase Dashboard SQL Editor, click <strong>"Re-verify Access"</strong> below.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={onGoHome}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-mono font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-colors flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to CyberShieldPK</span>
          </button>

          <div className="w-full sm:w-auto flex items-center gap-2">
            <button
              type="button"
              onClick={onRetry}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs font-mono font-medium text-cyan-300 bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-500/40 transition-colors"
            >
              Re-verify Access
            </button>
            <button
              type="button"
              onClick={onOpenAuth}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs font-mono font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-blue-400 hover:from-cyan-300 hover:to-blue-300 transition-all flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(0,240,255,0.2)]"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Login as Admin</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
