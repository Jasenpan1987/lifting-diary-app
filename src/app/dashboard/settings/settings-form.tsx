"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateProfileAction } from "./actions";

type SettingsFormProps = {
  weightKg: string | null;
};

export function SettingsForm({ weightKg }: SettingsFormProps) {
  const router = useRouter();
  const [weight, setWeight] = useState(weightKg ?? "");
  const [isSaving, setIsSaving] = useState(false);

  async function handleSave() {
    if (!weight) return;
    setIsSaving(true);
    try {
      await updateProfileAction({ weightKg: parseFloat(weight) });
      router.push("/dashboard");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="weight">Body Weight (kg)</Label>
        <Input
          id="weight"
          type="number"
          step="0.1"
          min="20"
          max="300"
          placeholder="e.g. 75.0"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
        />
        <p className="text-muted-foreground text-sm">
          Used to estimate calories burned during workouts.
        </p>
      </div>
      <div className="flex gap-2">
        <Button onClick={handleSave} disabled={isSaving || !weight}>
          {isSaving ? "Saving..." : "Save"}
        </Button>
        <Button variant="outline" onClick={() => router.push("/dashboard")}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
