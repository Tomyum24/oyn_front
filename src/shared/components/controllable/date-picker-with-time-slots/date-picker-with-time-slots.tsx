import { useState } from "react";
import { Control, FieldPath, FieldValues } from "react-hook-form";

import { Button } from "@/shared/components/ui/button";
import { Calendar } from "@/shared/components/ui/calendar";
import { Card, CardContent } from "@/shared/components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";

import { cn } from "@/shared/lib/utils";

import { Input } from "../../ui/input";
import { Separator } from "../../ui/separator";

import { CalendarIcon } from "lucide-react";

import dayjs from "dayjs";

import { ru } from "date-fns/locale";

interface FormDatePickerWithTimeSlotsProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
  timeSlotInterval?: number;
  startHour?: number;
  endHour?: number;
  bookedDates?: Date[];
  showFooter?: boolean;
  disableTimeSlots?: boolean;
}

export function FormDatePickerWithTimeSlots<T extends FieldValues>({
  control,
  name,
  label,
  placeholder = "Select a date and time for your meeting.",
  required = false,
  className,
  timeSlotInterval = 15,
  startHour = 9,
  endHour = 18,
  bookedDates = [],
  disableTimeSlots = false,
}: FormDatePickerWithTimeSlotsProps<T>) {
  const [timeInputValue, setTimeInputValue] = useState<string>("");

  const generateTimeSlots = () => {
    const slots = [];
    const totalMinutes = (endHour - startHour) * 60;
    const numberOfSlots = Math.ceil(totalMinutes / timeSlotInterval);

    for (let i = 0; i <= numberOfSlots; i++) {
      const minutes = i * timeSlotInterval;
      const hour = Math.floor(minutes / 60) + startHour;
      const minute = minutes % 60;

      if (hour >= endHour && minute > 0) break;
      if (hour > endHour) break;

      slots.push(
        `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`,
      );
    }

    return slots;
  };

  const timeSlots = generateTimeSlots();

  const parseDateTime = (
    value: any,
  ): { date: Date | undefined; time: string | null } => {
    if (!value) return { date: undefined, time: null };

    try {
      const parsed = dayjs(value);
      if (parsed.isValid()) {
        return {
          date: parsed.toDate(),
          time: parsed.format("HH:mm"),
        };
      }
    } catch {
      return { date: undefined, time: null };
    }

    return { date: undefined, time: null };
  };

  const combineDateTime = (
    date: Date | undefined,
    time: string | null,
  ): string => {
    if (!date || !time) return "";

    const dateStr = dayjs(date).format("YYYY-MM-DD");
    return dayjs(`${dateStr}T${time}:00`).toISOString();
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const { date: parsedDate, time: parsedTime } = parseDateTime(
          field.value,
        );

        const handleInputFocus = () => {
          // Initialize local state with current value when user focuses on input
          if (!timeInputValue && parsedTime) {
            setTimeInputValue(parsedTime);
          }
        };

        const handleDateSelect = (date: Date | undefined) => {
          if (date && parsedTime) {
            field.onChange(combineDateTime(date, parsedTime));
          } else if (date) {
            const dateStr = dayjs(date).format("YYYY-MM-DD");
            field.onChange(dayjs(`${dateStr}T00:00:00`).toISOString());
          }
        };

        const handleTimeSelect = (time: string) => {
          if (parsedDate) {
            field.onChange(combineDateTime(parsedDate, time));
          }
        };

        const handleTimeInputChange = (
          e: React.ChangeEvent<HTMLInputElement>,
        ) => {
          let value = e.target.value.replace(/[^\d:]/g, ""); // Remove non-numeric and non-colon characters

          // Auto-format as user types
          if (
            value.length === 2 &&
            !value.includes(":") &&
            timeInputValue.length < value.length
          ) {
            value = value + ":";
          }

          // Limit to HH:MM format
          if (value.length > 5) {
            value = value.slice(0, 5);
          }

          // Validate and cap hours and minutes as user types
          if (value.includes(":")) {
            const parts = value.split(":");
            const hours = parts[0];
            const minutes = parts[1] || "";

            // Cap hours at 23 (only if complete)
            let cappedHours = hours;
            if (hours.length === 2) {
              const h = parseInt(hours, 10);
              if (h > 23) {
                cappedHours = "23";
              }
            }

            // Cap minutes at 59 (only if typing would exceed)
            let cappedMinutes = minutes;
            if (minutes.length >= 1) {
              const m = parseInt(minutes, 10);
              if (m > 59) {
                cappedMinutes = "59";
              }
            }

            value = cappedMinutes
              ? `${cappedHours}:${cappedMinutes}`
              : `${cappedHours}:`;
          } else if (value.length === 2) {
            // Cap hours when colon hasn't been added yet (only check if complete)
            const h = parseInt(value, 10);
            if (h > 23) {
              value = "23";
            }
          }

          // Update local state for display
          setTimeInputValue(value);

          // Validate complete time format and update form
          if (value.length === 5 && value.includes(":")) {
            const [hours, minutes] = value.split(":");
            const h = parseInt(hours, 10);
            const m = parseInt(minutes, 10);

            // Validate hours (0-23) and minutes (0-59)
            if (
              !isNaN(h) &&
              !isNaN(m) &&
              h >= 0 &&
              h <= 23 &&
              m >= 0 &&
              m <= 59
            ) {
              const formattedValue = `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
              handleTimeSelect(formattedValue);
            }
          }
        };

        const displayValue =
          parsedDate && parsedTime
            ? `${dayjs(parsedDate).format("MMM D, YYYY")} at ${parsedTime}`
            : parsedDate
              ? dayjs(parsedDate).format("MMM D, YYYY")
              : placeholder;

        return (
          <FormItem className={cn("flex flex-col", className)}>
            <FormLabel>
              {label}
              {required && <span className="text-red-500">*</span>}
            </FormLabel>
            <Popover>
              <PopoverTrigger>
                <FormControl>
                  <Button
                    type="button"
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !field.value && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {displayValue}
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Card className="gap-0 border-0 p-0 shadow-none">
                  <CardContent
                    className={cn(
                      "relative p-0 md:pr-32",
                      disableTimeSlots && "md:pr-0",
                    )}
                  >
                    <Calendar
                      mode="single"
                      selected={parsedDate}
                      onSelect={handleDateSelect}
                      defaultMonth={parsedDate}
                      disabled={bookedDates}
                      showOutsideDays={false}
                      modifiers={{
                        booked: bookedDates,
                      }}
                      modifiersClassNames={{
                        booked: "[&>button]:line-through opacity-100",
                      }}
                      formatters={{
                        formatWeekdayName: (date) => {
                          return date.toLocaleString("en-US", {
                            weekday: "short",
                          });
                        },
                      }}
                      locale={ru}
                    />
                    {!disableTimeSlots ? (
                      <div className="no-scrollbar inset-y-0 right-0 flex max-h-72 w-full scroll-pb-4 flex-col gap-4 overflow-y-auto border-t p-4 md:absolute md:max-h-none md:w-32 md:border-t-0 md:border-l">
                        <div className="grid gap-2">
                          {timeSlots.map((time) => (
                            <Button
                              key={time}
                              type="button"
                              variant={
                                parsedTime === time ? "default" : "outline"
                              }
                              onClick={() => handleTimeSelect(time)}
                              className="w-full shadow-none"
                            >
                              {time}
                            </Button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <>
                        <Separator />
                        <div className="p-4">
                          <Input
                            type="text"
                            value={timeInputValue || parsedTime || ""}
                            onChange={handleTimeInputChange}
                            onFocus={handleInputFocus}
                            className="w-full"
                            placeholder="Введите время"
                            maxLength={5}
                            pattern="[0-2][0-9]:[0-5][0-9]"
                          />
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
