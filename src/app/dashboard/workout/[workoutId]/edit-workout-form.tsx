"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateWorkoutAction } from "./actions";

type Workout = {
  id: string;
  name: string | null;
  location: string | null;
  startedAt: Date | null;
  completedAt: Date | null;
};

function formatDateTimeLocal(date: Date | null): string {
  if (!date) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export function EditWorkoutForm({ workout }: { workout: Workout }) {
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const name = formData.get("name");
    const location = formData.get("location");
    const startedAt = formData.get("startedAt");
    const completedAt = formData.get("completedAt");

    if (
      typeof name !== "string" ||
      typeof startedAt !== "string" ||
      typeof completedAt !== "string"
    ) {
      return;
    }

    const result = await updateWorkoutAction({
      id: workout.id,
      name,
      location: typeof location === "string" && location ? location : undefined,
      startedAt,
      completedAt,
    });

    router.push(`/dashboard?date=${result.dateString}`);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Workout Name</Label>
        <Input
          id="name"
          name="name"
          type="text"
          placeholder="e.g., Morning Workout"
          required
          maxLength={50}
          defaultValue={workout.name ?? ""}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Location (optional)</Label>
        <Input
          id="location"
          name="location"
          type="text"
          placeholder="e.g., Home Gym"
          maxLength={255}
          defaultValue={workout.location ?? ""}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="startedAt">Start Time</Label>
        <Input
          id="startedAt"
          name="startedAt"
          type="datetime-local"
          required
          defaultValue={formatDateTimeLocal(workout.startedAt)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="completedAt">End Time</Label>
        <Input
          id="completedAt"
          name="completedAt"
          type="datetime-local"
          required
          defaultValue={formatDateTimeLocal(workout.completedAt)}
        />
      </div>

      <Button type="submit" className="w-full">
        Update Workout
      </Button>
    </form>
  );
}
