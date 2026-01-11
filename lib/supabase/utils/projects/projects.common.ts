import {SupabaseClient} from "@supabase/supabase-js";
import {QueryOptions, QueryResult} from "@/lib/types/query-option";

export default async function fetchProjects<T>(
    supabase: SupabaseClient,
    tableName: string,
    options: QueryOptions,
): Promise<QueryResult<T>> {
    const {page = 1, perPage = 10, search, countySlug, citySlug, countyId, cityId, allowUnassigned = false} = options;
    const offset = (page - 1) * perPage;

    let query = supabase
        .from(tableName)
        .select("*", {count: "exact"});

    const {data: claimsData} = await supabase.auth.getClaims();
    const isAdmin = claimsData?.claims?.user_role === "admin";

    if (!isAdmin && !allowUnassigned) {
        query = query.not("user_id", "is", null);
    }

    if (search) {
        query = query.ilike("name", `%${search}%`);
    }
    if (countySlug) {
        query = query.eq("implementation_county->>slug", countySlug);
    }
    if (citySlug) {
        query = query.eq("implementation_city->>slug", citySlug);
    }
    if (countyId) {
        query = query.eq("implementation_county_id", countyId);
    }
    if (cityId) {
        query = query.eq("implementation_city_id", cityId);
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