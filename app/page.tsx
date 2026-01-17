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
import Banner from "@/components/general/banner";


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

    const {
        allFinishedProjectsCount,
        allProjectsCount,
        totalFinancedAmount,
        totalAidReceivedAmount,
        totalOverdueInstallments,
        allAdvancedProjectsCount
    } = await getProjectsStatistics();

    const projectStatisticsCards = [
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
            title: "Proiecte avansate",
            subtitle: "Stadiu avansat de implementare",
            value: allAdvancedProjectsCount,
            tooltip: 'Progres între 40 și 98%'
        },
    ];

    const financingStatisticsCard = [
        {
            title: "Finanțare contractată",
            subtitle: "Valoare totală proiecte finalizate",
            value: totalFinancedAmount,
            type: 'currency',
            tooltip: 'Valoare totată contractată pentru proiectele finalizate'
        },
        {
            title: "Finanțare nerambursabilă",
            subtitle: "Valoare totală proiecte finalizate",
            value: totalAidReceivedAmount,
            type: 'currency',
            tooltip: 'Valoare totată nerambursabile pentru proiectele finalizate'
        },
        {
            title: "Tranșe plătite",
            subtitle: "Valoare totală achitată",
            value: totalOverdueInstallments,
            type: 'currency',
            tooltip: "Valoarea totală a tranșelor de finanțare deja achitate inclusiv pentru proiectele nefinalizate"
        },
    ];

    const now = new Date();

    return (
        <div className="max-w-4xl mx-auto mb-8 flex flex-col gap-4 px-4">
            <Banner/>
            <h1 className="text-primary leading-tighter text-4xl font-bold tracking-tight text-balance xl:text-5xl">Proiecte</h1>
            <StatisticsChart date={now}/>
            <ProjectsSummaryChart data={projectsSummaryByCities}/>
            <StatisticCards cards={projectStatisticsCards}/>
            <StatisticCards cards={financingStatisticsCard}/>
            <ProjectFilters counties={counties} cities={cities} search={search}/>
            <ServerPaginatedDataTable page={page} perPage={perPage} columns={columns} data={data}
                                      total={count}/>
        </div>
    );
}
