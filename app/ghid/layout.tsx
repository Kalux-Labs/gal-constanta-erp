import React from "react";
import Sidebar from "@/app/ghid/sidebar";

export default function DocsLayout({children}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex max-w-4xl mx-auto md:-mt-3">
            <Sidebar/>
            <main className="flex-1 p-4">{children}</main>
        </div>
    )
}
