import {z} from "zod";
import {quarterSchema, yearSchema} from "@/lib/validation/schemas/common-schemas";

const downloadTaskSchema = z.object({
    export_year: yearSchema,
    quarters: z.array(quarterSchema).min(1, "Cel puțin un trimestru").max(4, "Maxim 4 trimestre"),
});

type DownloadTaskFormData = z.infer<typeof downloadTaskSchema>;

export {downloadTaskSchema};
export type {DownloadTaskFormData};
