import {
    Controller,
    type FieldPath,
    type FieldValues,
    useFormContext,
} from "react-hook-form";
import { Label } from "@/components/ui/label";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp";

type FormFieldProps<TFieldValues extends FieldValues> = {
    name: FieldPath<TFieldValues>;
    label?: string;
    disabled?: boolean;
};

export default function OTPFormField<TFieldValues extends FieldValues>({
                                                                           name,
                                                                           label,
                                                                           disabled = false,
                                                                       }: FormFieldProps<TFieldValues>) {
    const { control } = useFormContext<TFieldValues>();

    return (
        <Controller
            control={control}
            name={name}
            render={({ field, fieldState }) => (
                <div className="grid gap-3">
                    <div className="flex items-center gap-1">
                        {label && <Label htmlFor={name}>{label}</Label>}
                        <span className="text-red-500">*</span>
                    </div>
                    <InputOTP maxLength={6} {...field} disabled={disabled}>
                        <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                        </InputOTPGroup>
                    </InputOTP>
                    {fieldState.error && (
                        <p className="text-sm text-red-500">{fieldState.error.message}</p>
                    )}
                </div>
            )}
        />
    );
}