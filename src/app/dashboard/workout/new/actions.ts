"use server";

import { z } from "zod";
import { format } from "date-fns";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createWorkout } from "@/data/workouts";

const createWorkoutSchema = z.object({
  name: z.string().min(1, "Name is required").max(50),
  location: z.string().max(255).optional(),
  startedAt: z.string().transform((val) => new Date(val)),
  completedAt: z.string().transform((val) => new Date(val)),
});

export async function createWorkoutAction(
  params: z.input<typeof createWorkoutSchema>
) {
  const validated = createWorkoutSchema.parse(params);

  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const workout = await createWorkout({
    userId,
    name: validated.name,
    location: validated.location ?? null,
    startedAt: validated.startedAt,
    completedAt: validated.completedAt,
  });

  const dateString = format(workout.startedAt!, "yyyy-MM-dd");

  revalidatePath("/dashboard");
  redirect(`/dashboard?date=${dateString}`);
}
