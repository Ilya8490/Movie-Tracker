# Movie Tracker

Production-ready MVP for tracking movies, lists, reviews, and watching analytics.

## Stack

- Frontend: Next.js App Router, TypeScript, Tailwind CSS, TanStack Query, React Hook Form, Zod
- Backend: Express, TypeScript, Prisma, PostgreSQL, JWT
- Shared: TypeScript package for common enums and types

## Apps

- `apps/web`: Next.js frontend
- `apps/api`: Express API
- `packages/shared`: shared types and enums

## Setup

1. Copy `.env.example` to `.env`.
2. Install dependencies with `npm install`.
3. Run `npm run prisma:generate`.
4. Run `npm run prisma:migrate`.
5. Start API with `npm run dev:api`.
6. Start web with `npm run dev:web`.
