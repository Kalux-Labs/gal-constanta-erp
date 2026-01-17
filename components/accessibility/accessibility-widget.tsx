"use client";

import { useState } from "react";
import {AccessibilityButton} from "@/components/accessibility/accessibility-button";
import {AccessibilityPanel} from "@/components/accessibility/accessibility-panel";

export function AccessibilityWidget() {
    const [open, setOpen] = useState(false);

    return (
        <>
            <AccessibilityButton action={() => setOpen(o => !o)} />
            {open && <AccessibilityPanel />}
        </>
    );
}
