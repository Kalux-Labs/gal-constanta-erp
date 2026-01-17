"use client";

import { Button } from "@/components/ui/button";
import {PersonStandingIcon} from "lucide-react";

export function AccessibilityButton({ action }: { action: () => void }) {
    return (
        <Button
            aria-label="Open accessibility options"
            onClick={action}
            className="fixed bottom-4 right-4 z-50 rounded-full h-12 w-12 shadow-lg"
        >
            <PersonStandingIcon className="!h-6 !w-6"/>
        </Button>
    );
}
