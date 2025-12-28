"use server";

import { z } from "zod";
import { format } from "date-fns";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { updateWorkout } from "@/data/workouts";
import { findOrCreateExercise } from "@/data/exercises";
import {
  addExerciseToWorkout,
  deleteWorkoutExercise,
} from "@/data/workout-exercises";
import { createSet, updateSet, deleteSet } from "@/data/sets";

const updateWorkoutSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, "Name is required").max(50),
  location: z.string().max(255).optional(),
  startedAt: z.string().transform((val) => new Date(val)),
  completedAt: z.string().transform((val) => new Date(val)),
});

export async function updateWorkoutAction(
  params: z.input<typeof updateWorkoutSchema>
) {
  const validated = updateWorkoutSchema.parse(params);

  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const workout = await updateWorkout(validated.id, {
    name: validated.name,
    location: validated.location ?? null,
    startedAt: validated.startedAt,
    completedAt: validated.completedAt,
  });

  const dateString = format(workout.startedAt!, "yyyy-MM-dd");

  revalidatePath("/dashboard");
  revalidatePath(`/dashboard/workout/${validated.id}`);

  return { dateString };
}

// === EXERCISE ACTIONS ===

const addExerciseSchema = z.object({
  workoutId: z.string().uuid(),
  exerciseName: z.string().min(1).max(255),
});

export async function addExerciseToWorkoutAction(
  params: z.input<typeof addExerciseSchema>
) {
  const validated = addExerciseSchema.parse(params);

  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const exercise = await findOrCreateExercise(validated.exerciseName);
  await addExerciseToWorkout(validated.workoutId, exercise.id);

  revalidatePath(`/dashboard/workout/${validated.workoutId}`);
  revalidatePath("/dashboard");
}

const deleteWorkoutExerciseSchema = z.object({
  workoutExerciseId: z.string().uuid(),
});

export async function deleteWorkoutExerciseAction(
  params: z.input<typeof deleteWorkoutExerciseSchema>
) {
  const validated = deleteWorkoutExerciseSchema.parse(params);

  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  await deleteWorkoutExercise(validated.workoutExerciseId);

  revalidatePath("/dashboard");
}

// === SET ACTIONS ===

const addSetSchema = z.object({
  workoutExerciseId: z.string().uuid(),
  setNumber: z.number().int().positive(),
  weight: z.number().nullable(),
  reps: z.number().int().nullable(),
});

export async function addSetAction(params: z.input<typeof addSetSchema>) {
  const validated = addSetSchema.parse(params);

  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  await createSet({
    workoutExerciseId: validated.workoutExerciseId,
    setNumber: validated.setNumber,
    weight: validated.weight,
    reps: validated.reps,
  });

  revalidatePath("/dashboard");
}

const updateSetSchema = z.object({
  setId: z.string().uuid(),
  weight: z.number().nullable(),
  reps: z.number().int().nullable(),
});

export async function updateSetAction(
  params: z.input<typeof updateSetSchema>
) {
  const validated = updateSetSchema.parse(params);

  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  await updateSet(validated.setId, {
    weight: validated.weight,
    reps: validated.reps,
  });

  revalidatePath("/dashboard");
}

const deleteSetSchema = z.object({
  setId: z.string().uuid(),
});

export async function deleteSetAction(
  params: z.input<typeof deleteSetSchema>
) {
  const validated = deleteSetSchema.parse(params);

  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  await deleteSet(validated.setId);

  revalidatePath("/dashboard");
}
