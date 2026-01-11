import {z} from "zod";
import {
    citySchema,
    countySchema, emailSchema,
    nameSchema, phoneSchema,
    streetSchema,
    zipcodeSchema,
    cuiSchema
} from "@/lib/validation/schemas/common-schemas";

const beneficiarySchema = z.object({
    name: nameSchema,

    cui: cuiSchema,

    county: countySchema,

    city: citySchema,

    street: streetSchema,

    zipcode: zipcodeSchema,

    email: emailSchema,

    phone: phoneSchema,

    bank_account: z.string()
        .min(1, "Contul bancar este obligatoriu")
        .min(13, "Contul bancar trebuie să aibă cel puțin 13 caractere")
        .max(34, "Contul bancar nu trebuie să depășească 34 caractere"),

    legal_representative: z.string()
        .min(1, "Reprezentantul legal este obligatoriu")
        .min(3, "Numele reprezentantului legal trebuie să aibă cel puțin 3 caractere")
        .max(255, "Numele reprezentantului legal nu trebuie să depășească 255 caractere"),
});

type BeneficiaryFormData = z.infer<typeof beneficiarySchema>;

export {beneficiarySchema};
export type {BeneficiaryFormData};