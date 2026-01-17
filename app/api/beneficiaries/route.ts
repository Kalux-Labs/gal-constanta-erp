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

        const validatedData = validation.data!;

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

        if (userRole !== 'admin') {
            const {
                data: beneficiaryData,
                error: beneficiaryError
            } = await supabase
                .from('beneficiaries')
                .select('id')
                .eq('user_id', user.id)
                .limit(1);

            if (beneficiaryError) {
                console.log(beneficiaryError);
                return NextResponse.json(
                    {error: "Nu s-a putut crea beneficiarul"},
                    {status: 500}
                );
            }

            if (beneficiaryData && beneficiaryData.length > 0) {
                return NextResponse.json(
                    {error: "Acest cont are deja un beneficiar asociat"},
                    {status: 400}
                );
            }
        }

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
            if (error.code.includes('23505')) {
                console.log(error);
                return NextResponse.json(
                    {
                        error: "Un beneficiar cu acest CUI este existent. Pentru orice neînțelegere vă rugăm să ne contactați.",
                        errors: [{code: "server", message: "CUI-ul trebuie să fie unic", path: ["cui"]}],
                    },
                    {status: 409}
                );
            }

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

