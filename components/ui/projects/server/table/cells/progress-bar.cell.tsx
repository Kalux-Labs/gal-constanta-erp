import {ProjectPublic} from "@/lib/types/project";

const getProgressColor = (progress: number) => {
    if (progress >= 98) return 'bg-green-600';
    if (progress >= 70) return 'bg-blue-400';
    if (progress >= 40) return 'bg-yellow-600';
    if (progress >= 20) return 'bg-orange-600'
    return 'bg-red-600';
};

const getFinancialProgressNormalized = (progress: number) => {
    if(progress >= 98) return 100;
    return progress;
};

export default function ProgressBarCell({project}: {
    project: ProjectPublic
}) {

    const financialProgressNormalized = getFinancialProgressNormalized(project.financial_records_progress);

    return (
        <div className="flex flex-row gap-2 items-center">
            <div className="w-full bg-muted rounded-full h-2 min-w-[80px]">
                <div
                    className={`h-2 rounded-full transition-all ${getProgressColor(project.financial_records_progress)}`}
                    style={{width: `${financialProgressNormalized}%`}}
                />
            </div>
            <p>{financialProgressNormalized} %</p>
        </div>
    )
}