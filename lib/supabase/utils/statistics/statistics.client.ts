import {FinancialRecordsQueryOptions} from "@/lib/types/financial-progress/financial-records-query-options";
import {createClient} from "@/lib/supabase/client";
import {fetchStatistics} from "@/lib/supabase/utils/statistics/statistics.common";

export async function getStatistics(options: FinancialRecordsQueryOptions) {
    const supabase = createClient();
    return fetchStatistics(supabase, options);
}