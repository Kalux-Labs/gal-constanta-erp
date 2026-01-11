import {createClient} from "@/lib/supabase/server";
import {fetchStatisticsByCities} from "@/lib/supabase/utils/statistics/statistics.common";
import ProjectsSummaryQueryOptions from "@/lib/types/projects-summary/projects-summary-query-options";
import {allowedIds} from "@/lib/supabase/utils/cities/cities.common";

export async function getProjectsSummaryByCities(options: ProjectsSummaryQueryOptions = {
    cityIds: allowedIds
}) {
    const supabase = await createClient();
    return fetchStatisticsByCities(supabase, options);
}