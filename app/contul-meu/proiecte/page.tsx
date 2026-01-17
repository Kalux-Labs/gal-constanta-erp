import {createClient} from "@/lib/supabase/server";
import {redirect} from "next/navigation";
import BreadcrumbComponent from "@/components/layout/breadcrumb-component";
import ProjectsClient from "@/components/ui/projects/client/projects-client";
import {getCounties} from "@/lib/supabase/utils/counties/counties.server";
import {getCities} from "@/lib/supabase/utils/cities/cities.server";

export default async function Projects() {
    const supabase = await createClient();

    const {data, error} = await supabase.auth.getClaims()
    if (error || !data?.claims) {
        redirect('/auth/login');
    }

    const counties = await getCounties({
        onlyAllowed: true,
    })

    const cities = await getCities({
        onlyAllowed: true,
        countyId: 15
    })

    const breadcrumbsItems = [
        {href: '/contul-meu', title: 'Contul meu'},
        {href: '/contul-meu/proiecte', title: 'Proiecte mele'}
    ]

    return (
        <div className="max-w-4xl mx-auto mb-8 flex flex-col gap-4 px-4">
            <BreadcrumbComponent items={breadcrumbsItems}/>
            <div>
                <h1 className="font-medium text-2xl">Proiectele mele</h1>
                <p className="text-muted-foreground">Administrează proiectele pe care le desfășori.</p>
            </div>
            <ProjectsClient counties={counties} cities={cities}/>
        </div>
    )
}