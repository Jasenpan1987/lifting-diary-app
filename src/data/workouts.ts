import { db } from "@/db";
import { workouts } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq, and, gte, lt } from "drizzle-orm";

export async function getWorkoutById(id: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  return db.query.workouts.findFirst({
    where: and(eq(workouts.id, id), eq(workouts.userId, userId)),
  });
}

export async function updateWorkout(
  id: string,
  data: {
    name: string | null;
    location: string | null;
    startedAt: Date;
    completedAt: Date;
  }
) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const [workout] = await db
    .update(workouts)
    .set({
      name: data.name,
      location: data.location,
      startedAt: data.startedAt,
      completedAt: data.completedAt,
      updatedAt: new Date(),
    })
    .where(and(eq(workouts.id, id), eq(workouts.userId, userId)))
    .returning();

  return workout;
}

export async function createWorkout(data: {
  userId: string;
  name: string | null;
  location: string | null;
  startedAt: Date;
  completedAt: Date;
}) {
  const [workout] = await db
    .insert(workouts)
    .values({
      userId: data.userId,
      name: data.name,
      location: data.location,
      startedAt: data.startedAt,
      completedAt: data.completedAt,
    })
    .returning();

  return workout;
}

export async function getWorkoutsByDate(date: Date) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  return db.query.workouts.findMany({
    where: and(
      eq(workouts.userId, userId),
      gte(workouts.createdAt, startOfDay),
      lt(workouts.createdAt, endOfDay)
    ),
    with: {
      workoutExercises: {
        with: {
          exercise: true,
          sets: true,
        },
      },
    },
    orderBy: (workouts, { desc }) => [desc(workouts.createdAt)],
  });
}
