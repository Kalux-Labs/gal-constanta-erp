"use client"

import {createClient} from "@/lib/supabase/client";
import {fetchCounties} from "@/lib/supabase/utils/counties/counties.common";
import {QueryOptions} from "@/lib/types/query-option";

export async function getCounties(options: QueryOptions) {
    const supabase = createClient();
    return fetchCounties(supabase, options);
}