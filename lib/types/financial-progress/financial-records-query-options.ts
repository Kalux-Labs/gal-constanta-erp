export interface FinancialRecordsQueryOptions {
    startDate: string;
    endDate: string;
    startedThreshold?: number;
    advancedThreshold?: number;
    finishedThreshold?: number;
    type?: string;
}