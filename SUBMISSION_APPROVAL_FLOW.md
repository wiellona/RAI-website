# Submission Approval Flow

## Overview
Sistem approval menggunakan 3 status pada tabel `Profiles`:

### Status Matrix

| `is_approved` | `is_rejected` | Status | Tampil di Admin? | Tampil di Rankings? |
|--------------|---------------|--------|------------------|---------------------|
| `false` | `false` | **PENDING** | ✅ Yes (Submissions) | ❌ No |
| `true` | `false` | **APPROVED** | ❌ No | ✅ Yes |
| `false` | `true` | **REJECTED** | ❌ No | ❌ No |

## Database Schema

```sql
-- Profiles table structure
CREATE TABLE public."Profiles" (
    id uuid PRIMARY KEY,
    name text,
    is_approved boolean NOT NULL DEFAULT false,
    is_rejected boolean NOT NULL DEFAULT false,
    role user_role NOT NULL DEFAULT 'user',
    created_at timestamptz DEFAULT now()
);
```

## API Behavior

### GET `/api/admin/submissions`
Menampilkan universities dengan `is_approved = false AND is_rejected = false`

### POST `/api/admin/submissions/[id]/accept`
```sql
UPDATE Profiles 
SET is_approved = true 
WHERE name = (SELECT pic_name FROM Universities WHERE id = [id])
```

### POST `/api/admin/submissions/[id]/reject`
```sql
UPDATE Profiles 
SET is_rejected = true 
WHERE name = (SELECT pic_name FROM Universities WHERE id = [id])
```

### GET `/api/rankings`
Menampilkan universities dengan `is_approved = true AND is_rejected = false`

## Migration Steps

1. **Jalankan migration SQL:**
   ```bash
   # Di Supabase SQL Editor
   ```
   ```sql
   ALTER TABLE public."Profiles"
     ADD COLUMN IF NOT EXISTS is_rejected boolean NOT NULL DEFAULT false;
   ```

2. **Restart development server:**
   ```bash
   npm run dev
   ```

3. **Test flow:**
   - Submit university → Muncul di "University Submissions"
   - Click "Accept" → Hilang dari submissions, muncul di rankings
   - Submit university lain → Muncul di submissions
   - Click "Decline" → Hilang dari submissions, TIDAK muncul lagi

## Benefits

✅ **Tidak mengubah tipe data** - Tetap menggunakan boolean  
✅ **Data tidak hilang** - Rejected profiles tetap ada di database  
✅ **Clean UI** - Rejected submissions tidak muncul lagi  
✅ **Audit trail** - Bisa track siapa yang di-reject  
✅ **Reversible** - Bisa "unreject" jika diperlukan dengan `UPDATE is_rejected = false`

## Optional: Unreject Feature

Jika suatu saat perlu "unreject" profile:

```sql
UPDATE public."Profiles"
SET is_rejected = false
WHERE name = 'Profile Name';
```

Atau buat API endpoint `/api/admin/submissions/unreject` untuk fitur ini.
