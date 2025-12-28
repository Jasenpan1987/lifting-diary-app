# Data Fetching Guidelines

## CRITICAL: Server Components Only

**ALL data fetching in this application MUST be done via Server Components.**

Data fetching is **NOT** allowed via:
- ❌ Route handlers (API routes)
- ❌ Client components
- ❌ `useEffect` or any client-side fetching hooks
- ❌ Third-party client-side data fetching libraries

Data fetching **MUST** be done via:
- ✅ Server Components only

## Database Queries

### Use the `/data` Directory

All database queries **MUST** be performed through helper functions located in the `/data` directory.

```
src/
  data/
    workouts.ts    # Workout-related queries
    exercises.ts   # Exercise-related queries
    sets.ts        # Set-related queries
    ...
```

### Use Drizzle ORM

All database queries **MUST** use Drizzle ORM.

- ✅ Use Drizzle query builder
- ❌ **DO NOT** use raw SQL queries

### Example Pattern

```typescript
// src/data/workouts.ts
import { db } from "@/db";
import { workouts } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq, and } from "drizzle-orm";

export async function getWorkouts() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  return db.query.workouts.findMany({
    where: eq(workouts.userId, userId),
  });
}

export async function getWorkoutById(id: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  return db.query.workouts.findFirst({
    where: and(
      eq(workouts.id, id),
      eq(workouts.userId, userId)  // CRITICAL: Always filter by userId
    ),
  });
}
```

## Security: User Data Isolation

### THIS IS EXTREMELY IMPORTANT

**A logged-in user MUST only be able to access their own data. Users MUST NOT be able to see other users' data.**

Every database query **MUST**:

1. Get the current user's ID via `auth()` from `@clerk/nextjs/server`
2. Filter ALL queries by `userId` to ensure data isolation
3. Throw an error if no user is authenticated

### Required Pattern for All Queries

```typescript
import { auth } from "@clerk/nextjs/server";

export async function getSomeData() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  // ALWAYS include userId in the where clause
  return db.query.someTable.findMany({
    where: eq(someTable.userId, userId),
  });
}
```

### Never Trust Client-Provided User IDs

- ❌ Never accept `userId` as a parameter from the client
- ✅ Always get `userId` from `auth()` on the server

## Summary

| Requirement | Rule |
|-------------|------|
| Data fetching location | Server Components ONLY |
| Database access | Through `/data` directory helpers |
| Query method | Drizzle ORM (NO raw SQL) |
| User data access | ALWAYS filter by authenticated userId |
| User ID source | ALWAYS from `auth()`, never from client |
