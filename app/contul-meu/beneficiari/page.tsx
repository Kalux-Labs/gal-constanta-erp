import {createClient} from "@/lib/supabase/server";
import {redirect} from "next/navigation";
import BreadcrumbComponent from "@/components/layout/breadcrumb-component";
import BeneficiariesClient from "@/components/ui/beneficiaries/client/beneficiaries-client";
import {getCounties} from "@/lib/supabase/utils/counties/counties.server";

export default async function Beneficiaries() {
    const supabase = await createClient();

    const {data, error} = await supabase.auth.getClaims()
    if (error || !data?.claims || !data?.claims?.email) {
        redirect('/auth/login');
    }

    const isAdmin = data?.claims?.user_role === 'admin';
    const email = data?.claims?.email;

    const counties = await getCounties({
        onlyAllowed: false
    });

    const breadcrumbsItems = [
        {href: '/contul-meu', title: 'Contul meu'},
        {href: '/contul-meu/beneficiari', title: isAdmin ? "Beneficiari" : "Profil beneficiar"}
    ]

    return (
        <div className="max-w-4xl mx-auto mb-8 flex flex-col gap-4 px-4">
            <BreadcrumbComponent items={breadcrumbsItems}/>
            <div>
                <h1 className="font-medium text-2xl">{isAdmin ? "Beneficiari" : "Profil beneficiar"}</h1>
                <p className="text-muted-foreground">{isAdmin ? "Administrează datele beneficiarilor pe care îi reprezinți.": "Administrează datele beneficiarului pe care îl reprezinți."}</p>
            </div>
            <BeneficiariesClient counties={counties ?? []} isAdmin={isAdmin} email={email}/>
        </div>
    )
}