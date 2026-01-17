import {ZodApiError} from "@/lib/utils/api";
import {FieldValues, Path, UseFormReturn} from "react-hook-form";

export function assignFormErrors<T extends FieldValues>(
    form: UseFormReturn<T>,
    errors: ZodApiError[]
): void {
    errors.forEach((error) => {
        error.path.forEach((fieldPath) => {
            form.setError(fieldPath as Path<T>, {
                type: error.code,
                message: error.message,
            });
        });
    });
}