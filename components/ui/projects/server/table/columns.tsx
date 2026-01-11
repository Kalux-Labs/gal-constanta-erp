"use client"

import {ColumnDef} from "@tanstack/react-table";
import {ProjectPublic} from "@/lib/types/project";
import LocationCell from "@/components/ui/projects/server/table/cells/location.cell";
import FinancingCell from "@/components/ui/projects/server/table/cells/financing.cell";
import ProgressBarCell from "@/components/ui/projects/server/table/cells/progress-bar.cell";
import ProjectNameCell from "@/components/ui/projects/server/table/cells/project-name.cell";
import BeneficiaryCell from "@/components/ui/projects/server/table/cells/beneficiary.cell";
import FinancedAtCell from "@/components/ui/projects/common/table/cells/financed_at.cell";

export const columns: ColumnDef<ProjectPublic>[] = [
    {
        accessorKey: 'name',
        header: 'Proiect',
        cell: ({row}) => <ProjectNameCell name={row.original.name} description={row.original.description}/>
    },
    {
        id: 'beneficiary_name',
        header: "Beneficiar",
        cell: ({row}) => <BeneficiaryCell beneficiary={row.original.beneficiary}/>
    },
    {
        id: 'location',
        header: "Locație",
        cell: ({row}) => <LocationCell county={row.original.implementation_county}
                                       city={row.original.implementation_city}/>
    },
    {
        id: 'financing',
        header: 'Finanțare',
        cell: ({row}) => <FinancingCell project={row.original}/>
    },
    {
        id: 'progress',
        header: 'Progres',
        cell: ({row}) => <ProgressBarCell project={row.original}/>
    },
    {
        id: 'financed_at',
        header: 'Finanțat la',
        cell: ({row}) => <FinancedAtCell date={row.original.financed_at}/>
    }
]