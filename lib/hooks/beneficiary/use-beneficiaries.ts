import {useQuery, UseQueryResult} from "@tanstack/react-query";
import {QueryOptions, QueryResult} from "@/lib/types/query-option";
import {getBeneficiaries} from "@/lib/supabase/utils/beneficiaries/beneficiaries.client";
import {BeneficiaryPrivate} from "@/lib/types/beneficiary";

export function useBeneficiaries(options: QueryOptions): UseQueryResult<QueryResult<BeneficiaryPrivate>> {
    return useQuery<QueryResult<BeneficiaryPrivate>>({
        queryKey: ["beneficiaries", options],
        queryFn: async () => await getBeneficiaries(options),
        retry: false,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
    });
}