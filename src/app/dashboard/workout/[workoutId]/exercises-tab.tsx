"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Dumbbell } from "lucide-react";
import { ExerciseItem } from "./exercise-item";
import { addExerciseToWorkoutAction } from "./actions";

type WorkoutExerciseWithDetails = {
  id: string;
  workoutId: string;
  exerciseId: string;
  order: number;
  exercise: { id: string; name: string };
  sets: Array<{
    id: string;
    setNumber: number;
    weight: string | null;
    reps: number | null;
  }>;
};

type ExercisesTabProps = {
  workoutId: string;
  workoutExercises: WorkoutExerciseWithDetails[];
  bodyWeightKg: number | null;
};

export function ExercisesTab({
  workoutId,
  workoutExercises,
  bodyWeightKg,
}: ExercisesTabProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [exerciseName, setExerciseName] = useState("");

  async function handleAddExercise() {
    if (!exerciseName.trim()) return;
    await addExerciseToWorkoutAction({
      workoutId,
      exerciseName: exerciseName.trim(),
    });
    setExerciseName("");
    setIsAdding(false);
  }

  return (
    <div className="space-y-4">
      {workoutExercises.length === 0 && !isAdding ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <Dumbbell className="text-muted-foreground mb-4 size-12" />
          <p className="text-muted-foreground mb-4">
            No exercises added yet. Start by adding your first exercise.
          </p>
        </div>
      ) : (
        workoutExercises.map((we) => (
          <ExerciseItem key={we.id} workoutExercise={we} bodyWeightKg={bodyWeightKg} />
        ))
      )}

      {isAdding ? (
        <div className="flex gap-2">
          <Input
            placeholder="Exercise name (e.g., Bench Press)"
            value={exerciseName}
            onChange={(e) => setExerciseName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddExercise()}
            autoFocus
          />
          <Button onClick={handleAddExercise}>Add</Button>
          <Button variant="outline" onClick={() => setIsAdding(false)}>
            Cancel
          </Button>
        </div>
      ) : (
        <Button
          variant="outline"
          className="w-full"
          onClick={() => setIsAdding(true)}
        >
          <Plus className="mr-2 size-4" />
          Add Exercise
        </Button>
      )}
    </div>
  );
}
