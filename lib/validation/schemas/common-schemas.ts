import {z} from "zod";

const idSchema = z.number().int().positive();

const beneficiaryIdNameSchema = z.object({
    id: idSchema,
    name: z.string()
})

const citySchema = z.object({
    id: idSchema,
    county_id: idSchema,
    name: z.string(),
}).nullable().optional().refine(val => val !== null && val !== undefined, "Orașul este obligatoriu");

const countySchema = z.object({
    id: idSchema,
    name: z.string(),
}).nullable().optional().refine(val => val !== null && val !== undefined, "Județul este obligatoriu");

const citySchemaExtended = z.object({
    id: idSchema,
    county_id: idSchema,
    name: z.string(),
    slug: z.string(),
}).nullable().optional().refine(val => val !== null && val !== undefined, "Orașul este obligatoriu");

const countySchemaExtended = z.object({
    id: idSchema,
    name: z.string(),
    slug: z.string(),
}).nullable().optional().refine(val => val !== null && val !== undefined, "Județul este obligatoriu");

const nameSchema = z.string()
    .trim()
    .min(1, "Numele este obligatoriu")
    .max(255, "Numele nu trebuie să depășească 255 de caractere");

const streetSchema = z.string()
    .trim()
    .min(1, "Strada este obligatorie")
    .max(255, "Strada nu trebuie să depășească 255 de caractere");

const zipcodeSchema = z.string()
    .trim()
    .min(1, "Codul poștal este obligatoriu")
    .regex(/^\d+$/, "Codul poștal trebuie să conțină doar cifre")
    .refine(val => val.length === 6, "Codul poștal trebuie să aibă exact 6 cifre")
    .nullable();

const emailSchema = z.string()
    .trim()
    .refine(val => val === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), "Format invalid de e-mail")
    .optional()
    .nullable();

const emailSchemaRequired = z.email({
    error: (issue) => issue.input === undefined ? 'E-mail-ul este obligatoriu' : 'Format invalid de e-mail'
})
    .trim()
    .min(1, "E-mail-ul este obligatoriu")
    .toLowerCase();

const passwordSchemaRequired = z.string({
    error: (issue) => issue.input === undefined ? 'Parola este obligatorie' : 'Format invalid de parolă'
})
    .trim()
    .min(6, "Parola trebuie să conțină cel puțin 6 caractere")
    .max(100, "Parola este prea lungă");

const phoneSchema = z.string()
    .trim()
    .min(1, "Telefonul este obligatoriu")
    .regex(/^[\d\s\-\+\(\)]+$/, "Numărul de telefon conține caractere nevalide")
    .min(10, "Telefonul trebuie să aibă cel puțin 10 caractere");

const cuiSchema = z.string()
    .trim()
    .min(1, "CUI-ul este obligatoriu")
    .regex(/^(RO)?[1-9]\d{1,9}$/i, "CUI-ul este invalid, ex: RO1234 sau 1234")

const submeasureSchema = z.string()
    .trim()
    .min(1, "Submăsura este obligatorie")
    .toLowerCase()
    .regex(
        /^\d{1,2}\.\d{1,2}([a-z]|\.\d{1,2})?$/,
        "Format submăsură invalid"
    )
    .max(10, "Submăsura nu trebuie să depășească 10 caractere");

const quarterSchema = z.union([
    z.literal(1),
    z.literal(2),
    z.literal(3),
    z.literal(4),
]);

const yearSchema = z.coerce.number<number>()
    .int()
    .min(1900)
    .max(2100);

const recurrencySchema = z.object({
    value: z.enum(["weekly", "monthly", "none"], {
        error: () => ({message: "Recurență invalidă"}),
    }),
    label: z.string()
});

const descriptionSchema = z.string()
    .trim()
    .max(500, "Maximum 500 de caractere")
    .nullable();

const defaultStringSchema = z.string()
    .trim()
    .max(255, "Maximum 255 de caractere")
    .nullable()

export {
    beneficiaryIdNameSchema,
    citySchema,
    countySchema,
    citySchemaExtended,
    countySchemaExtended,
    nameSchema,
    streetSchema,
    zipcodeSchema,
    emailSchema,
    phoneSchema,
    cuiSchema,
    idSchema,
    emailSchemaRequired,
    passwordSchemaRequired,
    submeasureSchema,
    quarterSchema,
    yearSchema,
    recurrencySchema,
    descriptionSchema,
    defaultStringSchema
};