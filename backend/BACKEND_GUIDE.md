# Backend Integration Guide

## Overview
Backend ini menyediakan dua pilihan service layer:
1. **Mock Services** (`serverServices.ts`) - Untuk development/demo tanpa database
2. **Supabase Services** (`supabaseServices.ts`) - Untuk production dengan Supabase database

## Database Schema
Database menggunakan PostgreSQL melalui Supabase dengan struktur sebagai berikut:

### Tables

#### 1. Universities
Menyimpan data universitas yang sudah diranking.

```sql
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
```

#### 2. Submissions
Menyimpan submisi universitas yang masih pending review.

```sql
CREATE TABLE submissions (
    id TEXT PRIMARY KEY,
    university_id TEXT,
    questionnaire_id TEXT,
    submitted_by_user_id TEXT,
    status submission_status NOT NULL DEFAULT 'pending',
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

#### 3. Users
Menyimpan data pengguna dan admin.

```sql
CREATE TABLE users (
    id TEXT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role user_role NOT NULL DEFAULT 'user',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### ENUM Types

```sql
CREATE TYPE user_role AS ENUM ('admin', 'university', 'user');
CREATE TYPE submission_status AS ENUM ('pending', 'accepted', 'rejected');
```

## API Routes

### Public Routes

#### GET `/api/universities`
Mengambil semua data universitas.

**Response:**
```json
[
  {
    "id": "uni-1",
    "slug": "mit",
    "name": "Massachusetts Institute of Technology",
    "country": "United States",
    "region": "North America",
    "rank": 1,
    "trustScore": 92,
    "lastUpdated": "2025-11-24T10:00:00Z",
    "metrics": {
      "transparency": 95,
      "auditability": 90,
      "dataPrivacy": 93,
      "policyMaturity": 90
    }
  }
]
```

#### GET `/api/universities/[slug]`
Mengambil detail universitas berdasarkan slug.

**Response:** Same structure as above (single object)

#### GET `/api/rankings`
Mengambil ranking universitas (sama dengan `/api/universities`).

### Admin Routes

#### GET `/api/admin/submissions`
Mengambil semua submisi yang pending.

**Response:**
```json
[
  {
    "id": "sub-1",
    "university_id": "uni-1",
    "questionnaire_id": "q-1",
    "submitted_by_user_id": "user-1",
    "submitted_at": "2025-11-20T10:00:00Z",
    "status": "pending"
  }
]
```

#### POST `/api/admin/submissions/[id]/accept`
Menerima submisi.

**Response:**
```json
{ "success": true }
```

#### POST `/api/admin/submissions/[id]/reject`
Menolak submisi.

**Response:**
```json
{ "success": true }
```

#### GET `/api/admin/users`
Mengambil semua user.

**Response:**
```json
[
  {
    "id": "user-1",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "admin"
  }
]
```

#### PUT `/api/admin/users/[id]/role`
Update role user.

**Request Body:**
```json
{ "role": "admin" }
```

**Response:**
```json
{ "success": true }
```

#### POST `/api/admin/analyze-university`
Menganalisis universitas menggunakan Gemini AI.

**Request Body:**
```json
{ "universityId": "uni-1" }
```

**Response:**
```json
{
  "success": true,
  "universityName": "MIT",
  "analysis": "AI-generated analysis text..."
}
```

## Environment Variables

Pastikan file `.env.local` berisi:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Gemini AI
GEMINI_API_KEY=your-gemini-api-key
```

## Switching Between Mock and Real Database

### Using Mock Data (Current - Development)
File `backend/src/lib/services/serverServices.ts` saat ini menggunakan mock data.

### Using Supabase (Production)
Untuk menggunakan database Supabase:

1. Pastikan schema database sudah dijalankan di Supabase SQL Editor
2. Ganti import di route files dari:
   ```typescript
   import { getUniversities } from "@/lib/services/serverServices";
   ```
   
   Menjadi:
   ```typescript
   import { getUniversities } from "@/lib/services/supabaseServices";
   ```

3. Atau buat file config switch:
   ```typescript
   // lib/services/index.ts
   const USE_SUPABASE = process.env.USE_SUPABASE === 'true';
   
   export * from USE_SUPABASE 
     ? './supabaseServices' 
     : './serverServices';
   ```

## Database Migration Steps

1. **Buat project Supabase** di https://supabase.com
2. **Jalankan schema** dari `database/schema.sql` di SQL Editor
3. **Insert sample data** (optional - uncomment section di schema.sql)
4. **Update .env.local** dengan credentials Supabase
5. **Switch ke supabaseServices** di route handlers
6. **Test endpoints** untuk memastikan koneksi database berhasil

## Gemini AI Integration

### Model yang Digunakan
- **gemini-1.5-flash** - Model terbaru yang stabil dan cepat

### Troubleshooting Gemini AI
Jika error saat menggunakan Gemini AI:

1. **Periksa API Key**: Pastikan `GEMINI_API_KEY` valid di `.env.local`
2. **Model Name**: Gunakan model yang valid (`gemini-1.5-flash`, `gemini-1.5-pro`)
3. **Rate Limiting**: Gemini free tier memiliki limit request per menit
4. **Error Handling**: Check console log untuk detail error

### Testing Gemini AI
```bash
# Test endpoint
curl -X POST http://localhost:3000/api/admin/analyze-university \
  -H "Content-Type: application/json" \
  -d '{"universityId": "uni-1"}'
```

## Notes
- Row Level Security (RLS) sudah diaktifkan di Supabase
- Auto-update timestamp menggunakan trigger
- Indexes sudah dibuat untuk query optimization
- ENUM types memastikan data consistency
