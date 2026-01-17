import {
    Dialog, DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle, DialogTrigger
} from "@/components/ui/dialog";
import {FormProvider, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import React, {useEffect, useState} from "react";
import {Button} from "@/components/ui/button";
import {TrashIcon} from "lucide-react";
import {FormCombobox} from "@/components/forms/form-combobox";
import {DownloadTaskFormData, downloadTaskSchema} from "@/lib/validation/schemas/download-task-schema";
import {FormMultiSelect} from "@/components/forms/form-multi-select";
import {getCurrentYear} from "@/lib/utils";
import {useDeleteTasks} from "@/lib/hooks/tasks/use-delete-tasks";
import {useConfirmDialog} from "@/lib/hooks/use-confirm-dialog";
import ConfirmDialog from "@/components/dialogs/confirm-dialog";

export default function DeleteTasksDialog({children}: {
    children: React.ReactNode;
}) {

    const [open, setOpen] = useState(false);
    const {mutate, isPending} = useDeleteTasks();
    const {open: confirmDialogOpen, config, isLoading, handleConfirm, handleCancel, confirm} = useConfirmDialog();

    const getDefaultValues = () => ({
        export_year: getCurrentYear(),
        quarters: undefined,
    })

    const form = useForm<DownloadTaskFormData>({
        resolver: zodResolver(downloadTaskSchema),
        defaultValues: getDefaultValues()
    })

    const onSubmit = async (data: DownloadTaskFormData) => {
        confirm(
            "Șterge activitățile",
            async () => {
                mutate(data, {
                    onSuccess: () => {
                        setOpen(false);
                    }
                });
            },
            'Ești sigur că vrei să ștergi activitățile? Această acțiune nu poate fi anulată.',
            {
                actionLabel: "Șterge",
                cancelLabel: "Anulează",
                variant: "destructive"
            }
        );
    }

    const handleSubmitClick = async () => {
        const isValid = await form.trigger();
        if (isValid) {
            await form.handleSubmit(onSubmit)();
        }
    }

    useEffect(() => {
        if (open) {
            form.reset(getDefaultValues())
        }
    }, [open, form]);

    return <Dialog modal open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
            {children}
        </DialogTrigger>
        <DialogContent
            onInteractOutside={(e) => e.preventDefault()}
            onEscapeKeyDown={(e) => e.preventDefault()}
            className="p-4"
        >
            <DialogHeader>
                <DialogTitle>Ștergere avansată a activităților</DialogTitle>
                <DialogDescription>Seletează filtrele și șterge activitățile</DialogDescription>
            </DialogHeader>
            <FormProvider {...form}>
                <form>
                    <div className="grid grid-cols-2 gap-4">
                        <FormCombobox
                            name="export_year"
                            label="An"
                            placeholder="Selectează anul"
                            options={[2024, 2025, 2026, 2027]}
                            getId={(item) => item}
                            getLabel={(item) => String(item)}
                            searchPlaceholder="Caută anul..."
                            required
                            disabled={isPending}
                        />

                        <FormMultiSelect
                            name="quarters"
                            label="Trimestru"
                            placeholder="Selectează trimestrul"
                            options={[1, 2, 3, 4]}
                            getId={(item) => item}
                            getLabel={(item) => String(item)}
                            searchPlaceholder="Caută trimestrul..."
                            required
                            disabled={isPending}
                        />
                    </div>
                </form>
            </FormProvider>
            <DialogFooter>
                <DialogClose asChild>
                    <Button variant="outline">Închide</Button>
                </DialogClose>
                <Button onClick={handleSubmitClick} disabled={isPending} loading={isPending} variant="destructive">
                    <TrashIcon/>
                    Șterge
                </Button>
            </DialogFooter>
        </DialogContent>
        <ConfirmDialog
            open={confirmDialogOpen}
            onOpenChange={handleCancel}
            title={config.title}
            description={config.description}
            actionLabel={config.actionLabel}
            cancelLabel={config.cancelLabel}
            isLoading={isLoading}
            onConfirm={handleConfirm}
            variant={config.variant}
        />
    </Dialog>
}