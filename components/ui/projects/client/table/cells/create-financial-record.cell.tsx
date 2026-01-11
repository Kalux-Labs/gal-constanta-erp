"use client"

import {ProjectPrivate} from "@/lib/types/project";
import {useState} from "react";
import {Button} from "@/components/ui/button";
import CreateFinancialRecordSheet from "@/components/ui/projects/client/create-financial-records-sheet";

interface CreateFinancialRecordCellProps {
    project: ProjectPrivate;
}

export default function CreateFinancialRecordCell({project}: CreateFinancialRecordCellProps) {
    const [financialRecordSheetOpen, setFinancialRecordSheetOpen] = useState(false);

    const displayText = project.financial_records.length == 0 ? "Încarcă" : "Rectifică";

    return <div>
        <Button onClick={() => setFinancialRecordSheetOpen(true)} className="w-full">
            {displayText}
        </Button>

        <CreateFinancialRecordSheet
            project={project}
            open={financialRecordSheetOpen}
            onOpenChange={setFinancialRecordSheetOpen}/>
    </div>
}