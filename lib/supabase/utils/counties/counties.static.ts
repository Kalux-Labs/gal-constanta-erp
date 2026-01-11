import {QueryOptions} from "@/lib/types/query-option";
import {createClient} from "@/lib/supabase/static";
import {fetchCounties} from "@/lib/supabase/utils/counties/counties.common";

export async function getCountiesStatic(options: QueryOptions) {
    const supabase = createClient();
    return fetchCounties(supabase, options);
}