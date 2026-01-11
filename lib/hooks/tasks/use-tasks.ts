import TasksQueryOptions from "@/lib/types/tasks/tasks-query-options";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {Task} from "@/lib/types/task";

export function useTasks(options: TasksQueryOptions) {
    return useQuery({
        queryKey: ["tasks", options],
        queryFn: async () => {
            const params = new URLSearchParams();

            params.append("year", String(options.year));
            params.append("quarter", String(options.quarter));
            params.append("done", String(options.done));

            if (options.search) params.append("search", options.search);

            const response = await axios.get(`/api/tasks?${params.toString()}`);
            return response.data as Task[] || [];
        },
        staleTime: 1000 * 60, // 1 minute
        retry: 2,
    });
}
