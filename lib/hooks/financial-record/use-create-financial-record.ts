import {useMutation, useQueryClient} from "@tanstack/react-query";
import axios, {AxiosError} from "axios";
import {FinancialRecordFormData} from "@/lib/validation/schemas/financial-record-schemas";
import {toast} from "sonner";
import {ApiErrorResponse} from "@/lib/utils/api";

export default function useCreateFinancialRecord() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: FinancialRecordFormData) => {
            const response = await axios.post("/api/financial-records", data);
            return response.data;
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: ["projects"]})
            toast.success("Declarația a fost încărcată cu succes!");
        },
        onError: (error: AxiosError<ApiErrorResponse>) => {
            toast.error(error.response?.data.error)
        }
    })
}