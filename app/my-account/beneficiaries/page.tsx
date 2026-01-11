import {createClient} from "@/lib/supabase/server";
import {redirect} from "next/navigation";
import BreadcrumbComponent from "@/components/layout/breadcrumb-component";
import BeneficiariesClient from "@/components/ui/beneficiaries/client/beneficiaries-client";
import {getCounties} from "@/lib/supabase/utils/counties/counties.server";

export default async function Beneficiaries() {
    const supabase = await createClient();

    const {data, error} = await supabase.auth.getClaims()
    if (error || !data?.claims) {
        redirect('/auth/login');
    }

    const counties = await getCounties({
        onlyAllowed: false
    });

    const breadcrumbsItems = [
        {href: '/my-account', title: 'Contul meu'},
        {href: '/my-account/beneficiaries', title: 'Beneficiari'}
    ]

    return (
        <div className="max-w-4xl mx-auto mb-8 flex flex-col gap-4 px-4">
            <BreadcrumbComponent items={breadcrumbsItems}/>
            <div>
                <h1 className="font-medium text-2xl">Beneficiari</h1>
                <p className="text-muted-foreground">Administreaza datele beneficiarilor pe care îi reprezinți.</p>
            </div>
            <BeneficiariesClient counties={counties ?? []}/>
        </div>
    )
}