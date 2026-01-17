"use client";

import {useMemo, useState} from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {Area, AreaChart, CartesianGrid, XAxis} from "recharts";
import {format, startOfDay, subDays, subMonths, subYears} from "date-fns";
import {ro} from "date-fns/locale";
import {TrendingUp, Calendar} from "lucide-react";
import {useStatistics} from "@/lib/hooks/statistics/use-statistics";
import ChartSkeleton from "@/components/ui/chart-skeleton";

const TIME_RANGES = ["7d", "30d", "90d", "1y"] as const;
type TimeRange = typeof TIME_RANGES[number];

export default function StatisticsChart({
                                            date
                                        }: {
    date: Date;
}) {
    const [timeRange, setTimeRange] = useState<TimeRange>("90d");

    const chartConfig = {
        started: {
            label: "În desfășurare: ",
            color: "var(--chart-1)",
        },
        advanced: {
            label: "Stadiu avansat: ",
            color: "var(--chart-2)",
        },
        finished: {
            label: "Stadiu finalizat: ",
            color: "var(--chart-3)",
        },
    };

    function getDateRange(range: TimeRange) {
        const endDate = date;

        switch (range) {
            case "7d":
                return {
                    startDate: startOfDay(subDays(endDate, 7)),
                    endDate,
                };
            case "30d":
                return {
                    startDate: startOfDay(subDays(endDate, 30)),
                    endDate,
                };
            case "90d":
                return {
                    startDate: startOfDay(subMonths(endDate, 3)),
                    endDate,
                };
            case "1y":
                return {
                    startDate: startOfDay(subYears(endDate, 1)),
                    endDate,
                };
        }
    }

    const {startDate, endDate} = getDateRange(timeRange);

    const {data: items = [], isLoading} = useStatistics({
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        type: timeRange === "1y" ? "monthly" : "daily",
    });

    const chartData = items.map((item) => ({
        date: item.period_start,
        "started": item.started_count,
        "advanced": item.advanced_count,
        "finished": item.finished_count,
    }));

    // Calculate totals for the period
    const totals = useMemo(() => {
        return items.reduce(
            (acc, item) => ({
                finished: acc.finished + item.finished_count,
            }),
            {finished: 0}
        );
    }, [items]);

    const handleTimeRangeChange = (value: string) => {
        if (TIME_RANGES.includes(value as TimeRange)) {
            setTimeRange(value as TimeRange);
        }
    };

    if (isLoading) {
        return <ChartSkeleton/>
    }

    return (
        <Card className="shadow-none py-4">
            <CardHeader className="flex flex-col px-4">
                <div className="flex flex-col md:flex-row items-start justify-between w-full gap-2">
                    <div className="flex flex-col gap-2">
                        <CardTitle className="text-xl flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-primary"/>
                            Evoluția proiectelor
                        </CardTitle>
                        <CardDescription className="flex items-center gap-1.5 text-base">
                            <Calendar className="w-4 h-4"/>
                            {format(startDate, "d MMMM yyyy", {locale: ro})} –{" "}
                            {format(endDate, "d MMMM yyyy", {locale: ro})}
                        </CardDescription>
                    </div>
                    <Select value={timeRange} onValueChange={handleTimeRangeChange}>
                        <SelectTrigger
                            aria-label="Selectează perioada"
                        >
                            <SelectValue/>
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                            <SelectItem value="7d" className="rounded-lg">
                                Ultimele 7 zile
                            </SelectItem>
                            <SelectItem value="30d" className="rounded-lg">
                                Ultimele 30 de zile
                            </SelectItem>
                            <SelectItem value="90d" className="rounded-lg">
                                Ultimele 3 luni
                            </SelectItem>
                            <SelectItem value="1y" className="rounded-lg">
                                Ultimul an
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-4 gap-4 pt-2">
                    <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Proiecte finalizate</p>
                        <p className="text-2xl font-bold text-foreground tracking-light">{totals.finished}</p>
                    </div>
                    {/*<div className="flex flex-row gap-1 items-center">*/}
                    {/*    <CircleSmall className="text-chart-1"/>*/}
                    {/*    <p className="text-sm text-muted-foreground">În desfășurare</p>*/}
                    {/*</div>*/}
                    {/*<div className="flex flex-row gap-1 items-center">*/}
                    {/*    <CircleSmall className="text-chart-2"/>*/}
                    {/*    <p className="text-sm text-muted-foreground">Stadiu avansat</p>*/}
                    {/*</div>*/}
                    {/*<div className="flex flex-row gap-1 items-center">*/}
                    {/*    <CircleSmall className="text-chart-3"/>*/}
                    {/*    <p className="text-sm text-muted-foreground">Stadiu finalizat</p>*/}
                    {/*</div>*/}
                </div>
            </CardHeader>

            <CardContent className="px-2">
                <ChartContainer
                    config={chartConfig}
                    className="h-[350px] w-full"
                >
                    <AreaChart
                        data={chartData}
                        margin={{
                            top: 10,
                            right: 10,
                            left: 10,
                            bottom: 10,
                        }}
                    >
                        <defs>
                            <linearGradient id="fillStarted" x1="0" y1="0" x2="0" y2="1">
                                <stop
                                    offset="5%"
                                    stopColor="var(--chart-1)"
                                    stopOpacity={0.8}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="var(--chart-1)"
                                    stopOpacity={0.1}
                                />
                            </linearGradient>
                            <linearGradient id="fillAdvanced" x1="0" y1="0" x2="0" y2="1">
                                <stop
                                    offset="5%"
                                    stopColor="var(--chart-2)"
                                    stopOpacity={0.8}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="var(--chart-2)"
                                    stopOpacity={0.1}
                                />
                            </linearGradient>
                            <linearGradient id="fillFinished" x1="0" y1="0" x2="0" y2="1">
                                <stop
                                    offset="5%"
                                    stopColor="var(--chart-3)"
                                    stopOpacity={0.8}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="var(--chart-3)"
                                    stopOpacity={0.1}
                                />
                            </linearGradient>
                        </defs>

                        <CartesianGrid
                            strokeDasharray="3 3"
                            vertical={false}
                            horizontal={true}
                            stroke="var(--primary)"
                            opacity={0.1}
                        />

                        <XAxis
                            dataKey="date"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={12}
                            minTickGap={32}
                            tick={{fill: "hsl(var(--muted-foreground))", fontSize: 12}}
                            tickFormatter={(value) => {
                                const date = new Date(value);
                                return timeRange === "1y"
                                    ? format(date, "MMM yyyy", {locale: ro})
                                    : format(date, "d MMM", {locale: ro});
                            }}
                        />

                        <ChartTooltip
                            content={
                                <ChartTooltipContent
                                    labelFormatter={(value) =>
                                        timeRange === "1y"
                                            ? format(new Date(value), "MMMM yyyy", {locale: ro})
                                            : format(new Date(value), "d MMMM yyyy", {locale: ro})
                                    }
                                    indicator="dot"
                                    className="rounded-lg border bg-background p-3 shadow-lg"
                                />
                            }
                        />

                        <Area
                            dataKey="started"
                            type="monotone"
                            fill="url(#fillStarted)"
                            stroke="var(--chart-1)"
                            strokeWidth={2}
                            stackId="a"
                            dot={false}
                        />
                        <Area
                            dataKey="advanced"
                            type="monotone"
                            fill="url(#fillAdvanced)"
                            stroke="var(--chart-2)"
                            strokeWidth={2}
                            stackId="a"
                            dot={false}
                        />
                        <Area
                            dataKey="finished"
                            type="monotone"
                            fill="url(#fillFinished)"
                            stroke="var(--chart-3)"
                            strokeWidth={2}
                            stackId="a"
                            dot={false}
                        />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}