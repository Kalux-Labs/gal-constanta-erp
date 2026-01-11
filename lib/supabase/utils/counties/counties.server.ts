import {createClient} from "@/lib/supabase/server";
import {fetchCounties, fetchCounty} from "@/lib/supabase/utils/counties/counties.common";
import {QueryOptions} from "@/lib/types/query-option";

export async function getCounties(options: QueryOptions) {
    const supabase = await createClient();
    return fetchCounties(supabase, options);
}

export async function getCounty(options: QueryOptions) {
    const supabase = await createClient();
    return fetchCounty(supabase, options);
}