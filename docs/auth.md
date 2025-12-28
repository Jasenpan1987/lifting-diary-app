# Authentication Coding Standards

This document outlines the authentication coding standards for the Lifting Diary project.

## Authentication Provider

**This application uses [Clerk](https://clerk.com) for authentication.**

- Package: `@clerk/nextjs`
- Do NOT use other authentication libraries
- Do NOT implement custom authentication solutions

## Setup

### ClerkProvider

The `ClerkProvider` must wrap the entire application in the root layout:

```typescript
// src/app/layout.tsx
import { ClerkProvider } from "@clerk/nextjs";

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
```

### Middleware

Clerk middleware handles route protection and must be configured in `src/proxy.ts`:

```typescript
// src/proxy.ts
import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
```

## Client-Side Components

### Conditional Rendering Based on Auth State

Use Clerk's built-in components for showing/hiding UI based on authentication:

```typescript
import { SignedIn, SignedOut } from "@clerk/nextjs";

// Content only visible to authenticated users
<SignedIn>
  <Dashboard />
</SignedIn>

// Content only visible to unauthenticated users
<SignedOut>
  <LandingPage />
</SignedOut>
```

### Sign In / Sign Up Buttons

Use Clerk's pre-built button components:

```typescript
import { SignInButton, SignUpButton } from "@clerk/nextjs";

<SignInButton mode="modal" />
<SignUpButton mode="modal" />
```

### User Button

Display a user avatar with dropdown menu for account management:

```typescript
import { UserButton } from "@clerk/nextjs";

<UserButton />
```

## Server-Side Authentication

### Getting the Current User

Use the `auth()` function from `@clerk/nextjs/server` to get the current user's ID:

```typescript
import { auth } from "@clerk/nextjs/server";

export async function someServerAction() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  // userId is now available for database queries
}
```

### Required Pattern for Data Access

Every database query MUST:

1. Get the current user's ID via `auth()`
2. Throw an error if no user is authenticated
3. Filter ALL queries by `userId` to ensure data isolation

```typescript
import { auth } from "@clerk/nextjs/server";

export async function getUserData() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  return db.query.someTable.findMany({
    where: eq(someTable.userId, userId),
  });
}
```

## Security Rules

### User Data Isolation

**A logged-in user MUST only be able to access their own data. Users MUST NOT be able to see other users' data.**

### Never Trust Client-Provided User IDs

- ❌ Never accept `userId` as a parameter from the client
- ✅ Always get `userId` from `auth()` on the server

```typescript
// ❌ WRONG - Don't do this
export async function getData(userId: string) {
  return db.query.data.findMany({
    where: eq(data.userId, userId), // User could pass any ID!
  });
}

// ✅ CORRECT - Always use auth()
export async function getData() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  return db.query.data.findMany({
    where: eq(data.userId, userId),
  });
}
```

## Summary

| Requirement | Rule |
|-------------|------|
| Auth provider | Clerk (`@clerk/nextjs`) ONLY |
| Provider setup | `ClerkProvider` in root layout |
| Middleware | `clerkMiddleware()` in `src/proxy.ts` |
| Conditional UI | Use `<SignedIn>` and `<SignedOut>` |
| Server auth | Use `auth()` from `@clerk/nextjs/server` |
| User ID source | ALWAYS from `auth()`, never from client |
| Data isolation | ALWAYS filter queries by authenticated `userId` |
