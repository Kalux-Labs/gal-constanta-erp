"use client";

import ProjectsSummaryChartItem from "@/lib/types/projects-summary/projects-summary-chart-item";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {CircleSmall, TrendingUp} from "lucide-react";
import {ChartContainer, ChartTooltip, ChartTooltipContent} from "@/components/ui/chart";
import {Bar, BarChart, CartesianGrid, XAxis, YAxis} from "recharts";

export default function ProjectsSummaryChart({
                                                 data,
                                             }: {
    data: ProjectsSummaryChartItem[]
}) {
    const chartConfig = {
        total_count: {
            label: "Total proiecte: ",
            color: "var(--chart-1)",
        },
        finished_count: {
            label: "Proiecte finalizate: ",
            color: "var(--chart-2)",
        },
    };

    const chartData = data.map((item) => ({
        city: item.city.name,
        total_count: item.total_count,
        finished_count: item.finished_count,
    }));

    return (
        <Card className="shadow-none py-4">
            <CardHeader className="flex flex-col px-4">
                <div className="flex flex-col gap-2">
                    <CardTitle className="text-xl flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-primary" />
                        Rezumatul proiectelor pe localități
                    </CardTitle>
                    <CardDescription className="text-base">
                        Distribuția proiectelor ordonate după numărul total
                    </CardDescription>
                </div>
                <div className="grid grid-cols-3 gap-4 pt-2">
                    <div className="flex flex-row gap-1 items-center">
                        <CircleSmall className="text-chart-1"/>
                        <p className="text-sm text-muted-foreground">Total proiecte</p>
                    </div>
                    <div className="flex flex-row gap-1 items-center">
                        <CircleSmall className="text-chart-2"/>
                        <p className="text-sm text-muted-foreground">Proiecte finalizate</p>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="px-2">
                <ChartContainer config={chartConfig} className="h-[400px] w-full">
                    <BarChart
                        data={chartData}
                        layout={"vertical"}
                        margin={{
                            top: 10,
                            right: 10,
                            left: 10,
                            bottom: 10,
                        }}
                    >
                        <CartesianGrid
                            strokeDasharray="3 3"
                            vertical={true}
                            horizontal={false}
                            stroke="var(--primary)"
                            opacity={0.1}
                        />

                        <XAxis
                            type="number"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}

                        />

                        <YAxis
                            dataKey="city"
                            type="category"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={10}
                            width={90}
                            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                        />

                        <ChartTooltip
                            content={<ChartTooltipContent indicator="dot" className="rounded-lg border bg-background p-3 shadow-lg"/>}
                        />

                        <Bar
                            dataKey="total_count"
                            fill="var(--chart-1)"
                            radius={[0, 4, 4, 0]}
                        />
                        <Bar
                            dataKey="finished_count"
                            fill="var(--chart-2)"
                            radius={[0, 4, 4, 0]}
                        />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
