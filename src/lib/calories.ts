const LBS_TO_KG = 0.453592;

export function calculateSetCalories(
  set: { weight: string | null; reps: number | null },
  bodyWeightKg: number
): number {
  const weightLbs = set.weight ? parseFloat(set.weight) : 0;
  const reps = set.reps ?? 0;
  if (weightLbs <= 0 || reps <= 0) return 0;
  const weightKg = weightLbs * LBS_TO_KG;
  return weightKg * reps * 0.0005 * bodyWeightKg;
}

type WorkoutExerciseInput = {
  exercise: { name: string };
  sets: Array<{ weight: string | null; reps: number | null }>;
};

export function calculateWorkoutCalories(
  workoutExercises: WorkoutExerciseInput[],
  bodyWeightKg: number
): { exercises: Array<{ name: string; calories: number }>; totalCalories: number } {
  let totalCalories = 0;
  const exercises = workoutExercises.map((we) => {
    const calories = we.sets.reduce(
      (sum, set) => sum + calculateSetCalories(set, bodyWeightKg),
      0
    );
    totalCalories += calories;
    return { name: we.exercise.name, calories };
  });

  return { exercises, totalCalories };
}
