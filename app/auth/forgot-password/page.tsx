import {ForgotPasswordForm} from '@/components/forgot-password-form'
import {createClient} from "@/lib/supabase/server";
import {redirect} from "next/navigation";

export default async function Page() {
    const supabase = await createClient();

    const {data} = await supabase.auth.getClaims();
    if (data?.claims) {
        redirect('/auth/update-password');
    }

    return (
        <div className="flex min-h-[calc(100vh-72px)] w-full items-center justify-center">
            <div className="w-full max-w-sm">
                <ForgotPasswordForm/>
            </div>
        </div>
    )
}
