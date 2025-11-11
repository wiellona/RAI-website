# RAI Backend (template)

This folder contains a minimal Next.js app that acts as a backend API for the frontend.

How to run (development):

1. cd backend
2. npm install
3. npm run dev

The dev server runs on port 3001 by default (script uses -p 3001).

Set the frontend env to point to this backend before starting frontend dev:

Create `.env.local` in the frontend project root (RAI-website) with:

```
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api
```

Endpoints implemented (mock):
- GET  /api/universities
- GET  /api/universities/:slug
- GET  /api/rankings
- PUT  /api/rankings/:id/score
- GET  /api/admin/submissions
- POST /api/admin/submissions/:id/accept
- POST /api/admin/submissions/:id/reject
- GET  /api/admin/users
- PUT  /api/admin/users/:id/role
- POST /api/admin/process-scores
- POST /api/auth/login

Notes:
- This is a mock/template: data lives in `backend/src/lib/mockData.ts` and is in-memory.
- Replace the services in `backend/src/lib/services/serverServices.ts` with database logic when ready (Prisma/TypeORM/knex, etc.).
