import {createClient} from "@/lib/supabase/server";
import {ProjectPublic} from "@/lib/types/project";
import fetchProjects from "@/lib/supabase/utils/projects/projects.common";
import {QueryOptions, QueryResult} from "@/lib/types/query-option";

export async function getProjects(options: QueryOptions): Promise<QueryResult<ProjectPublic>> {
    const supabase = await createClient();
    return fetchProjects<ProjectPublic>(supabase, 'projects_public_view', options);
}

interface ProjectsStatistics {
    allFinishedProjectsCount: number;
    allProjectsCount: number;
    totalFinancedAmount: number;
}

export async function getProjectsStatistics(): Promise<ProjectsStatistics> {
    const supabase = await createClient();

    const [{count: allProjectsCount}, {count: allFinishedProjectsCount}, totalFinancedAidAmount] =
        await Promise.all([
            supabase.from("projects_public_view").select("id", {count: "exact", head: true}),
            supabase.from("projects_public_view").select("id", {count: "exact", head: true}).gte("financial_records_progress", 98),
            supabase
                .from("projects_public_view")
                .select("non_refundable_financing_aid_amount.sum()")
                .gte("financial_records_progress", 98)
        ]);

    return {
        allFinishedProjectsCount: allFinishedProjectsCount ?? 0,
        allProjectsCount: allProjectsCount ?? 0,
        totalFinancedAmount: Number(totalFinancedAidAmount?.data?.[0].sum ?? 0),
    };
}