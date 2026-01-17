import {FinancialRecordsQueryOptions} from "@/lib/types/financial-progress/financial-records-query-options";
import {SupabaseClient} from "@supabase/supabase-js";
import FinancialProgressChartItem from "@/lib/types/financial-progress/financial-progress-chart-item";
import ProjectsSummaryQueryOptions from "@/lib/types/projects-summary/projects-summary-query-options";
import ProjectsSummaryChartItem from "@/lib/types/projects-summary/projects-summary-chart-item";

export async function fetchStatistics(
    supabase: SupabaseClient,
    options: FinancialRecordsQueryOptions,
): Promise<FinancialProgressChartItem[]> {
    const {data, error} = await supabase.rpc('financial_progress_by_range_v2',
        {
            p_start: options.startDate,
            p_end: options.endDate,
            p_type: options.type,
            p_threshold_started: options.startedThreshold,
            p_threshold_advanced: options.advancedThreshold,
            p_threshold_finished: options.finishedThreshold,
        });

    if (error) {
        return [];
    }

    return data as FinancialProgressChartItem[] || [];
}

export async function fetchStatisticsByCities(
    supabase: SupabaseClient,
    options: ProjectsSummaryQueryOptions
): Promise<ProjectsSummaryChartItem[]> {
    const {data, error} = await supabase.rpc('get_projects_summary_by_cities', {
        city_ids: options.cityIds
    });

    if (error) {
        return [];
    }

    return data as ProjectsSummaryChartItem[] || [];
}