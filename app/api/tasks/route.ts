import {NextRequest, NextResponse} from "next/server";
import {getTasks} from "@/lib/supabase/utils/tasks/tasks.server";
import TasksQueryOptions from "@/lib/types/tasks/tasks-query-options";
import {taskQueryGETSchema} from "@/lib/validation/schemas/tasks-query-schema";
import {getRecurrencyOption} from "@/lib/utils";
import {Task} from "@/lib/types/task";
import {taskSchema} from "@/lib/validation/schemas/task-schema";
import {requireAdmin, requireAuth, validateBody} from "@/lib/server/api/utils";

export async function GET(request: NextRequest) {
    try {
        const auth = await requireAdmin();
        if (auth.error) {
            return auth.error;
        }

        const searchParams = request.nextUrl.searchParams;

        if (!searchParams.get("year") || !searchParams.get("quarter")) {
            return NextResponse.json(
                {error: "year and quarter are required query params"},
                {status: 400}
            );
        }

        const options: TasksQueryOptions = taskQueryGETSchema.parse({
            year: searchParams.get("year"),
            quarter: searchParams.get("quarter"),
            search: searchParams.get("search"),
            done: searchParams.get("done")
        });

        const tasks = await getTasks(options);

        const data: Task[] = tasks.map(task => ({
            ...task,
            recurrency: getRecurrencyOption(task.recurrency),
            children: task.children?.map(child => ({
                ...child,
                recurrency: getRecurrencyOption(child.recurrency),
                children: []
            })) || [],
        }));

        return NextResponse.json(data, {status: 200});
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            {error: "Eroare internă a serverului"},
            {status: 500}
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const auth = await requireAuth();
        if (auth.error) {
            return auth.error;
        }

        const validation = await validateBody(request, taskSchema);
        if (validation.error) {
            return validation.error;
        }

        const {supabase, user} = auth;
        const validatedData = validation.data!;

        const {data, error} = await supabase
            .from('tasks')
            .insert({
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
                user_id: user.id,
            })
            .select();

        if (error) {
            console.error(error);
            return NextResponse.json(
                {error: "Cannot create activity"},
                {status: 422}
            );
        }

        return NextResponse.json(data[0], {status: 201});
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            {error: "Eroare internă a serverului"},
            {status: 500}
        )
    }
}