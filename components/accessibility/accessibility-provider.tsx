"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type AccessibilityState = {
    fontScale: number;
    highContrast: boolean;
    reduceMotion: boolean;
};

type AccessibilityContextType = {
    state: AccessibilityState;
    setFontScale: (v: number) => void;
    toggleContrast: () => void;
    toggleMotion: () => void;
};

const AccessibilityContext = createContext<AccessibilityContextType | null>(null);

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
    const [state, setState] = useState<AccessibilityState>({
        fontScale: 1,
        highContrast: false,
        reduceMotion: false,
    });

    // Apply side effects
    useEffect(() => {
        document.documentElement.style.fontSize = `${state.fontScale * 100}%`;
        document.documentElement.classList.toggle("high-contrast", state.highContrast);
        document.documentElement.classList.toggle("reduce-motion", state.reduceMotion);

        localStorage.setItem("accessibility", JSON.stringify(state));
    }, [state]);

    // Load persisted settings
    useEffect(() => {
        const saved = localStorage.getItem("accessibility");
        if (saved) setState(JSON.parse(saved));
    }, []);

    return (
        <AccessibilityContext.Provider
            value={{
                state,
                setFontScale: (v) => setState(s => ({ ...s, fontScale: v })),
                toggleContrast: () => setState(s => ({ ...s, highContrast: !s.highContrast })),
                toggleMotion: () => setState(s => ({ ...s, reduceMotion: !s.reduceMotion })),
            }}
        >
            {children}
        </AccessibilityContext.Provider>
    );
}

export const useAccessibility = () => {
    const ctx = useContext(AccessibilityContext);
    if (!ctx) throw new Error("useAccessibility must be used inside provider");
    return ctx;
};
