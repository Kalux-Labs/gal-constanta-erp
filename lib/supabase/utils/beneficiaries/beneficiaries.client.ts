import {QueryOptions} from "@/lib/types/query-option";
import {createClient} from "@/lib/supabase/client";
import fetchBeneficiaries from "@/lib/supabase/utils/beneficiaries/beneficiaries.common";
import {BeneficiaryPrivate} from "@/lib/types/beneficiary";

export async function getBeneficiaries(options: QueryOptions) {
    const supabase = createClient();
    return fetchBeneficiaries<BeneficiaryPrivate>(supabase, "beneficiaries_private_view", options);
}