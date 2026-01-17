import type {Metadata} from "next";
import {Geist, Geist_Mono} from "next/font/google";
import "./globals.css";
import React from "react";
import {Providers} from "@/app/providers";
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

export const metadata: Metadata = {
    title: "Asociația GAL Constanța Centru",
    description: "Platforma Grupului de Acțiune Locală Constanța - Portal dedicat sprijinului și dezvoltării proiectelor de investiții în comunitatea noastră locală."
};

export default async function RootLayout({
                                             children,
                                         }: Readonly<{
    children: React.ReactNode;
}>) {

    return (
        <html lang={"ro"} suppressHydrationWarning>
        <head>
            <meta charSet="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <meta
                name="keywords"
                content="asociatia gal constanta, gal, constanta, rural"
            />
            <meta name="author" content="Kalux Labs SRL" />

            <meta
                property="og:title"
                content="Asociația GAL Constanța Centru"
            />
            <meta
                property="og:description"
                content="Platforma Grupului de Acțiune Locală Constanța - Portal dedicat sprijinului și dezvoltării proiectelor de investiții în comunitatea noastră locală."
            />
            <meta property="og:type" content="website" />
            <meta property="og:url" content="https://asociatiagalconstantacentru.ro" />
            <meta property="og:image" content="https://asociatiagalconstantacentru.ro/preview.jpg" />

            <meta
                property="twitter:title"
                content="Asociația GAL Constanța Centru"
            />
            <meta
                property="twitter:description"
                content="Platforma Grupului de Acțiune Locală Constanța - Portal dedicat sprijinului și dezvoltării proiectelor de investiții în comunitatea noastră locală."
            />
            <meta property="twitter:image" content="https://asociatiagalconstantacentru.ro/favicon.ico" />

            <link
                rel="apple-touch-icon"
                sizes="180x180"
                href="/apple-touch-icon.png"
            />
            <link
                rel="icon"
                type="image/png"
                sizes="32x32"
                href="/favicon-32x32.png"
            />
            <link
                rel="icon"
                type="image/png"
                sizes="16x16"
                href="/favicon-16x16.png"
            />
            <link rel="manifest" href="/site.webmanifest" />
            <title>Asociația GAL Constanța Centru</title>
        </head>
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
                    <Providers>
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
