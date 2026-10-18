import { createClient } from '@supabase/supabase-js';

const getEnv = (key: string): string => {
  const val = (import.meta.env as any)[key] || (typeof process !== 'undefined' && (process.env as any)?.[key]);
  if (val && typeof val === 'string' && val.trim() !== '') return val.trim();
  if (typeof window !== 'undefined' && window.localStorage) {
    const localVal = window.localStorage.getItem(key);
    if (localVal && localVal.trim() !== '') return localVal.trim();
  }
  return '';
};

const supabaseUrl = getEnv('VITE_SUPABASE_URL') || import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = getEnv('VITE_SUPABASE_ANON_KEY') || import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseUrl.startsWith('https://') &&
  !supabaseUrl.includes('placeholder') &&
  !supabaseUrl.includes('your-project') &&
  supabaseAnonKey &&
  supabaseAnonKey !== 'placeholder' &&
  supabaseAnonKey !== 'your-anon-key'
);

export const supabase = createClient(
  isSupabaseConfigured ? supabaseUrl : 'https://placeholder.supabase.co',
  isSupabaseConfigured ? supabaseAnonKey : 'placeholder'
);
