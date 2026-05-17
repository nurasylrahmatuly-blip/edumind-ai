---
name: EduMind AI project context
description: Day 1 foundation — what was built, tech stack decisions, and Day 2 scope
type: project
---

Multi-agent educational SaaS for students. Working dir: `c:\Users\админ\Downloads\EduMind AI 2.0`.

**Why:** User is building this from scratch, Day 1 = foundation. Day 2 = AI chat + document generation.

**Stack:** Next.js 14 App Router, TypeScript strict, Tailwind + shadcn/ui, Prisma 5 + PostgreSQL (Neon), NextAuth v5 beta, Anthropic API.

**Key decisions:**
- Folder name "EduMind AI 2.0" breaks `create-next-app` (npm name restrictions), so all files were created manually.
- `nodemailer@^7.0.7` required (not v6) — next-auth beta.31 peer dep.
- Russian UI language throughout.
- Purple primary: HSL `245 60% 66%` = `#7F77DD`.

**How to apply:** On Day 2+ always check existing file structure before adding. Auth is NextAuth v5 — use `auth()` server-side, `useSession()` client-side.
