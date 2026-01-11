import {createClient} from "@/lib/supabase/client";
import {ProjectPrivate} from "@/lib/types/project";
import fetchProjects from "@/lib/supabase/utils/projects/projects.common";
import {QueryOptions} from "@/lib/types/query-option";

export async function getProjects(options: QueryOptions) {
    const supabase = createClient();
    return fetchProjects<ProjectPrivate>(supabase, 'projects_private_view', options);
}