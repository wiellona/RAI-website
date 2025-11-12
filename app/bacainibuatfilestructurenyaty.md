# RAI Website - App Structure

## 📁 Folder Structure

```
app/
├── (auth)/                          # Authentication routes group
│   ├── login/
│   │   └── page.tsx                 # Login page - /login
│   └── register/
│       └── page.tsx                 # Register page - /register
│
├── questionnaire/                   # Questionnaire flow
│   ├── general-info/
│   │   └── page.tsx                 # General info form - /questionnaire/general-info
│   ├── criteria/
│   │   └── page.tsx                 # 8 Criteria questions - /questionnaire/criteria
│   ├── review/
│   │   └── page.tsx                 # Review & validation - /questionnaire/review
│   └── submission/
│       └── page.tsx                 # Success page - /questionnaire/submission
│
├── components/
│   └── Navbar.tsx                   # Shared navigation component
│
├── page.tsx                         # Landing page - /
├── layout.tsx                       # Root layout
└── globals.css                      # Global styles
```

## 🔄 User Flow

### Authentication Flow

1. **Landing Page** (`/`)

   - View information about RAI
   - Click "Login" or "Explore Ranking" → redirects to `/login`

2. **Register** (`/register`)

   - Fill registration form
   - Submit → redirects to `/login`

3. **Login** (`/login`)
   - Enter email & password (dummy auth)
   - Submit → redirects to `/questionnaire/general-info`

### Questionnaire Flow

4. **General Info** (`/questionnaire/general-info`)

   - Fill institution information (9 fields)
   - Submit → redirects to `/questionnaire/criteria`

5. **Criteria Questions** (`/questionnaire/criteria`)

   - 8 Criteria sections with 2 questions each
   - Navigate between criteria using sidebar
   - Progress tracking & score calculation
   - "Review & Submit" → redirects to `/questionnaire/review`

6. **Review** (`/questionnaire/review`)

   - Check completion status of all 8 criteria
   - Go back to edit or submit
   - Submit → redirects to `/questionnaire/submission`

7. **Submission Success** (`/questionnaire/submission`)
   - Confirmation message
   - "Return to Home" → redirects to `/`

## 💾 Data Storage (localStorage)

### User-Specific Keys

- `generalInfo_{userEmail}` - Stores general information per user
- `questionnaireAnswers_{userEmail}` - Stores questionnaire answers per user

### Auth Keys

- `isLoggedIn` - Boolean flag for login status
- `userEmail` - Current logged-in user email
- `universityName` - University name from registration

## 🎨 Components

### Navbar.tsx

Shared navigation component that:

- Shows/hides Login/Logout button based on auth status
- Clears user-specific data on logout
- Used across all pages for consistency

## 📝 Notes for Backend Integration

When implementing the backend API:

1. **Authentication Endpoints**

   - `POST /api/auth/register` - Replace localStorage in `/register/page.tsx`
   - `POST /api/auth/login` - Replace localStorage in `/login/page.tsx`
   - `POST /api/auth/logout` - Replace localStorage clear in `Navbar.tsx`

2. **Questionnaire Endpoints**

   - `GET /api/questionnaire/general-info` - Load saved general info
   - `POST /api/questionnaire/general-info` - Save general info
   - `GET /api/questionnaire/answers` - Load saved answers
   - `POST /api/questionnaire/answers` - Save/update answers
   - `GET /api/questionnaire/review` - Get completion status
   - `POST /api/questionnaire/submit` - Final submission

3. **Data Format**
   - General Info: 9 fields (institutionName, dateEstablishment, etc.)
   - Answers: Key-value pairs where key is question ID (e.g., "1.1", "1.2")
   - Each answer has `value` (0-100) and optional `evidence` field

## 🚀 Development

- All pages use "use client" directive (client-side rendering)
- Routing uses Next.js App Router conventions
- Folder names in parentheses like `(auth)` don't affect URL structure
