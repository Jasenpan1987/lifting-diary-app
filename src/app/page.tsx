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
        <div className="relative text-center mb-24">
          {/* Background decoration */}
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-full blur-3xl"></div>
          </div>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-zinc-900/5 dark:bg-zinc-50/10 border border-zinc-900/10 dark:border-zinc-50/20">
            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Your Personal Lifting Coach
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-8 text-zinc-900 dark:text-zinc-50 tracking-tight">
            Track Your
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Lifting Journey
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-zinc-600 dark:text-zinc-400 mb-12 max-w-3xl mx-auto leading-relaxed">
            The simple and effective way to log your workouts, track progress,
            and achieve your fitness goals. Built for lifters, by lifters.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <SignUpButton mode="modal">
              <Button size="lg" className="text-lg px-8 h-14 shadow-lg hover:shadow-xl transition-shadow">
                Get Started Free
              </Button>
            </SignUpButton>
            <SignInButton mode="modal">
              <Button size="lg" variant="outline" className="text-lg px-8 h-14 border-2">
                Sign In
              </Button>
            </SignInButton>
          </div>

          {/* Social Proof */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-zinc-600 dark:text-zinc-400">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 border-2 border-white dark:border-zinc-950"></div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 border-2 border-white dark:border-zinc-950"></div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-orange-500 border-2 border-white dark:border-zinc-950"></div>
              </div>
              <span className="font-medium">Join 1000+ lifters</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">⭐⭐⭐⭐⭐</span>
              <span className="font-medium">Rated 5/5</span>
            </div>
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
