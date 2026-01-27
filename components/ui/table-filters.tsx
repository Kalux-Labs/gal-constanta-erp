"use client";

import County from "@/lib/types/county";
import {z} from "zod";
import {FormProvider, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import FormField from "@/components/forms/form-field";
import {FormCombobox} from "@/components/forms/form-combobox";
import {useEffect} from "react";
import {Button} from "@/components/ui/button";
import {X} from "lucide-react";
import City from "@/lib/types/city";
import {cn} from "@/lib/utils";

const formSchema = z.object({
    search: z.string(),
    county: z
        .object({
            id: z.number(),
            name: z.string(),
            slug: z.string(),
        })
        .nullable(),
    city: z.object({
        id: z.number(),
        name: z.string(),
        slug: z.string(),
        county_id: z.number()
    }).nullable()
});

type FormData = z.infer<typeof formSchema>;

interface TableFiltersProps {
    counties: County[];
    cities: City[];
    onSearchChange: (value: string) => void;
    onCountyChange: (county: County | null) => void;
    onCityChange: (city: City | null) => void;
    disabled?: boolean;
}

export default function TableFilters({
                                         counties,
                                         cities,
                                         onSearchChange,
                                         onCountyChange,
                                         onCityChange,
                                         disabled = false,
                                     }: TableFiltersProps) {
    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            search: "",
            county: null,
            city: null,
        },
    });

    const watchedCounty = form.watch("county");
    const watchedCity = form.watch("city");

    useEffect(() => {
        if (watchedCounty?.id !== watchedCity?.county_id) {
            form.setValue("city", null);
            onCityChange(null);
        }
    }, [watchedCounty, watchedCity, form, onCityChange]);

    return (
        <FormProvider {...form}>
            <form className={cn("grid grid-cols-1 sm:grid-cols-3 gap-4 items-end")}>
                <FormField<FormData>
                    name="search"
                    label="Caută"
                    placeholder="Începe a tasta..."
                    onValueChange={onSearchChange}
                    disabled={disabled}
                />
                <FormCombobox<FormData, County>
                    name="county"
                    label="Județ"
                    placeholder="Selectați județul"
                    searchPlaceholder="Căutați județul"
                    options={counties}
                    getId={(c) => c.id}
                    getLabel={(c) => c.name}
                    onSelect={onCountyChange}
                    disabled={disabled}
                />
                <FormCombobox<FormData, City>
                    name="city"
                    label="Localitate"
                    placeholder={!watchedCounty ? "Selectați întâi județul" : "Selectați localitatea"}
                    searchPlaceholder="Căutați localitatea..."
                    options={cities}
                    getId={(c) => c.id}
                    getLabel={(c) => c.name}
                    onSelect={onCityChange}
                    disabled={!watchedCounty || disabled}
                />
                {
                    form.formState.isDirty && (
                        <Button
                            variant="outline"
                            type="button"
                            onClick={() => {
                                form.reset();
                                onSearchChange("");
                                onCountyChange(null);
                                onCityChange(null);
                            }}
                            disabled={disabled}
                        >
                            <X/> Resetează filtrele
                        </Button>
                    )
                }
            </form>
        </FormProvider>
    );
}
