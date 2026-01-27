import {z} from "zod";
import {
    citySchema,
    countySchema,
    nameSchema, phoneSchema,
    streetSchema,
    zipcodeSchema,
    cuiSchema, emailSchemaRequired
} from "@/lib/validation/schemas/common-schemas";

const beneficiarySchema = z.object({
    name: nameSchema,

    cui: cuiSchema,

    county: countySchema,

    city: citySchema,

    street: streetSchema,

    zipcode: zipcodeSchema,

    email: emailSchemaRequired,

    phone: phoneSchema,

    bank_account: z.string()
        .min(1, "Contul bancar este obligatoriu")
        .min(13, "Contul bancar trebuie să aibă cel puțin 13 caractere")
        .max(34, "Contul bancar nu trebuie să depășească 34 caractere"),

    legal_representative: z.string()
        .min(1, "Reprezentantul legal este obligatoriu")
        .min(3, "Numele reprezentantului legal trebuie să aibă cel puțin 3 caractere")
        .max(255, "Numele reprezentantului legal nu trebuie să depășească 255 caractere"),
}).refine((data) => data.county !== null, {
    message: "Județul este obligatoriu",
    path: ["county"]
}).refine((data) => data.city !== null, {
    message: "Localitatea este obligatorie",
    path: ["city"]
});

type BeneficiaryFormData = z.infer<typeof beneficiarySchema>;

export {beneficiarySchema};
export type {BeneficiaryFormData};