import {UpdatePasswordForm} from '@/components/update-password-form'
import {createClient} from "@/lib/supabase/server";
import {redirect} from "next/navigation";

export default async function Page() {
    const supabase = await createClient()

    const {data, error} = await supabase.auth.getClaims()
    if (error || !data?.claims) {
        redirect('/auth/login');
    }

    return (
        <div className="flex min-h-[calc(100vh-72px)] w-full items-center justify-center">
            <div className="w-full max-w-sm">
                <UpdatePasswordForm/>
            </div>
        </div>
    )
}
