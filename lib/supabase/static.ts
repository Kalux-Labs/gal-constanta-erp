import { createClient as createClientSupabase } from '@supabase/supabase-js'

export function createClient() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY

    if (!url || !key) {
        throw new Error('Missing Supabase credentials')
    }

    return createClientSupabase(url, key, {
        auth: {
            persistSession: false,
            autoRefreshToken: false,
        }
    })
}