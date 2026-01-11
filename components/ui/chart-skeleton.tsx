import {Card, CardContent, CardHeader} from "@/components/ui/card";

export default function ChartSkeleton() {
    return (
        <Card className="shadow-none h-[556px]">
            <CardHeader>
                <div className="space-y-2">
                    <div className="h-6 w-48 animate-pulse rounded bg-muted"/>
                    <div className="h-4 w-64 animate-pulse rounded bg-muted"/>
                </div>
                <div className="grid grid-cols-3 gap-4 pt-4">
                    {Array.from({length: 1}).map((_, i) => (
                        <div key={i} className="space-y-2">
                            <div className="h-4 w-24 animate-pulse rounded bg-muted"/>
                            <div className="h-8 w-16 animate-pulse rounded bg-muted"/>
                        </div>
                    ))}
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex h-[350px] w-full items-end gap-2">
                    {Array.from({length: 12}).map((_, i) => (
                        <div
                            key={i}
                            className="w-full animate-pulse rounded-t-md bg-muted"
                            style={{height: `${30 + 0.9 * 60}%`}}
                        />
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}