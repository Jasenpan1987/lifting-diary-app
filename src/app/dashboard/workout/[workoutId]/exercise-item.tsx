"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Plus, Flame } from "lucide-react";
import { SetItem } from "./set-item";
import { deleteWorkoutExerciseAction, addSetAction } from "./actions";
import { calculateSetCalories } from "@/lib/calories";

type ExerciseItemProps = {
  workoutExercise: {
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
  bodyWeightKg: number | null;
};

export function ExerciseItem({ workoutExercise, bodyWeightKg }: ExerciseItemProps) {
  const [isAddingSet, setIsAddingSet] = useState(false);
  const [weight, setWeight] = useState("");
  const [reps, setReps] = useState("");

  async function handleDeleteExercise() {
    await deleteWorkoutExerciseAction({
      workoutExerciseId: workoutExercise.id,
    });
  }

  async function handleAddSet() {
    const nextSetNumber = workoutExercise.sets.length + 1;
    await addSetAction({
      workoutExerciseId: workoutExercise.id,
      setNumber: nextSetNumber,
      weight: weight ? parseFloat(weight) : null,
      reps: reps ? parseInt(reps, 10) : null,
    });
    setWeight("");
    setReps("");
    setIsAddingSet(false);
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          {workoutExercise.exercise.name}
          {bodyWeightKg && (() => {
            const cal = workoutExercise.sets.reduce(
              (sum, set) => sum + calculateSetCalories(set, bodyWeightKg),
              0
            );
            return cal > 0 ? (
              <span className="text-muted-foreground flex items-center gap-1 text-sm font-normal">
                <Flame className="size-3" />
                {Math.round(cal)} kcal
              </span>
            ) : null;
          })()}
        </CardTitle>
        <Button variant="ghost" size="icon-sm" onClick={handleDeleteExercise}>
          <Trash2 className="size-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-2">
        {workoutExercise.sets
          .sort((a, b) => a.setNumber - b.setNumber)
          .map((set) => (
            <SetItem key={set.id} set={set} />
          ))}

        {isAddingSet ? (
          <div className="flex items-center gap-2">
            <Input
              type="number"
              placeholder="Weight"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="w-24"
            />
            <span className="text-sm">lbs</span>
            <Input
              type="number"
              placeholder="Reps"
              value={reps}
              onChange={(e) => setReps(e.target.value)}
              className="w-20"
            />
            <span className="text-sm">reps</span>
            <Button size="sm" onClick={handleAddSet}>
              Add
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsAddingSet(false)}
            >
              Cancel
            </Button>
          </div>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsAddingSet(true)}
          >
            <Plus className="mr-1 size-3" />
            Add Set
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
