"use client";

import * as React from "react";
import {CalendarIcon} from "lucide-react";
import {format} from "date-fns";
import {ro} from "date-fns/locale";
import {cn} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import {Calendar} from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {ScrollArea, ScrollBar} from "@/components/ui/scroll-area";

interface DateTimePickerProps {
    field: {
        value: string;
        onChange: (value: string) => void;
    };
    disablePastDates?: boolean;
    enableHours?: boolean;
    enableMinutes?: boolean;
    onSelect?: () => void;
    disabled?: boolean;
}

export default function DateTimePicker({
                                           field,
                                           disablePastDates,
                                           enableMinutes,
                                           enableHours,
                                           onSelect,
                                           disabled,
                                       }: DateTimePickerProps) {
    const date = field.value ? new Date(field.value) : undefined;

    const [isOpen, setIsOpen] = React.useState(false);

    const hours = Array.from({length: 24}, (_, i) => i + 1);

    const handleDateSelect = (selectedDate: Date | undefined) => {
        if (selectedDate) {
            const newDate = date ? new Date(date): new Date();
            newDate.setFullYear(selectedDate.getFullYear());
            newDate.setMonth(selectedDate.getMonth());
            newDate.setDate(selectedDate.getDate());
            field.onChange(newDate.toISOString());
        }
        onSelect?.();
        setIsOpen(false);
    };

    const handleTimeChange = (type: "hour" | "minute", value: string) => {
        const newDate = date ? new Date(date) : new Date();
        if (type === "hour") {
            newDate.setHours(parseInt(value));
        } else if (type === "minute") {
            newDate.setMinutes(parseInt(value));
        }
        field.onChange(format(newDate, formatString(), {locale: ro}));
    };

    const formatString = () => {
        if (enableHours) {
            if (enableMinutes) {
                return "dd MMMM yyyy HH:mm";
            }
            return "dd MMMM yyyy HH";
        }
        return "dd MMMM yyyy";
    };

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen} modal>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground",
                    )}
                    disabled={disabled}
                >
                    <CalendarIcon className="h-4 w-4"/>
                    {date ? (
                        format(date, formatString(), {locale: ro})
                    ) : (
                        <span>Alege data</span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
                <div className="sm:flex">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={handleDateSelect}
                        autoFocus={true}
                        locale={ro}
                        disabled={
                            disablePastDates
                                ? {
                                    before: new Date(),
                                }
                                : disabled
                        }
                    />
                    {enableHours && (
                        <div className="flex flex-col sm:flex-row sm:h-[300px] divide-y sm:divide-y-0 sm:divide-x">
                            <ScrollArea className="w-64 sm:w-auto">
                                <div className="flex sm:flex-col p-2">
                                    {hours.map((hour) => (
                                        <Button
                                            key={hour}
                                            size="icon"
                                            variant={
                                                date && date.getHours() % 12 === hour % 12
                                                    ? "default"
                                                    : "ghost"
                                            }
                                            className="sm:w-full shrink-0 aspect-square"
                                            onClick={() => handleTimeChange("hour", hour.toString())}
                                        >
                                            {hour}
                                        </Button>
                                    ))}
                                </div>
                                <ScrollBar orientation="horizontal" className="sm:hidden"/>
                            </ScrollArea>
                            {enableMinutes && (
                                <ScrollArea className="w-64 sm:w-auto">
                                    <div className="flex sm:flex-col p-2">
                                        {Array.from({length: 12}, (_, i) => i * 5).map(
                                            (minute) => (
                                                <Button
                                                    key={minute}
                                                    size="icon"
                                                    variant={
                                                        date && date.getMinutes() === minute
                                                            ? "default"
                                                            : "ghost"
                                                    }
                                                    className="sm:w-full shrink-0 aspect-square"
                                                    onClick={() =>
                                                        handleTimeChange("minute", minute.toString())
                                                    }
                                                >
                                                    {minute.toString().padStart(2, "0")}
                                                </Button>
                                            ),
                                        )}
                                    </div>
                                    <ScrollBar orientation="horizontal" className="sm:hidden"/>
                                </ScrollArea>
                            )}
                        </div>
                    )}
                </div>
            </PopoverContent>
        </Popover>
    );
}