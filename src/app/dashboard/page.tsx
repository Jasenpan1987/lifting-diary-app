import { format } from "date-fns";
import { Dumbbell, MapPin, Clock, Plus } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getWorkoutsByDate } from "@/data/workouts";
import { DatePicker } from "./date-picker";

function getTodayDateString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

interface DashboardPageProps {
  searchParams: Promise<{ date?: string }>;
}

export default async function DashboardPage({
  searchParams,
}: DashboardPageProps) {
  const params = await searchParams;
  const dateString = params.date ?? getTodayDateString();
  const date = new Date(dateString + "T00:00:00");
  const workouts = await getWorkoutsByDate(date);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Dashboard</h1>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Calendar</h2>
          <DatePicker dateString={dateString} />
        </div>

        <div className="space-y-4 lg:px-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              Workouts for {format(date, "do MMM yyyy")}
            </h2>
            <Button asChild>
              <Link href="/dashboard/workout/new">
                <Plus className="size-4" />
                Create Workout
              </Link>
            </Button>
          </div>

          {workouts.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-8">
              <Dumbbell className="text-muted-foreground mb-4 size-12" />
              <p className="text-muted-foreground">
                No workouts logged for this date.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {workouts.map((workout) => (
              <Link
                key={workout.id}
                href={`/dashboard/workout/${workout.id}`}
                className="block"
              >
                <Card className="transition-colors hover:bg-muted/50">
                  <CardHeader>
                  <CardTitle>{workout.name ?? "Workout"}</CardTitle>
                  <CardDescription className="flex flex-wrap gap-4">
                    {workout.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="size-3" />
                        {workout.location}
                      </span>
                    )}
                    {workout.startedAt && workout.completedAt && (
                      <span className="flex items-center gap-1">
                        <Clock className="size-3" />
                        {format(workout.startedAt, "h:mm a")} -{" "}
                        {format(workout.completedAt, "h:mm a")}
                      </span>
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {workout.workoutExercises
                    .sort((a, b) => a.order - b.order)
                    .map((workoutExercise) => (
                      <div key={workoutExercise.id}>
                        <h3 className="mb-2 font-medium">
                          {workoutExercise.exercise.name}
                        </h3>
                        <div className="space-y-2">
                          {workoutExercise.sets
                            .sort((a, b) => a.setNumber - b.setNumber)
                            .map((set) => (
                              <div
                                key={set.id}
                                className="bg-muted flex items-center justify-between rounded-md px-4 py-2"
                              >
                                <span className="text-muted-foreground text-sm">
                                  Set {set.setNumber}
                                </span>
                                <span className="font-medium">
                                  {set.reps} reps × {set.weight} lbs
                                </span>
                              </div>
                            ))}
                        </div>
                      </div>
                    ))}
                </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
        </div>
      </div>
    </div>
  );
}
