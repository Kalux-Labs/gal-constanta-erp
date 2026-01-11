export default interface TasksQueryOptions {
    year: number;
    quarter: 1 | 2 | 3 | 4;
    search?: string | null;
    done?: boolean | null;
}