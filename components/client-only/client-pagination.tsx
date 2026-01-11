"use client";

import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ClientPagination({
                                             page,
                                             perPage,
                                             total,
                                             onPageChangeAction,
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
                    <Button
                        variant="ghost"
                        disabled={page <= 1}
                        onClick={() => onPageChangeAction?.(page - 1)}
                        tabIndex={page <= 1 ? -1 : undefined}
                    >
                        <ChevronLeft />
                    </Button>
                </PaginationItem>

                {page > 2 && (
                    <PaginationItem>
                        <Button variant="ghost" onClick={() => onPageChangeAction?.(1)}>
                            1
                        </Button>
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
                            <Button
                                variant={p === page ? "outline" : "ghost"}
                                size="icon"
                                onClick={() => onPageChangeAction?.(p)}
                                tabIndex={p === page ? -1 : undefined}
                                className={cn(
                                    "select-none",
                                    p === page ? "pointer-events-none" : undefined,
                                )}
                            >
                                {p}
                            </Button>
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
                        <Button
                            variant="ghost"
                            onClick={() => onPageChangeAction?.(totalPages)}
                            size="icon"
                        >
                            {totalPages}
                        </Button>
                    </PaginationItem>
                )}

                <PaginationItem>
                    <Button
                        variant="ghost"
                        onClick={() => onPageChangeAction?.(page + 1)}
                        tabIndex={page >= totalPages ? -1 : undefined}
                        className={cn(
                            "select-none",
                            page >= totalPages ? "pointer-events-none opacity-50" : undefined,
                        )}
                    >
                        <ChevronRight />
                    </Button>
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
}