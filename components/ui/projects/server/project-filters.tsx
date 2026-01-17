"use client"

import {Card, CardContent} from "@/components/ui/card";
import {
    citySchemaExtended,
    countySchemaExtended
} from "@/lib/validation/schemas/common-schemas";
import {FormProvider, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useRouter} from "next/navigation";
import FormField from "@/components/forms/form-field";
import {FormCombobox} from "@/components/forms/form-combobox";
import County from "@/lib/types/county";
import City from "@/lib/types/city";
import {Button} from "@/components/ui/button";
import {z} from "zod";
import {X} from "lucide-react";

export default function ProjectFilters({
                                           county,
                                           city,
                                           search,
                                           counties,
                                           cities
                                       }: {
    county?: County;
    city?: City;
    counties: County[];
    cities: City[];
    search?: string;
}) {

    const router = useRouter();

    const formSchema = z.object({
        county: countySchemaExtended,
        city: citySchemaExtended.nullable(),
        search: z.string().optional(),
    }).refine((data) => data.county !== null, {
        message: "Județul este obligatoriu",
        path: ["county"]
    });

    type FormData = z.infer<typeof formSchema>;

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            county: county || counties.at(0),
            city: city,
            search: search
        }
    })

    const onSubmit = async (data: FormData) => {

        const {county, city, search} = data;

        let path = "";

        if (county) {
            path += `/${county.slug}`
        }

        if (city) {
            path += `/${city.slug}`
        }

        if (search) {
            path += `?search=${search}`
        }
        router.push(path);
    }

    const watchedCounty = form.watch("county");

    return <Card className="shadow-none py-0">
        <CardContent className="px-4 py-4">
            <FormProvider {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}
                      className="grid grid-cols-1 gap-4 md:grid-cols-3 items-end">
                    <FormField<FormData>
                        name={"search"}
                        label="Căutare după nume"
                        placeholder="Începe a tasta"
                        maxLength={50}
                    />
                    <FormCombobox<FormData, County>
                        name={"county"}
                        label="Județ"
                        options={counties}
                        getId={(c) => c.id}
                        getLabel={(c) => c.name}
                    />
                    <FormCombobox<FormData, City>
                        name={"city"}
                        label="Oraș"
                        options={cities}
                        getId={(c) => c.id}
                        getLabel={(c) => c.name}
                        disabled={!watchedCounty}
                    />
                    <Button type="submit">
                        Caută
                    </Button>
                    {
                        form.formState.isDirty && (
                            <Button
                                variant="outline"
                                type="button"
                                onClick={() => {
                                    form.reset();
                                }}>
                                <X/> Resetează filtrele
                            </Button>
                        )
                    }
                </form>
            </FormProvider>
        </CardContent>
    </Card>
}