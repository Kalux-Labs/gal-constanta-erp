import {QueryOptions} from "@/lib/types/query-option";
import {createClient} from "@/lib/supabase/static";
import {fetchCities} from "@/lib/supabase/utils/cities/cities.common";

export async function getCitiesStatic(options: QueryOptions) {
    const supabase = createClient();
    return fetchCities(supabase, options);
}