import {useMutation, useQueryClient} from "@tanstack/react-query";
import axios, {AxiosError} from "axios";
import {toast} from "sonner";
import {ApiErrorResponse} from "@/lib/utils/api";

export function useDeleteProject() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: number) => {
            const response = await axios.delete(`/api/projects/${id}`);
            return response.data;
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: ["projects"]});
            toast.success("Proiectul a fost șters cu succes!");
        },
        onError: (error: AxiosError<ApiErrorResponse>) => {
            toast.error(error.response?.data.error)
        }
    });
}