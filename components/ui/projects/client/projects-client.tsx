"use client"

import County from "@/lib/types/county";
import {useEffect, useState} from "react";
import City from "@/lib/types/city";
import {useRouter, useSearchParams} from "next/navigation";
import ClientPaginatedDataTable from "@/components/ui/client-paginated-data-table";
import {columns} from "@/components/ui/projects/client/table/columns";
import NewProjectSheet from "@/components/ui/projects/client/new-project-sheet";
import {Button} from "@/components/ui/button";
import TableFilters from "@/components/ui/table-filters";
import {useProjects} from "@/lib/hooks/project/use-projects";

export default function ProjectsClient({counties, cities}: {
    counties: County[];
    cities: City[];
}) {
    const [page, setPage] = useState(1);
    const [perPage] = useState(10);
    const [search, setSearch] = useState("");
    const [county, setCounty] = useState<County | null>(null);
    const [city, setCity] = useState<City | null>(null);

    const searchParams = useSearchParams();
    const router = useRouter();

    const shouldOpen = searchParams.get("new") === "1";

    const [open, setOpen] = useState<boolean>(false);

    const {data, isLoading, refetch} = useProjects({
        page, perPage, search, countyId: county?.id, cityId: city?.id
    });

    const onPageChangeAction = (page: number) => {
        setPage(page);
    }

    useEffect(() => {
        if (shouldOpen) {
            setOpen(true);
            router.replace("/my-account/projects")
        }
    }, [shouldOpen, router]);

    useEffect(() => {
        refetch()
    }, [page, perPage, search, county, city, refetch])

    return (
        <>
            <div className="flex justify-end w-full">
                <NewProjectSheet
                    open={open}
                    onOpenChange={setOpen}
                    trigger={<Button>Adaugă un nou proiect</Button>}
                    counties={counties}
                    cities={cities}
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
    )
}