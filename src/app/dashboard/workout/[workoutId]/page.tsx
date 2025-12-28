import { notFound } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getWorkoutById } from "@/data/workouts";
import { EditWorkoutForm } from "./edit-workout-form";

type Params = Promise<{ workoutId: string }>;

export default async function EditWorkoutPage({ params }: { params: Params }) {
  const { workoutId } = await params;
  const workout = await getWorkoutById(workoutId);

  if (!workout) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-md">
        <Card>
          <CardHeader>
            <CardTitle>Edit Workout</CardTitle>
            <CardDescription>
              Update the details of your workout session.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <EditWorkoutForm workout={workout} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
