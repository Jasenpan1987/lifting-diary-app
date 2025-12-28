"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Pencil } from "lucide-react";
import { updateSetAction, deleteSetAction } from "./actions";

type SetItemProps = {
  set: {
    id: string;
    setNumber: number;
    weight: string | null;
    reps: number | null;
  };
};

export function SetItem({ set }: SetItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [weight, setWeight] = useState(set.weight ?? "");
  const [reps, setReps] = useState(set.reps?.toString() ?? "");

  async function handleUpdate() {
    await updateSetAction({
      setId: set.id,
      weight: weight ? parseFloat(weight) : null,
      reps: reps ? parseInt(reps, 10) : null,
    });
    setIsEditing(false);
  }

  async function handleDelete() {
    await deleteSetAction({ setId: set.id });
  }

  if (isEditing) {
    return (
      <div className="bg-muted flex items-center gap-2 rounded-md px-4 py-2">
        <span className="text-muted-foreground w-12 text-sm">
          Set {set.setNumber}
        </span>
        <Input
          type="number"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          placeholder="Weight"
          className="w-20"
        />
        <span className="text-sm">lbs</span>
        <Input
          type="number"
          value={reps}
          onChange={(e) => setReps(e.target.value)}
          placeholder="Reps"
          className="w-16"
        />
        <span className="text-sm">reps</span>
        <Button size="sm" onClick={handleUpdate}>
          Save
        </Button>
        <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>
          Cancel
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-muted flex items-center justify-between rounded-md px-4 py-2">
      <span className="text-muted-foreground text-sm">Set {set.setNumber}</span>
      <div className="flex items-center gap-2">
        <span className="font-medium">
          {set.reps ?? 0} reps x {set.weight ?? 0} lbs
        </span>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => setIsEditing(true)}
        >
          <Pencil className="size-3" />
        </Button>
        <Button variant="ghost" size="icon-sm" onClick={handleDelete}>
          <Trash2 className="size-3" />
        </Button>
      </div>
    </div>
  );
}
