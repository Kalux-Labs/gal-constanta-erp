import {useMutation} from "@tanstack/react-query";
import axios, {AxiosError} from "axios";
import {toast} from "sonner";
import {UpdateAccountFormData} from "@/lib/validation/schemas/update-account-schema";
import {ApiErrorResponse} from "@/lib/utils/api";

export function useUpdateUser() {
    return useMutation({
        mutationFn: async (data: UpdateAccountFormData) => {
            const response = await axios.patch(`/api/users`, data);
            return response.data;
        },
        onSuccess: () => {
            toast.success("Contul a fost actualizat cu succes.");
        },
        onError: (error: AxiosError<ApiErrorResponse>) => {
            toast.error(error.response?.data.error);
        }
    });
}