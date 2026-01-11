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
import DateTimePicker from "@/components/forms/date-time-picker";

type FormDateTimePickerProps<TFieldValues extends FieldValues> = {
    name: FieldPath<TFieldValues>;
    label?: string;
    required?: boolean;
    disabled?: boolean;
    hidden?: boolean;
    showError?: boolean;
    tooltip?: string;
    disablePastDates?: boolean;
    enableHours?: boolean;
    enableMinutes?: boolean;
    onSelect?: () => void;
};

export default function FormDateTimePicker<TFieldValues extends FieldValues>({
                                                                                 name,
                                                                                 label,
                                                                                 required = false,
                                                                                 disabled = false,
                                                                                 hidden = false,
                                                                                 showError = true,
                                                                                 tooltip,
                                                                                 disablePastDates = false,
                                                                                 enableHours = false,
                                                                                 enableMinutes = false,
                                                                                 onSelect,
                                                                             }: FormDateTimePickerProps<TFieldValues>) {
    const {control} = useFormContext<TFieldValues>();

    return (
        <Controller
            control={control}
            name={name}
            render={({field, fieldState}) => (
                <div className="grid gap-2" hidden={hidden}>
                    {label && (
                        <Label htmlFor={name} className="flex items-center gap-1">
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

                    <DateTimePicker
                        field={field}
                        disablePastDates={disablePastDates}
                        enableHours={enableHours}
                        enableMinutes={enableMinutes}
                        onSelect={onSelect}
                        disabled={disabled}
                    />

                    {fieldState.error && showError && (
                        <p className="text-sm text-red-500">{fieldState.error.message}</p>
                    )}
                </div>
            )}
        />
    );
}