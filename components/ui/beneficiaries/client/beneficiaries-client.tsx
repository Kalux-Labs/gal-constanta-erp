"use client"

import {Button} from "@/components/ui/button";
import NewBeneficiarySheet from "@/components/ui/beneficiaries/client/new-beneficiary-sheet";
import {useEffect, useState} from "react";
import {useBeneficiaries} from "@/lib/hooks/beneficiary/use-beneficiaries";
import ClientPaginatedDataTable from "@/components/ui/client-paginated-data-table";
import {columns} from "@/components/ui/beneficiaries/table/columns";
import County from "@/lib/types/county";
import {useRouter, useSearchParams} from "next/navigation";
import City from "@/lib/types/city";
import TableFilters from "@/components/ui/table-filters";
import {useCities} from "@/lib/hooks/cities/use-cities";

export default function BeneficiariesClient({counties}: {
    counties: County[];
}) {
    const [page, setPage] = useState(1);
    const [perPage] = useState(10);
    const [search, setSearch] = useState("");
    const [county, setCounty] = useState<County | null>(null);
    const [city, setCity] = useState<City | null>(null);

    const {data: cities = []} = useCities({
        countyId: county?.id,
        onlyAllowed: false
    });

    const searchParams = useSearchParams();
    const router = useRouter();

    const shouldOpen = searchParams.get("new") === "1";

    const [open, setOpen] = useState<boolean>(false);

    const {data, isLoading, refetch} = useBeneficiaries({
        page, perPage, search, countyId: county?.id, cityId: city?.id
    });

    const onPageChangeAction = (page: number) => {
        setPage(page);
    }

    useEffect(() => {
        if (shouldOpen) {
            setOpen(true);
            router.replace("/my-account/beneficiaries")
        }
    }, [shouldOpen, router]);

    useEffect(() => {
        refetch();
    }, [page, perPage, search, county, city, refetch])

    return (
        <>
            <div className="flex justify-end w-full">
                <NewBeneficiarySheet
                    open={open}
                    onOpenChange={setOpen}
                    trigger={<Button>Adaugă un nou beneficiar</Button>}
                    counties={counties}
                />
            </div>

            <TableFilters
                counties={counties}
                cities={cities}
                onSearchChange={(value) => {
                    setPage(1);
                    if (value.length >= 3 || value.length === 0) {
                        setSearch(value);
                    }
                }}
                onCountyChange={(value) => {
                    setPage(1);
                    setCounty(value);
                }}
                onCityChange={(value) => {
                    setPage(1);
                    setCity(value);
                }}
                disabled={open}
            />

            <ClientPaginatedDataTable page={page} perPage={perPage} columns={columns} data={data?.data ?? []}
                                      total={data?.count ?? 0} isLoading={isLoading}
                                      onPageChangeAction={onPageChangeAction}/>

        </>
    );
}
