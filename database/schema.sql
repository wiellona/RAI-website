-- ========================================
-- RAI Website - Supabase Database Schema
-- ========================================
-- File ini berisi definisi lengkap struktur database untuk aplikasi RAI Website
-- Jalankan script ini di Supabase SQL Editor untuk membuat semua tabel yang diperlukan

-- 1. PEMBERSIHAN (OPSIONAL)
-- Hapus tabel dan tipe jika sudah ada (agar skrip bisa dijalankan ulang)
DROP TABLE IF EXISTS universities CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS submissions CASCADE;
DROP TYPE IF EXISTS user_role CASCADE;
DROP TYPE IF EXISTS submission_status CASCADE;


-- 2. DEFINISI TIPE (DDL)
-- Buat ENUM untuk peran pengguna
CREATE TYPE user_role AS ENUM (
    'admin',
    'university',
    'user'
);

-- Buat ENUM untuk status submisi
CREATE TYPE submission_status AS ENUM (
    'pending',
    'accepted',
    'rejected'
);


-- 3. PEMBUATAN TABEL (DDL)
-- Tabel untuk Pengguna (Users)
CREATE TABLE users (
    id TEXT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role user_role NOT NULL DEFAULT 'user',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tabel untuk Submisi Universitas (yang masih pending)
CREATE TABLE submissions (
    id TEXT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    status submission_status NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    -- Di database production, Anda mungkin ingin menambahkan 
    -- 'submitted_by_user_id' sebagai Foreign Key ke tabel users
);

-- Tabel untuk Universitas (yang sudah diranking)
-- VERSI TERBARU: country dan region di-set sebagai NOT NULL
CREATE TABLE universities (
    id TEXT PRIMARY KEY,
    slug VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    country VARCHAR(100) NOT NULL,
    region VARCHAR(100) NOT NULL,
    rank INTEGER UNIQUE NOT NULL,
    trust_score INTEGER NOT NULL CHECK (trust_score BETWEEN 0 AND 100),
    last_updated TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Metrics
    transparency INTEGER NOT NULL CHECK (transparency BETWEEN 0 AND 100),
    auditability INTEGER NOT NULL CHECK (auditability BETWEEN 0 AND 100),
    data_privacy INTEGER NOT NULL CHECK (data_privacy BETWEEN 0 AND 100),
    policy_maturity INTEGER NOT NULL CHECK (policy_maturity BETWEEN 0 AND 100),
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- 4. PEMBUATAN INDEX (DDL)
-- Buat index untuk pencarian/filter yang lebih cepat
CREATE INDEX idx_universities_region ON universities(region);
CREATE INDEX idx_universities_country ON universities(country);
CREATE INDEX idx_universities_trust_score ON universities(trust_score);
CREATE INDEX idx_universities_rank ON universities(rank);
CREATE INDEX idx_universities_slug ON universities(slug);
CREATE INDEX idx_submissions_status ON submissions(status);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);


-- 5. ROW LEVEL SECURITY (RLS)
-- Enable RLS untuk semua tabel
ALTER TABLE universities ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

-- Policy untuk public read universities
CREATE POLICY "Universities are viewable by everyone"
  ON universities FOR SELECT
  USING (true);

-- Policy untuk admin dapat melakukan semua operasi pada universities
CREATE POLICY "Admins can do everything on universities"
  ON universities FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- Policy untuk submissions (sesuaikan dengan kebutuhan)
CREATE POLICY "Submissions are viewable by everyone"
  ON submissions FOR SELECT
  USING (true);

-- Policy untuk admin dapat melakukan semua operasi pada submissions
CREATE POLICY "Admins can do everything on submissions"
  ON submissions FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- Policy untuk users (hanya admin yang bisa melihat semua users)
CREATE POLICY "Users can view their own data"
  ON users FOR SELECT
  USING (auth.uid()::text = id OR auth.jwt() ->> 'role' = 'admin');

-- Policy untuk admin dapat melakukan semua operasi pada users
CREATE POLICY "Admins can do everything on users"
  ON users FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');


-- 6. FUNCTION & TRIGGER untuk auto-update timestamp
-- Function untuk update updated_at otomatis
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger untuk tabel users
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger untuk tabel submissions
CREATE TRIGGER update_submissions_updated_at
    BEFORE UPDATE ON submissions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger untuk tabel universities
CREATE TRIGGER update_universities_updated_at
    BEFORE UPDATE ON universities
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();


-- 7. SAMPLE DATA (OPSIONAL - untuk testing)
-- Uncomment untuk insert data sample

/*
-- Insert sample users
INSERT INTO users (id, name, email, role) VALUES
('admin-1', 'Admin User', 'admin@rai.com', 'admin'),
('user-1', 'Regular User', 'user@rai.com', 'user');

-- Insert sample university
INSERT INTO universities (
    id, slug, name, country, region, rank, trust_score,
    transparency, auditability, data_privacy, policy_maturity
) VALUES (
    'uni-1',
    'mit',
    'Massachusetts Institute of Technology',
    'United States',
    'North America',
    1,
    92,
    95,
    90,
    93,
    90
);

-- Insert sample submission
INSERT INTO submissions (id, name, status) VALUES
('sub-1', 'Stanford University', 'pending');
*/


-- ========================================
-- QUERY UNTUK VERIFIKASI
-- ========================================
-- Uncomment untuk melihat struktur yang telah dibuat

/*
-- Lihat semua tabel
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Lihat struktur tabel universities
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'universities'
ORDER BY ordinal_position;

-- Lihat semua ENUM types
SELECT n.nspname as schema, t.typname as type_name, e.enumlabel as enum_value
FROM pg_type t 
JOIN pg_enum e ON t.oid = e.enumtypid  
JOIN pg_catalog.pg_namespace n ON n.oid = t.typnamespace
WHERE n.nspname = 'public'
ORDER BY type_name, e.enumsortorder;

-- Lihat semua indexes
SELECT indexname, tablename, indexdef
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;

-- Lihat semua RLS policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
*/
