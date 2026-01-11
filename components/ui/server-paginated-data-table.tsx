import {ColumnDef} from "@tanstack/react-table";
import ServerPagination from "@/components/server-only/server-pagination";
import {DataTable} from "@/components/ui/data-table";

interface PaginatedDataTableProps<T> {
    page?: number;
    perPage?: number;
    data: T[];
    total: number;
    columns: ColumnDef<T>[];
}

export default function ServerPaginatedDataTable<T>({
                                                        page = 1,
                                                        perPage = 10,
                                                        data,
                                                        total,
                                                        columns,
                                                    }: PaginatedDataTableProps<T>) {
    return (
        <>
            <DataTable columns={columns} data={data}/>
            <ServerPagination page={page} perPage={perPage} total={total}/>
        </>
    );
}