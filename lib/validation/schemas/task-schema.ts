import {z} from "zod";
import {
    descriptionSchema,
    idSchema,
    nameSchema,
    quarterSchema,
    recurrencySchema,
    yearSchema
} from "@/lib/validation/schemas/common-schemas";

const baseTaskSchema = z.object({
    name: nameSchema,
    description: descriptionSchema,
    parent_id: idSchema.nullable(),
    start_date: z.string().nullable(),
    end_date: z.string().nullable(),
    recurrency: recurrencySchema,
    done: z.boolean(),
    notify: z.coerce.boolean<boolean>(),
    year: yearSchema,
    quarter: quarterSchema,
}).superRefine((data, ctx) => {
    if (data.start_date && data.end_date) {
        if (new Date(data.start_date) > new Date(data.end_date)) {
            ctx.addIssue({
                code: 'custom',
                message: "Interval invalid",
                path: ["start_date"],
            });

            ctx.addIssue({
                code: 'custom',
                message: "Interval invalid",
                path: ["end_date"],
            });
        }
    }
    if (data.notify) {
        if (data.recurrency.value === "none") {
            if (data.end_date === null || data.end_date === undefined) {
                ctx.addIssue({
                    code: 'custom',
                    message: "Sfârșit de activitate necesar pentru notificare fără recurență",
                    path: ["recurrency"]
                })
            }
        } else {
            if (data.start_date === null || data.start_date === undefined || data.end_date === null || data.end_date === undefined) {
                ctx.addIssue({
                    code: 'custom',
                    message: "Început și sfârșit de activitate necesare pentru notificare recurentă",
                    path: ["recurrency"]
                })
            }
        }
    }
});

const taskSchema = baseTaskSchema.safeExtend({
    children: z.array(baseTaskSchema)
})

type TaskFormData = z.infer<typeof taskSchema>;

export {taskSchema}
export type {TaskFormData};