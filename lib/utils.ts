import {clsx, type ClassValue} from "clsx"
import {twMerge} from "tailwind-merge"
import {RecurrencyOption, recurrencyOptions, RecurrencyValue} from "@/lib/types/recurrency";
import {Calendar, Repeat} from "lucide-react";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}
export function formatCurrencyToRO({value, currency}: { value: number; currency?: string }) {
    return new Intl.NumberFormat("ro-RO", {
        style: "currency",
        currency: currency ?? "RON",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value);
}

export function getCurrentYear(): number {
    return new Date().getFullYear();
}

export function getCurrentQuarter(): 1 | 2 | 3 | 4 {
    const month = new Date().getMonth() + 1; // getMonth() returns 0-11
    if (month <= 3) return 1;
    if (month <= 6) return 2;
    if (month <= 9) return 3;
    return 4;
}

export function getRecurrencyVariant(recurrency: RecurrencyOption): string {
    const variants = {
        none: "outline",
        weekly: "secondary",
        monthly: "secondary"
    };
    return variants[recurrency.value as keyof typeof variants] || "secondary";
}

export function getRecurrencyIcon(recurrency: RecurrencyOption) {
    const icons = {
        none: Calendar,
        weekly: Repeat,
        monthly: Repeat
    };
    return icons[recurrency.value as keyof typeof icons] || Repeat;
}

export function getRecurrencyLabel(value: RecurrencyValue | null | undefined): string {
    if (!value || value === 'none') return 'Fără recurență';
    return recurrencyOptions.find(opt => opt.value === value)?.label || 'Fără recurență';
}

export function getRecurrencyOption(value: RecurrencyValue | null | undefined): RecurrencyOption {
    if (!value || value === 'none') {
        return { value: 'none', label: 'Fără recurență' };
    }
    return recurrencyOptions.find(opt => opt.value === value) || { value: 'none', label: 'Fără recurență' };
}

export const quarterOptionsLiterals = [1, 2, 3, 4] as const;
