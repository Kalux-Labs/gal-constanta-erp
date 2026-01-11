import {Controller, type FieldPath, type FieldValues, useFormContext} from "react-hook-form";
import {Checkbox} from "@/components/ui/checkbox";
import {Label} from "@/components/ui/label";

type FormCheckboxProps<TFieldValues extends FieldValues> = {
    name: FieldPath<TFieldValues>;
    label?: string;
    card?: boolean;
    description?: string;
    disabled?: boolean;
};

export function FormCheckbox<TFieldValues extends FieldValues>({
                                                                   name,
                                                                   card = false,
                                                                   disabled,
                                                                   label,
                                                                   description
                                                               }: FormCheckboxProps<TFieldValues>) {
    const {control} = useFormContext<TFieldValues>();

    return (<Controller
            control={control}
            name={name}
            render={({field}) => {
                const processedValue = typeof field.value === "object" && field.value !== null && "id" in field.value
                    ? Boolean(field.value.id)
                    : field.value;

                return <div className="grid gap-2">
                    {!card && label && (
                        <Label htmlFor={name}>
                            {label}
                        </Label>
                    )}
                    {!card && <Checkbox
                        id={name}
                        checked={processedValue}
                        onCheckedChange={field.onChange}
                        disabled={disabled}
                    />}
                    {card && label && (
                        <Label
                            className="bg-background dark:bg-accent/40 hover:bg-accent dark:hover:bg-input/50 transition flex items-start gap-3 rounded-lg border p-3 has-[[aria-checked=true]]:border-primary has-[[aria-checked=true]]:bg-muted dark:has-[[aria-checked=true]]:border-primary dark:has-[[aria-checked=true]]:bg-muted cursor-pointer">
                            <Checkbox
                                id={name}
                                checked={processedValue}
                                onCheckedChange={field.onChange}
                                disabled={disabled}
                            />
                            <div className="grid gap-1.5 font-normal">
                                <p className="text-sm leading-none font-medium">
                                    {label}
                                </p>
                                <p className="text-muted-foreground text-sm">
                                    {description}
                                </p>
                            </div>
                        </Label>
                    )}
                </div>
            }}
        />
    )
}