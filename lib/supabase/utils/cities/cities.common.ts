import {SupabaseClient} from "@supabase/supabase-js";
import {QueryOptions} from "@/lib/types/query-option";
import City from "@/lib/types/city";

// 4686 = castelu
// 4679 = nicolae balcescu
// 4756 = silistea
// 4753 = pantelimon
// 4751 = vulturu
// 4676 = cogealac
// 4663 = mihail kogalniceanu
// 4660 = ovidiu
// 4685 = cuza voda
// 4669 = lumina
// 4741 = gradina
// 4707 = targusor

export const allowedIds = [4686, 4679, 4756, 4753, 4751, 4676, 4663, 4660, 4685, 4669, 4741, 4707]

export async function fetchCities(
    supabase: SupabaseClient,
    options: QueryOptions,
): Promise<City[]> {

    const {citySlug, countyId, cityId, onlyAllowed} = options;

    if (!countyId) {
        throw new Error("County missing");
    }

    let query = supabase.from("cities").select("*", {count: "exact"}).eq("county_id", countyId).order("name");

    if (onlyAllowed) {
        query = query.in("id", allowedIds);
    }

    if (citySlug) {
        query = query.eq("slug", citySlug);
    }

    if (cityId) {
        query = query.eq("id", cityId);
    }

    const {data, error} = await query;

    if (error) {
        throw error;
    }

    return (data as City[]) || [];
}

export async function fetchCity(
    supabase: SupabaseClient,
    options: QueryOptions,
): Promise<City> {

    const {countyId, citySlug, cityId, onlyAllowed} = options;

    if(!countyId) {
        throw new Error("County missing");
    }

    let query = supabase.from("cities").select("*");

    if (onlyAllowed) {
        query = query.in("id", allowedIds);
    }

    if (citySlug) {
        query = query.eq("slug", citySlug);
    }

    if (cityId) {
        query = query.eq("id", cityId);
    }

    const {data, error} = await query.single();

    if (error) {
        throw error;
    }

    return data as City;
}