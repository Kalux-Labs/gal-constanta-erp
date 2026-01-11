import {useMutation, useQueryClient} from "@tanstack/react-query";
import {TaskFormData} from "@/lib/validation/schemas/task-schema";
import axios, {AxiosError} from "axios";
import {toast} from "sonner";
import {ApiErrorResponse} from "@/lib/utils/api";

export function useUpdateTask(id: number) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: TaskFormData) => {
            const response = await axios.put(`/api/tasks/${id}`, data);
            return response.data;
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: ["tasks"]});
            toast.success("Activitatea a fost actualizată cu succes!");
        },
        onError: (error: AxiosError<ApiErrorResponse>) => {
            toast.error(error.response?.data.error);
        }
    })
}