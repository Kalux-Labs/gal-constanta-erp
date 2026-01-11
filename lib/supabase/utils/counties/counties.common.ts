import {SupabaseClient} from "@supabase/supabase-js";
import {QueryOptions} from "@/lib/types/query-option";
import County from "@/lib/types/county";

// 15 Constanta

const allowedIds = [15];

export async function fetchCounties(
    supabase: SupabaseClient,
    options: QueryOptions,
): Promise<County[]> {

    const {countySlug, countyId, onlyAllowed} = options;

    let query = supabase.from("counties").select("*", {count: "exact"}).order("name");

    if (onlyAllowed) {
        query = query.in("id", allowedIds);
    }

    if (countySlug) {
        query = query.eq("slug", countySlug);
    }

    if (countyId) {
        query = query.eq("id", countyId);
    }

    const {data, error} = await query;

    if (error) {
        throw error;
    }

    return (data as County[]) || [];
}

export async function fetchCounty(
    supabase: SupabaseClient,
    options: QueryOptions,
): Promise<County> {

    const {countySlug, countyId, onlyAllowed} = options;

    let query = supabase.from("cities").select("*");

    if (onlyAllowed) {
        query = query.in("id", allowedIds);
    }

    if (countySlug) {
        query = query.eq("slug", countySlug);
    }

    if (countyId) {
        query = query.eq("id", countyId);
    }

    const {data, error} = await query.single();

    if (error) {
        throw error;
    }

    return data as County;
}