"use client"

import {ColumnDef} from "@tanstack/react-table";
import ActionCell from "@/components/ui/beneficiaries/table/action-cell";
import {BeneficiaryPrivate} from "@/lib/types/beneficiary";

export const columns: ColumnDef<BeneficiaryPrivate>[] = [
    {
        accessorKey: 'name',
        header: 'Nume beneficiar',
    },
    {
        accessorKey: 'cui',
        header: 'CUI',
    },
    {
        accessorFn: (row) => row.county?.name,
        id: 'county',
        header: 'Județ',
    },
    {
        accessorFn: (row) => row.city?.name,
        id: 'city',
        header: 'Oraș',
    },
    {
        accessorKey: 'legal_representative',
        header: 'Reprezentant legal',
    },
    {
        id: 'actions',
        header: "",
        cell: ({row}) => <ActionCell key={row.original.id} beneficiary={row.original}/>
    }
]