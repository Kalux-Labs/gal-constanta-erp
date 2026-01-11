interface FinancialRecordInstallment {
    date: string;
    total_amount: number;
    total_financial_help: number;
}

export default interface FinancialRecord {
    id: number;
    created_at: string;
    project_id: number;
    installments: FinancialRecordInstallment[];
}