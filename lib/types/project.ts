import {BeneficiaryPublic, BeneficiaryPrivate} from './beneficiary'
import County from "@/lib/types/county";
import City from "@/lib/types/city";
import FinancialRecord from "@/lib/types/financial-record";

export interface ProjectBase {
    id: number
    name: string
    description: string | null
    financed_at: string

    implementation_street: string
    implementation_zipcode: string | null
    implementation_details: string | null

    financial_records_progress: number

    implementation_county: County
    implementation_city: City

    beneficiary: BeneficiaryPublic

    total_eligible_financing_amount: number
    non_refundable_financing_aid_rate: number
    non_refundable_financing_aid_amount: number
}

export type ProjectPublic = ProjectBase

export interface ProjectPrivate extends ProjectBase {
    code: string
    beneficiary_id: number

    implementation_period: number

    objectives: string | null
    results: string | null

    created_at: string
    updated_at: string

    beneficiary: BeneficiaryPrivate

    financial_records: FinancialRecord[]
    
    submeasure: string
}