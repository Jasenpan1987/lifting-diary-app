"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createWorkoutAction } from "./actions";

export function NewWorkoutForm() {
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

    await createWorkoutAction({
      name,
      location: typeof location === "string" && location ? location : undefined,
      startedAt,
      completedAt,
    });
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
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="startedAt">Start Time</Label>
        <Input
          id="startedAt"
          name="startedAt"
          type="datetime-local"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="completedAt">End Time</Label>
        <Input
          id="completedAt"
          name="completedAt"
          type="datetime-local"
          required
        />
      </div>

      <Button type="submit" className="w-full">
        Create Workout
      </Button>
    </form>
  );
}
