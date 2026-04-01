# Acadex Client

Acadex Client is the modern web application for Acadex, a classroom-first study platform where students can join classrooms, organize subjects and folders, upload notes, track leaderboard activity, save favorites, and collaborate in a cleaner academic workflow.

## Live URLs

- Production App: [https://acadex-client.vercel.app](https://acadex-client.vercel.app)
- Production API: [https://acadex-server.vercel.app/api/v1](https://acadex-server.vercel.app/api/v1)

## Features

- Email/password and Google sign-in flow
- Role-aware dashboard experience for students, CRs, admins, and super admins
- Classroom creation, join flow, and classroom management
- Subject and folder organization for structured study materials
- Note upload, approval-aware browsing, and note detail pages
- Favorites, comments, and leaderboard experiences
- Notice center and admin management screens
- Responsive UI built with reusable component patterns

## Technologies Used

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- TanStack Query
- TanStack React Form
- Axios
- Radix UI and shadcn/ui patterns
- Framer Motion
- Zod
- Vercel deployment

## Setup Instructions

### 1. Install dependencies

```bash
npm install
```

### 2. Create your environment file

Create `Acadex-client/.env.local` with values similar to:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_BASE_URL=http://localhost:3000
ACCESS_TOKEN_SECRET=your_access_token_secret
```

Notes:

- `ACCESS_TOKEN_SECRET` should match the backend `ACCESS_TOKEN_SECRET`
- If your deployment still uses `JWT_ACCESS_SECRET`, keep it identical to the backend access token secret
- Some services also support `NEXT_PUBLIC_API_URL` as a fallback, but `NEXT_PUBLIC_API_BASE_URL` is the main value used across the app

### 3. Start the development server

```bash
npm run dev
```

The client will be available at [http://localhost:3000](http://localhost:3000).

### 4. Build for production

```bash
npm run build
npm run start
```
