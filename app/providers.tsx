'use client';

import React from "react";
import {
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query';
import {ReactQueryDevtools} from "@tanstack/react-query-devtools";
import {AccessibilityProvider} from "@/components/accessibility/accessibility-provider";
import {AccessibilityWidget} from "@/components/accessibility/accessibility-widget";

interface ProvidersProps {
    children: React.ReactNode;
}

const queryClient = new QueryClient();

export function Providers({children}: ProvidersProps) {

    return (
        <QueryClientProvider client={queryClient}>
            <AccessibilityProvider>
                {children}
                <AccessibilityWidget/>
            </AccessibilityProvider>
            {/*<ReactQueryDevtools initialIsOpen={false}/>*/}
        </QueryClientProvider>
    );
}