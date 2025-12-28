# Data Mutations Coding Standards

This document outlines the coding standards for all data mutations in the Lifting Diary project.

## Architecture Overview

Data mutations follow a two-layer architecture:

1. **Data Layer** (`src/data/`) - Helper functions that wrap Drizzle ORM database calls
2. **Action Layer** (colocated `actions.ts`) - Server actions that validate input and call data helpers

## Data Layer (`src/data/`)

**All database mutations MUST be implemented as helper functions within the `src/data/` directory.**

### Requirements

- All database calls MUST use Drizzle ORM
- Each function should handle a single, focused database operation
- Functions must be properly typed with TypeScript

### Example

```typescript
// src/data/workouts.ts
import { db } from "@/db";
import { workouts } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function createWorkout(data: {
  userId: string;
  name: string;
  date: Date;
}) {
  const [workout] = await db
    .insert(workouts)
    .values(data)
    .returning();

  return workout;
}

export async function deleteWorkout(id: string) {
  await db.delete(workouts).where(eq(workouts.id, id));
}
```

## Server Actions (`actions.ts`)

**All data mutations MUST be performed via server actions defined in colocated `actions.ts` files.**

### Requirements

| Rule | Details |
|------|---------|
| File name | MUST be `actions.ts` |
| Location | Colocated with the consuming component/page |
| Directive | `"use server"` at top of file |
| Parameters | MUST be explicitly typed |
| FormData | NEVER use `FormData` as a parameter type |
| Validation | ALL arguments MUST be validated with Zod |
| Navigation | NEVER use `redirect()` inside server actions |

### Example

```typescript
// src/app/workouts/actions.ts
"use server";

import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { createWorkout, deleteWorkout } from "@/data/workouts";

const createWorkoutSchema = z.object({
  name: z.string().min(1).max(100),
  date: z.coerce.date(),
});

const deleteWorkoutSchema = z.object({
  id: z.string().uuid(),
});

export async function createWorkoutAction(
  params: z.infer<typeof createWorkoutSchema>
) {
  const validated = createWorkoutSchema.parse(params);

  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const workout = await createWorkout({
    userId,
    name: validated.name,
    date: validated.date,
  });

  revalidatePath("/workouts");

  return workout;
}

export async function deleteWorkoutAction(
  params: z.infer<typeof deleteWorkoutSchema>
) {
  const validated = deleteWorkoutSchema.parse(params);

  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  await deleteWorkout(validated.id);

  revalidatePath("/workouts");
}
```

## Calling Server Actions

When calling server actions from client components, extract form data into a typed object:

```typescript
"use client";

import { createWorkoutAction } from "./actions";

export function WorkoutForm() {
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    // ✅ Extract and pass typed object - NOT FormData
    await createWorkoutAction({
      name: formData.get("name") as string,
      date: new Date(formData.get("date") as string),
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" type="text" required />
      <input name="date" type="date" required />
      <button type="submit">Create</button>
    </form>
  );
}
```

## Navigation After Mutations

**NEVER use `redirect()` from `next/navigation` inside server actions.** Navigation should be handled on the client side after the server action resolves.

### Why?

- Server actions should be pure data operations that return results
- Client-side navigation provides better control over loading states and error handling
- Mixing navigation with data mutations creates tight coupling

### Correct Pattern

```typescript
// actions.ts
"use server";

export async function createWorkoutAction(params: CreateWorkoutParams) {
  const validated = schema.parse(params);
  // ... create workout
  revalidatePath("/dashboard");
  return workout; // Return data, don't redirect
}
```

```typescript
// client component
"use client";

import { useRouter } from "next/navigation";
import { createWorkoutAction } from "./actions";

export function WorkoutForm() {
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const workout = await createWorkoutAction({
      name: formData.get("name") as string,
    });

    // Navigate on the client after success
    router.push(`/dashboard?date=${workout.date}`);
  }

  return <form onSubmit={handleSubmit}>{/* ... */}</form>;
}
```

## Validation Rules

### Why Zod?

- ❌ Server actions receive untrusted input from the client
- ❌ TypeScript types are erased at runtime
- ✅ Zod provides runtime validation with type inference

### Validation Pattern

```typescript
// 1. Define schema
const schema = z.object({
  name: z.string().min(1),
  count: z.number().positive(),
});

// 2. Infer type from schema
type Params = z.infer<typeof schema>;

// 3. Validate in action
export async function myAction(params: Params) {
  const validated = schema.parse(params); // Throws if invalid
  // ...
}
```

## Summary

| Requirement | Rule |
|-------------|------|
| Database operations | Drizzle ORM via `src/data/` helper functions |
| Mutation entry point | Server actions in colocated `actions.ts` files |
| Parameter types | Explicitly typed, NO `FormData` |
| Validation | ALL parameters validated with Zod |
| Authentication | Check `auth()` in every mutating action |
| Cache invalidation | Use `revalidatePath` or `revalidateTag` |
| Navigation | Handle on client side, NEVER use `redirect()` in actions |
