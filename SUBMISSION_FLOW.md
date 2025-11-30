# Submission Flow Documentation

## Database Schema Overview

Berdasarkan `database/scheme.sql`, sistem submission menggunakan struktur:

### Tables Terkait

1. **Universities** - Data universitas yang mendaftar
2. **Submissions** - Tracking submission kuesioner
3. **Questionnaires** - Template kuesioner
4. **Questions** - Pertanyaan dalam kuesioner
5. **Options** - Pilihan jawaban untuk setiap pertanyaan
6. **Answers** - Jawaban yang dipilih user untuk setiap pertanyaan

### Status Flow

```
draft → submitted → approved/rejected
```

- **draft**: Submission masih dalam proses pengisian
- **submitted**: Submission sudah dikirim, menunggu review admin
- **approved**: Admin menyetujui submission
- **rejected**: Admin menolak submission

## API Endpoints

### GET `/api/admin/submissions`
Mengambil semua submissions dengan status "submitted" (pending review).

**Response:**
```json
[
  {
    "id": "uuid",
    "university_id": "uuid",
    "questionnaire_id": "uuid",
    "submitted_by_user_id": "uuid",
    "submitted_at": "2025-11-24T10:00:00Z",
    "status": "submitted",
    "university": {
      "name": "Stanford University",
      "website": "https://stanford.edu",
      "address": "450 Serra Mall, Stanford, CA",
      "date_of_establishment": "1885-10-01",
      "dean_name": "Dr. Jennifer Widom",
      "pic_name": "John Smith",
      "pic_email": "john@stanford.edu"
    },
    "questionnaire": {
      "title": "Responsible AI Assessment 2025",
      "version": "1",
      "description": "Comprehensive assessment..."
    }
  }
]
```

### POST `/api/admin/submissions/[id]/accept`
Approve submission (ubah status menjadi "approved").

**Response:**
```json
{ "success": true }
```

### POST `/api/admin/submissions/[id]/reject`
Reject submission (ubah status menjadi "rejected").

**Response:**
```json
{ "success": true }
```

## Frontend Components

### UniversitySubmissions Component
Location: `src/components/admin/UniversitySubmissions.tsx`

**Props:**
- `submissions`: Array of Submission objects
- `onAccept`: Callback when Accept button clicked
- `onReject`: Callback when Decline button clicked

**Features:**
- Display list of pending submissions
- Show university name from joined data
- Show submission date
- "View Details" link to detailed page
- Accept/Decline buttons

### Admin Page
Location: `src/app/admin/page.tsx`

Menggunakan `getRankings()` dari `src/lib/api.ts` yang:
- Memanggil `/api/admin/submissions`
- Handle accept/reject actions
- Refresh data setelah action

## Sample SQL Queries

### Insert Test University
```sql
INSERT INTO public."Universities" (
  id, name, website, address, date_of_establishment, dean_name, pic_name, pic_email
) VALUES (
  gen_random_uuid(),
  'Stanford University',
  'https://www.stanford.edu',
  '450 Serra Mall, Stanford, CA 94305, USA',
  '1885-10-01',
  'Dr. Jennifer Widom',
  'John Smith',
  'john.smith@stanford.edu'
);
```

### Insert Test Questionnaire
```sql
INSERT INTO public."Questionnaires" (id, title, version, description)
VALUES (
  gen_random_uuid(),
  'Responsible AI Assessment 2025',
  1,
  'Comprehensive assessment of AI ethics and governance practices'
);
```

### Insert Test Submission (Easy Way - Use CTE)
```sql
-- OPTION 1: Jika Anda sudah login (gunakan user yang sedang login)
WITH new_university AS (
  INSERT INTO public."Universities" (name, website, address, pic_name, pic_email)
  VALUES ('Stanford University', 'https://stanford.edu', '450 Serra Mall, CA', 'John Smith', 'john@stanford.edu')
  RETURNING id
),
new_questionnaire AS (
  INSERT INTO public."Questionnaires" (title, version, description)
  VALUES ('Responsible AI Assessment 2025', 1, 'Comprehensive AI ethics assessment')
  RETURNING id
)
INSERT INTO public."Submissions" (
  university_id,
  questionnaire_id,
  submitted_by_user_id,
  status
)
SELECT 
  (SELECT id FROM new_university),
  (SELECT id FROM new_questionnaire),
  auth.uid(), -- User yang sedang login
  'submitted'
RETURNING *;
```

```sql
-- OPTION 2: Jika tidak ada user login, set submitted_by_user_id = NULL
WITH new_university AS (
  INSERT INTO public."Universities" (name, website, address, pic_name, pic_email)
  VALUES ('MIT', 'https://mit.edu', '77 Massachusetts Ave', 'Jane Doe', 'jane@mit.edu')
  RETURNING id
),
new_questionnaire AS (
  INSERT INTO public."Questionnaires" (title, version, description)
  VALUES ('Responsible AI Assessment 2025', 1, 'Comprehensive AI ethics assessment')
  RETURNING id
)
INSERT INTO public."Submissions" (
  university_id,
  questionnaire_id,
  submitted_by_user_id,
  status
)
SELECT 
  (SELECT id FROM new_university),
  (SELECT id FROM new_questionnaire),
  NULL, -- Set NULL jika tidak ada user (foreign key ON DELETE SET NULL)
  'submitted'
RETURNING *;
```

```sql
-- OPTION 3: Gunakan user yang sudah ada di database
-- First, check existing users:
SELECT id, email FROM auth.users LIMIT 5;

-- Then insert using existing user ID:
WITH new_university AS (
  INSERT INTO public."Universities" (name, website, address, pic_name, pic_email)
  VALUES ('Oxford University', 'https://ox.ac.uk', 'Oxford, UK', 'Dr. Smith', 'smith@ox.ac.uk')
  RETURNING id
),
new_questionnaire AS (
  INSERT INTO public."Questionnaires" (title, version, description)
  VALUES ('Responsible AI Assessment 2025', 1, 'Comprehensive AI ethics assessment')
  RETURNING id
)
INSERT INTO public."Submissions" (
  university_id,
  questionnaire_id,
  submitted_by_user_id,
  status
)
SELECT 
  (SELECT id FROM new_university),
  (SELECT id FROM new_questionnaire),
  (SELECT id FROM auth.users LIMIT 1), -- Gunakan user pertama yang ada
  'submitted'
RETURNING *;
```

### OR: Insert Step by Step
```sql
-- Step 1: Insert University and get ID
INSERT INTO public."Universities" (name, website, address, pic_name, pic_email)
VALUES ('MIT', 'https://mit.edu', '77 Massachusetts Ave, Cambridge', 'Jane Doe', 'jane@mit.edu')
RETURNING id;
-- Copy the UUID from result, e.g.: a1b2c3d4-e5f6-7890-abcd-ef1234567890

-- Step 2: Insert Questionnaire and get ID  
INSERT INTO public."Questionnaires" (title, version)
VALUES ('AI Ethics Survey 2025', 1)
RETURNING id;
-- Copy the UUID from result, e.g.: b2c3d4e5-f6g7-8901-bcde-f12345678901

-- Step 3: Insert Submission (paste UUIDs from step 1 & 2)
INSERT INTO public."Submissions" (university_id, questionnaire_id, submitted_by_user_id, status)
VALUES (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890'::uuid,  -- Replace with UUID from step 1
  'b2c3d4e5-f6g7-8901-bcde-f12345678901'::uuid,  -- Replace with UUID from step 2
  gen_random_uuid(),
  'submitted'
);
```

### Query to View Submissions with University Details
```sql
SELECT 
  s.id,
  s.status,
  s.submitted_at,
  u.name as university_name,
  u.pic_name,
  u.pic_email,
  q.title as questionnaire_title
FROM public."Submissions" s
JOIN public."Universities" u ON s.university_id = u.id
JOIN public."Questionnaires" q ON s.questionnaire_id = q.id
WHERE s.status = 'submitted'
ORDER BY s.submitted_at DESC;
```

### Update Submission Status (Approve)
```sql
UPDATE public."Submissions"
SET status = 'approved'
WHERE id = 'submission-uuid';
```

### Update Submission Status (Reject)
```sql
UPDATE public."Submissions"
SET status = 'rejected'
WHERE id = 'submission-uuid';
```

## Testing Steps

1. **Setup Database**
   - Jalankan `database/scheme.sql` di Supabase SQL Editor
   - Pastikan RLS policies sudah aktif

2. **Insert Test Data**
   - Insert 1 university
   - Insert 1 questionnaire
   - Insert 1 submission dengan status "submitted"

3. **Test Frontend**
   - Login sebagai admin
   - Navigate ke `/admin`
   - Lihat submission muncul di "University Submissions"
   - Click "View Details" untuk melihat detail
   - Click "Accept" atau "Decline"
   - Verify status berubah di database

4. **Verify Database**
   ```sql
   SELECT * FROM public."Submissions" ORDER BY submitted_at DESC;
   ```

## Notes

- **RLS (Row Level Security)** sudah diaktifkan di semua tabel
- Admin perlu bypass RLS dengan service_role_key
- User regular hanya bisa lihat submission mereka sendiri
- Status "draft" dan "submitted" bisa dilihat oleh user
- Status "approved" dan "rejected" hanya untuk admin tracking

## Error Handling

Jika submission tidak muncul, check:
1. ✅ Database memiliki data dengan status "submitted"
2. ✅ RLS policies allow admin to read
3. ✅ Supabase credentials benar di `.env.local`
4. ✅ Join query benar (Universities, Questionnaires)
5. ✅ Frontend error di console browser
