"use client"

import {useQuery} from "@tanstack/react-query";
import {getCities} from "@/lib/supabase/utils/cities/cities.client";

export function useCities({countyId, onlyAllowed = false}: {
    countyId: number | undefined,
    onlyAllowed?: boolean
}) {
    return useQuery({
        queryKey: ["cities", countyId, onlyAllowed],
        queryFn: async () => {
            return await getCities({
                countyId: countyId,
                onlyAllowed: onlyAllowed
            });
        },
    });
}