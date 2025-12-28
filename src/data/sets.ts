import { db } from "@/db";
import { sets, workoutExercises } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";

async function verifySetOwnership(setId: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const set = await db.query.sets.findFirst({
    where: eq(sets.id, setId),
    with: {
      workoutExercise: {
        with: { workout: true },
      },
    },
  });

  if (!set || set.workoutExercise.workout.userId !== userId) {
    throw new Error("Not found or unauthorized");
  }

  return set;
}

async function verifyWorkoutExerciseOwnership(workoutExerciseId: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const we = await db.query.workoutExercises.findFirst({
    where: eq(workoutExercises.id, workoutExerciseId),
    with: { workout: true },
  });

  if (!we || we.workout.userId !== userId) {
    throw new Error("Not found or unauthorized");
  }

  return we;
}

export async function createSet(data: {
  workoutExerciseId: string;
  setNumber: number;
  weight: number | null;
  reps: number | null;
}) {
  await verifyWorkoutExerciseOwnership(data.workoutExerciseId);

  const [set] = await db
    .insert(sets)
    .values({
      workoutExerciseId: data.workoutExerciseId,
      setNumber: data.setNumber,
      weight: data.weight?.toString() ?? null,
      reps: data.reps,
    })
    .returning();

  return set;
}

export async function updateSet(
  setId: string,
  data: { weight: number | null; reps: number | null }
) {
  await verifySetOwnership(setId);

  const [set] = await db
    .update(sets)
    .set({
      weight: data.weight?.toString() ?? null,
      reps: data.reps,
    })
    .where(eq(sets.id, setId))
    .returning();

  return set;
}

export async function deleteSet(setId: string) {
  await verifySetOwnership(setId);
  await db.delete(sets).where(eq(sets.id, setId));
}
