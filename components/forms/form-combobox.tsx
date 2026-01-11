import {
    Controller,
    type FieldPath,
    type FieldValues,
    useFormContext,
} from "react-hook-form";
import {Check, ChevronsUpDown, Info} from "lucide-react";
import {cn} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {Label} from "@/components/ui/label";
import React, {useMemo, useState} from "react";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";

type FormComboboxProps<TFieldValues extends FieldValues, T> = {
    name: FieldPath<TFieldValues>;
    label?: string;
    placeholder?: string;
    description?: string;
    options: T[];
    disabled?: boolean;
    searchPlaceholder?: string;
    required?: boolean;
    hidden?: boolean;
    showError?: boolean;
    variant?: "default" | "dashed";

    getId: (item: T) => string | number;
    getLabel: (item: T) => string;

    onSelect?: (value: T | null) => void;
    onSearchChange?: (value: string) => void;

    tooltip?: string;
};

export function FormCombobox<TFieldValues extends FieldValues, T>({
                                                                      name,
                                                                      label,
                                                                      placeholder = "Alege opțiunea",
                                                                      description,
                                                                      options,
                                                                      disabled = false,
                                                                      searchPlaceholder = "Caută...",
                                                                      required = false,
                                                                      onSearchChange,
                                                                      onSelect,
                                                                      hidden = false,
                                                                      showError = false,
                                                                      variant = "default",
                                                                      getId,
                                                                      getLabel,
                                                                      tooltip
                                                                  }: FormComboboxProps<TFieldValues, T>) {
    const {control, setValue} = useFormContext<TFieldValues>();
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");

    const filteredOptions = useMemo(() => {
        const q = search.toLowerCase();
        return options.filter((o) =>
            getLabel(o).toLowerCase().includes(q)
        );
    }, [options, search, getLabel]);

    return (
        <Controller
            control={control}
            name={name}
            render={({field, fieldState}) => (
                <div className="grid gap-2" hidden={hidden} aria-disabled={disabled}>
                    {label && (
                        <Label htmlFor={name} className={cn( "flex items-center gap-1", disabled && "pointer-events-none text-muted-foreground" )}>
                            {label}
                            {required && <span className="text-red-500">*</span>}
                            {tooltip && (
                                <Tooltip>
                                    <TooltipTrigger type="button">
                                        <Info className="w-4 h-4"/>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        {tooltip}
                                    </TooltipContent>
                                </Tooltip>
                            )}
                        </Label>
                    )}

                    <Popover open={open} onOpenChange={setOpen} modal>
                        <PopoverTrigger asChild>
                            <Button
                                id={name}
                                type="button"
                                variant="outline"
                                role="combobox"
                                className={cn(
                                    "w-full justify-between",
                                    !field.value && "text-muted-foreground",
                                    fieldState.error && "border-red-500 bg-red-50",
                                    variant === "dashed" && "border-dashed"
                                )}
                                disabled={disabled}
                            >
                                {field.value ? getLabel(field.value as T) : placeholder}
                                <ChevronsUpDown className="opacity-50"/>
                            </Button>
                        </PopoverTrigger>

                        <PopoverContent className="p-0 w-full" align="start" side="bottom" avoidCollisions={false}>
                            <Command>
                                <CommandInput
                                    placeholder={searchPlaceholder}
                                    className="h-9"
                                    onValueChange={(value) => {
                                        setSearch(value);
                                        onSearchChange?.(value);
                                    }}
                                />

                                <CommandList>
                                    {filteredOptions.length === 0 && (
                                        <CommandEmpty>Fără rezultate.</CommandEmpty>
                                    )}

                                    <CommandGroup>
                                        {filteredOptions.map((option) => {
                                            return <CommandItem
                                                key={getId(option)}
                                                value={String(getId(option))}
                                                onSelect={() => {
                                                    setValue(name, option as never, {
                                                        shouldDirty: true
                                                    });
                                                    onSelect?.(option);
                                                    setOpen(false);
                                                }}
                                            >
                                                {getLabel(option)}
                                                <Check
                                                    className={cn(
                                                        "ml-auto h-4 w-4",
                                                        field.value &&
                                                        getId(field.value as T) === getId(option)
                                                            ? "opacity-100"
                                                            : "opacity-0"
                                                    )}
                                                />
                                            </CommandItem>
                                        })}
                                    </CommandGroup>
                                </CommandList>
                            </Command>
                        </PopoverContent>
                    </Popover>

                    {description && (
                        <p className="text-sm text-muted-foreground">{description}</p>
                    )}

                    {fieldState.error && showError && !hidden && (
                        <p className="text-sm text-red-500">
                            {fieldState.error.message}
                        </p>
                    )}
                </div>
            )}
        />
    );
}