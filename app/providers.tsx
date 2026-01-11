'use client';

import {NextIntlClientProvider} from 'next-intl';
import React from "react";
import {DeepPartial} from "react-hook-form";
import {
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query';
import {ReactQueryDevtools} from "@tanstack/react-query-devtools";

interface ProvidersProps {
    children: React.ReactNode;
    locale: string;
    messages?: DeepPartial<Record<string, never>> | null | undefined;
}

const queryClient = new QueryClient();

export function Providers({children, locale, messages}: ProvidersProps) {

    return (
        <NextIntlClientProvider locale={locale} messages={messages} timeZone={"UTC"}>
            <QueryClientProvider client={queryClient}>
                {children}
                <ReactQueryDevtools initialIsOpen={false}/>
            </QueryClientProvider>
        </NextIntlClientProvider>
    );
}