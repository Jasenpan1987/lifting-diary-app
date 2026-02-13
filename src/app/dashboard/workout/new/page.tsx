import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BackButton } from "@/components/back-button";
import { NewWorkoutForm } from "./new-workout-form";

export default function NewWorkoutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-md">
        <BackButton />
        <Card>
          <CardHeader>
            <CardTitle>Create New Workout</CardTitle>
            <CardDescription>
              Start a new workout session by entering the details below.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <NewWorkoutForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
