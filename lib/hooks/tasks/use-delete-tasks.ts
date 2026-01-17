import {useMutation, useQueryClient} from "@tanstack/react-query";
import {DownloadTaskFormData} from "@/lib/validation/schemas/download-task-schema";
import axios, {AxiosError} from "axios";
import {toast} from "sonner";
import {ApiErrorResponse} from "@/lib/utils/api";

export function useDeleteTasks() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: DownloadTaskFormData) => {
            const response = await axios.delete(`/api/tasks`, {data});
            return response.data;
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: ["tasks"]});
            toast.success("Activitățile au fost șterse cu succes!");
        },
        onError: (error: AxiosError<ApiErrorResponse>) => {
            toast.error(error.response?.data.error);
        }
    })
}