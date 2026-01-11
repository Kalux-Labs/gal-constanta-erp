import {SupabaseClient} from "@supabase/supabase-js";
import TasksQueryOptions from "@/lib/types/tasks/tasks-query-options";
import {SupabaseTask} from "@/lib/types/task";

export async function fetchTasks(
    supabase: SupabaseClient,
    options: TasksQueryOptions
): Promise<SupabaseTask[]> {
    const {data} = await supabase.rpc('get_filtered_tasks', {
        q_year: options.year,
        q_quarter: options.quarter,
        q_search: options.search,
        q_done: options.done
    }).throwOnError();

    return data as SupabaseTask[] || [];
}