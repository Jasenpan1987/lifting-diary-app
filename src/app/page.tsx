import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function Home() {
  const { userId } = await auth();

  if (userId) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-zinc-100 dark:from-zinc-950 dark:to-zinc-900">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-zinc-900 dark:text-zinc-50">
            Track Your Lifting Journey
          </h1>
          <p className="text-xl md:text-2xl text-zinc-600 dark:text-zinc-400 mb-8 max-w-2xl mx-auto">
            The simple and effective way to log your workouts, track progress, and achieve your fitness goals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <SignUpButton mode="modal">
              <Button size="lg" className="text-lg px-8">
                Get Started Free
              </Button>
            </SignUpButton>
            <SignInButton mode="modal">
              <Button size="lg" variant="outline" className="text-lg px-8">
                Sign In
              </Button>
            </SignInButton>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          <Card className="text-center">
            <CardHeader>
              <CardTitle className="flex flex-col items-center gap-3">
                <span className="text-4xl">📊</span>
                <span>Track Progress</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-zinc-600 dark:text-zinc-400 mb-4">
                Log every workout and watch your strength gains over time
              </p>
              <p className="text-sm text-zinc-500 dark:text-zinc-500">
                Record sets, reps, and weights for each exercise. Visualize your improvements and stay motivated.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <CardTitle className="flex flex-col items-center gap-3">
                <span className="text-4xl">📝</span>
                <span>Simple Logging</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-zinc-600 dark:text-zinc-400 mb-4">
                Quick and easy workout entry designed for the gym floor
              </p>
              <p className="text-sm text-zinc-500 dark:text-zinc-500">
                No complicated forms or confusing interfaces. Just log your lifts and get back to training.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <CardTitle className="flex flex-col items-center gap-3">
                <span className="text-4xl">🎯</span>
                <span>Stay Consistent</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-zinc-600 dark:text-zinc-400 mb-4">
                Build the habit and achieve your fitness goals
              </p>
              <p className="text-sm text-zinc-500 dark:text-zinc-500">
                Keep a complete history of your training sessions and maintain accountability to your goals.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4 text-zinc-900 dark:text-zinc-50">
            Ready to start your journey?
          </h2>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-6">
            Join now and take control of your lifting progress.
          </p>
          <SignUpButton mode="modal">
            <Button size="lg" className="text-lg px-8">
              Sign Up Now
            </Button>
          </SignUpButton>
        </div>
      </div>
    </div>
  );
}
