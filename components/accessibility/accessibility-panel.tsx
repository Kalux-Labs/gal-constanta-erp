"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {useAccessibility} from "@/components/accessibility/accessibility-provider";
import {Button} from "@/components/ui/button";
import {Switch} from "@/components/ui/switch";

export function AccessibilityPanel() {
    const { state, setFontScale, toggleContrast, toggleMotion } = useAccessibility();

    return (
        <Card className="fixed bottom-24 right-4 z-50 w-80 shadow-xl py-4">
            <CardHeader className="px-4">
                <CardTitle>Preferințe de accesibilitate</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4 px-4">
                <div className="flex justify-between items-center">
                    <span>Mărimea fontului</span>
                    <div className="space-x-2">
                        <Button size="sm" className="w-12" onClick={() => setFontScale(Math.max(0.9, state.fontScale - 0.1))}>
                            A-
                        </Button>
                        <Button size="sm" className="w-12" onClick={() => setFontScale(Math.min(1.5, state.fontScale + 0.1))}>
                            A+
                        </Button>
                    </div>
                </div>

                <div className="flex justify-between items-center">
                    <span>Contrast mărit</span>
                    <Switch checked={state.highContrast} onCheckedChange={toggleContrast} />
                </div>

                <div className="flex justify-between items-center">
                    <span>Fără animații</span>
                    <Switch checked={state.reduceMotion} onCheckedChange={toggleMotion} />
                </div>
            </CardContent>
        </Card>
    );
}
