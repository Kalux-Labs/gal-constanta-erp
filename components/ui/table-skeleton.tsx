import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";

export function TableSkeleton({columnsCount}: { columnsCount: number }) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    {Array.from({length: columnsCount}).map((_, i) => (
                        <TableHead key={i}>
                            <div className="h-4 w-24 animate-pulse rounded bg-muted"/>
                        </TableHead>
                    ))}
                </TableRow>
            </TableHeader>
            <TableBody>
                {Array.from({length: 5}).map((_, rowIndex) => (
                    <TableRow key={rowIndex}>
                        {Array.from({length: columnsCount}).map((_, cellIndex) => (
                            <TableCell key={cellIndex}>
                                <div className="h-4 w-full animate-pulse rounded bg-muted"/>
                            </TableCell>
                        ))}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}

export function TableRowSkeleton({
                                     columnsCount,
                                     rows = 5,
                                 }: {
    columnsCount: number;
    rows?: number;
}) {
    return (
        <>
            {Array.from({length: rows}).map((_, rowIndex) => (
                <TableRow key={`skeleton-row-${rowIndex}`} className="h-14">
                    {Array.from({length: columnsCount}).map((_, cellIndex) => (
                        <TableCell key={`skeleton-cell-${cellIndex}`} className="py-4">
                            <div className="h-4 w-full animate-pulse rounded bg-muted"/>
                        </TableCell>
                    ))}
                </TableRow>
            ))}
        </>
    );
}