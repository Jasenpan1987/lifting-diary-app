import { notFound } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getWorkoutById } from "@/data/workouts";
import { getWorkoutExercisesWithDetails } from "@/data/workout-exercises";
import { WorkoutTabs } from "./workout-tabs";

type Params = Promise<{ workoutId: string }>;

export default async function EditWorkoutPage({ params }: { params: Params }) {
  const { workoutId } = await params;
  const workout = await getWorkoutById(workoutId);

  if (!workout) {
    notFound();
  }

  const workoutExercises = await getWorkoutExercisesWithDetails(workoutId);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Edit Workout</CardTitle>
            <CardDescription>
              Update the details of your workout session.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <WorkoutTabs
              workout={workout}
              workoutExercises={workoutExercises}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
