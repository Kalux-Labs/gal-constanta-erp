"use client"

import {Badge} from "@/components/ui/badge";
import {Check} from "lucide-react";

export default function FinancialRecordsProgressCell({progress}: {progress: number}) {
    const threshold = 98;

    const displayedProgress = progress > threshold ? "Finalizat" : `${progress} %`;
    const variant = progress > threshold ? "default" : "outline";
    const displayIcon = progress > threshold;
    const className = progress > threshold ? "border-green-600 text-green-600 dark:border-green-500 dark:text-green-500 bg-white dark:bg-background" : undefined;

    return (
        <Badge variant={variant} className={className}>
            {displayIcon && <Check/>}
            {`${displayedProgress}`}
        </Badge>
    )
}