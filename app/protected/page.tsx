import {redirect} from 'next/navigation'

import {createClient} from '@/lib/supabase/server'
import TasksClient from "@/components/ui/tasks/client/tasks-client";
import TaskSheetLayout from "@/lib/layouts/task-sheet-layout";

export default async function ProtectedPage() {
    const supabase = await createClient()

    const {data, error} = await supabase.auth.getClaims()
    if (error || !data?.claims || data?.claims?.user_role !== 'admin') {
        redirect('/auth/login')
    }
    return (
        <div className="max-w-4xl mx-auto mb-8 flex flex-col gap-4 px-4">
            <div>
                <h1 className="font-medium text-2xl">Planificator</h1>
                <p className="text-muted-foreground">Accesează și gestionează rapid informațiile despre planificări și alertele acestora.</p>
            </div>
            <TaskSheetLayout>
                <TasksClient/>
            </TaskSheetLayout>
        </div>
    )
}
