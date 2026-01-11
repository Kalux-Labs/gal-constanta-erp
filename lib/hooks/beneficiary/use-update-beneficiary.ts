import {useMutation, useQueryClient} from "@tanstack/react-query";
import {BeneficiaryFormData} from "@/lib/validation/schemas/beneficiary-schema";
import axios, {AxiosError} from "axios";
import {toast} from "sonner";
import {ApiErrorResponse} from "@/lib/utils/api";

export function useUpdateBeneficiary(id: number) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: BeneficiaryFormData) => {
            const response = await axios.put(`/api/beneficiaries/${id}`, data);
            return response.data;
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: ["beneficiaries"]});
            toast.success("Beneficiarul a fost actualizat cu succes!");
        },
        onError: (error: AxiosError<ApiErrorResponse>) => {
            toast.error(error.response?.data.error);
        }
    });
}