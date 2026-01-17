import ServerPaginatedDataTable from "@/components/ui/server-paginated-data-table";
import {columns} from "@/components/ui/projects/server/table/columns";
import {getProjects} from "@/lib/supabase/utils/projects/projects.server";
import {getCounties} from "@/lib/supabase/utils/counties/counties.server";
import {getCountiesStatic} from "@/lib/supabase/utils/counties/counties.static";
import {getCities} from "@/lib/supabase/utils/cities/cities.server";
import ProjectFilters from "@/components/ui/projects/server/project-filters";
import BreadcrumbComponent from "@/components/layout/breadcrumb-component";

type Params = Promise<{
    countySlug: string;
}>;

type SearchParams = Promise<{
    search?: string;
    page?: number;
    perPage?: number;
}>;

export default async function CountyPage({
                                             params,
                                             searchParams
                                         }: {
    params: Params;
    searchParams: SearchParams;
}) {

    const {countySlug} = await params;
    const {search} = await searchParams;
    let {page, perPage} = await searchParams;
    page = Number(page) || 1;
    perPage = Number(perPage) || 10;

    const counties = await getCounties({
        onlyAllowed: true,
    });

    const cities = await getCities({
        onlyAllowed: true,
        countyId: 15
    });

    const county = counties.find((c) => c.slug === countySlug);

    const {data, count} = await getProjects({
        page: page, perPage: perPage, search: search, countySlug: countySlug, allowUnassigned: true
    });

    const breadcrumbItems = [
        {
            title: "Acasă",
            href: "/"
        },
        {
            title: county?.name ?? "",
            href: `/${county?.slug}`
        },
    ];

    return (
        <div className="max-w-4xl mx-auto mb-8 flex flex-col gap-4 px-4">
            <BreadcrumbComponent items={breadcrumbItems}/>
            <div>
                <h1 className="text-primary leading-tighter text-4xl font-bold tracking-tight text-balance xl:text-5xl">Proiecte</h1>
            </div>
            <ProjectFilters counties={counties} cities={cities} search={search} county={county}/>
            <ServerPaginatedDataTable page={page} perPage={perPage} columns={columns} data={data}
                                      total={count}/>
        </div>
    );
}

export const dynamicParams = false;

export async function generateStaticParams() {
    const counties = await getCountiesStatic({onlyAllowed: true});
    if (!counties) {
        return [];
    }

    return counties.map((county) => ({
        countySlug: county.slug
    }))
}