import {
    Controller,
    type FieldPath,
    type FieldValues,
    useFormContext,
} from "react-hook-form";
import {Label} from "@/components/ui/label";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import {Info} from "lucide-react";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import Link from "next/link";

type FormFieldProps<TFieldValues extends FieldValues> = {
    name: FieldPath<TFieldValues>;
    label?: string;
    forgotPassword?: string;
    autocomplete?: string;
    placeholder?: string;
    type?: string;
    disabled?: boolean;
    required?: boolean;
    maxLength?: number;
    hidden?: boolean;
    showError?: boolean;
    tooltip?: string;
    textarea?: boolean;
    readOnly?: boolean;
    onValueChange?: (value: string) => void;
    min?: number;
    max?: number;
    inputMode?: 'text' | 'numeric' | 'decimal' | 'tel' | 'search' | 'email' | 'url';
};

export default function FormField<TFieldValues extends FieldValues>({
                                                                        name,
                                                                        label,
                                                                        forgotPassword,
                                                                        placeholder,
                                                                        autocomplete = "off",
                                                                        type = "text",
                                                                        disabled = false,
                                                                        required = false,
                                                                        maxLength = 255,
                                                                        hidden = false,
                                                                        showError = true,
                                                                        tooltip,
                                                                        textarea = false,
                                                                        readOnly,
                                                                        onValueChange,
                                                                        min,
                                                                        max,
                                                                        inputMode
                                                                    }: FormFieldProps<TFieldValues>) {
    const {control} = useFormContext<TFieldValues>();
    return (
        <Controller
            control={control}
            name={name}
            render={({field, fieldState}) => {
                const handleChange = (value: string) => {
                    field.onChange(value);
                    onValueChange?.(value);
                }

                return (<div className="grid gap-2">
                    <div className="flex items-center gap-1" hidden={hidden}>
                        {label && (
                            <Label
                                htmlFor={name}
                                className="flex items-center gap-1"
                                hidden={hidden}
                            >
                                {label}
                                {required && <span className="text-red-500">*</span>}
                                {tooltip && (
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Info className="w-4 h-4"/>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>{tooltip}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                )}
                            </Label>
                        )}
                        {forgotPassword && (
                            <Link
                                href={forgotPassword}
                                className="ml-auto text-sm underline-offset-4 hover:underline"
                            >
                                Ai uitat parola?
                            </Link>
                        )}
                    </div>
                    {textarea ? (
                        <Textarea
                            id={name}
                            placeholder={placeholder}
                            autoComplete={autocomplete}
                            disabled={disabled}
                            maxLength={maxLength}
                            hidden={hidden}
                            className={"max-h-[150px] bg-white"}
                            readOnly={readOnly}
                            {...field}
                            value={field.value ?? ""}
                            onChange={(e) => handleChange(e.target.value)}
                        />
                    ) : (
                        <Input
                            id={name}
                            placeholder={placeholder}
                            autoComplete={autocomplete}
                            disabled={disabled}
                            maxLength={maxLength}
                            hidden={hidden}
                            readOnly={readOnly}
                            className="bg-white"
                            {...field}
                            type={type}
                            min={min}
                            max={max}
                            value={field.value ?? ""}
                            inputMode={type === 'number' ? 'numeric' : inputMode}
                            pattern={type === 'number' ? '[0-9]' : undefined}
                            onChange={(e) => {
                                const value = e.target.value;
                                if (type === 'number') {
                                    const numeric = Number(value);

                                    if (!Number.isNaN(numeric)) {
                                        if (min != undefined && numeric < min) {
                                            return;
                                        }
                                        if (max != undefined && numeric > max) {
                                            return;
                                        }
                                    }
                                }

                                handleChange(value);
                            }}
                        />
                    )}
                    {fieldState.error && !hidden && showError && (
                        <p className="text-sm text-red-500">{fieldState.error.message}</p>
                    )}
                </div>)
            }}
        />
    );
}