
import {useMutation} from "@tanstack/react-query";
import axios, {AxiosError} from "axios";
import {toast} from "sonner";
import {ApiErrorResponse} from "@/lib/utils/api";
import {BeneficiaryPrivate} from "@/lib/types/beneficiary";

export function useCreateEmail() {
    return useMutation({
        mutationFn: async (data: BeneficiaryPrivate) => {
            const response = await axios.post("/api/send", data);
            return response.data;
        },
        onSuccess: async () => {
            toast.success("E-mail-ul a fost trimis cu succes!");
        },
        onError: (error: AxiosError<ApiErrorResponse>) => {
            toast.error(error.response?.data.error);
        }
    });
}