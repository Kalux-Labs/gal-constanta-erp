import {format} from "date-fns";
import {ro} from "date-fns/locale";
import * as Sentry from "@sentry/nextjs";

export const DATE_FORMATS = {
    short: "dd.MM.yyyy",              // 08.01.2026
    medium: "dd MMM yyyy",             // 08 ian 2026
    mediumFull: "dd MMM. yyyy",        // 08 ian. 2026
    long: "dd MMMM yyyy",              // 08 ianuarie 2026
    full: "EEEE, dd MMMM yyyy",        // joi, 08 ianuarie 2026
    time: "HH:mm",                     // 14:30
    dateTime: "dd MMM yyyy, HH:mm",    // 08 ian 2026, 14:30
    dateTimeFull: "dd MMMM yyyy, HH:mm", // 08 ianuarie 2026, 14:30
    iso: "yyyy-MM-dd",                 // 2026-01-08
} as const;

export type DateFormatPreset = keyof typeof DATE_FORMATS;

export function formatDate(
    date: Date | string | null,
    formatPreset: DateFormatPreset | string = "medium"
): string | null {
    if (!date) return null;

    try {
        const dateObj = date instanceof Date ? date : new Date(date);

        const formatStr = formatPreset in DATE_FORMATS
            ? DATE_FORMATS[formatPreset as DateFormatPreset]
            : formatPreset;

        return format(dateObj, formatStr, {locale: ro});
    } catch (error) {
        Sentry.captureException(error, {
            level: 'error',
            tags: {
                component: 'date-formats.ts',
            }
        });
        return null;
    }
}

export const formatDateShort = (date: Date | string | null) => formatDate(date, "short");
export const formatDateMedium = (date: Date | string | null) => formatDate(date, "medium");
export const formatDateMediumFull = (date: Date | string | null) => formatDate(date, "mediumFull");
export const formatDateLong = (date: Date | string | null) => formatDate(date, "long");
export const formatDateFull = (date: Date | string | null) => formatDate(date, "full");
export const formatTime = (date: Date | string | null) => formatDate(date, "time");
export const formatDateTime = (date: Date | string | null) => formatDate(date, "dateTime");
export const formatDateTimeFull = (date: Date | string | null) => formatDate(date, "dateTimeFull");
export const formatDateISO = (date: Date | string | null) => formatDate(date, "iso");