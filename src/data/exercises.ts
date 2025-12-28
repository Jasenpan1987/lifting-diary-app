import { db } from "@/db";
import { exercises } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function findOrCreateExercise(name: string) {
  const existing = await db.query.exercises.findFirst({
    where: eq(exercises.name, name),
  });

  if (existing) {
    return existing;
  }

  const [exercise] = await db.insert(exercises).values({ name }).returning();

  return exercise;
}

export async function getExerciseById(id: string) {
  return db.query.exercises.findFirst({
    where: eq(exercises.id, id),
  });
}
