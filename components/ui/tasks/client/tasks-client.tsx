"use client";

import {zodResolver} from "@hookform/resolvers/zod";
import {FormProvider, useForm} from "react-hook-form";
import {z} from "zod";
import {Tabs, TabsList, TabsTrigger, TabsContent} from "@/components/ui/tabs";
import {TaskCard} from "@/components/ui/tasks/common/task-card";
import {useTasks} from "@/lib/hooks/tasks/use-tasks";
import FormField from "@/components/forms/form-field";
import {FormCombobox} from "@/components/forms/form-combobox";
import {Button} from "@/components/ui/button";
import {
    DownloadIcon,
    Loader2,
    MoreHorizontalIcon,
    Plus, Trash2
} from "lucide-react";
import {taskQuerySchema} from "@/lib/validation/schemas/tasks-query-schema";
import {useTaskSheet} from "@/lib/hooks/tasks/use-task-sheet";
import {getCurrentQuarter, getCurrentYear, quarterOptionsLiterals} from "@/lib/utils";
import {ButtonGroup} from "@/components/ui/button-group";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem, DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import React from "react";
import ExportTasksDialog from "@/components/ui/tasks/client/export-tasks-dialog";
import DeleteTasksDialog from "@/components/ui/tasks/client/delete-tasks-dialog";

type DoneOption = {
    value: "all" | "true" | "false";
    label: string;
};

const doneOptions: DoneOption[] = [
    {value: "all", label: "Toate"},
    {value: "true", label: "Finalizate"},
    {value: "false", label: "Nefinalizate"},
];

type FormValues = z.infer<typeof taskQuerySchema>;

export default function TasksClient() {
    const {openTaskSheet} = useTaskSheet();
    const form = useForm<FormValues>({
        resolver: zodResolver(taskQuerySchema),
        defaultValues: {
            year: getCurrentYear(),
            quarter: getCurrentQuarter(),
            search: null,
            isDone: doneOptions[0],
        },
    });

    const watchedValues = form.watch();
    const {year, quarter, search, isDone} = watchedValues;

    const {data, isFetching, isPending} = useTasks({
        year,
        quarter,
        search,
        done: isDone.value === "all" ? null : isDone.value === "true",
    });

    return (
        <>
            <div className="space-y-4">
                <FormProvider {...form}>
                    <form className="flex flex-col md:flex-row items-end gap-4">
                        <div className="flex flex-col md:flex-row items-end gap-4 flex-1 w-full">
                            <div className="w-full md:w-[300px]">
                                <FormField
                                    name="search"
                                    placeholder="Filtrează după titlu..."
                                    type="text"
                                />
                            </div>

                            <div className="w-full md:w-[140px]">
                                <FormCombobox
                                    name="isDone"
                                    placeholder="Selectează status"
                                    options={doneOptions}
                                    getId={(item) => item.value}
                                    getLabel={(item) => item.label}
                                    searchPlaceholder="Caută status..."
                                    variant="dashed"
                                />
                            </div>

                            <div className="w-full md:w-[140px]">
                                <FormCombobox
                                    name="year"
                                    placeholder="Selectează anul"
                                    options={[2024, 2025, 2026, 2027]}
                                    getId={(item) => item}
                                    getLabel={(item) => String(item)}
                                    searchPlaceholder="Caută anul..."
                                    variant="dashed"
                                />
                            </div>
                        </div>
                        <ButtonGroup className="w-full md:w-auto gap-4 sm:gap-0">
                            <Button
                                type="button"
                                variant="outline"
                                className="flex-1" onClick={() => openTaskSheet()}>
                                <Plus/>
                                <span className="inline md:hidden lg:inline">Adaugă activitate</span>
                                <span className="hidden md:inline lg:hidden">Adaugă</span>
                            </Button>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button type="button" variant="outline" size="icon" aria-label="Mai multe opțiuni">
                                        <MoreHorizontalIcon/>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-44" align="end">
                                    <DropdownMenuGroup>
                                        <ExportTasksDialog>
                                            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                                <DownloadIcon/>
                                                Descarcă raport
                                            </DropdownMenuItem>
                                        </ExportTasksDialog>
                                        <DropdownMenuSeparator/>
                                        <DeleteTasksDialog>
                                            <DropdownMenuItem variant="destructive"
                                                              onSelect={(e) => e.preventDefault()}>
                                                <Trash2/>
                                                Ștergere avansată
                                            </DropdownMenuItem>
                                        </DeleteTasksDialog>
                                    </DropdownMenuGroup>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </ButtonGroup>
                    </form>
                </FormProvider>

                <Tabs
                    value={quarter.toString()}
                    onValueChange={(value) => form.setValue("quarter", parseInt(value) as 1 | 2 | 3 | 4)}
                    className="gap-4"
                >
                    <TabsList className="h-full bg-background gap-2 border w-full px-2 py-2">
                        {quarterOptionsLiterals.map(q => (
                            <TabsTrigger
                                key={q}
                                value={q.toString()}
                                className="h-[36px] flex-row items-center gap-2 data-[state=active]:bg-primary dark:data-[state=active]:bg-primary data-[state=active]:text-primary-foreground dark:data-[state=active]:text-primary-foreground dark:data-[state=active]:border-transparent hover:bg-muted transition-colors"
                            >
                                <span className="font-medium">
                                    <span className="md:hidden">T{q}</span>
                                    <span className="hidden md:inline">Trimestru {q}</span>
                                </span>
                            </TabsTrigger>
                        ))}
                    </TabsList>
                    {quarterOptionsLiterals.map(q => (
                        <TabsContent key={q} value={q.toString()} className="flex flex-col gap-4">
                            {isPending && isFetching && (
                                <div className="w-full flex flex-row justify-center items-center animate-spin">
                                    <Loader2/>
                                </div>
                            )}

                            {!isPending && data && data.length > 0 && (
                                data.map((task) => (
                                    <TaskCard key={task.id} task={task}/>
                                ))
                            )}

                            {!isPending && (!data || data.length === 0) && !isFetching && (
                                <div className="text-center text-muted-foreground py-8">
                                    Nu există activități pentru acest trimestru
                                </div>
                            )}

                        </TabsContent>
                    ))}
                </Tabs>
            </div>
        </>
    );
}