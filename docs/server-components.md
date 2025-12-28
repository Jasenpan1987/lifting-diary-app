# Server Components

This document outlines coding standards for React Server Components in this Next.js 15+ project.

## Dynamic Route Parameters

**IMPORTANT:** In Next.js 15+, the `params` object in dynamic routes is a Promise and MUST be awaited before accessing its properties.

### Correct Usage

```tsx
type PageProps = {
  params: Promise<{ workoutId: string }>;
};

export default async function WorkoutPage({ params }: PageProps) {
  const { workoutId } = await params;

  // Now you can use workoutId
  const workout = await getWorkout(workoutId);

  return <div>{workout.name}</div>;
}
```

### Incorrect Usage (Will Cause Errors)

```tsx
// ❌ DO NOT do this - params is a Promise in Next.js 15+
export default async function WorkoutPage({ params }: PageProps) {
  const workout = await getWorkout(params.workoutId); // Error!
  return <div>{workout.name}</div>;
}
```

## Search Params

Similarly, `searchParams` is also a Promise in Next.js 15+ and must be awaited:

```tsx
type PageProps = {
  params: Promise<{ workoutId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function WorkoutPage({ params, searchParams }: PageProps) {
  const { workoutId } = await params;
  const { tab } = await searchParams;

  // Use workoutId and tab
}
```

## Layout Components

The same rules apply to layout components with dynamic segments:

```tsx
type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{ workoutId: string }>;
};

export default async function WorkoutLayout({ children, params }: LayoutProps) {
  const { workoutId } = await params;

  return (
    <div>
      <nav>Workout: {workoutId}</nav>
      {children}
    </div>
  );
}
```

## Key Points

1. Always type `params` as `Promise<{ ... }>` in page and layout components
2. Always `await params` before accessing properties
3. Always `await searchParams` before accessing query parameters
4. Server Components must be `async` functions to use `await`
