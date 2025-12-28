# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Documentation First

**IMPORTANT:** Before generating any code, ALWAYS first check the `/docs` directory for relevant documentation. The docs folder contains specifications, guidelines, and context that must be followed when implementing features or making changes. This ensures consistency and adherence to project standards.

- /docs/ui.md
- /docs/data-fetching.md
- /docs/auth.md
- /docs/data-mutations.md
- /docs/server-components.md
- /docs/routing.md

## Commands

- `npm run dev` - Start development server at http://localhost:3000
- `npm run build` - Build for production
- `npm run lint` - Run ESLint

## Architecture

This is a Next.js 16 application using the App Router with React 19.

**Tech Stack:**
- Next.js 16 with App Router
- React 19
- TypeScript (strict mode)
- Tailwind CSS 4
- Clerk for authentication

**Project Structure:**
- `src/app/` - App Router pages and layouts
- `src/proxy.ts` - Clerk middleware (uses `clerkMiddleware()`)
- Path alias: `@/*` maps to `./src/*`

## Authentication

Uses Clerk with `@clerk/nextjs`. Key patterns:
- `ClerkProvider` wraps the app in `layout.tsx`
- Use `<SignedIn>`, `<SignedOut>` for conditional rendering
- Use `auth()` from `@clerk/nextjs/server` for server-side auth (async)
- Middleware in `src/proxy.ts` handles route protection
