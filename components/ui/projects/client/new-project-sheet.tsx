"use client"

import React, {useState, useEffect, useCallback} from "react";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger
} from "@/components/ui/sheet";
import {Button} from "@/components/ui/button";
import {FormProvider, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import FormField from "@/components/forms/form-field";
import {FormCombobox} from "@/components/forms/form-combobox";
import County from "@/lib/types/county";
import City from "@/lib/types/city";
import {ProjectPrivate} from "@/lib/types/project";
import {ProjectFormData, projectSchema} from "@/lib/validation/schemas/project-schema";
import FormDateTimePicker from "@/components/forms/form-date-time-picker";
import {BeneficiaryPrivate} from "@/lib/types/beneficiary";
import {useBeneficiaries} from "@/lib/hooks/beneficiary/use-beneficiaries";
import useCreateProject from "@/lib/hooks/project/use-create-project";
import {useUpdateProject} from "@/lib/hooks/project/use-update-project";
import {Plus} from "lucide-react";
import Link from "next/link";
import {useCounties} from "@/lib/hooks/counties/use-counties";
import {useCities} from "@/lib/hooks/cities/use-cities";

interface NewProjectSheetProps {
    project?: ProjectPrivate;
    trigger?: React.ReactNode;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    counties?: County[];
    cities?: City[];
}

export default function NewProjectSheet({
                                            project,
                                            trigger,
                                            open: externalOpen,
                                            onOpenChange: externalOnOpenChange,
                                            counties: initialCounties,
                                            cities: initialCities
                                        }: NewProjectSheetProps) {
    const [internalOpen, setInternalOpen] = useState(false);

    const open = externalOpen !== undefined ? externalOpen : internalOpen;
    const setOpen = externalOnOpenChange || setInternalOpen;

    const isEditing = !!project;

    const createMutation = useCreateProject();
    const updateMutation = useUpdateProject(project?.id || 0);
    const isPending = createMutation.isPending || updateMutation.isPending;

    const title = isEditing ? "Editează proiectul" : "Adaugă un nou proiect";
    const description = isEditing
        ? `Actualizează informațiile pentru ${project?.name}`
        : "Completează informațiile de bază ale proiectului.";
    const submitText = isEditing ? "Salvează modificările" : "Creează proiectul";

    const {data: beneficiaries, isLoading: beneficiariesLoading} = useBeneficiaries({page: 1, perPage: 100})

    const {data: fetchedCounties, isLoading: countiesLoading} = useCounties({
        onlyAllowed: true
    });
    const {data: fetchedCities, isLoading: citiesLoading} = useCities({
        onlyAllowed: true,
        countyId: 15
    });

    const counties = initialCounties ?? fetchedCounties ?? [];
    const cities = initialCities ?? fetchedCities ?? [];

    const getDefaultValues = useCallback(() => ({
        name: project?.name ?? "",
        description: project?.description ?? null,
        financed_at: project?.financed_at ?? new Date().toISOString(),
        implementation_street: project?.implementation_street ?? "",
        implementation_zipcode: project?.implementation_zipcode ?? null,
        implementation_details: project?.implementation_details ?? null,
        implementation_period: project?.implementation_period ?? 0,
        implementation_county: project?.implementation_county ?? null,
        implementation_city: project?.implementation_city ?? null,
        code: project?.code ?? "",
        submeasure: project?.submeasure ?? "",
        total_eligible_financing_amount: project?.total_eligible_financing_amount ?? 0,
        non_refundable_financing_aid_rate: project?.non_refundable_financing_aid_rate ?? 0,
        non_refundable_financing_aid_amount: project?.non_refundable_financing_aid_amount ?? 0,
        beneficiary: project?.beneficiary ?? null,
        objectives: project?.objectives ?? null,
        results: project?.results ?? null,
    }), [project]);

    const form = useForm<ProjectFormData>({
        resolver: zodResolver(projectSchema),
        defaultValues: getDefaultValues(),
    });

    const watchedCounty = form.watch("implementation_county");

    useEffect(() => {
        if (open && project) {
            form.reset(getDefaultValues())
        }
    }, [project, open, form, getDefaultValues]);

    useEffect(() => {
        if (project?.implementation_county?.id !== watchedCounty?.id) {
            form.setValue("implementation_city", null);
        }
    }, [isEditing, project?.implementation_county?.id, form, watchedCounty]);

    const onSubmit = async (data: ProjectFormData) => {
        const mutation = isEditing ? updateMutation : createMutation;

        mutation.mutate(data, {
            onSuccess: () => {
                form.reset();
                setOpen(false);
            },
        });
    };


    const handleSubmitClick = async () => {
        const isValid = await form.trigger();
        if (isValid) {
            await form.handleSubmit(onSubmit)();
        }
    };

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            {trigger && (
                <SheetTrigger asChild disabled={beneficiariesLoading}>
                    {trigger}
                </SheetTrigger>
            )}
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
                        <p className="text-xs font-semibold">Câmpuri obligatorii</p>
                        <FormField<ProjectFormData>
                            name="name"
                            label="Nume proiect"
                            placeholder="Introduceți numele proiectului"
                            required
                            disabled={isPending}
                        />


                        <FormCombobox<ProjectFormData, BeneficiaryPrivate>
                            name="beneficiary"
                            label="Beneficiar"
                            placeholder="Selectați beneficiarul"
                            searchPlaceholder="Căutați beneficiarul..."
                            options={beneficiaries?.data ?? []}
                            disabled={isPending || beneficiariesLoading || isEditing}
                            showError
                            getId={(b) => b.id}
                            getLabel={(b) => b.name}
                            required
                        />

                        <Button variant="dashed" asChild>
                            <Link href="/my-account/beneficiaries?new=1">
                                <Plus/>
                                Creează un nou beneficiar
                            </Link>
                        </Button>

                        <FormField<ProjectFormData>
                            name="code"
                            label="Cod"
                            placeholder="Introduceți codul"
                            required
                            disabled={isPending || isEditing}
                            maxLength={21}
                        />

                        <FormDateTimePicker<ProjectFormData>
                            name="financed_at"
                            label="Finanțat la data"
                            required
                            disabled={isPending || isEditing}
                        />

                        <FormField<ProjectFormData>
                            name="submeasure"
                            label="Submăsură"
                            placeholder="Introduceți submăsura"
                            required
                            disabled={isPending || isEditing}
                            maxLength={10}
                        />

                        <p className="text-xs text-muted-foreground">Locație implementare</p>
                        <FormCombobox<ProjectFormData, County>
                            name="implementation_county"
                            label="Județ"
                            placeholder="Selectați județul"
                            searchPlaceholder="Căutați județ..."
                            options={counties}
                            disabled={isPending || countiesLoading}
                            required
                            showError
                            getId={(c) => c.id}
                            getLabel={(c) => c.name}
                        />

                        <FormCombobox<ProjectFormData, City>
                            name="implementation_city"
                            label="Oraș"
                            placeholder={!watchedCounty ? "Selectați mai întâi județul" : "Selectați orașul"}
                            searchPlaceholder="Căutați orașul..."
                            options={cities}
                            disabled={!watchedCounty || isPending || citiesLoading}
                            required
                            showError
                            getId={(c) => c.id}
                            getLabel={(c) => c.name}
                        />

                        <FormField<ProjectFormData>
                            name="implementation_street"
                            label="Stradă"
                            placeholder="Introduceți strada"
                            required
                            disabled={isPending}
                            maxLength={255}
                        />

                        <p className="text-xs text-muted-foreground">Detalii finanțare</p>

                        <FormField<ProjectFormData>
                            name="total_eligible_financing_amount"
                            label="Valoarea totală eligibilă"
                            placeholder="Introduceți valoarea"
                            required
                            disabled={isPending}
                            type="number"
                            min={0}
                            max={1000000000}
                        />

                        <FormField<ProjectFormData>
                            name="non_refundable_financing_aid_rate"
                            label="Rata ajutorului financiar nerambursabil (%)"
                            placeholder="Introduceți valoarea"
                            required
                            disabled={isPending}
                            type="number"
                            min={0}
                            max={100}
                        />

                        <FormField<ProjectFormData>
                            name="non_refundable_financing_aid_amount"
                            label="Valoarea ajutorului financiar nerambursabil"
                            placeholder="Introduceți valoarea"
                            required
                            disabled={isPending}
                            type="number"
                            min={0}
                            max={1000000000}
                        />

                        <FormField<ProjectFormData>
                            name="implementation_period"
                            label="Perioada de implementare (luni)"
                            placeholder="Introduceți valoarea"
                            required
                            disabled={isPending}
                            type="number"
                            min={0}
                            max={100}
                        />

                        <p className="text-xs font-semibold">Câmpuri opționale</p>

                        <FormField<ProjectFormData>
                            name="implementation_zipcode"
                            label="Cod poștal implementare"
                            placeholder="Introduceți codul poștal"
                            disabled={isPending}
                            maxLength={6}
                        />

                        <FormField<ProjectFormData>
                            name="description"
                            label="Descriere"
                            placeholder="Introduceți descrierea proiectului"
                            textarea
                            maxLength={255}
                            disabled={isPending}
                        />

                        <FormField<ProjectFormData>
                            name="objectives"
                            label="Obiective"
                            placeholder="Introduceți obiectivele separate de virgula"
                            disabled={isPending}
                            textarea
                            maxLength={255}
                        />

                        <FormField<ProjectFormData>
                            name="results"
                            label="Rezultate"
                            placeholder="Introduceți rezultatele separate de virgula"
                            disabled={isPending}
                            textarea
                            maxLength={255}
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
    );
}