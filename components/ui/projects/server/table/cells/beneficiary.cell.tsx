import {BeneficiaryPublic} from "@/lib/types/beneficiary";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";

export default function BeneficiaryCell({
                                            beneficiary
                                        }: {
    beneficiary: BeneficiaryPublic
}) {

    const {name, cui} = beneficiary;

    return (
        <div className="flex flex-col items-start">
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild className="w-[130px]">
                        <p className="truncate max-w-[130px]">
                            {name.length > 50 ? `${name.slice(0, 50)}…` : name}
                        </p>
                    </TooltipTrigger>
                    <TooltipContent>{name}</TooltipContent>
                </Tooltip>

                <Tooltip>
                    <TooltipTrigger asChild>
                        <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                            {cui}
                        </p>
                    </TooltipTrigger>
                    <TooltipContent>{cui}</TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
    )
}