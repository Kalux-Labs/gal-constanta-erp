"use client";

import {Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Collapsible, CollapsibleContent, CollapsibleTrigger} from "@/components/ui/collapsible";
import React from "react";
import {Button} from "@/components/ui/button";
import {ChevronDownIcon, ChevronUpIcon} from "lucide-react";


export default function Section({
                                    key, title = "", description = "", expandable = false, children
                                }: {
    key?: string;
    title?: string;
    description?: string;
    expandable?: boolean;
    children?: React.ReactNode;
}) {
    const [open, setOpen] = React.useState(!expandable);

    const handleOnOpenChange = (open: boolean) => {
        if (expandable) {
            setOpen(open);
        }
    }

    return <Collapsible key={key} open={open} onOpenChange={handleOnOpenChange}>
        <Card className="shadow-none bg-sidebar">
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
                {expandable && <CollapsibleTrigger asChild>
                    <CardAction>
                        <Button variant="ghost" size="icon" className="size-8">
                            {open ? <ChevronUpIcon/> : <ChevronDownIcon/>}
                        </Button>
                    </CardAction>
                </CollapsibleTrigger>}
            </CardHeader>
            <CollapsibleContent>
                <CardContent>
                    {children}
                </CardContent>
                <CardFooter>

                </CardFooter>
            </CollapsibleContent>
        </Card>
    </Collapsible>
}