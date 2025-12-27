"use client";

import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, Dumbbell, MapPin, Clock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

// Dummy data matching the database schema
const dummyWorkouts = [
  {
    id: "550e8400-e29b-41d4-a716-446655440000",
    userId: "user_2abc123",
    name: "Morning Push Day",
    location: "Home Gym",
    startedAt: new Date("2024-12-28T08:00:00"),
    completedAt: new Date("2024-12-28T09:15:00"),
    createdAt: new Date("2024-12-28T08:00:00"),
    updatedAt: new Date("2024-12-28T09:15:00"),
    workoutExercises: [
      {
        id: "660e8400-e29b-41d4-a716-446655440001",
        workoutId: "550e8400-e29b-41d4-a716-446655440000",
        exerciseId: "770e8400-e29b-41d4-a716-446655440001",
        order: 0,
        createdAt: new Date("2024-12-28T08:00:00"),
        exercise: {
          id: "770e8400-e29b-41d4-a716-446655440001",
          name: "Bench Press",
          createdAt: new Date("2024-01-01T00:00:00"),
          updatedAt: new Date("2024-01-01T00:00:00"),
        },
        sets: [
          { id: "880e8400-e29b-41d4-a716-446655440001", workoutExerciseId: "660e8400-e29b-41d4-a716-446655440001", setNumber: 1, weight: "135.00", reps: 10, createdAt: new Date("2024-12-28T08:05:00") },
          { id: "880e8400-e29b-41d4-a716-446655440002", workoutExerciseId: "660e8400-e29b-41d4-a716-446655440001", setNumber: 2, weight: "155.00", reps: 8, createdAt: new Date("2024-12-28T08:10:00") },
          { id: "880e8400-e29b-41d4-a716-446655440003", workoutExerciseId: "660e8400-e29b-41d4-a716-446655440001", setNumber: 3, weight: "175.00", reps: 6, createdAt: new Date("2024-12-28T08:15:00") },
        ],
      },
      {
        id: "660e8400-e29b-41d4-a716-446655440002",
        workoutId: "550e8400-e29b-41d4-a716-446655440000",
        exerciseId: "770e8400-e29b-41d4-a716-446655440002",
        order: 1,
        createdAt: new Date("2024-12-28T08:20:00"),
        exercise: {
          id: "770e8400-e29b-41d4-a716-446655440002",
          name: "Overhead Press",
          createdAt: new Date("2024-01-01T00:00:00"),
          updatedAt: new Date("2024-01-01T00:00:00"),
        },
        sets: [
          { id: "880e8400-e29b-41d4-a716-446655440004", workoutExerciseId: "660e8400-e29b-41d4-a716-446655440002", setNumber: 1, weight: "95.00", reps: 10, createdAt: new Date("2024-12-28T08:25:00") },
          { id: "880e8400-e29b-41d4-a716-446655440005", workoutExerciseId: "660e8400-e29b-41d4-a716-446655440002", setNumber: 2, weight: "105.00", reps: 8, createdAt: new Date("2024-12-28T08:30:00") },
        ],
      },
      {
        id: "660e8400-e29b-41d4-a716-446655440003",
        workoutId: "550e8400-e29b-41d4-a716-446655440000",
        exerciseId: "770e8400-e29b-41d4-a716-446655440003",
        order: 2,
        createdAt: new Date("2024-12-28T08:35:00"),
        exercise: {
          id: "770e8400-e29b-41d4-a716-446655440003",
          name: "Incline Dumbbell Press",
          createdAt: new Date("2024-01-01T00:00:00"),
          updatedAt: new Date("2024-01-01T00:00:00"),
        },
        sets: [
          { id: "880e8400-e29b-41d4-a716-446655440006", workoutExerciseId: "660e8400-e29b-41d4-a716-446655440003", setNumber: 1, weight: "50.00", reps: 12, createdAt: new Date("2024-12-28T08:40:00") },
          { id: "880e8400-e29b-41d4-a716-446655440007", workoutExerciseId: "660e8400-e29b-41d4-a716-446655440003", setNumber: 2, weight: "55.00", reps: 10, createdAt: new Date("2024-12-28T08:45:00") },
          { id: "880e8400-e29b-41d4-a716-446655440008", workoutExerciseId: "660e8400-e29b-41d4-a716-446655440003", setNumber: 3, weight: "55.00", reps: 8, createdAt: new Date("2024-12-28T08:50:00") },
        ],
      },
    ],
  },
];

export default function DashboardPage() {
  const [date, setDate] = useState<Date>(new Date());

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Dashboard</h1>

      <div className="mb-8">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal sm:w-[280px]",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 size-4" />
              {date ? format(date, "do MMM yyyy") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(newDate) => newDate && setDate(newDate)}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">
          Workouts for {format(date, "do MMM yyyy")}
        </h2>

        {dummyWorkouts.length === 0 ? (
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
            {dummyWorkouts.map((workout) => (
              <Card key={workout.id}>
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
                        {format(workout.startedAt, "h:mm a")} - {format(workout.completedAt, "h:mm a")}
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
