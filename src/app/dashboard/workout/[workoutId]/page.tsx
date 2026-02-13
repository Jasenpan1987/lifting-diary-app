import { notFound } from "next/navigation";
import { Flame } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getWorkoutById } from "@/data/workouts";
import { getWorkoutExercisesWithDetails } from "@/data/workout-exercises";
import { getUserProfile } from "@/data/user-profiles";
import { calculateWorkoutCalories } from "@/lib/calories";
import { WorkoutTabs } from "./workout-tabs";

type Params = Promise<{ workoutId: string }>;

export default async function EditWorkoutPage({ params }: { params: Params }) {
  const { workoutId } = await params;
  const workout = await getWorkoutById(workoutId);

  if (!workout) {
    notFound();
  }

  const [workoutExercises, profile] = await Promise.all([
    getWorkoutExercisesWithDetails(workoutId),
    getUserProfile(),
  ]);
  const bodyWeightKg = profile?.weightKg ? parseFloat(profile.weightKg) : null;
  const totalCalories =
    bodyWeightKg
      ? calculateWorkoutCalories(workoutExercises, bodyWeightKg).totalCalories
      : null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Edit Workout</CardTitle>
            <CardDescription className="flex items-center gap-4">
              Update the details of your workout session.
              {totalCalories != null && totalCalories > 0 && (
                <span className="flex items-center gap-1">
                  <Flame className="size-3" />
                  {Math.round(totalCalories)} kcal
                </span>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <WorkoutTabs
              workout={workout}
              workoutExercises={workoutExercises}
              bodyWeightKg={bodyWeightKg}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
