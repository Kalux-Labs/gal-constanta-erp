
import { createContext, useContext, useState, ReactNode } from "react";
import { Task } from "@/lib/types/task";

interface TaskSheetOptions {
    year?: number;
    quarter?: 1 | 2 | 3 | 4;
    parentId?: number;
}

interface TaskSheetContextType {
    open: boolean;
    task: Task | undefined;
    options: TaskSheetOptions;
    openTaskSheet: (task?: Task, options?: TaskSheetOptions) => void;
    closeTaskSheet: () => void;
}

const TaskSheetContext = createContext<TaskSheetContextType | null>(null);

export function TaskSheetProvider({ children }: { children: ReactNode }) {
    const [open, setOpen] = useState(false);
    const [task, setTask] = useState<Task | undefined>(undefined);
    const [options, setOptions] = useState<TaskSheetOptions>({});

    const openTaskSheet = (task?: Task, options?: TaskSheetOptions) => {
        setTask(task);
        setOptions(options || {});
        setOpen(true);
    };

    const closeTaskSheet = () => {
        setOpen(false);
        setTask(undefined);
        setOptions({});
    };

    return (
        <TaskSheetContext.Provider
            value={{ open, task, options, openTaskSheet, closeTaskSheet }}
        >
            {children}
        </TaskSheetContext.Provider>
    );
}

export function useTaskSheet() {
    const ctx = useContext(TaskSheetContext);
    if (!ctx) throw new Error("useTaskSheet must be used inside TaskSheetProvider");
    return ctx;
}