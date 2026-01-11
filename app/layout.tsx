import type {Metadata} from "next";
import {Geist, Geist_Mono} from "next/font/google";
import "./globals.css";
import React from "react";
import {Providers} from "@/app/providers";
import {getLocale, getMessages} from "next-intl/server";
import {Toaster} from "@/components/ui/sonner";
import NextTopLoader from "nextjs-toploader";
import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import {ThemeProvider} from "@/components/theme-provider";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {

    return {
        title: "",
        description: "",
    }
}

export default async function RootLayout({
                                             children,
                                         }: Readonly<{
    children: React.ReactNode;
}>) {
    const locale = await getLocale();
    const messages = await getMessages();

    return (
        <html lang={"ro"} suppressHydrationWarning>
        <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
        <NextTopLoader/>
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <div className="flex flex-col min-h-screen">
                <Header/>
                <main className="pt-18 flex-1">
                    <Providers locale={locale} messages={messages}>
                        {children}
                    </Providers>
                </main>
            </div>
            <Toaster/>
            <Footer/>
        </ThemeProvider>
        </body>
        </html>
    );
}
