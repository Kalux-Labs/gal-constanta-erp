import {createClient} from "@/lib/supabase/server";
import {fetchCities, fetchCity} from "@/lib/supabase/utils/cities/cities.common";
import {QueryOptions} from "@/lib/types/query-option";

export async function getCities(options: QueryOptions) {
    const supabase = await createClient();
    return fetchCities(supabase, options);
}

export async function getCity(options: QueryOptions) {
    const supabase = await createClient();
    return fetchCity(supabase, options);
}