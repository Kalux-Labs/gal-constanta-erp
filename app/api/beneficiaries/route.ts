import {NextRequest, NextResponse} from "next/server";
import {beneficiarySchema} from "@/lib/validation/schemas/beneficiary-schema";
import {requireAuth, validateBody} from "@/lib/server/api/utils";

export async function POST(request: NextRequest) {
    try {
        const auth = await requireAuth();
        if (auth.error) {
            return auth.error;
        }

        const validation = await validateBody(request, beneficiarySchema);
        if (validation.error) {
            return validation.error;
        }

        const {supabase, user} = auth;
        const validatedData = validation.data!;

        const {data, error} = await supabase
            .from("beneficiaries")
            .insert({
                name: validatedData.name,
                cui: validatedData.cui,
                county_id: validatedData.county!.id,
                city_id: validatedData.city!.id,
                street: validatedData.street,
                zipcode: validatedData.zipcode,
                email: validatedData.email || null,
                phone: validatedData.phone,
                bank_account: validatedData.bank_account,
                legal_representative: validatedData.legal_representative,
                user_id: user.id,
            })
            .select()
            .single();

        if (error) {
            return NextResponse.json(
                {error: "Nu s-a putut crea beneficiarul"},
                {status: 500}
            );
        }

        if (!data) {
            return NextResponse.json(
                {error: "Nu s-a putut creea beneficiarul"},
                {status: 404}
            );
        }

        return NextResponse.json(data, {status: 201});
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            {error: "Eroare internă a serverului"},
            {status: 500}
        );
    }
}

