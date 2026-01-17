import { Metadata } from "next";

interface SeoOptions {
    title: string;
    canonicalUrl: string;
    description?: string;
    ogImage?: string;
    keywords: string[];
    category?: string;
}

const BASE_URL = "https://asociatiagalconstantacentru.ro"

export function buildMetadata({
                                  title,
                                  canonicalUrl = BASE_URL,
                                  description = "Platforma Grupului de Acțiune Locală Constanța - Portal dedicat sprijinului și dezvoltării proiectelor de investiții în comunitatea noastră locală.",
                                  ogImage = `${BASE_URL}/preview.jpg`,
                                  keywords = [],
                                  category,
                              }: SeoOptions): Metadata {
    return {
        title: title,
        description: description,
        keywords: keywords,
        alternates: {
            canonical: canonicalUrl,
        },
        openGraph: {
            title: title,
            description: description,
            url: canonicalUrl,
            siteName: "GAL Constanța Centru",
            locale: "ro_RO",
            type: "website",
            images: [
                {
                    url: ogImage,
                    alt: title,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: title,
            description: description,
            images: [ogImage],
        },
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                "max-snippet": -1,
                "max-image-preview": "large",
                "max-video-preview": -1,
            },
        },
        icons: {
            icon: [
                {
                    url: `${BASE_URL}/favicon-16x16.png`,
                    sizes: "16x16",
                    type: "image/png",
                },
                {
                    url: `${BASE_URL}/favicon-32x32.png`,
                    sizes: "32x32",
                    type: "image/png",
                },
            ],
            shortcut: `${BASE_URL}/favicon.ico`,
            apple: [
                {
                    url: `${BASE_URL}/apple-touch-icon.png`,
                    sizes: "180x180",
                    type: "image/png",
                },
            ],
        },
        category: category,
        manifest: "/site.webmanifest",
        other: {
            "og:image": ogImage,
            "og:url": canonicalUrl,
            "og:title": title,
            "og:description": description,
            "og:type": "website",
        },
    };
}
