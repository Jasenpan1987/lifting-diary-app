import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getUserProfile } from "@/data/user-profiles";
import { SettingsForm } from "./settings-form";

export default async function SettingsPage() {
  const profile = await getUserProfile();

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Settings</h1>
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>
            Manage your profile settings for calorie estimation.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SettingsForm weightKg={profile?.weightKg ?? null} />
        </CardContent>
      </Card>
    </div>
  );
}
