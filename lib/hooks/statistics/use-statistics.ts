import {useQuery} from "@tanstack/react-query";
import {getStatistics} from "@/lib/supabase/utils/statistics/statistics.client";
import {FinancialRecordsQueryOptions} from "@/lib/types/financial-progress/financial-records-query-options";

export function useStatistics(options: FinancialRecordsQueryOptions) {
    return useQuery({
        queryKey: ["statistics", options],
        queryFn: async () => await getStatistics({
            startedThreshold: 40,
            advancedThreshold: 98,
            finishedThreshold: 98,
            type: "monthly",
            ...options
        }),
        placeholderData: (prev) => prev
    });
}