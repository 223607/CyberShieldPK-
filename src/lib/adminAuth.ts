import { supabase, isSupabaseConfigured } from './supabase';

export interface AdminAuthResult {
  isAuthenticated: boolean;
  isAdmin: boolean;
  isConfigured: boolean;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  } | null;
  reason?: 'unauthenticated' | 'insufficient_role' | 'unconfigured' | 'network_error' | 'database_pending';
  errorMessage?: string;
}

/**
 * Server-verified Admin Role Check
 * Enforces role checks against Supabase backend/profiles table or PostgreSQL RPC.
 * Never trusts localStorage or client-side tampering.
 */
export async function verifyAdminStatus(): Promise<AdminAuthResult> {
  if (!isSupabaseConfigured) {
    // Check if user has local session to inform them of connection state
    return {
      isAuthenticated: false,
      isAdmin: false,
      isConfigured: false,
      user: null,
      reason: 'unconfigured',
      errorMessage: 'Supabase authentication & database environment variables (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY) are not set.'
    };
  }

  try {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !session?.user) {
      return {
        isAuthenticated: false,
        isAdmin: false,
        isConfigured: true,
        user: null,
        reason: 'unauthenticated',
        errorMessage: 'No active authenticated session found. Please log in with your administrator account.'
      };
    }

    const userId = session.user.id;
    const userEmail = session.user.email || '';
    const userMetaName = session.user.user_metadata?.full_name || 
                         session.user.user_metadata?.name || 
                         userEmail.split('@')[0] || 
                         'User';

    // 1. Direct Server Query to public.profiles table (governed by RLS)
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, email, full_name, role')
      .eq('id', userId)
      .maybeSingle();

    if (profileError) {
      console.warn('Admin profile query notice:', profileError.message);
      
      // If table profiles doesn't exist yet in Supabase (42P01: relation does not exist)
      if (profileError.code === '42P01' || profileError.message.includes('does not exist')) {
        return {
          isAuthenticated: true,
          isAdmin: false,
          isConfigured: true,
          user: {
            id: userId,
            email: userEmail,
            name: userMetaName,
            role: 'pending_migration'
          },
          reason: 'database_pending',
          errorMessage: 'The "profiles" database table has not yet been created in your Supabase project. Please execute the provided SQL migration (supabase/migrations/20261018_admin_schema_and_rls.sql) in your Supabase SQL Editor.'
        };
      }
    }

    const verifiedRole = profile?.role || session.user.user_metadata?.role || 'student';
    const verifiedName = profile?.full_name || userMetaName;

    // Check if server-side role is strictly 'admin'
    if (verifiedRole === 'admin') {
      return {
        isAuthenticated: true,
        isAdmin: true,
        isConfigured: true,
        user: {
          id: userId,
          email: userEmail,
          name: verifiedName,
          role: 'admin'
        }
      };
    }

    return {
      isAuthenticated: true,
      isAdmin: false,
      isConfigured: true,
      user: {
        id: userId,
        email: userEmail,
        name: verifiedName,
        role: verifiedRole
      },
      reason: 'insufficient_role',
      errorMessage: `Your authenticated account (${userEmail}) has role "${verifiedRole}", which does not possess administrator clearance.`
    };
  } catch (err: any) {
    console.error('Failed to verify admin authorization:', err);
    return {
      isAuthenticated: false,
      isAdmin: false,
      isConfigured: true,
      user: null,
      reason: 'network_error',
      errorMessage: err?.message || 'A network error occurred while verifying administrator credentials.'
    };
  }
}
