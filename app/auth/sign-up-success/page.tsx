import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import {createClient} from "@/lib/supabase/server";
import {redirect} from "next/navigation";
import {BadgeCheck} from "lucide-react";

export default async function Page() {
    const supabase = await createClient();

    const {data} = await supabase.auth.getClaims();
    if (data?.claims) {
        redirect('/my-account');
    }

    return (
        <div className="flex min-h-[calc(100vh-72px)] w-full items-center justify-center">
            <div className="w-full max-w-sm">
                <div className="flex flex-col gap-6">
                    <Card className="shadow-xs">
                        <CardHeader>
                            <CardTitle className="text-2xl flex flex-row gap-2 items-center">
                                <BadgeCheck className="text-green-600 h-8 w-8"/>
                                Verifică adresa de e-mail</CardTitle>
                            <CardDescription>Pașii următori pentru activarea contului</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">
                                Dacă adresa de email este validă, vei primi în curând un mesaj cu instrucțiuni pentru continuarea procesului.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
