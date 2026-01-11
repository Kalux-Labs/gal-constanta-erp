import County from "@/lib/types/county";
import City from "@/lib/types/city";

export interface BeneficiaryPublic {
    name: string;
    cui: string;
}

export interface BeneficiaryPrivate extends BeneficiaryPublic {
    id: number;
    county: County
    city: City
    street: string
    zipcode: string | null
    email: string
    phone: string
    bank_account: string
    legal_representative: string
    created_at: string
    updated_at: string
}