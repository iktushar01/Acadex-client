# Acadex Client

The web frontend for **Acadex** — a classroom-first study platform where students join digital classrooms, share notes, chat in real time, and study with an AI assistant grounded in their class materials.

| | |
|---|---|
| **Live** | [acadex-client.vercel.app](https://acadex-client.vercel.app) |
| **API** | [acadex-server.vercel.app/api/v1](https://acadex-server.vercel.app/api/v1) |
| **Full docs** | [DOCUMENTATION.md](./DOCUMENTATION.md) |

---

## At a glance

- **Classroom hub** — join with a code, organize subjects/folders, share PDF and image notes  
- **CR moderation** — class representatives approve uploads and manage curriculum  
- **Real-time chat** — Pusher-powered group chat per classroom  
- **AI Study Assistant** — streaming RAG Q&A over approved class notes  
- **Student tools** — GPA calculator, timetables, flashcards, cover pages, exam planner  
- **Admin panel** — platform stats, classroom moderation, global notices  

**Stack:** Next.js 16 · React 19 · TypeScript · Tailwind CSS 4 · TanStack Query · Pusher · Vercel

---

## Quick start

```bash
pnpm install
```

Create `.env.local`:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_BASE_URL=http://localhost:3000
ACCESS_TOKEN_SECRET=your_access_token_secret

# Optional — real-time chat
NEXT_PUBLIC_PUSHER_KEY=your_pusher_key
NEXT_PUBLIC_PUSHER_CLUSTER=ap1
```

```bash
pnpm dev    # http://localhost:3000
```

Requires [Acadex Server](../Acadex-server) running locally on port 5000.

---

## Documentation

| Document | Audience | Contents |
|----------|----------|----------|
| **[DOCUMENTATION.md](./DOCUMENTATION.md)** | Users, recruiters, developers | Product overview, user flows, features, architecture, deployment |
| **[/Developer](https://acadex-client.vercel.app/Developer)** | Contributors | Interactive setup guide in the app |

**Server docs:** [Acadex-server/DOCUMENTATION.md](../Acadex-server/DOCUMENTATION.md)

---

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Development server |
| `pnpm build` | Production build |
| `pnpm start` | Serve production build |
| `pnpm lint` | ESLint |

---

## Repository layout

```
src/
├── app/           # Pages & API routes (App Router)
├── actions/       # Server Actions
├── services/      # API clients
├── components/    # UI modules
├── hooks/         # Client hooks
└── lib/           # Auth, HTTP, utilities
```

See [DOCUMENTATION.md](./DOCUMENTATION.md) for detailed architecture and user journeys.
