import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function Home() {
  const { userId } = await auth();

  if (userId) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-black">
      <main className="container mx-auto px-4 py-16 md:py-24">
        <div className="flex flex-col items-center text-center space-y-8">
          <div className="space-y-4 max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              Track Your Lifting Journey
            </h1>
            <p className="text-xl md:text-2xl text-zinc-600 dark:text-zinc-400">
              The simple, powerful way to log your workouts and monitor your progress in the gym.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <SignUpButton mode="modal">
              <Button size="lg" className="text-lg px-8 py-6">
                Get Started Free
              </Button>
            </SignUpButton>
            <SignInButton mode="modal">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                Sign In
              </Button>
            </SignInButton>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 w-full max-w-5xl">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">📊</span>
                  Track Progress
                </CardTitle>
                <CardDescription>
                  Log every workout and watch your strength gains over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  Record sets, reps, and weights for each exercise. Visualize your improvements and stay motivated.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">📝</span>
                  Simple Logging
                </CardTitle>
                <CardDescription>
                  Quick and easy workout entry designed for the gym floor
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  No complicated forms or confusing interfaces. Just log your lifts and get back to training.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">🎯</span>
                  Stay Consistent
                </CardTitle>
                <CardDescription>
                  Build the habit and achieve your fitness goals
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  Keep a complete history of your training sessions and maintain accountability to your goals.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-16 p-8 bg-white dark:bg-zinc-800 rounded-lg shadow-lg max-w-2xl">
            <h2 className="text-3xl font-bold mb-4 text-zinc-900 dark:text-zinc-50">
              Ready to transform your training?
            </h2>
            <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-6">
              Join lifters who are already tracking their progress and reaching new personal records.
            </p>
            <SignUpButton mode="modal">
              <Button size="lg" className="text-lg px-8 py-6">
                Start Your Journey Today
              </Button>
            </SignUpButton>
          </div>
        </div>
      </main>
    </div>
  );
}
