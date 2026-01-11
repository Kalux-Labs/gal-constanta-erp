import {PostgrestError} from "@supabase/supabase-js";

export interface QueryOptions {
    countySlug?: string;
    citySlug?: string;
    countyId?: number;
    cityId?: number;
    search?: string;
    page?: number;
    perPage?: number;
    onlyAllowed?: boolean;
    allowUnassigned?: boolean;
}

export interface QueryResult<T> {
    data: T[];
    count: number;
    page: number;
    perPage: number;
    pageCount: number;
    error: PostgrestError | null;
}