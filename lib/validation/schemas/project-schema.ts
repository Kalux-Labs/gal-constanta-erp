import {z} from "zod";
import {
    beneficiaryIdNameSchema,
    citySchema,
    countySchema,
    defaultStringSchema,
    descriptionSchema,
    nameSchema,
    submeasureSchema,
    zipcodeSchema
} from "@/lib/validation/schemas/common-schemas";

const projectSchema = z.object({
    name: nameSchema,
    description: descriptionSchema,
    submeasure: submeasureSchema,
    financed_at: z.string(),
    implementation_street: z.string().min(3, "Strada este obligatorie").max(150, "Numele străzi nu poate depăși 150 de caractere").regex(/^[A-Za-z0-9ăâîșțĂÂÎȘȚ .,'-]+$/, "Strada poate conține doar litere, cifre și caractere uzuale"),
    implementation_zipcode: zipcodeSchema,
    implementation_details: z.string().nullable(),
    implementation_period: z.coerce.number<number>().int("Perioada exprimată în luni").min(1, "Perioada trebuie să fie de cel puțin o lună").max(120, "Perioada nu poate depăși 120 de luni").refine((val) => val !== 0 && val !== null && val !== undefined, "Valoare invalidă"),
    implementation_county: countySchema,
    implementation_city: citySchema,
    code: z.string().min(1, "Codul este obligatoriu").regex(/^[A-Z0-9]+$/, "Codul poate conține doar litere mari și cifre").length(21, "Codul trebuie să aibă exact 21 de caractere"),
    total_eligible_financing_amount: z.coerce.number<number>().nonnegative("Valoarea trebuie să fie pozitivă").max(1_000_000_000, "Valoarea nu poate depăși 1.000.000.000 RON").refine((val) => val !== 0 && val !== null && val !== undefined, "Valoare invalidă"),
    non_refundable_financing_aid_rate: z.coerce.number<number>().min(0, "Rata trebuie să fie pozitivă").max(100, "Rata nu poate depăși 100 de procente").refine((val) => val !== 0 && val !== null && val !== undefined, "Valoare invalidă"),
    non_refundable_financing_aid_amount: z.coerce.number<number>().nonnegative("Valoarea ajutorului nerambursabil trebuie să fie pozitivă").max(1_000_000_000, "Valoarea nu poate depăși 1.000.000.000 RON").refine((val) => val !== 0 && val !== null && val !== undefined, "Valoare invalidă"),
    beneficiary: beneficiaryIdNameSchema.nullable(),
    objectives: defaultStringSchema,
    results: defaultStringSchema,
}).superRefine((data, ctx) => {
    if (data.implementation_county === null) {
        ctx.addIssue({
            code: 'custom',
            message: "Județul este obligatoriu",
            path: ["implementation_county"],
        });
    }
    if (data.implementation_city === null) {
        ctx.addIssue({
            code: 'custom',
            message: "Localitatea este obligatorie",
            path: ["implementation_city"],
        });
    }
    if (data.beneficiary === null) {
        ctx.addIssue({
            code: 'custom',
            message: "Beneficiarul este obligatoriu",
            path: ["beneficiary"],
        });
    }
    if (data.non_refundable_financing_aid_amount > data.total_eligible_financing_amount) {
        ctx.addIssue({
            code: 'custom',
            message: "Ajutorul financiar nu poate depăși valoarea totală",
            path: ["non_refundable_financing_aid_amount"],
        });
    }
});

type ProjectFormData = z.infer<typeof projectSchema>;

export {projectSchema};
export type {ProjectFormData};