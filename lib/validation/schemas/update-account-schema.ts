import {z} from "zod";
import {emailSchema, nameSchema} from "@/lib/validation/schemas/common-schemas";

export const updateAccountSchema = z.object({
    email: emailSchema,
    displayName: nameSchema,
});

export type UpdateAccountFormData = z.infer<typeof updateAccountSchema>;
