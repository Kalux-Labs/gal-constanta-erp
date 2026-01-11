import {NextRequest, NextResponse} from "next/server";
import {taskSchema} from "@/lib/validation/schemas/task-schema";
import {requireAdmin, validateBody} from "@/lib/server/api/utils";

export async function PUT(
    request: NextRequest,
    {params}: { params: Promise<{ id: string }> }
) {
    try {
        const auth = await requireAdmin();
        if (auth.error) {
            return auth.error;
        }

        const {id} = await params;

        const validation = await validateBody(request, taskSchema);
        if (validation.error) {
            return validation.error;
        }

        const {supabase} = auth;
        const validatedData = validation.data!;

        const {data, error} = await supabase.from("tasks").update({
            name: validatedData.name,
            description: validatedData.description,
            year: validatedData.year,
            quarter: validatedData.quarter,
            parent_id: validatedData.parent_id,
            recurrency: validatedData.recurrency.value,
            notify: validatedData.notify,
            done: validatedData.done,
            start_date: validatedData.start_date,
            end_date: validatedData.end_date,
            updated_at: new Date().toISOString(),
        })
            .eq("id", id)
            .select()
            .single();

        if (error) {
            return NextResponse.json(
                {error: "Nu s-a putut actualiza activitatea"},
                {status: 500}
            );
        }

        if (!data) {
            return NextResponse.json(
                {error: "Nu s-a putut actualiza activitatea"},
                {status: 404}
            );
        }

        return NextResponse.json(data);
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
        const auth = await requireAdmin();
        if (auth.error) {
            return auth.error;
        }

        const {id} = await params;

        const {supabase} = auth;

        const {data, error} = await supabase.from("tasks").delete()
            .eq("id", id).select().single();

        if (error) {
            console.error(error);
            if (error.code === '23503') {
                return NextResponse.json(
                    {error: "Nu s-a putut șterge activitatea"},
                    {status: 409}
                );
            }
            return NextResponse.json(
                {error: "Nu s-a putut șterge activitatea"},
                {status: 403}
            );
        }

        if (!data) {
            return NextResponse.json(
                {message: "Nu s-a putut șterge activitatea"},
                {status: 404}
            )
        }

        return NextResponse.json(
            {message: "Activitatea a fost ștearsă cu succes"},
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