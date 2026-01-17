import {NextRequest, NextResponse} from "next/server";
import {beneficiarySchema} from "@/lib/validation/schemas/beneficiary-schema";
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

        const validation = await validateBody(request, beneficiarySchema);
        if (validation.error) {
            return validation.error;
        }

        const {supabase} = auth;
        const validatedData = validation.data!;

        const {data, error} = await supabase
            .from("beneficiaries")
            .update({
                name: validatedData.name,
                county_id: validatedData.county!.id,
                city_id: validatedData.city!.id,
                street: validatedData.street,
                zipcode: validatedData.zipcode,
                email: validatedData.email || null,
                phone: validatedData.phone,
                bank_account: validatedData.bank_account,
                legal_representative: validatedData.legal_representative,
                updated_at: new Date().toISOString(),
            })
            .eq("id", id)
            .select()
            .single();

        if (error) {
            Sentry.captureException(error, {
                level: 'error',
                tags: {
                    section: 'api/beneficiaries/[id]/route.ts',
                    action: 'create',
                    details: 'dbError'
                }
            });
            return NextResponse.json(
                {error: "Nu s-a putut actualiza beneficiarul"},
                {status: 500}
            );
        }

        if (!data) {
            return NextResponse.json(
                {error: "Nu s-a putut actualiza beneficiarul"},
                {status: 404}
            );
        }

        return NextResponse.json(data, {status: 200});
    } catch (error) {
        Sentry.captureException(error, {
            level: 'error',
            tags: {
                section: 'api/beneficiaries/[id]/route.ts',
                action: 'create'
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

        const {supabase, user} = auth;

        const {data: claimsData, error: claimsError} =
            await supabase.auth.getClaims();

        if (claimsError) {
            return NextResponse.json(
                {error: "Nu s-au putut verifica permisiunile"},
                {status: 401}
            );
        }

        const userRole = claimsData?.claims?.user_role;

        if (userRole === "admin") {
            // Admin: hard delete beneficiary
            const {error: deleteError} = await supabase
                .from("beneficiaries")
                .delete()
                .eq("id", id);

            if (deleteError) {
                Sentry.captureException(deleteError, {
                    level: 'error',
                    tags: {
                        section: 'api/beneficiaries/[id]/route.ts',
                        action: 'delete',
                        details: 'dbError - deleteError'
                    }
                });

                return NextResponse.json(
                    {error: "Nu s-a putut șterge beneficiarul"},
                    {status: 500}
                );
            }
        } else {
            const {error: updateBeneficiaryError} = await supabase
                .from("beneficiaries")
                .update({user_id: null})
                .eq("id", id);

            if (updateBeneficiaryError) {
                Sentry.captureException(updateBeneficiaryError, {
                    level: 'error',
                    tags: {
                        section: 'api/beneficiaries/[id]/route.ts',
                        action: 'delete',
                        details: 'dbError - updateBeneficiaryError'
                    }
                });
                return NextResponse.json(
                    {error: "Nu s-a putut șterge beneficiarul"},
                    {status: 500}
                );
            }

            const {error: updateProjectsError} = await supabase
                .from("projects")
                .update({user_id: null})
                .eq("user_id", user.id);

            if (updateProjectsError) {
                Sentry.captureException(updateProjectsError, {
                    level: 'error',
                    tags: {
                        section: 'api/beneficiaries/[id]/route.ts',
                        action: 'delete',
                        details: 'dbError - updateProjectsError'
                    }
                });
                return NextResponse.json(
                    {error: "Nu s-au putut actualiza proiectele"},
                    {status: 500}
                );
            }
        }

        return NextResponse.json(
            {message: "Beneficiarul a fost șters cu succes"},
            {status: 200}
        );
    } catch (error) {
        Sentry.captureException(error, {
            level: 'error',
            tags: {
                section: 'api/beneficiaries/[id]/route.ts',
                action: 'delete',
            }
        });
        return NextResponse.json(
            {error: "Eroare internă a serverului"},
            {status: 500}
        );
    }
}