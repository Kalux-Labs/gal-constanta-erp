"use client"

import React, {useCallback, useEffect} from "react";
import {FormProvider, useForm} from "react-hook-form";
import {TaskFormData, taskSchema} from "@/lib/validation/schemas/task-schema";
import {zodResolver} from "@hookform/resolvers/zod";
import {getCurrentQuarter, getCurrentYear} from "@/lib/utils";
import {RecurrencyOption, recurrencyOptions} from "@/lib/types/recurrency";
import {
    Sheet, SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import FormField from "@/components/forms/form-field";
import {FormCombobox} from "@/components/forms/form-combobox";
import {FormCheckbox} from "@/components/forms/form-checkbox";
import FormDateTimePicker from "@/components/forms/form-date-time-picker";
import {FormMotionCheckbox} from "@/components/forms/form-motion-checkbox";
import {Button} from "@/components/ui/button";
import {useUpdateTask} from "@/lib/hooks/tasks/use-update-task";
import {useCreateTask} from "@/lib/hooks/tasks/use-create-task";
import {useTaskSheet} from "@/lib/hooks/tasks/use-task-sheet";

export default function NewTaskSheet() {
    const {task, options, closeTaskSheet, open} = useTaskSheet();

    const isEditing = !!task;

    const createMutation = useCreateTask();
    const updateMutation = useUpdateTask(task?.id || 0);
    const isPending = createMutation.isPending || updateMutation.isPending;

    const isSubtask = task?.parent_id || options.parentId;
    const taskType = isSubtask ? "activității secundare" : "activității";
    const taskTypeCapitalized = isSubtask ? "activitate secundară" : "activitate";

    const title = isEditing
        ? `Editează ${taskTypeCapitalized}`
        : `Adaugă ${taskTypeCapitalized}`;

    const description = isEditing
        ? `Actualizează informațiile ${taskType}`
        : `Completează informațiile de bază ale ${taskType}`;

    const submitText = isEditing
        ? `Salvează modificările ${taskType}`
        : `Creează ${taskTypeCapitalized}`;

    const getEmptyValues = useCallback(() => ({
        name: "",
        description: "",
        parent_id: options.parentId ?? null,
        recurrency: recurrencyOptions[0],
        done: false,
        year: options.year ?? getCurrentYear(),
        quarter: options.quarter ?? getCurrentQuarter(),
        notify: false,
        start_date: null,
        end_date: null,
        children: []
    }), [options]);

    const getDefaultValues = useCallback(() => ({
        name: task?.name ?? getEmptyValues().name,
        description: task?.description ?? getEmptyValues().description,
        parent_id: task?.parent_id ?? getEmptyValues().parent_id,
        recurrency: task?.recurrency ?? getEmptyValues().recurrency,
        done: task?.done ?? getEmptyValues().done,
        year: task?.year ?? getEmptyValues().year,
        quarter: task?.quarter ?? getEmptyValues().quarter,
        notify: task?.notify ?? getEmptyValues().notify,
        start_date: task?.start_date ?? getEmptyValues().start_date,
        end_date: task?.end_date ?? getEmptyValues().end_date,
        children: task?.children ?? getEmptyValues().children
    }), [task, getEmptyValues]);

    const form = useForm<TaskFormData>({
        resolver: zodResolver(taskSchema),
        defaultValues: getDefaultValues()
    });

    const {notify, done} = form.watch();

    useEffect(() => {
        if (open) {
            form.reset(getDefaultValues())
        }
        if(!open) {
            form.reset(getEmptyValues())
        }
    }, [task, open, form, getDefaultValues, getEmptyValues]);

    const onSubmit = async (data: TaskFormData) => {
        const mutation = isEditing ? updateMutation : createMutation;

        mutation.mutate(data, {
            onSuccess: () => {
                closeTaskSheet();
                form.reset(getEmptyValues());
            },
        });
    }

    const handleSubmitClick = async () => {
        const isValid = await form.trigger();
        if (isValid) {
            await form.handleSubmit(onSubmit)();
        }
    }

    const handleOpenChange = (newOpen: boolean) => {
        if (!newOpen) {
            closeTaskSheet();
        }
    }

    return (
        <Sheet open={open} onOpenChange={handleOpenChange}>
            <SheetContent
                onInteractOutside={(e) => e.preventDefault()}
                onEscapeKeyDown={(e) => e.preventDefault()}
                className="w-full sm:max-w-lg max-h-full overflow-y-auto"
            >
                <SheetHeader>
                    <SheetTitle>{title}</SheetTitle>
                    <SheetDescription>{description}</SheetDescription>
                </SheetHeader>

                <FormProvider {...form}>
                    <form className="grid flex-1 auto-rows-min gap-4 px-4">
                        {task && (<div className="mb-2">
                                <FormMotionCheckbox
                                    name="done"
                                    inline
                                    label={done ? "Activitate finalizată" : "Activitate în desfășurare"}
                                />
                            </div>
                        )
                        }
                        <FormField<TaskFormData>
                            name="name"
                            label="Nume activitate"
                            placeholder="Introduceți numele activității"
                            required
                            maxLength={255}
                            disabled={isPending}
                        />
                        <FormField<TaskFormData>
                            name="description"
                            label="Descriere"
                            placeholder="Introduceți descrierea activității"
                            textarea
                            maxLength={500}
                            disabled={isPending}
                        />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FormCombobox<TaskFormData, number>
                                name="year"
                                label="An"
                                required
                                options={[2024, 2025, 2026, 2027]}
                                getId={(c) => c}
                                getLabel={(c) => String(c)}
                                showError
                                disabled={isPending}
                            />
                            <FormCombobox<TaskFormData, 1 | 2 | 3 | 4>
                                name="quarter"
                                label="Trimestru"
                                required
                                options={[1, 2, 3, 4]}
                                getId={(c) => c}
                                getLabel={(c) => String(c)}
                                showError
                                disabled={isPending}
                            />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FormDateTimePicker name="start_date" label="Început activitate" disabled={isPending}/>
                            <FormDateTimePicker name="end_date" label="Sfârșit activitate" disabled={isPending}/>
                        </div>
                        <FormCheckbox name="notify" card label="Activează notificari"
                                      description="Poți activa/dezactiva notificările oricând" disabled={isPending}/>

                        <FormCombobox<TaskFormData, RecurrencyOption>
                            name="recurrency"
                            label="Recureță notificări"
                            options={recurrencyOptions}
                            getId={(c) => c.value}
                            getLabel={(c) => c.label}
                            tooltip="Un email va fi trimis cu o zi înainte de termenul recurenței."
                            disabled={!notify || isPending}
                            showError
                        />

                    </form>
                </FormProvider>

                <SheetFooter className="mt-6">
                    <Button
                        onClick={handleSubmitClick}
                        disabled={isPending}
                        loading={isPending}
                    >
                        {submitText}
                    </Button>
                    <SheetClose asChild>
                        <Button variant="outline" disabled={isPending}>
                            Închide
                        </Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}