import {NextRequest, NextResponse} from "next/server";
import {createClient} from "@/lib/supabase/server";
import {z, ZodError, ZodObject} from "zod";

export async function requireAuth() {
    const supabase = await createClient();
    const {data: {user}, error: userError} = await supabase.auth.getUser();

    if (userError || !user) {
        return {
            error: NextResponse.json({error: 'Unauthorized'}, {status: 401}),
            supabase: null,
            user: null,
        };
    }

    return {error: null, supabase, user};
}

export async function requireAdmin() {
    const auth = await requireAuth();
    if (auth.error) return auth;

    const {data} = await auth.supabase.auth.getClaims();

    const role = data?.claims?.user_role;

    if (role !== 'admin') {
        return {
            error: NextResponse.json(
                {error: 'Unauthorized'},
                {status: 403}
            ),
            supabase: null,
            user: null,
        };
    }

    return auth;
}

export async function validateBody<T extends ZodObject>(req: NextRequest, schema: T): Promise<{
    error: NextResponse | null;
    data: z.infer<T> | null;
}> {
    try {
        const body = await req.json();
        const validatedData = schema.parse(body);

        return {error: null, data: validatedData};
    } catch (error) {
        if (error instanceof ZodError) {
            return {
                error: NextResponse.json({errors: error.issues}, {status: 400}),
                data: null,
            };
        }

        if (error instanceof TypeError || error instanceof SyntaxError) {
            return {
                error: NextResponse.json({error: "Invalid request"}, {status: 400}),
                data: null,
            }
        }

        return {
            error: NextResponse.json(
                {error: 'Eroare internă a serverului'},
                {status: 500}
            ),
            data: null,
        };
    }
}

export function validateQuery(req: NextRequest, schema: ZodObject) {
    try {
        const url = new URL(req.url);
        const queryParams = Object.fromEntries(url.searchParams.entries());
        const validatedData = schema.parse(queryParams);
        return {error: null, data: validatedData};
    } catch (error) {
        if (error instanceof ZodError) {
            return {
                error: NextResponse.json({errors: error.issues}, {status: 400}),
                data: null,
            };
        }

        return {
            error: NextResponse.json(
                {error: 'Eroare internă a serverului'},
                {status: 500}
            ),
            data: null,
        };
    }
}