import {Controller, type FieldPath, type FieldValues, useFormContext} from "react-hook-form";
import {Label} from "@/components/ui/label";
import {MotionCheckbox} from "@/components/ui/motion-checkbox";

type FormCheckboxProps<TFieldValues extends FieldValues> = {
    name: FieldPath<TFieldValues>;
    label?: string;
    card?: boolean;
    description?: string;
    disabled?: boolean;
    inline?: boolean; // boolean only
};

export function FormMotionCheckbox<TFieldValues extends FieldValues>({
                                                                         name,
                                                                         card = false,
                                                                         disabled,
                                                                         label,
                                                                         description,
                                                                         inline = false,
                                                                     }: FormCheckboxProps<TFieldValues>) {
    const {control} = useFormContext<TFieldValues>();

    return (
        <Controller
            control={control}
            name={name}
            render={({field}) => {
                const processedValue =
                    typeof field.value === "object" &&
                    field.value !== null &&
                    "id" in field.value
                        ? Boolean(field.value.id)
                        : field.value;

                return (
                    <div className="grid gap-2">
                        {/* NON-CARD MODE */}
                        {!card && (
                            <div
                                className={
                                    inline
                                        ? "flex items-center gap-2"
                                        : "grid gap-2"
                                }
                            >
                                {/* Label on top (default) */}
                                {!inline && label && (
                                    <Label htmlFor={name}>{label}</Label>
                                )}

                                {/* Checkbox */}
                                <MotionCheckbox
                                    id={name}
                                    checked={processedValue}
                                    onCheckedChange={field.onChange}
                                    disabled={disabled}
                                    />

                                {/* Inline label (right of checkbox) */}
                                {inline && label && (
                                    <Label htmlFor={name}
                                           className={"after:bg-primary peer-data-[state=checked]:text-primary relative after:absolute after:top-1/2 after:left-0 after:h-px after:w-full after:origin-bottom after:scale-x-0 after:transition-transform after:duration-500 after:ease-in-out peer-data-[state=checked]:after:origin-bottom peer-data-[state=checked]:after:scale-x-100"}>{label}</Label>
                                )}
                            </div>
                        )}

                        {/* CARD MODE (unchanged) */}
                        {card && label && (
                            <Label
                                className="bg-background dark:bg-accent/40 hover:bg-accent dark:hover:bg-input/50 transition flex items-start gap-3 rounded-lg border p-3 has-[[aria-checked=true]]:border-primary has-[[aria-checked=true]]:bg-muted dark:has-[[aria-checked=true]]:border-primary dark:has-[[aria-checked=true]]:bg-muted cursor-pointer"
                            >
                                <MotionCheckbox
                                    id={name}
                                    checked={processedValue}
                                    onCheckedChange={field.onChange}
                                    disabled={disabled}
                                   />
                                <div className="grid gap-1.5 font-normal">
                                    <p className="text-sm leading-none font-medium">
                                        {label}
                                    </p>
                                    {description && (<p className="text-muted-foreground text-sm">
                                        {description}
                                    </p>)}
                                </div>
                            </Label>
                        )}
                    </div>
                );
            }}
        />
    );
}
