"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { TooltipWrapper } from "@/components/ui/tooltip-wrapper";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { getTooltipContent } from "@/lib/tooltip-content";
import type { DateRange } from "react-day-picker";

interface UsageActionBarProps {
  date: DateRange | undefined;
  setDate: (date: DateRange | undefined) => void;
}

export function UsageActionBar({ date, setDate }: UsageActionBarProps) {
  return (
    <div className="flex flex-wrap gap-2 justify-end mb-6">
      <TooltipWrapper content={getTooltipContent('billing', 'export')}>
        <Button
          variant="outline"
          className="h-10 px-4 rounded-md"
        >
          Export Report
        </Button>
      </TooltipWrapper>
      <Popover>
        <TooltipWrapper content="Select date range for usage report">
          <PopoverTrigger asChild>
            <Button
              id="date-range"
              variant="outline"
              className="ml-2 min-w-[220px] justify-start text-left font-normal rounded-md h-10 px-4"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}
                  </>
                ) : (
                  format(date.from, "LLL dd, y")
                )
              ) : (
                <span>Pick a date range</span>
              )}
            </Button>
          </PopoverTrigger>
        </TooltipWrapper>
        <PopoverContent className="w-auto p-0" align="end">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
} 