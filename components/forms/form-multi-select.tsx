import {
    Controller,
    type FieldPath,
    type FieldValues,
    useFormContext,
} from "react-hook-form";
import {Check, ChevronsUpDown, Info} from "lucide-react";
import {cn} from "@/lib/utils";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {Label} from "@/components/ui/label";
import React, {useMemo, useState} from "react";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";
import {Skeleton} from "@/components/ui/skeleton";
import {Button} from "@/components/ui/button";

type FormMultiSelectProps<TFieldValues extends FieldValues, T> = {
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
    isLoading?: boolean;

    getId: (item: T) => string | number;
    getLabel: (item: T) => string;

    onSelect?: (value: T[]) => void;
    onSearchChange?: (value: string) => void;

    tooltip?: string;
};

export function FormMultiSelect<TFieldValues extends FieldValues, T>({
                                                                         name,
                                                                         label,
                                                                         placeholder = "Selectează opțiuni",
                                                                         description,
                                                                         options,
                                                                         disabled = false,
                                                                         searchPlaceholder = "Caută...",
                                                                         required = false,
                                                                         onSearchChange,
                                                                         onSelect,
                                                                         hidden = false,
                                                                         showError = false,
                                                                         isLoading = false,
                                                                         getId,
                                                                         getLabel,
                                                                         tooltip,
                                                                     }: FormMultiSelectProps<TFieldValues, T>) {
    const {control, setValue} = useFormContext<TFieldValues>();
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");

    const filteredOptions = useMemo(() => {
        const q = search.toLowerCase();
        return options.filter((o) => getLabel(o).toLowerCase().includes(q));
    }, [options, search, getLabel]);

    return (
        <Controller
            control={control}
            name={name}
            render={({field, fieldState}) => {
                const selectedValues = (field.value as T[]) || [];

                const handleSelect = (itemToAdd: T) => {
                    const isSelected = selectedValues.some(
                        (item) => getId(item) === getId(itemToAdd)
                    );

                    let newValues: T[] | undefined;
                    if (isSelected) {
                        const filtered = selectedValues.filter(
                            (item) => getId(item) !== getId(itemToAdd)
                        );
                        newValues = filtered.length === 0 ? undefined : filtered;
                    } else {
                        newValues = [...selectedValues, itemToAdd];
                    }

                    if (newValues) {
                        newValues.sort((a, b) => getLabel(a).localeCompare(getLabel(b)));
                    }

                    setValue(name, newValues as never, {shouldDirty: true});
                    onSelect?.(newValues || []);
                };

                return (
                    <div className="grid gap-2" hidden={hidden} aria-disabled={disabled}>
                        {label && (
                            <Label
                                htmlFor={name}
                                className={cn(
                                    "flex items-center gap-1",
                                    disabled && "pointer-events-none text-muted-foreground"
                                )}
                            >
                                {label}
                                {required && <span className="text-red-500">*</span>}
                                {tooltip && (
                                    <Tooltip>
                                        <TooltipTrigger type="button">
                                            <Info className="w-4 h-4"/>
                                        </TooltipTrigger>
                                        <TooltipContent>{tooltip}</TooltipContent>
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
                                        "w-full justify-between font-normal",
                                        !field.value && "text-muted-foreground font-regular",
                                        fieldState.error && "border-red-500 bg-red-50",
                                    )}
                                    disabled={disabled}
                                >
                                    {field.value ? getLabel(field.value as T) : placeholder}
                                    <ChevronsUpDown className="opacity-50"/>
                                </Button>
                            </PopoverTrigger>

                            <PopoverContent className="w-full p-0" align="start">
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
                                        <CommandEmpty className="p-0">
                                            {isLoading ? (
                                                <div className="p-2">
                                                    {Array.from({length: 6}).map((_, index) => (
                                                        <Skeleton
                                                            key={index}
                                                            className="h-4 w-full mb-1 last:mb-0"
                                                        />
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="text-center text-sm py-4 text-muted-foreground">
                                                    Fără rezultate.
                                                </div>
                                            )}
                                        </CommandEmpty>

                                        <CommandGroup>
                                            {filteredOptions.map((option) => {
                                                const isSelected = selectedValues.some(
                                                    (item) => getId(item) === getId(option)
                                                );

                                                return (
                                                    <CommandItem
                                                        key={getId(option)}
                                                        value={String(getId(option))}
                                                        onSelect={() => handleSelect(option)}
                                                    >
                                                        <Check
                                                            className={cn(
                                                                "mr-2 h-4 w-4",
                                                                isSelected ? "opacity-100" : "opacity-0"
                                                            )}
                                                        />
                                                        {getLabel(option)}
                                                    </CommandItem>
                                                );
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
                            <p className="text-sm text-red-500">{fieldState.error.message}</p>
                        )}
                    </div>
                );
            }}
        />
    );
}