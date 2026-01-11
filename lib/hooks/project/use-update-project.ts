import {useMutation, useQueryClient} from "@tanstack/react-query";
import axios, {AxiosError} from "axios";
import {ProjectFormData} from "@/lib/validation/schemas/project-schema";
import {toast} from "sonner";
import {ApiErrorResponse} from "@/lib/utils/api";

export function useUpdateProject(projectId: number) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: ProjectFormData) => {
            const response = await axios.put(`/api/projects/${projectId}`, data);
            return response.data;
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: ["projects"]});
            toast.success("Proiectul a fost actualizat cu succes!");
        },
        onError: (error: AxiosError<ApiErrorResponse>) => {
            toast.error(error.response?.data.error);
        }
    });
}