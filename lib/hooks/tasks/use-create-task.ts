import {useMutation, useQueryClient} from "@tanstack/react-query";
import axios, {AxiosError} from "axios";
import {TaskFormData} from "@/lib/validation/schemas/task-schema";
import {toast} from "sonner";
import {ApiErrorResponse} from "@/lib/utils/api";

export function useCreateTask() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: TaskFormData) => {
            const response = await axios.post("/api/tasks", data);
            return response.data;
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: ["tasks"]});
            toast.success("Activitatea a fost creeată cu succes!");
        },
        onError: (error: AxiosError<ApiErrorResponse>) => {
            toast.error(error.response?.data.error);
        }
    });
}