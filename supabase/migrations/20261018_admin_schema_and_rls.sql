-- ==============================================================================
-- CyberShieldPK Academy — Production Database Schema & Row Level Security (RLS)
-- Version: 2.6.0
-- Security Architect: CyberShieldPK Architecture Team
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. USER PROFILES TABLE
-- Extends Supabase auth.users with RBAC role enforcement
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text,
  role text NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'instructor', 'admin')),
  avatar_url text,
  bio text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Index for role lookup performance
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);

-- 3. SERVER-SIDE SECURE HELPER: is_admin()
-- Evaluates directly in PostgreSQL with SECURITY DEFINER to avoid RLS recursion
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- Helper: is_instructor_or_admin()
CREATE OR REPLACE FUNCTION public.is_instructor_or_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('instructor', 'admin')
  );
$$;

-- 4. ROW LEVEL SECURITY ON PROFILES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Anyone authenticated can view their own profile; admins can view all profiles
DROP POLICY IF EXISTS "Users can view own profile or admins view all" ON public.profiles;
CREATE POLICY "Users can view own profile or admins view all"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id OR public.is_admin());

-- Users can insert their own initial profile during registration
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Users can update their own personal info, but CANNOT elevate their own role!
DROP POLICY IF EXISTS "Users can update own personal info but not role" ON public.profiles;
CREATE POLICY "Users can update own personal info but not role"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id OR public.is_admin())
  WITH CHECK (
    -- If user is admin, they can change roles
    public.is_admin()
    -- If user is not admin, role must remain unchanged
    OR (auth.uid() = id AND role = (SELECT p.role FROM public.profiles p WHERE p.id = auth.uid()))
  );

-- 5. COURSES TABLE
CREATE TABLE IF NOT EXISTS public.courses (
  id text PRIMARY KEY,
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  category text NOT NULL,
  difficulty text NOT NULL CHECK (difficulty IN ('Beginner', 'Intermediate', 'Advanced', 'All Levels')),
  duration text NOT NULL DEFAULT '10 Hours',
  modules_count integer NOT NULL DEFAULT 1,
  lessons_count integer NOT NULL DEFAULT 1,
  price_pkr integer NOT NULL DEFAULT 0,
  price_usd integer NOT NULL DEFAULT 0,
  is_premium boolean NOT NULL DEFAULT false,
  is_published boolean NOT NULL DEFAULT true,
  badge text,
  description text NOT NULL,
  detailed_overview text,
  instructor_name text NOT NULL DEFAULT 'Muhammad Zaib Zafar',
  instructor_role text NOT NULL DEFAULT 'Lead Cybersecurity Architect',
  instructor_bio text,
  skills text[] DEFAULT '{}',
  prerequisites text[] DEFAULT '{}',
  labs_included text[] DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_courses_published ON public.courses(is_published);
CREATE INDEX IF NOT EXISTS idx_courses_category ON public.courses(category);

ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

-- Public read for published courses; Admins can see all (including unpublished drafts)
DROP POLICY IF EXISTS "Anyone can view published courses" ON public.courses;
CREATE POLICY "Anyone can view published courses"
  ON public.courses FOR SELECT
  USING (is_published = true OR public.is_admin());

-- Only admins can insert, update, or delete courses
DROP POLICY IF EXISTS "Only admins can modify courses" ON public.courses;
CREATE POLICY "Only admins can modify courses"
  ON public.courses FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 6. COURSE CHAPTERS / MODULES TABLE
CREATE TABLE IF NOT EXISTS public.course_chapters (
  id text PRIMARY KEY,
  course_id text NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  chapter_number integer NOT NULL,
  title text NOT NULL,
  description text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_chapters_course ON public.course_chapters(course_id);

ALTER TABLE public.course_chapters ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view chapters of visible courses" ON public.course_chapters;
CREATE POLICY "Anyone can view chapters of visible courses"
  ON public.course_chapters FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.courses c
      WHERE c.id = course_chapters.course_id
        AND (c.is_published = true OR public.is_admin())
    )
  );

DROP POLICY IF EXISTS "Only admins can modify chapters" ON public.course_chapters;
CREATE POLICY "Only admins can modify chapters"
  ON public.course_chapters FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 7. COURSE LESSONS TABLE
CREATE TABLE IF NOT EXISTS public.course_lessons (
  id text PRIMARY KEY,
  chapter_id text NOT NULL REFERENCES public.course_chapters(id) ON DELETE CASCADE,
  course_id text NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title text NOT NULL,
  duration text NOT NULL DEFAULT '15 min',
  is_free boolean NOT NULL DEFAULT false,
  summary text,
  video_url text,
  video_type text NOT NULL DEFAULT 'youtube' CHECK (video_type IN ('youtube', 'vimeo', 'direct', 'notes')),
  lecture_notes text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_lessons_course ON public.course_lessons(course_id);
CREATE INDEX IF NOT EXISTS idx_lessons_chapter ON public.course_lessons(chapter_id);

ALTER TABLE public.course_lessons ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "View lessons of visible courses" ON public.course_lessons;
CREATE POLICY "View lessons of visible courses"
  ON public.course_lessons FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.courses c
      WHERE c.id = course_lessons.course_id
        AND (c.is_published = true OR public.is_admin())
    )
  );

DROP POLICY IF EXISTS "Only admins can modify lessons" ON public.course_lessons;
CREATE POLICY "Only admins can modify lessons"
  ON public.course_lessons FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 8. ENROLLMENTS TABLE
CREATE TABLE IF NOT EXISTS public.enrollments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id text NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'revoked')),
  enrolled_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz,
  progress_percentage integer NOT NULL DEFAULT 0 CHECK (progress_percentage BETWEEN 0 AND 100),
  UNIQUE(user_id, course_id)
);

CREATE INDEX IF NOT EXISTS idx_enrollments_user ON public.enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_course ON public.enrollments(course_id);

ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Students can view own enrollments or admin view all" ON public.enrollments;
CREATE POLICY "Students can view own enrollments or admin view all"
  ON public.enrollments FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "Admins can manage enrollments" ON public.enrollments;
CREATE POLICY "Admins can manage enrollments"
  ON public.enrollments FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 9. ORDERS & PAYMENT VERIFICATION TABLE
CREATE TABLE IF NOT EXISTS public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user_email text NOT NULL,
  course_id text NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  course_title text NOT NULL,
  amount_pkr integer NOT NULL,
  payment_method text NOT NULL CHECK (payment_method IN ('easypaisa', 'jazzcash', 'bank_transfer', 'credit_card', 'crypto', 'manual')),
  transaction_reference text,
  payment_proof_url text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  admin_notes text,
  verified_by uuid REFERENCES auth.users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_user ON public.orders(user_id);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Students view own orders or admins view all" ON public.orders;
CREATE POLICY "Students view own orders or admins view all"
  ON public.orders FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "Students can submit orders" ON public.orders;
CREATE POLICY "Students can submit orders"
  ON public.orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Only admins can update order verification status" ON public.orders;
CREATE POLICY "Only admins can update order verification status"
  ON public.orders FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 10. CERTIFICATES & CREDENTIAL VERIFICATION TABLE
CREATE TABLE IF NOT EXISTS public.certificates (
  id text PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id text NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  student_name text NOT NULL,
  course_title text NOT NULL,
  status text NOT NULL DEFAULT 'preview' CHECK (status IN ('preview', 'issued', 'revoked')),
  verification_hash text NOT NULL,
  issued_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_cert_user ON public.certificates(user_id);
CREATE INDEX IF NOT EXISTS idx_cert_status ON public.certificates(status);

ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

-- Anyone can verify an issued certificate by ID, but preview/revoked are restricted
DROP POLICY IF EXISTS "Public can verify issued certificates" ON public.certificates;
CREATE POLICY "Public can verify issued certificates"
  ON public.certificates FOR SELECT
  USING (status = 'issued' OR auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "Only admins can issue or revoke certificates" ON public.certificates;
CREATE POLICY "Only admins can issue or revoke certificates"
  ON public.certificates FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 11. QUIZZES & ASSESSMENTS TABLE
CREATE TABLE IF NOT EXISTS public.quizzes (
  id text PRIMARY KEY,
  course_id text NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title text NOT NULL,
  passing_score integer NOT NULL DEFAULT 80,
  time_limit_minutes integer NOT NULL DEFAULT 30,
  questions jsonb NOT NULL DEFAULT '[]'::jsonb,
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view published quizzes" ON public.quizzes;
CREATE POLICY "Anyone can view published quizzes"
  ON public.quizzes FOR SELECT
  USING (is_published = true OR public.is_admin());

DROP POLICY IF EXISTS "Only admins can modify quizzes" ON public.quizzes;
CREATE POLICY "Only admins can modify quizzes"
  ON public.quizzes FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 12. PLATFORM SETTINGS & AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS public.platform_settings (
  key text PRIMARY KEY,
  value jsonb NOT NULL,
  description text,
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid REFERENCES auth.users(id)
);

ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view public platform settings" ON public.platform_settings;
CREATE POLICY "Public can view public platform settings"
  ON public.platform_settings FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Only admins can change platform settings" ON public.platform_settings;
CREATE POLICY "Only admins can change platform settings"
  ON public.platform_settings FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Default Settings Seed
INSERT INTO public.platform_settings (key, value, description)
VALUES 
  ('maintenance_mode', '{"enabled": false, "message": "CyberShieldPK is performing scheduled security updates."}'::jsonb, 'Global site maintenance banner status'),
  ('enrollment_policy', '{"allow_self_enrollment": true, "require_email_verification": true}'::jsonb, 'Enrollment policies')
ON CONFLICT (key) DO NOTHING;

-- 13. AUTOMATIC PROFILE TRIGGER ON SIGNUP
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    'student' -- Always default to 'student'; only existing admins can elevate via SQL or admin panel
  )
  ON CONFLICT (id) DO UPDATE
  SET email = EXCLUDED.email;
  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- INSTRUCTIONS FOR INITIAL SUPERADMIN PROVISIONING:
-- Run this query once in your Supabase SQL Editor to grant admin rights to your email:
-- UPDATE public.profiles SET role = 'admin' WHERE email = 'your-admin-email@cybershieldpk.com';
-- ==============================================================================
