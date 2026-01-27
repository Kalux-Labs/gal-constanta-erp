"use client"

import {ColumnDef} from "@tanstack/react-table";
import ActionCell from "@/components/ui/projects/client/table/cells/action.cell";
import {ProjectPrivate} from "@/lib/types/project";
import FinancialRecordsProgressCell from "@/components/ui/projects/client/table/cells/financial-records-progress.cell";
import FinancedAtCell from "@/components/ui/projects/common/table/cells/financed_at.cell";
import CreateFinancialRecordCell from "@/components/ui/projects/client/table/cells/create-financial-record.cell";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";
import {InfoIcon} from "lucide-react";

export const columns: ColumnDef<ProjectPrivate>[] = [
    {
        id: "create_financial_records",
        header: () => <Tooltip>
            <TooltipTrigger asChild>
                <div className="flex flex-row items-center gap-2">
                    <InfoIcon size={16} className="text-muted-foreground"/>
                    D.E.P.
                </div>
            </TooltipTrigger>
            <TooltipContent>
                <p>Declarația de eșalonare a depunerii dosarelor cererilor deplată</p>
            </TooltipContent>
        </Tooltip>,
        cell: ({row}) => <CreateFinancialRecordCell key={row.original.id} project={row.original}/>,
    },
    {
        accessorKey: 'name',
        header: 'Nume proiect',
    },
    {
        accessorFn: (row) => row.beneficiary?.name,
        id: 'beneficiary_name',
        header: "Nume beneficiar"
    },
    {
        accessorFn: (row) => row.beneficiary?.cui,
        id: 'cui',
        header: 'CUI',
    },
    {
        accessorKey: 'financial_records_progress',
        header: 'Progres',
        cell: ({row}) => <FinancialRecordsProgressCell progress={row.original.financial_records_progress}/>,
    },
    {
        accessorKey: 'financed_at',
        header: 'Finanțat la',
        cell: ({row}) => <FinancedAtCell date={row.original.financed_at}/>,
    },
    {
        accessorFn: (row) => row.implementation_county?.name,
        id: 'implementation_county',
        header: 'Județ',
    },
    {
        accessorFn: (row) => row.implementation_city?.name,
        id: 'implementation_city',
        header: 'Localitate',
    },
    {
        id: 'actions',
        header: "",
        cell: ({row}) => <ActionCell key={row.original.id} project={row.original}/>
    }
]