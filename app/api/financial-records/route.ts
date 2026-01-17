import {NextRequest, NextResponse} from "next/server";
import {financialRecordSchema} from "@/lib/validation/schemas/financial-record-schemas";
import {requireAuth, validateBody} from "@/lib/server/api/utils";
import * as Sentry from "@sentry/nextjs";

export async function POST(request: NextRequest) {
    try {
        const auth = await requireAuth();
        if (auth.error) {
            return auth.error;
        }

        const validation = await validateBody(request, financialRecordSchema);
        if (validation.error) {
            return validation.error;
        }

        const {supabase} = auth;
        const validatedData = validation.data!;

        const {data: projectData, error: projectError} = await supabase
            .from("projects")
            .select("total_eligible_financing_amount")
            .eq("id", validatedData.project_id)
            .single();

        if (projectError || !projectData) {
            return NextResponse.json(
                {error: "Proiectul nu a fost găsit"},
                {status: 404}
            );
        }

        const totalEligible = projectData.total_eligible_financing_amount;

        const installmentsTotal = validatedData.installments.reduce(
            (acc, inst) => acc + inst.total_amount,
            0
        );

        if (installmentsTotal > totalEligible) {
            return NextResponse.json(
                {error: "Suma tranșelor depășește valoarea eligibilă totală a finanțării"},
                {status: 422}
            );
        }

        const {data, error} = await supabase.from("financial_records").insert({
            project_id: validatedData.project_id,
            installments: validatedData.installments
        })
            .select()
            .single();

        if (error) {
            Sentry.captureException(error, {
                level: 'error',
                tags: {
                    section: 'api/financial-records/route.ts',
                    action: 'create',
                    details: 'dbError'
                }
            });

            return NextResponse.json(
                {error: "Nu s-a putut creea raportul financiar"},
                {status: 500}
            );
        }

        if (!data) {
            return NextResponse.json(
                {error: "Nu s-a putut actualiza proiectul"},
                {status: 404}
            );
        }

        return NextResponse.json(data, {status: 201});
    } catch (error) {
        Sentry.captureException(error, {
            level: 'error',
            tags: {
                section: 'api/financial-records/route.ts',
                action: 'create'
            }
        });
        return NextResponse.json(
            {error: "Eroare internă a serverului"},
            {status: 500}
        );
    }
}