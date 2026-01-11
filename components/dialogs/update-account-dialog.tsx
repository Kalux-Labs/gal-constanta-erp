"use client"

import {
    Dialog, DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import {zodResolver} from "@hookform/resolvers/zod";
import FormField from "@/components/forms/form-field";
import {FormProvider, useForm} from "react-hook-form";
import {Button} from "@/components/ui/button";
import {UpdateAccountFormData, updateAccountSchema} from "@/lib/validation/schemas/update-account-schema";
import {useRouter} from "next/navigation";
import {useUpdateUser} from "@/lib/hooks/user/use-update-user";
import {useEffect} from "react";

interface UpdateAccountDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    email?: string;
    displayName?: string;
}

export default function UpdateAccountDialog({
                                                open, onOpenChange,
                                                email, displayName
                                            }: UpdateAccountDialogProps) {

    const router = useRouter();

    const form = useForm<UpdateAccountFormData>({
        resolver: zodResolver(updateAccountSchema),
        defaultValues: {
            email: email,
            displayName: displayName
        }
    })

    const {mutate: updateUser, isPending} = useUpdateUser();

    const onSubmit = async (data: UpdateAccountFormData) => {
        updateUser(data, {
            onSuccess: () => {
                onOpenChange(false);
                router.refresh();
            }
        });
    }

    const handleOnClick = async () => {
        const isValid = await form.trigger();
        if (isValid) {
            await form.handleSubmit(onSubmit)();
        }
    }

    useEffect(() => {
        if (!open) {
            form.clearErrors();
        }

    }, [open, form]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Actualizează datele contului</DialogTitle>
                    <DialogDescription>Modifică numele afișat și alte detalii ale contului tău.</DialogDescription>
                </DialogHeader>

                <FormProvider {...form}>
                    <form className="flex flex-col gap-4">
                        <FormField<UpdateAccountFormData>
                            name="displayName"
                            label="Nume complet"
                            placeholder="Exemplu: Ion Vasile"
                            required
                            maxLength={100}
                            disabled={isPending}
                        />
                        <FormField<UpdateAccountFormData>
                            name="email"
                            label="Email"
                            disabled
                        />
                    </form>
                </FormProvider>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button size="lg" variant="outline">Închide</Button>
                    </DialogClose>
                    <Button
                        size="lg"
                        onClick={handleOnClick}>Actualizează</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}