"use client";

import { useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { format } from "date-fns";

import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";

interface DatePickerProps {
  dateString: string;
}

export function DatePicker({ dateString }: DatePickerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const date = useMemo(
    () => new Date(dateString + "T00:00:00"),
    [dateString]
  );

  const handleDateChange = (newDate: Date | undefined) => {
    if (newDate) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("date", format(newDate, "yyyy-MM-dd"));
      router.push(`/dashboard?${params.toString()}`);
    }
  };

  return (
    <Card className="w-full p-4">
      <Calendar
        className="w-full"
        mode="single"
        selected={date}
        onSelect={handleDateChange}
      />
    </Card>
  );
}
