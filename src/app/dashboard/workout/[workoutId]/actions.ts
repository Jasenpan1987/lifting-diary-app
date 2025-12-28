"use server";

import { z } from "zod";
import { format } from "date-fns";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { updateWorkout } from "@/data/workouts";

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
