import {z} from "zod";

const financialRecordSchema = z.object({
    project_id: z.number(),

    installments: z
        .array(
            z
                .object({
                    date: z.string(),
                    total_amount: z.coerce.number<number>().nonnegative("Valoarea trebuie să fie pozitivă").max(1_000_000_000, "Valoarea nu poate depăși 1.000.000.000 RON"),
                    total_financial_help: z.coerce.number<number>().nonnegative("Valoarea trebuie să fie pozitivă").max(1_000_000_000, "Valoarea nu poate depăși 1.000.000.000 RON"),
                })
                .refine(
                    (inst) => inst.total_financial_help <= inst.total_amount,
                    {
                        message: "Ajutorul financiar nu poate depăși valoarea totală",
                        path: ["total_financial_help"], // attach error to the correct field
                    }
                )
        )
        .min(1, "Trebuie să existe cel puțin o tranșă")
        .max(10, "Numărul de tranșe nu trebuie să depășească 10"),
});

type FinancialRecordFormData = z.infer<typeof financialRecordSchema>;

export {financialRecordSchema};
export type {FinancialRecordFormData};