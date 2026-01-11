import {SupabaseClient} from "@supabase/supabase-js";
import {QueryOptions, QueryResult} from "@/lib/types/query-option";

export default async function fetchBeneficiaries<T>(
    supabase: SupabaseClient,
    tableName: string,
    options: QueryOptions,
): Promise<QueryResult<T>> {
    const {page = 1, perPage = 10, search, countySlug, citySlug, countyId, cityId} = options;

    const offset = (page - 1) * perPage;

    const {data: claimsData} = await supabase.auth.getClaims();
    const isAdmin = claimsData?.claims?.user_role === "admin";

    let query = supabase
        .from(tableName)
        .select("*", {count: "exact"});

    if (!isAdmin) {
        query = query.not("user_id", "is", null);
    }

    if (search) {
        query = query.ilike("name", `%${search}%`);
    }
    if (countySlug) {
        query = query.eq("county->>slug", countySlug);
    }
    if (citySlug) {
        query = query.eq("city->>slug", citySlug);
    }
    if (countyId) {
        query = query.eq("county_id", countyId);
    }
    if (cityId) {
        query = query.eq("city_id", cityId);
    }

    query = query.range(offset, offset + perPage - 1);

    const {data, error, count} = await query;

    const pageCount = count ? Math.ceil(count / perPage) : 0;
    return {
        data: data as T[] || [],
        count: count || 0,
        page,
        perPage,
        pageCount,
        error
    };
}