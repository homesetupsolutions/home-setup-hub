import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { format, parseISO, isSameDay, addDays, startOfDay } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { SquareAvailability } from "@/lib/squareBooking";

interface TimeSlotPickerProps {
  availabilities: SquareAvailability[];
  selectedTime: string | null;
  onSelectTime: (time: string) => void;
  isLoading: boolean;
}

export function TimeSlotPicker({
  availabilities,
  selectedTime,
  onSelectTime,
  isLoading,
}: TimeSlotPickerProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // Get unique dates that have availability
  const availableDates = useMemo(() => {
    const dates = new Set<string>();
    availabilities.forEach((a) => {
      const date = format(parseISO(a.start_at), 'yyyy-MM-dd');
      dates.add(date);
    });
    return dates;
  }, [availabilities]);

  // Get time slots for selected date
  const timeSlotsForDate = useMemo(() => {
    return availabilities.filter((a) => 
      isSameDay(parseISO(a.start_at), selectedDate)
    ).sort((a, b) => 
      new Date(a.start_at).getTime() - new Date(b.start_at).getTime()
    );
  }, [availabilities, selectedDate]);

  // Group time slots by morning/afternoon/evening
  const groupedSlots = useMemo(() => {
    const groups = {
      morning: [] as SquareAvailability[],
      afternoon: [] as SquareAvailability[],
      evening: [] as SquareAvailability[],
    };

    timeSlotsForDate.forEach((slot) => {
      const hour = parseISO(slot.start_at).getHours();
      if (hour < 12) {
        groups.morning.push(slot);
      } else if (hour < 17) {
        groups.afternoon.push(slot);
      } else {
        groups.evening.push(slot);
      }
    });

    return groups;
  }, [timeSlotsForDate]);

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Select Date & Time</h2>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Calendar */}
        <div className="bg-card rounded-xl border p-4">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            disabled={(date) => {
              const dateStr = format(date, 'yyyy-MM-dd');
              return date < startOfDay(new Date()) || !availableDates.has(dateStr);
            }}
            modifiers={{
              available: (date) => availableDates.has(format(date, 'yyyy-MM-dd')),
            }}
            modifiersStyles={{
              available: { fontWeight: 'bold' },
            }}
            className="rounded-md"
          />
        </div>

        {/* Time Slots */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-48">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          ) : timeSlotsForDate.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
              <Clock className="w-12 h-12 mb-2 opacity-50" />
              <p>No available times for this date</p>
              <p className="text-sm">Please select another date</p>
            </div>
          ) : (
            <>
              <p className="text-sm text-muted-foreground">
                {format(selectedDate, 'EEEE, MMMM d, yyyy')}
              </p>

              {Object.entries(groupedSlots).map(([period, slots]) => 
                slots.length > 0 && (
                  <div key={period} className="space-y-2">
                    <h3 className="text-sm font-medium capitalize text-muted-foreground">
                      {period}
                    </h3>
                    <div className="grid grid-cols-3 gap-2">
                      {slots.map((slot) => (
                        <motion.button
                          key={slot.start_at}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={cn(
                            "px-3 py-2 rounded-lg text-sm font-medium transition-all",
                            selectedTime === slot.start_at
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted hover:bg-muted/80"
                          )}
                          onClick={() => onSelectTime(slot.start_at)}
                        >
                          {format(parseISO(slot.start_at), 'h:mm a')}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
