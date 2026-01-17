import {NextRequest, NextResponse} from "next/server";
import {projectSchema} from "@/lib/validation/schemas/project-schema";
import {requireAuth, validateBody} from "@/lib/server/api/utils";
import * as Sentry from "@sentry/nextjs";

export async function PUT(
    request: NextRequest,
    {params}: { params: Promise<{ id: string }> }
) {
    try {
        const auth = await requireAuth();
        if (auth.error) {
            return auth.error;
        }

        const {id} = await params;

        const validation = await validateBody(request, projectSchema);
        if (validation.error) {
            return validation.error;
        }

        const {supabase} = auth;
        const validatedData = validation.data!;

        const {data, error} = await supabase
            .from("projects")
            .update({
                name: validatedData.name,
                description: validatedData.description,
                total_eligible_financing_amount: validatedData.total_eligible_financing_amount,
                non_refundable_financing_aid_rate: validatedData.non_refundable_financing_aid_rate,
                non_refundable_financing_aid_amount: validatedData.non_refundable_financing_aid_amount,
                implementation_period: validatedData.implementation_period,
                implementation_county_id: validatedData.implementation_county?.id,
                implementation_city_id: validatedData.implementation_city?.id,
                implementation_street: validatedData.implementation_street,
                implementation_zipcode: validatedData.implementation_zipcode,
                implementation_details: validatedData.implementation_details,
                objectives: validatedData.objectives,
                results: validatedData.results,
                updated_at: new Date().toISOString(),
            })
            .eq("id", id)
            .select()
            .single();

        if (error) {
            Sentry.captureException(error, {
                level: 'error',
                tags: {
                    section: 'api/projects/[id]/route.ts',
                    action: 'create',
                    details: 'dbError - error'
                }
            });
            return NextResponse.json(
                {error: "Nu s-a putut actualiza proiectul"},
                {status: 500}
            );
        }

        if (!data) {
            Sentry.captureException(error, {
                level: 'error',
                tags: {
                    section: 'api/projects/[id]/route.ts',
                    action: 'create',
                    details: 'dbError - no data'
                }
            });
            return NextResponse.json(
                {error: "Nu s-a putut actualiza proiectul"},
                {status: 404}
            );
        }

        return NextResponse.json(data, {status: 200});
    } catch (error) {
        Sentry.captureException(error, {
            level: 'error',
            tags: {
                section: 'api/projects/[id]/route.ts',
                action: 'create',
            }
        });
        return NextResponse.json(
            {error: "Eroare internă a serverului"},
            {status: 500}
        );
    }
}

export async function DELETE(
    request: NextRequest,
    {params}: { params: Promise<{ id: string }> }
) {
    try {
        const auth = await requireAuth();
        if (auth.error) {
            return auth.error;
        }

        const {id} = await params;

        const {supabase} = auth;

        const {data: claimsData, error: claimsError} =
            await supabase.auth.getClaims();

        if (claimsError) {
            return NextResponse.json(
                {error: "Nu s-au putut verifica permisiunile"},
                {status: 401}
            );
        }

        const userRole = claimsData?.claims?.user_role;

        const {error: deleteError} = userRole === "admin"
            ? await supabase
                .from("projects")
                .delete()
                .eq("id", id)
            : await supabase
                .from("projects")
                .update({user_id: null})
                .eq("id", id);

        if (deleteError) {
            Sentry.captureException(deleteError, {
                level: 'error',
                tags: {
                    section: 'api/projects/[id]/route.ts',
                    action: 'delete',
                    details: 'dbError - deleteError'
                }
            });
            return NextResponse.json(
                {error: "Nu s-a putut șterge proiectul"},
                {status: 500}
            );
        }

        return NextResponse.json(
            {message: "Proiectul a fost șters cu succes"},
            {status: 200}
        );
    } catch (error) {
        Sentry.captureException(error, {
            level: 'error',
            tags: {
                section: 'api/projects/[id]/route.ts',
                action: 'delete',
            }
        });
        return NextResponse.json(
            {error: "Eroare internă a serverului"},
            {status: 500}
        );
    }
}
