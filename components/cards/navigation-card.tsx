import {LucideIcon} from "lucide-react";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import Link from "next/link";

interface NavigationCardProps {
    title: string
    description: string
    body: string
    href: string
    actionLabel: string
    icon: LucideIcon
}

export default function NavigationCard({
                            title,
                            description,
                            body,
                            href,
                            actionLabel,
                            icon: Icon,
                        }: NavigationCardProps) {
    return (
        <Card
            className="flex flex-col transition-shadow duration-200 shadow-xs shadow-border/70 hover:shadow-lg hover:shadow-border/80">
            <CardHeader className="pb-3">
                <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 rounded-lg bg-primary/10 p-2">
                        <Icon className="h-6 w-6 text-primary"/>
                    </div>

                    <div className="flex-1">
                        <CardTitle className="text-xl font-bold tracking-tight">
                            {title}
                        </CardTitle>
                        <CardDescription>
                            {description}
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="flex-1 pb-4">
                <p className="text-sm text-muted-foreground">{body}</p>
            </CardContent>

            <CardFooter className="pt-0">
                <Button size="lg" className="w-full" asChild>
                    <Link href={href}>{actionLabel}</Link>
                </Button>
            </CardFooter>
        </Card>
    )
}