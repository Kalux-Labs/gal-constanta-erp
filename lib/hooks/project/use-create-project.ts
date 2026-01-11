import {useMutation, useQueryClient} from "@tanstack/react-query";
import {ProjectFormData} from "@/lib/validation/schemas/project-schema";
import axios, {AxiosError} from "axios";
import {toast} from "sonner";
import {ApiErrorResponse} from "@/lib/utils/api";

export default function useCreateProject() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: ProjectFormData) => {
            const response = await axios.post("/api/projects", data);
            return response.data;
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: ["projects"]});
            toast.success("Proiectul a fost creat cu succes!");
        },
        onError: (error: AxiosError<ApiErrorResponse>) => {
            toast.error(error.response?.data.error);
        }
    });
}