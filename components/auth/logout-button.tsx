"use client";

import {Button} from "@/components/ui/button";
import {createClient} from "@/lib/supabase/client";
import {useRouter} from "next/navigation";

export default function LogoutButton() {
    const router = useRouter();
    const supabase = createClient();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/auth/login");
    };

    return (
        <Button variant="outline" className="w-full" onClick={handleLogout}>
            Deconectare
        </Button>
    );
}
