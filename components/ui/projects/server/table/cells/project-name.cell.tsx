import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";


export default function ProjectNameCell({
                                            name, description
                                        }: {
    name: string
    description?: string | null
}) {
    return (
        <div className="flex flex-col items-start mr-4">
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <p className="truncate w-[200px] text-md font-semibold">
                            {name.length > 50 ? `${name.slice(0, 50)}…` : name}
                        </p>
                    </TooltipTrigger>
                    <TooltipContent>{name}</TooltipContent>
                </Tooltip>

                {description && (
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                                {description.length > 50 ? `${description.slice(0, 50)}…` : description}
                            </p>
                        </TooltipTrigger>
                        <TooltipContent>{description}</TooltipContent>
                    </Tooltip>
                )}
            </TooltipProvider>
        </div>
    )
}