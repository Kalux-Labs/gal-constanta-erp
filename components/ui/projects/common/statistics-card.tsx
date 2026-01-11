import {Card, CardContent} from "@/components/ui/card";
import {formatCurrencyToRO} from "@/lib/utils";

interface StatisticCardsProps {
    cards: {
        title: string;
        subtitle: string;
        value: number
        type?: string | "currency";
    }[]
}

export default function StatisticCards({cards}: StatisticCardsProps) {
    return (
        <div className="flex items-center justify-center">
            <div className="@container grow w-full">
                <div
                    className="grid grid-cols-1 @3xl:grid-cols-3 bg-background overflow-hidden rounded-xl border border-border">
                    {cards.map((card, i) => (
                        <Card
                            key={i}
                            className="py-4 border-0 shadow-none rounded-none border-y @3xl:border-x @3xl:border-y-0 border-border last:border-0 first:border-0"
                        >
                            <CardContent className="flex flex-col h-full space-y-6 justify-between px-4">
                                <div className="space-y-0.25">
                                    <div className="text-lg font-semibold text-foreground">{card.title}</div>
                                    <div className="text-sm text-muted-foreground">{card.subtitle}</div>
                                </div>
                                <div className="flex-1 flex flex-col gap-1.5 justify-between grow">
                                    <div className="flex items-center gap-2">
                                        <span className="text-2xl font-bold tracking-tight">{card.type ? formatCurrencyToRO({value: card.value}) : card.value}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}