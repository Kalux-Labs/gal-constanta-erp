import {z} from "zod";
import {quarterSchema, yearSchema} from "@/lib/validation/schemas/common-schemas";

export const taskQuerySchema = z.object({
    year: z.coerce.number<number>().min(1900).max(2100),
    quarter: quarterSchema,
    search: z.string().nullable(),
    isDone: z.object({
        value: z.enum(["all", "false", "true"]),
        label: z.string()
    }),
})

export const taskQueryGETSchema = z.object({
    year: yearSchema,
    quarter: z.coerce.number().pipe(quarterSchema),
    search: z.string().nullable(),
    done: z
        .union([
            z.literal("null").transform(() => null),
            z.enum(["true", "false"]).transform(v => v === "true"),
            z.null()
        ])
        .nullable()
        .default(null),
});
