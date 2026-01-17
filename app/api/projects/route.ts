import {NextRequest, NextResponse} from "next/server";
import {projectSchema} from "@/lib/validation/schemas/project-schema";
import {requireAuth, validateBody} from "@/lib/server/api/utils";

export async function POST(request: NextRequest) {
    try {
        const auth = await requireAuth();
        if (auth.error) {
            return auth.error;
        }

        const validation = await validateBody(request, projectSchema);
        if (validation.error) {
            return validation.error;
        }

        const {supabase, user} = auth;
        const validatedData = validation.data!;

        const {data, error} = await supabase
            .from("projects")
            .insert({
                code: validatedData.code,
                submeasure: validatedData.submeasure,
                financed_at: validatedData.financed_at,
                name: validatedData.name,
                description: validatedData.description,
                beneficiary_id: validatedData.beneficiary?.id,
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
                user_id: user.id
            })
            .select()
            .single();

        if (error) {
            if (error.message.includes('projects_code_key')) {
                return NextResponse.json(
                    {
                        error: "Codul trebuie să fie unic.",
                        errors: [{code: "server", message: "Codul trebuie să fie unic", path: ["code"]}],
                    },
                    {status: 409}
                )
            }
            console.log(error);
            return NextResponse.json(
                {error: "Nu s-a putut creea proiectul"},
                {status: 500}
            );
        }

        if (!data) {
            return NextResponse.json(
                {error: "Nu s-a putut creea proiectul"},
                {status: 404}
            );
        }

        return NextResponse.json(data, {status: 201});
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            {error: "Eroare internă a serverului"},
            {status: 500}
        )
    }
}

