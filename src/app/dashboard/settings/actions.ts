"use server";

import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { upsertUserProfile } from "@/data/user-profiles";

const updateProfileSchema = z.object({
  weightKg: z
    .number()
    .min(20, "Weight must be at least 20 kg")
    .max(300, "Weight must be at most 300 kg"),
});

export async function updateProfileAction(
  params: z.input<typeof updateProfileSchema>
) {
  const validated = updateProfileSchema.parse(params);

  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const profile = await upsertUserProfile({
    weightKg: validated.weightKg.toString(),
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/workout");

  return profile;
}
