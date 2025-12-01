drop policy if exists "Authenticated users can view templates." on public."Questionnaires";

create policy "Apporoved users can view questionnaires."
  on public."Questionnaires" for select
  using (
    auth.role() = 'authenticaed' and
    (select is_approved from public."Profiles" where id = auth.uid()) = true
  );

drop policy if exists "Authenticated users can view templates." on public."Categories";
create policy "Approved users can view categories."
  on public."Categories" for select
  using (
    auth.role() = 'authenticated' and
    (select is_approved from public."Profiles" where id = auth.uid()) = true
  );

drop policy if exists "Authenticated users can view templates." on public."Questions";
create policy "Approved users can view categories."
  on public."Questions" for select
  using (
    auth.role() = 'authenticated' and
    (select is_approved from public."Profiles" where id = auth.uid()) = true
  );

drop policy if exists "Authenticated users can view templates." on public."Options";
create policy "Approved users can view categories."
  on public."Options" for select
  using (
    auth.role() = 'authenticated' and
    (select is_approved from public."Profiles" where id = auth.uid()) = true
  );


-- Function to craete new row in Profiles table
create function public.handle_new_user()
returns trigger as $$
  begin insert into public."Profiles" (id, name)
  values (new.id, new.raw_user_meta_data->>'name');
  return new;
end;
$$ language plpgsql security definer;

-- Triger to call handle_new_user function
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Adding user_role enum
create type public.user_role as enum ('user', 'reviewer', 'admin');

-- Update Profile table
alter table public."Profiles"
  add column if not exists is_approved boolean not null default false,
  add column if not exists role public.user_role not null default 'user';

-- Update Profile policy
alter table public."Profiles" enable row level security;

drop policy if exists "Users can update their own profile." on public."Profiles";

create policy "Admins can view all profiles."
  on public."Profiles" for select
  using (
    (select role from public."Profiles" where id = auth.uid()) = 'admin'
  );

DROP POLICY IF EXISTS "Admins can update any profile." ON public."Profiles";

create policy "Admins can update any profile."
  on public."Profiles" for update
  using (
    (select role from public."Profiles" where id = auth.uid()) = 'admin'
  );

BEGIN; -- Mulai transaksi

-- ===================================
-- GRUP 0: SUPABASE AUTH
-- ===================================
-- Tabel ini tidak perlu dibuat, karena sudah disediakan oleh Supabase (auth.users)
-- Kita hanya perlu membuat tabel 'Profiles' untuk melengkapi data user.

CREATE TABLE public."Profiles" (
    id uuid NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name text,
    -- Tambahkan kolom profile lain di sini (misal: avatar_url, role)
    created_at timestamptz DEFAULT now()
);

-- Aktifkan RLS
ALTER TABLE public."Profiles" ENABLE ROW LEVEL SECURITY;

-- Policies untuk Profiles: User hanya bisa melihat dan mengedit profile mereka sendiri.
CREATE POLICY "Users can view their own profile."
    ON public."Profiles" FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile."
    ON public."Profiles" FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);


-- ===================================
-- GRUP 1: STRUKTUR KUESIONER (TEMPLATE)
-- ===================================

CREATE TABLE public."Universities" (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    website text,
    address text,
    date_of_establishment date,
    dean_name text,
    pic_name text,
    pic_email text,
    country_code text,
    pic_relation text,
    publication_evidence_path text,
    asset_evidence_path text,
    letter_path text,
    created_at timestamptz DEFAULT now()
);

CREATE TABLE public."Questionnaires" (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    title text NOT NULL,
    version integer DEFAULT 1,
    description text,
    created_at timestamptz DEFAULT now()
);

CREATE TABLE public."Categories" (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    questionnaire_id uuid NOT NULL REFERENCES public."Questionnaires"(id) ON DELETE CASCADE,
    name text NOT NULL,
    "order" integer,
    created_at timestamptz DEFAULT now()
);

CREATE TABLE public."Questions" (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    category_id uuid NOT NULL REFERENCES public."Categories"(id) ON DELETE CASCADE,
    text text NOT NULL,
    max_score integer NOT NULL,
    "order" integer,
    created_at timestamptz DEFAULT now()
);

CREATE TABLE public."Options" (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    question_id uuid NOT NULL REFERENCES public."Questions"(id) ON DELETE CASCADE,
    text text NOT NULL,
    value numeric(3, 2) NOT NULL, -- (Contoh: 0.25, 0.50, 1.00)
    "order" integer,
    created_at timestamptz DEFAULT now()
);

-- Aktifkan RLS untuk tabel template
ALTER TABLE public."Universities" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Questionnaires" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Categories" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Questions" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Options" ENABLE ROW LEVEL SECURITY;

-- Policy untuk tabel template: Siapapun yang terotentikasi bisa membacanya.
-- Asumsi: Admin akan mengelola data ini via Supabase Studio (bypass RLS)
CREATE POLICY "Authenticated users can view templates."
    ON public."Universities" FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can view templates."
    ON public."Questionnaires" FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can view templates."
    ON public."Categories" FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can view templates."
    ON public."Questions" FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can view templates."
    ON public."Options" FOR SELECT USING (auth.role() = 'authenticated');


-- ===================================
-- GRUP 2: DATA SUBMISSION (JAWABAN)
-- ===================================

CREATE TABLE public."Submissions" (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    university_id uuid NOT NULL REFERENCES public."Universities"(id) ON DELETE RESTRICT,
    questionnaire_id uuid NOT NULL REFERENCES public."Questionnaires"(id) ON DELETE RESTRICT,
    submitted_by_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
    submitted_at timestamptz DEFAULT now(),
    status text DEFAULT 'submitted' -- (Bisa juga 'draft', 'approved')
);

CREATE TABLE public."Answers" (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    submission_id uuid NOT NULL REFERENCES public."Submissions"(id) ON DELETE CASCADE,
    question_id uuid NOT NULL REFERENCES public."Questions"(id) ON DELETE RESTRICT,
    selected_option_id uuid NOT NULL REFERENCES public."Options"(id) ON DELETE RESTRICT,
    evidence_notes text -- Tempat untuk menyimpan bukti
);

-- Aktifkan RLS untuk tabel submission
ALTER TABLE public."Submissions" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Answers" ENABLE ROW LEVEL SECURITY;

-- Policies untuk Submission: User hanya bisa melihat dan membuat submission mereka sendiri.
CREATE POLICY "Users can view their own submissions."
    ON public."Submissions" FOR SELECT
    USING (auth.uid() = submitted_by_user_id);

CREATE POLICY "Users can create submissions."
    ON public."Submissions" FOR INSERT
    WITH CHECK (auth.uid() = submitted_by_user_id);

-- Policies untuk Answers: User hanya bisa melihat/membuat jawaban untuk submission milik mereka.
CREATE POLICY "Users can manage answers for their own submissions."
    ON public."Answers" FOR ALL
    USING (
        auth.uid() = (
            SELECT submitted_by_user_id
            FROM public."Submissions"
            WHERE id = submission_id
        )
    )
    WITH CHECK (
        auth.uid() = (
            SELECT submitted_by_user_id
            FROM public."Submissions"
            WHERE id = submission_id
        )
    );


-- ===================================
-- GRUP 3: HASIL SKOR (DENORMALISASI)
-- ===================================

CREATE TABLE public."CategoryScores" (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    submission_id uuid NOT NULL REFERENCES public."Submissions"(id) ON DELETE CASCADE,
    category_id uuid NOT NULL REFERENCES public."Categories"(id) ON DELETE CASCADE,
    category_name text NOT NULL, -- Nama kategori (Collaboration, Privacy, etc.)
    calculated_score numeric(10, 2), -- NULL jika belum dihitung
    updated_at timestamptz DEFAULT now(), -- Timestamp untuk tracking
    UNIQUE(submission_id, category_id)
);

CREATE TABLE public."CrawlingData" (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    university_id uuid NOT NULL REFERENCES public."Universities"(id) ON DELETE CASCADE,
    num_publications integer DEFAULT 0,
    num_assets integer DEFAULT 0,
    crawling_score numeric(10, 2) DEFAULT 0,
    last_crawled_at timestamptz
);

CREATE TABLE public."UniversityRankings" (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    university_id uuid NOT NULL REFERENCES public."Universities"(id) ON DELETE CASCADE,
    period text NOT NULL, -- (Contoh: "2025")
    total_questionnaire_score numeric(10, 2) DEFAULT 0,
    total_crawling_score numeric(10, 2) DEFAULT 0,
    final_total_score numeric(10, 2) DEFAULT 0,
    rank integer,
    UNIQUE(university_id, period) -- Pastikan hanya ada 1 ranking per univ per periode
);

-- Insert 8 Kategori RAI Default (setelah questionnaire dibuat)
-- Jalankan setelah membuat questionnaire pertama
-- INSERT INTO public."Categories" (questionnaire_id, name, "order") VALUES
--   ((SELECT id FROM public."Questionnaires" LIMIT 1), 'Collaboration', 1),
--   ((SELECT id FROM public."Questionnaires" LIMIT 1), 'Privacy', 2),
--   ((SELECT id FROM public."Questionnaires" LIMIT 1), 'Accountability', 3),
--   ((SELECT id FROM public."Questionnaires" LIMIT 1), 'Security', 4),
--   ((SELECT id FROM public."Questionnaires" LIMIT 1), 'Ethics in AI', 5),
--   ((SELECT id FROM public."Questionnaires" LIMIT 1), 'Fairness', 6),
--   ((SELECT id FROM public."Questionnaires" LIMIT 1), 'Transparency', 7),
--   ((SELECT id FROM public."Questionnaires" LIMIT 1), 'Continuous Learning', 8);

-- Aktifkan RLS untuk tabel hasil
ALTER TABLE public."CategoryScores" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."CrawlingData" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."UniversityRankings" ENABLE ROW LEVEL SECURITY;

-- Policy untuk tabel hasil: Siapapun (termasuk user anonim) bisa melihat data ini untuk dashboard.
CREATE POLICY "Public can view ranking data."
    ON public."CategoryScores" FOR SELECT USING (true);
CREATE POLICY "Public can view ranking data."
    ON public."CrawlingData" FOR SELECT USING (true);
CREATE POLICY "Public can view ranking data."
    ON public."UniversityRankings" FOR SELECT USING (true);

-- (PENTING): crawling service Anda perlu service_role_key untuk bypass RLS
-- saat INSERT/UPDATE ke CrawlingData.


COMMIT; -- Selesaikan transaksi