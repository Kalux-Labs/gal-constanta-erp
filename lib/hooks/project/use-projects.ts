import {useQuery, UseQueryResult} from "@tanstack/react-query";
import {QueryOptions, QueryResult} from "@/lib/types/query-option";
import {getProjects} from "@/lib/supabase/utils/projects/projects.client";
import {ProjectPrivate} from "@/lib/types/project";

export function useProjects(options: QueryOptions): UseQueryResult<QueryResult<ProjectPrivate>> {
    return useQuery<QueryResult<ProjectPrivate>>({
        queryKey: ["projects", options],
        queryFn: async () => await getProjects(options),
        retry: false,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
    });
}