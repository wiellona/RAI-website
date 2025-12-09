# Implementasi Backend Supabase untuk Admin-FE

Implementasi backend Supabase telah berhasil ditambahkan ke branch Admin-FE. Berikut adalah ringkasan perubahan:

## 📦 Dependencies
- Installed `@supabase/supabase-js` package

## 🔧 Konfigurasi Supabase
- **`src/lib/supabase.ts`** - Client-side Supabase client
- **`src/lib/supabaseServer.ts`** - Server-side Supabase client dengan service role key

## 🛣️ API Routes

### Universities API
- **GET** `/api/universities` - Fetch semua universitas
- **GET** `/api/universities/[slug]` - Fetch universitas berdasarkan slug

### Admin API
- **GET** `/api/admin/submissions` - Fetch pending submissions
- **POST** `/api/admin/submissions/[id]/accept` - Accept submission
- **POST** `/api/admin/submissions/[id]/reject` - Reject submission
- **GET** `/api/admin/users` - Fetch semua users
- **PUT** `/api/admin/users/[id]/role` - Update user role
- **POST** `/api/admin/process-scores` - Process dan recalculate scores

### Rankings API
- **GET** `/api/rankings` - Fetch rankings
- **PUT** `/api/rankings/[id]/score` - Update ranking score

### Auth API
- **POST** `/api/auth/login` - User authentication

## 📝 Update File Yang Ada
- **`src/lib/api.ts`** - Updated untuk menggunakan API routes lokal (`/api`) daripada mock data. Tetap memiliki fallback ke mock data jika API gagal.

## ⚙️ Environment Variables
File `.env.example` telah dibuat. Copy file ini menjadi `.env.local` dan isi dengan credentials Supabase:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

## 🗄️ Database Schema yang Dibutuhkan

Anda perlu membuat tabel-tabel berikut di Supabase:

### Table: `universities`
```sql
CREATE TABLE universities (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  country TEXT NOT NULL,
  region TEXT NOT NULL,
  rank INTEGER NOT NULL,
  trustScore INTEGER NOT NULL,
  lastUpdated TEXT NOT NULL,
  metrics JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Table: `submissions`
```sql
CREATE TABLE submissions (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Table: `users`
```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## 🚀 Cara Menggunakan

1. Copy `.env.example` menjadi `.env.local`
2. Isi credentials Supabase di `.env.local`
3. Buat tabel-tabel yang diperlukan di Supabase
4. Restart development server: `npm run dev`
5. Aplikasi akan otomatis terhubung ke Supabase

## ✨ Fitur
- ✅ Tidak lagi bergantung pada mock data
- ✅ Koneksi langsung ke Supabase database
- ✅ API routes yang lengkap untuk semua operasi CRUD
- ✅ Fallback ke mock data jika koneksi gagal
- ✅ Server-side rendering dengan Next.js App Router
- ✅ Type-safe dengan TypeScript
