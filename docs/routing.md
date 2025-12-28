# Routing Coding Standards

This document outlines the routing standards for the Lifting Diary project.

## Route Structure

**All application routes MUST be accessed via `/dashboard`.**

The `/dashboard` page and all sub-pages are protected routes that are only accessible by logged-in users.

```
/dashboard                     - Main dashboard page
/dashboard/workout/new         - Create new workout
/dashboard/workout/[workoutId] - View/edit specific workout
```

## Route Protection

### Middleware-Based Protection

Route protection MUST be implemented via Next.js middleware in `src/proxy.ts`. This ensures:

- Consistent protection across all dashboard routes
- Protection happens before the page renders
- Unauthenticated users are redirected to sign-in

### Current Middleware Configuration

The middleware uses Clerk's `clerkMiddleware()` with `createRouteMatcher` to protect routes:

```typescript
// src/proxy.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
```

## Rules

### DO

- ✅ Place all authenticated user features under `/dashboard`
- ✅ Use Next.js middleware for route protection
- ✅ Use Clerk's `createRouteMatcher` to define protected routes
- ✅ Call `auth.protect()` for protected routes in middleware

### DON'T

- ❌ Create authenticated routes outside of `/dashboard`
- ❌ Implement route protection in individual page components
- ❌ Use client-side redirects as the primary protection mechanism
- ❌ Rely solely on `<SignedIn>` / `<SignedOut>` for route protection

## Adding New Protected Routes

When adding new pages that require authentication:

1. Create the page under `src/app/dashboard/`
2. The route is automatically protected by the middleware pattern `/dashboard(.*)`
3. No additional protection code is needed in the page component

```
src/app/dashboard/
├── page.tsx                 # /dashboard
├── workout/
│   ├── new/
│   │   └── page.tsx         # /dashboard/workout/new
│   └── [workoutId]/
│       └── page.tsx         # /dashboard/workout/[workoutId]
└── settings/
    └── page.tsx             # /dashboard/settings (example)
```

## Public Routes

The root page (`/`) is the only public route. It serves as the landing page for unauthenticated users and should redirect authenticated users to `/dashboard`.

## Summary

| Requirement | Rule |
|-------------|------|
| Protected routes | All under `/dashboard` |
| Protection method | Next.js middleware (`src/proxy.ts`) |
| Route matcher | `createRouteMatcher(["/dashboard(.*)"])` |
| New protected pages | Add under `src/app/dashboard/` |
| Public routes | Root `/` only |
