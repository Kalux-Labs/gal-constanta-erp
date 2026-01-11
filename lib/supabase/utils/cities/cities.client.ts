"use client"

import {createClient} from "@/lib/supabase/client";
import {fetchCities} from "@/lib/supabase/utils/cities/cities.common";
import {QueryOptions} from "@/lib/types/query-option";

export async function getCities(options: QueryOptions) {
    const supabase = createClient();
    return fetchCities(supabase, options);
}