import { eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { userProfiles } from "@/db/schema";

export async function getUserProfile() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  return db.query.userProfiles.findFirst({
    where: eq(userProfiles.userId, userId),
  });
}

export async function upsertUserProfile({
  weightKg,
}: {
  weightKg: string;
}) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const existing = await db.query.userProfiles.findFirst({
    where: eq(userProfiles.userId, userId),
  });

  if (existing) {
    const [updated] = await db
      .update(userProfiles)
      .set({ weightKg, updatedAt: new Date() })
      .where(eq(userProfiles.userId, userId))
      .returning();
    return updated;
  }

  const [created] = await db
    .insert(userProfiles)
    .values({ userId, weightKg })
    .returning();
  return created;
}
