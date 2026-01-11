import {RecurrencyOption, RecurrencyValue} from "@/lib/types/recurrency";

interface BaseTask {
    id: number;
    parent_id: number | null;
    name: string;
    description: string | null;
    start_date: string | null;
    end_date: string | null;
    done: boolean;
    notify: boolean;

    year: number;
    quarter: 1 | 2 | 3 | 4;
    created_at: string;
    updated_at: string;
}

export interface SupabaseTask extends BaseTask {
    recurrency: RecurrencyValue;
    children: SupabaseTask[];
}

export interface Task extends BaseTask {
    children: Task[];
    recurrency: RecurrencyOption;
}