"use client"

import React, {useState, useEffect, useRef, useCallback} from "react";
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
import {beneficiarySchema, BeneficiaryFormData} from "@/lib/validation/schemas/beneficiary-schema";
import FormField from "@/components/forms/form-field";
import {FormCombobox} from "@/components/forms/form-combobox";
import {useCreateBeneficiary} from "@/lib/hooks/beneficiary/use-create-beneficiary";
import {useUpdateBeneficiary} from "@/lib/hooks/beneficiary/use-update-beneficiary";
import {useCities} from "@/lib/hooks/cities/use-cities";
import {BeneficiaryPrivate} from "@/lib/types/beneficiary";
import County from "@/lib/types/county";
import City from "@/lib/types/city";
import {useCounties} from "@/lib/hooks/counties/use-counties";

interface NewBeneficiarySheetProps {
    beneficiary?: BeneficiaryPrivate;
    trigger?: React.ReactNode;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    counties?: County[];
}

export default function NewBeneficiarySheet({
                                                beneficiary,
                                                trigger,
                                                open: externalOpen,
                                                onOpenChange: externalOnOpenChange,
                                                counties: initialCounties
                                            }: NewBeneficiarySheetProps) {

    const [internalOpen, setInternalOpen] = useState(false);
    const formRef = useRef<HTMLFormElement>(null);


    const open = externalOpen || internalOpen;
    const setOpen = externalOnOpenChange || setInternalOpen;

    const isEditing = !!beneficiary;

    const createMutation = useCreateBeneficiary();
    const updateMutation = useUpdateBeneficiary(beneficiary?.id || 0);
    const isPending = createMutation.isPending || updateMutation.isPending;

    const title = isEditing ? "Editează beneficiar" : "Adaugă un nou beneficiar";
    const description = isEditing
        ? `Actualizează informațiile pentru ${beneficiary?.name}`
        : "Completează informațiile de bază ale beneficiarului.";
    const submitText = isEditing ? "Salvează modificările" : "Creează beneficiarul";

    const getDefaultValues = useCallback(() => ({
        name: beneficiary?.name ?? "",
        cui: beneficiary?.cui?.toString() ?? "",
        county: beneficiary?.county ?? null,
        city: beneficiary?.city ?? null,
        street: beneficiary?.street ?? "",
        zipcode: beneficiary?.zipcode?.toString() ?? "",
        email: beneficiary?.email ?? "",
        phone: beneficiary?.phone ?? "",
        bank_account: beneficiary?.bank_account ?? "",
        legal_representative: beneficiary?.legal_representative ?? "",
    }), [beneficiary]);

    const form = useForm<BeneficiaryFormData>({
        resolver: zodResolver(beneficiarySchema),
        defaultValues: getDefaultValues(),
    });

    const {data: fetchedCounties, isLoading: countiesLoading} = useCounties({
        onlyAllowed: false
    })

    const counties = initialCounties ?? fetchedCounties ?? [];

    const watchedCounty = form.watch("county");

    const {data: cities = [], isLoading: citiesLoading} = useCities({
        countyId: watchedCounty?.id,
        onlyAllowed: false
    });

    useEffect(() => {
        if (open && beneficiary) {
            form.reset(getDefaultValues())
        }
    }, [beneficiary, form, getDefaultValues, open]);

    useEffect(() => {
        if (beneficiary?.county?.id !== watchedCounty?.id) {
            form.setValue("city", null);
        }
    }, [isEditing, beneficiary?.county?.id, form, watchedCounty]);

    const onSubmit = async (data: BeneficiaryFormData) => {
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
                <SheetTrigger asChild>
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
                    <form ref={formRef} className="grid flex-1 auto-rows-min gap-4 px-4">
                        <p className="text-muted-foreground text-xs">Câmpuri obligatorii</p>
                        <FormField<BeneficiaryFormData>
                            name="name"
                            label="Nume"
                            placeholder="Introduceți numele"
                            required
                            disabled={isPending}
                        />

                        <FormField<BeneficiaryFormData>
                            name="cui"
                            label="CUI"
                            placeholder="Introduceți CUI-ul"
                            required
                            disabled={isPending}
                        />

                        <FormCombobox<BeneficiaryFormData, County>
                            name="county"
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

                        <FormCombobox<BeneficiaryFormData, City>
                            name="city"
                            label="Oraș"
                            placeholder={!watchedCounty ? "Selectați mai întâi județul" : "Selectați orașul"}
                            searchPlaceholder="Căutați orașul..."
                            options={cities}
                            disabled={!watchedCounty || citiesLoading || isPending}
                            required
                            showError
                            getId={(c) => c.id}
                            getLabel={(c) => c.name}
                        />

                        <FormField<BeneficiaryFormData>
                            name="street"
                            label="Strada"
                            placeholder="Introduceți adresa străzii"
                            required
                            disabled={isPending}
                        />

                        <FormField<BeneficiaryFormData>
                            name="zipcode"
                            label="Cod Poștal"
                            placeholder="Introduceți codul poștal (6 cifre)"
                            required
                            disabled={isPending}
                        />

                        <FormField<BeneficiaryFormData>
                            name="phone"
                            label="Telefon"
                            placeholder="Introduceți numărul de telefon"
                            required
                            disabled={isPending}
                        />

                        <FormField<BeneficiaryFormData>
                            name="bank_account"
                            label="Cont Bancar"
                            placeholder="Introduceți IBAN-ul"
                            required
                            disabled={isPending}
                        />

                        <FormField<BeneficiaryFormData>
                            name="legal_representative"
                            label="Reprezentant Legal"
                            placeholder="Introduceți numele reprezentantului legal"
                            required
                            disabled={isPending}
                        />

                        <p className="text-muted-foreground text-xs">Câmpuri opționale</p>

                        <FormField<BeneficiaryFormData>
                            name="email"
                            label="Email"
                            placeholder="Introduceți adresa de email"
                            type="email"
                            disabled={isPending}
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