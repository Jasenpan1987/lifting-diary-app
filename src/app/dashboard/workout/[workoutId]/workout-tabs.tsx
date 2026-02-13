"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EditWorkoutForm } from "./edit-workout-form";
import { ExercisesTab } from "./exercises-tab";

type Workout = {
  id: string;
  name: string | null;
  location: string | null;
  startedAt: Date | null;
  completedAt: Date | null;
};

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

type WorkoutTabsProps = {
  workout: Workout;
  workoutExercises: WorkoutExerciseWithDetails[];
  bodyWeightKg: number | null;
};

export function WorkoutTabs({ workout, workoutExercises, bodyWeightKg }: WorkoutTabsProps) {
  return (
    <Tabs defaultValue="details">
      <TabsList className="mb-4 grid w-full grid-cols-2">
        <TabsTrigger value="details">Details</TabsTrigger>
        <TabsTrigger value="exercises">Exercises</TabsTrigger>
      </TabsList>
      <TabsContent value="details">
        <EditWorkoutForm workout={workout} />
      </TabsContent>
      <TabsContent value="exercises">
        <ExercisesTab
          workoutId={workout.id}
          workoutExercises={workoutExercises}
          bodyWeightKg={bodyWeightKg}
        />
      </TabsContent>
    </Tabs>
  );
}
