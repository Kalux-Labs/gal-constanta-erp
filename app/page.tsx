import ServerPaginatedDataTable from "@/components/ui/server-paginated-data-table";
import {columns} from "@/components/ui/projects/server/table/columns";
import {getProjects, getProjectsStatistics} from "@/lib/supabase/utils/projects/projects.server";
import ProjectFilters from "@/components/ui/projects/server/project-filters";
import {getCounties} from "@/lib/supabase/utils/counties/counties.server";
import {getCities} from "@/lib/supabase/utils/cities/cities.server";
import StatisticCards from "@/components/ui/projects/common/statistics-card";
import StatisticsChart from "@/components/ui/projects/common/statistics-chart";
import {getProjectsSummaryByCities} from "@/lib/supabase/utils/statistics/statistics.server";
import ProjectsSummaryChart from "@/components/ui/projects/common/projects-summary-by-cities-chart";


type SearchParams = Promise<{
    search?: string;
    page?: number;
    perPage?: number;
}>;

export default async function Home({
                                       searchParams
                                   }: {
    searchParams: SearchParams;
}) {

    const {search} = await searchParams;
    let {page, perPage} = await searchParams;
    page = Number(page) || 1;
    perPage = Number(perPage) || 10;

    const counties = await getCounties({
        onlyAllowed: true,
    });

    const cities = await getCities({
        onlyAllowed: true,
        countyId: 15,
    })

    const {data, count} = await getProjects({
        page: page, perPage: perPage, search: search, allowUnassigned: true
    });

    const projectsSummaryByCities = await getProjectsSummaryByCities();

    const {allFinishedProjectsCount, allProjectsCount, totalFinancedAmount} = await getProjectsStatistics();

    const cards = [
        {
            title: "Total proiecte",
            subtitle: "Toate proiectele înregistrate",
            value: allProjectsCount,
        },
        {
            title: "Proiecte finalizate",
            subtitle: "Finalizate cu succes",
            value: allFinishedProjectsCount,
        },
        {
            title: "Finanțare nerambursabilă",
            subtitle: "Valoare totală acordată",
            value: totalFinancedAmount,
            type: 'currency'
        }
    ]

    const now = new Date();

    return (
        <div className="max-w-4xl mx-auto mb-8 flex flex-col gap-4 px-4">
            <div>
                <h1 className="text-primary leading-tighter text-4xl font-bold tracking-tight text-balance xl:text-5xl">Proiecte</h1>
            </div>
            <StatisticsChart date={now}/>
            <ProjectsSummaryChart data={projectsSummaryByCities}/>
            <StatisticCards cards={cards}/>
            <ProjectFilters counties={counties} cities={cities} search={search}/>
            <ServerPaginatedDataTable page={page} perPage={perPage} columns={columns} data={data}
                                      total={count}/>
        </div>
    );
}
