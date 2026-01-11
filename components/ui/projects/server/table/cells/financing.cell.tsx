import {ProjectPublic} from "@/lib/types/project";

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ro-RO', {
        style: 'currency',
        currency: 'RON',
        maximumFractionDigits: 2,
    }).format(amount);
};

export default function FinancingCell({project}: {
    project: ProjectPublic
}) {
    return (
        <div className="flex flex-col min-w-[120px]">
            <p>
                {formatCurrency(project.non_refundable_financing_aid_amount)}
            </p>
            <p className="text-xs text-muted-foreground">
                din {formatCurrency(project.total_eligible_financing_amount)}
            </p>
        </div>
    )
}