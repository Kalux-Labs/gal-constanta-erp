import {NextRequest, NextResponse} from "next/server";
import {updateAccountSchema} from "@/lib/validation/schemas/update-account-schema";
import {requireAuth, validateBody} from "@/lib/server/api/utils";
import * as Sentry from "@sentry/nextjs";

export async function PATCH(request: NextRequest) {
    try {
        const auth = await requireAuth();
        if (auth.error) {
            return auth.error;
        }
        const validation = await validateBody(request, updateAccountSchema);
        if (validation.error) {
            return validation.error;
        }

        const {supabase} = auth;
        const validatedData = validation.data!;

        const {error} = await supabase.auth.updateUser({
            data: {
                displayName: validatedData.displayName,
            },
        });

        if (error) {
            Sentry.captureException(error, {
                level: 'error',
                tags: {
                    section: 'users/route.ts',
                    action: 'update',
                    details: 'dbError'
                }
            });
            return NextResponse.json({error: "Nu s-a putut actualiza profilul"}, {status: 403});
        }

        await supabase.auth.refreshSession();

        return NextResponse.json(
            {message: "Profilul a fost actualizat cu succes"},
            {status: 200}
        );
    } catch (error) {
        Sentry.captureException(error, {
            level: 'error',
            tags: {
                section: 'users/route.ts',
                action: 'update'
            }
        });
        return NextResponse.json(
            {error: "Eroare internă a serverului"},
            {status: 500}
        );
    }
}
