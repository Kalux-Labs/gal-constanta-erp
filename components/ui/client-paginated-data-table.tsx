"use client";

import {DataTable} from "@/components/ui/data-table";
import {ColumnDef} from "@tanstack/react-table";
import ClientPagination from "@/components/client-only/client-pagination";

interface ClientPaginatedDataTableProps<T> {
    page?: number;
    perPage?: number;
    data: T[];
    total: number;
    columns: ColumnDef<T>[];
    isLoading: boolean;
    onPageChangeAction?: (page: number) => void;
}

export default function ClientPaginatedDataTable<T>({
                                                                          page = 1,
                                                                          perPage = 10,
                                                                          data,
                                                                          total,
                                                                          columns,
                                                                          isLoading = false,
                                                                          onPageChangeAction
                                                                      }: ClientPaginatedDataTableProps<T>) {
    return (
        <>
            <DataTable columns={columns} data={data} isLoading={isLoading}/>
            <ClientPagination page={page} perPage={perPage} total={total} onPageChangeAction={onPageChangeAction}/>
        </>
    );
}