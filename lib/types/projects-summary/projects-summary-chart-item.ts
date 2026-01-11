import City from "@/lib/types/city";

export default interface ProjectsSummaryChartItem {
    city: City;
    total_count: number;
    finished_count: number;
}