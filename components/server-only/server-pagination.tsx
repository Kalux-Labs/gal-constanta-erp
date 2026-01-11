import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";
import React from "react";

export default function ServerPagination({
                                             page,
                                             perPage,
                                             total,
                                         }: {
    page: number;
    perPage: number;
    total: number;
    onPageChangeAction?: (page: number) => void;
}) {

    const totalPages = Math.ceil(total / perPage);

    const getPageNumbers = () => {
        const pages = new Set<number>();

        if (page > 1) {
            pages.add(page - 1);
        }
        pages.add(page);
        if (page < totalPages) {
            pages.add(page + 1);
        }

        return Array.from(pages).sort((a, b) => a - b);
    };


    const pageNumbers = getPageNumbers();

    if (total === 0 || perPage >= total) {
        return null;
    }

    return (
        <Pagination>
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious
                        href={`?page=${page - 1}&perPage=${perPage}`}
                        aria-disabled={page <= 1}
                        tabIndex={page <= 1 ? -1 : undefined}
                        className={cn(
                            "select-none",
                            page <= 1 ? "pointer-events-none opacity-50" : undefined,
                        )}
                    />
                </PaginationItem>

                {page > 2 && (
                    <PaginationItem>
                        <PaginationLink href={`?page=1&perPage=${perPage}`}>
                            1
                        </PaginationLink>
                    </PaginationItem>
                )}

                {page >= 4 && totalPages >= 4 && (
                    <PaginationItem>
                        <PaginationEllipsis />
                    </PaginationItem>
                )}

                {pageNumbers.map((p) => {
                    return (
                        <PaginationItem key={p}>
                            <PaginationLink
                                href={`?page=${p}&perPage=${perPage}`}
                                isActive={p === page}
                                aria-disabled={p === page}
                                tabIndex={p === page ? -1 : undefined}
                                className={cn(
                                    "select-none",
                                    p === page ? "pointer-events-none" : undefined,
                                )}
                            >
                                {p}
                            </PaginationLink>
                        </PaginationItem>
                    );
                })}

                {page <= totalPages - 3 && totalPages >= 4 && (
                    <PaginationItem>
                        <PaginationEllipsis />
                    </PaginationItem>
                )}

                {page < totalPages - 1 && (
                    <PaginationItem>
                        <PaginationLink href={`?page=${totalPages}&perPage=${perPage}`}>
                            {totalPages}
                        </PaginationLink>
                    </PaginationItem>
                )}

                <PaginationItem>
                    <PaginationNext
                        href={`?page=${page + 1}&perPage=${perPage}`}
                        aria-disabled={page >= totalPages}
                        tabIndex={page >= totalPages ? -1 : undefined}
                        className={cn(
                            "select-none",
                            page >= totalPages ? "pointer-events-none opacity-50" : undefined,
                        )}
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
}