"use client"

import {Button} from "@/components/ui/button";
import NewBeneficiarySheet from "@/components/ui/beneficiaries/client/new-beneficiary-sheet";
import {useEffect, useState} from "react";
import {useBeneficiaries} from "@/lib/hooks/beneficiary/use-beneficiaries";
import ClientPaginatedDataTable from "@/components/ui/client-paginated-data-table";
import {columns} from "@/components/ui/beneficiaries/table/columns";
import County from "@/lib/types/county";
import {useRouter, useSearchParams} from "next/navigation";
import {InfoIcon} from "lucide-react";

export default function BeneficiariesClient({counties, isAdmin}: {
    counties: County[];
    isAdmin: boolean;
}) {
    const [page, setPage] = useState(1);
    const [perPage] = useState(10);

    const searchParams = useSearchParams();
    const router = useRouter();

    const shouldOpen = searchParams.get("nou") === "1";

    const [open, setOpen] = useState<boolean>(false);

    const {data, isLoading} = useBeneficiaries({
        page, perPage
    });

    const canCreate = (data?.data?.length ?? 0) < 1 || isAdmin;

    const onPageChangeAction = (page: number) => {
        setPage(page);
    }

    useEffect(() => {
        if (shouldOpen && canCreate) {
            setOpen(true);
            router.replace("/contul-meu/beneficiari")
        }
    }, [shouldOpen, router, canCreate]);

    return (
        <>
            <div className="flex justify-end w-full">
                <NewBeneficiarySheet
                    open={open}
                    onOpenChange={setOpen}
                    trigger={
                        <Button disabled={!canCreate}>
                            Adaugă un nou beneficiar
                        </Button>
                    }
                    counties={counties}
                    canCreate={canCreate}
                />
            </div>
            <ClientPaginatedDataTable page={page} perPage={perPage} columns={columns} data={data?.data ?? []}
                                      total={data?.count ?? 0} isLoading={isLoading}
                                      onPageChangeAction={onPageChangeAction}/>
            <p className="text-xs text-muted-foreground font-regular flex flex-row gap-1 items-center">
                <InfoIcon className="h-3 w-3"/>
                Poți avea un singur beneficiar asociat.
            </p>
        </>
    );
}
