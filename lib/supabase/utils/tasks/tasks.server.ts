import TasksQueryOptions from "@/lib/types/tasks/tasks-query-options";
import {createClient} from "@/lib/supabase/server";
import {fetchTasks} from "@/lib/supabase/utils/tasks/tasks.common";

export async function getTasks(options: TasksQueryOptions) {
    const supabase = await createClient();
    return fetchTasks(supabase, options);
}