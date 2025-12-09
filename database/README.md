# Database Schema Documentation

## 📋 Daftar Tabel

Database untuk RAI Website terdiri dari 3 tabel utama:

### 1. **users** 
Menyimpan data pengguna aplikasi
- **Columns:**
  - `id` (TEXT, PRIMARY KEY)
  - `name` (VARCHAR(255), NOT NULL)
  - `email` (VARCHAR(255), UNIQUE, NOT NULL)
  - `role` (user_role ENUM: 'admin', 'university', 'user')
  - `created_at` (TIMESTAMPTZ)
  - `updated_at` (TIMESTAMPTZ)

### 2. **submissions**
Menyimpan data submisi universitas yang menunggu persetujuan
- **Columns:**
  - `id` (TEXT, PRIMARY KEY)
  - `name` (VARCHAR(255), NOT NULL)
  - `status` (submission_status ENUM: 'pending', 'accepted', 'rejected')
  - `created_at` (TIMESTAMPTZ)
  - `updated_at` (TIMESTAMPTZ)

### 3. **universities**
Menyimpan data universitas yang sudah diranking
- **Columns:**
  - `id` (TEXT, PRIMARY KEY)
  - `slug` (VARCHAR(100), UNIQUE, NOT NULL)
  - `name` (VARCHAR(255), NOT NULL)
  - `country` (VARCHAR(100), NOT NULL)
  - `region` (VARCHAR(100), NOT NULL)
  - `rank` (INTEGER, UNIQUE, NOT NULL)
  - `trust_score` (INTEGER, 0-100)
  - `last_updated` (TIMESTAMPTZ)
  - `transparency` (INTEGER, 0-100)
  - `auditability` (INTEGER, 0-100)
  - `data_privacy` (INTEGER, 0-100)
  - `policy_maturity` (INTEGER, 0-100)
  - `created_at` (TIMESTAMPTZ)
  - `updated_at` (TIMESTAMPTZ)

## 🔄 Database ↔ TypeScript Mapping

### Perbedaan Naming Convention

**Database (PostgreSQL)**: Menggunakan `snake_case`
**TypeScript**: Menggunakan `camelCase`

| Database Column | TypeScript Property |
|----------------|---------------------|
| `trust_score` | `trustScore` |
| `last_updated` | `lastUpdated` |
| `data_privacy` | `dataPrivacy` (nested in metrics) |
| `policy_maturity` | `policyMaturity` (nested in metrics) |

### Struktur Metrics

**Database**: Kolom terpisah (flat structure)
```sql
transparency INTEGER,
auditability INTEGER,
data_privacy INTEGER,
policy_maturity INTEGER
```

**TypeScript**: Nested object
```typescript
metrics: {
  transparency: number;
  auditability: number;
  dataPrivacy: number;
  policyMaturity: number;
}
```

### Automatic Mapping

File `src/lib/dbMappers.ts` menyediakan fungsi untuk mapping otomatis:
- `mapDbToUniversity()` - Database → TypeScript
- `mapUniversityToDb()` - TypeScript → Database

## 📊 Custom Types (ENUM)

### user_role
- `admin` - Administrator dengan akses penuh
- `university` - Representatif universitas
- `user` - Pengguna biasa

### submission_status
- `pending` - Menunggu review
- `accepted` - Diterima
- `rejected` - Ditolak

## 🔍 Indexes

Untuk performa query yang lebih baik:
- `idx_universities_region` - Filter by region
- `idx_universities_country` - Filter by country
- `idx_universities_trust_score` - Sort by score
- `idx_universities_rank` - Sort by rank
- `idx_universities_slug` - Lookup by slug
- `idx_submissions_status` - Filter submissions
- `idx_users_email` - User lookup
- `idx_users_role` - Filter by role

## 🔒 Row Level Security (RLS)

Semua tabel memiliki RLS enabled dengan policies:
- **Universities**: Public read, admin full access
- **Submissions**: Public read, admin full access
- **Users**: Users can view own data, admin full access

## 🚀 Cara Setup

1. Buka Supabase SQL Editor
2. Copy isi file `schema.sql`
3. Jalankan script
4. Verifikasi dengan query yang tersedia di bagian bawah file

## 🔄 Auto-Update Timestamp

Semua tabel memiliki trigger yang otomatis update kolom `updated_at` saat ada perubahan data.

## ✅ Backend Compatibility Check

Backend API sudah **100% kompatibel** dengan schema SQL:
- ✅ Automatic snake_case ↔ camelCase conversion
- ✅ Flat columns ↔ nested metrics mapping
- ✅ Type-safe dengan TypeScript
- ✅ Semua API routes sudah menggunakan `dbMappers`

## 📝 Catatan Penting

- Pastikan menggunakan Supabase atau PostgreSQL 12+
- RLS policies disesuaikan dengan kebutuhan security
- Sample data tersedia di file schema (dalam komentar)
- Untuk production, pertimbangkan menambahkan foreign keys dan constraints tambahan
- Backend sudah siap langsung terhubung ke database tanpa perlu modifikasi tambahan
