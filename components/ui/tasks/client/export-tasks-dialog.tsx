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
import {DownloadIcon} from "lucide-react";
import {FormCombobox} from "@/components/forms/form-combobox";
import {DownloadTaskFormData, downloadTaskSchema} from "@/lib/validation/schemas/download-task-schema";
import {FormMultiSelect} from "@/components/forms/form-multi-select";
import {getCurrentYear} from "@/lib/utils";
import {toast} from "sonner";
import {downloadTasksPdf} from "@/lib/utils/pdf-download";
import {format} from "date-fns";

export default function ExportTasksDialog({children}: {
    children: React.ReactNode;
}) {

    const [open, setOpen] = useState(false);

    const getDefaultValues = () => ({
        export_year: getCurrentYear(),
        quarters: undefined,
    })

    const form = useForm<DownloadTaskFormData>({
        resolver: zodResolver(downloadTaskSchema),
        defaultValues: getDefaultValues()
    })

    const onSubmit = async (data: DownloadTaskFormData) => {
        try {
            const formattedDate = format(Date.now(), "dd_MM_yyyy");
            const filename = `raport_de_activitate_${formattedDate}.pdf`

            await downloadTasksPdf(data, filename);
            toast.success("Raport descărcat cu succes!")
        } catch (error) {
            toast.error(error instanceof Error ? error.message: "Eroare în descărcarea raportului.")
        }
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
                <DialogTitle>Descarcă raport de activitate</DialogTitle>
                <DialogDescription>Seletează filtrele și descarcă raportul de activitate</DialogDescription>
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
                        />
                    </div>
                </form>
            </FormProvider>
            <DialogFooter>
                <DialogClose asChild>
                    <Button variant="outline">Închide</Button>
                </DialogClose>
                <Button onClick={handleSubmitClick}>
                    <DownloadIcon/>
                    Descarcă
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
}