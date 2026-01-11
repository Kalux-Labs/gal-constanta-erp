import {NextRequest, NextResponse} from "next/server";
import {beneficiarySchema} from "@/lib/validation/schemas/beneficiary-schema";
import {requireAuth, validateBody} from "@/lib/server/api/utils";

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
                cui: validatedData.cui,
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
        console.error(error);
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
                .from("beneficiaries")
                .delete()
                .eq("id", id)
            : await supabase
                .from("beneficiaries")
                .update({user_id: null})
                .eq("id", id);

        if (deleteError) {
            return NextResponse.json(
                {error: "Nu s-a putut șterge beneficiarul"},
                {status: 500}
            );
        }

        return NextResponse.json(
            {message: "Beneficiarul a fost șters cu succes"},
            {status: 200}
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            {error: "Eroare internă a serverului"},
            {status: 500}
        );
    }
}
