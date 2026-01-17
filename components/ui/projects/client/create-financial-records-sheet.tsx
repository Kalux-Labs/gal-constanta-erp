"use client";

import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle
} from "@/components/ui/sheet";
import {ProjectPrivate} from "@/lib/types/project";
import {FormProvider, useFieldArray, useForm} from "react-hook-form";
import {FinancialRecordFormData, financialRecordSchema} from "@/lib/validation/schemas/financial-record-schemas";
import {zodResolver} from "@hookform/resolvers/zod";
import {Button} from "@/components/ui/button";
import FormDateTimePicker from "@/components/forms/form-date-time-picker";
import FormField from "@/components/forms/form-field";
import {useCallback, useEffect, useState} from "react";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import useCreateFinancialRecord from "@/lib/hooks/financial-record/use-create-financial-record";
import {toast} from "sonner";

interface CreateFinancialRecordSheetProps {
    project: ProjectPrivate;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}

export default function CreateFinancialRecordSheet({
                                                       project,
                                                       open: externalOpen,
                                                       onOpenChange: externalOnOpenChange
                                                   }: CreateFinancialRecordSheetProps) {
    const isInitialUpload = project.financial_records.length === 0;
    const financialRecordType = isInitialUpload ? "Inițială" : "Rectificată";

    const [internalOpen, setInternalOpen] = useState(false);

    const open = externalOpen !== undefined ? externalOpen : internalOpen;
    const setOpen = externalOnOpenChange || setInternalOpen;

    const {mutate, isPending} = useCreateFinancialRecord();

    const getDefaultValues = useCallback(() => ({
        project_id: project.id,
        installments: [
            {date: new Date().toISOString(), total_amount: 0, total_financial_help: 0}
        ]
    }), [project]);

    const form = useForm<FinancialRecordFormData>({
        resolver: zodResolver(financialRecordSchema),
        defaultValues: getDefaultValues()
    });

    const {control} = form;
    const {fields, append, remove} = useFieldArray({
        control,
        name: "installments"
    });

    const canAdd = fields.length < 10;
    const canRemove = (index: number) => fields.length > 1 && index !== 0;

    const onSubmit = (data: FinancialRecordFormData) => {
        const total_financial_records_amount = [...data.installments].reduce((acc, item) => acc + item.total_amount, 0);

        if (total_financial_records_amount > project.total_eligible_financing_amount) {
            toast.error("Suma tranșelor nu poate depăși valoarea totală eligibilă");
            return;
        }

        mutate(data, {
            onSuccess: () => {
                form.reset();
                setOpen(false);
            },
        })
    };

    const handleSubmitClick = async () => {
        const isValid = await form.trigger();
        console.log(form.formState.errors);
        if (isValid) {
            console.log(form.getValues());
            await form.handleSubmit(onSubmit)();
        }
    }

    useEffect(() => {
        if (open && project) {
            form.reset(getDefaultValues())
        }
    }, [project, open, form, getDefaultValues]);

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetContent
                onInteractOutside={(e) => e.preventDefault()}
                onEscapeKeyDown={(e) => e.preventDefault()}
                className="w-full sm:max-w-lg max-h-full overflow-y-auto"
            >
                <SheetHeader>
                    <SheetTitle>Încarcă declarația de eșalonare</SheetTitle>
                    <SheetDescription>
                        Completează declarația de eșalonare a depunerii dosarelor cererilor de plată.
                    </SheetDescription>
                </SheetHeader>


                <FormProvider {...form}>
                    <form
                        className="grid flex-1 auto-rows-min gap-4 px-4">
                        <p className="text-sm font-medium">Tip declarație: {financialRecordType}</p>
                        <p className="text-sm font-medium">Valoare totală
                            eligibilă: {project.total_eligible_financing_amount}</p>
                        {fields.map((field, index) => {
                                const cardTitle = index == 0 ? `Avans` : `Tranșa ${index}`;

                                return (<Card key={field.id} className="shadow-xs py-4 px-4">
                                        <CardHeader className="text-md font-medium px-0">
                                            <CardTitle>{cardTitle}</CardTitle>
                                            <CardDescription></CardDescription>
                                        </CardHeader>
                                        <CardContent className="px-0 grid flex-1 auto-rows-min gap-4">
                                            <FormDateTimePicker
                                                name={`installments.${index}.date`}
                                                label="Data"
                                                required
                                                disabled={isPending}
                                            />
                                            <FormField name={`installments.${index}.total_amount`}
                                                       label="Valoare totală"
                                                       placeholder="Introduceți valoarea"
                                                       required
                                                       type="number"
                                                       min={0}
                                                       max={1000000000}
                                                       disabled={isPending}
                                            />
                                            <FormField name={`installments.${index}.total_financial_help`}
                                                       label="Valoare ajutor financiar nerambursabil"
                                                       placeholder="Introduceți valoarea"
                                                       required
                                                       type="number"
                                                       min={0}
                                                       max={1000000000}
                                                       disabled={isPending}
                                            />

                                            {canRemove(index) && (
                                                <Button
                                                    variant="dashed"
                                                    className="text-red-500 border-red-300 hover:bg-red-50 hover:text-red-500"
                                                    onClick={() => remove(index)}
                                                    disabled={isPending}
                                                >
                                                    Șterge tranșa
                                                </Button>
                                            )}
                                        </CardContent>
                                    </Card>
                                );
                            }
                        )}

                        {canAdd && (
                            <Button
                                type="button"
                                variant="dashed"
                                className="w-full"
                                onClick={() =>
                                    append({
                                        date: new Date().toISOString(),
                                        total_amount: 0,
                                        total_financial_help: 0
                                    })
                                }
                                disabled={isPending}
                            >
                                Adaugă tranșă
                            </Button>
                        )}
                    </form>
                </FormProvider>
                <SheetFooter className="mt-6">
                    <Button onClick={handleSubmitClick} disabled={isPending} loading={isPending}>
                        Încarcă declarația
                    </Button>
                    <SheetClose asChild>
                        <Button variant="outline" disabled={isPending}>
                            Închide
                        </Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
