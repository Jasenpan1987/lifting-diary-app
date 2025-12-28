import { db } from "@/db";
import { workoutExercises, workouts } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";

export async function getWorkoutExercisesWithDetails(workoutId: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const workout = await db.query.workouts.findFirst({
    where: and(eq(workouts.id, workoutId), eq(workouts.userId, userId)),
  });

  if (!workout) {
    throw new Error("Workout not found");
  }

  return db.query.workoutExercises.findMany({
    where: eq(workoutExercises.workoutId, workoutId),
    with: {
      exercise: true,
      sets: true,
    },
    orderBy: (we, { asc }) => [asc(we.order)],
  });
}

export async function addExerciseToWorkout(
  workoutId: string,
  exerciseId: string
) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const workout = await db.query.workouts.findFirst({
    where: and(eq(workouts.id, workoutId), eq(workouts.userId, userId)),
  });

  if (!workout) {
    throw new Error("Workout not found");
  }

  const existing = await db.query.workoutExercises.findMany({
    where: eq(workoutExercises.workoutId, workoutId),
  });
  const nextOrder = existing.length;

  const [workoutExercise] = await db
    .insert(workoutExercises)
    .values({
      workoutId,
      exerciseId,
      order: nextOrder,
    })
    .returning();

  return workoutExercise;
}

export async function deleteWorkoutExercise(workoutExerciseId: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const workoutExercise = await db.query.workoutExercises.findFirst({
    where: eq(workoutExercises.id, workoutExerciseId),
    with: { workout: true },
  });

  if (!workoutExercise || workoutExercise.workout.userId !== userId) {
    throw new Error("Not found or unauthorized");
  }

  await db
    .delete(workoutExercises)
    .where(eq(workoutExercises.id, workoutExerciseId));
}
