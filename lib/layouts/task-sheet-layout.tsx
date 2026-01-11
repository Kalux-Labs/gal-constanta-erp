"use client"

import {TaskSheetProvider} from "@/lib/hooks/tasks/use-task-sheet";
import React from "react";
import NewTaskSheet from "@/components/ui/tasks/client/new-task-sheet";

export default function TaskSheetLayout({children}: {children: React.ReactNode}) {
    return (
        <TaskSheetProvider>
            {children}
            <NewTaskSheet/>
        </TaskSheetProvider>
    )
}