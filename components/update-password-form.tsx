'use client'

import {cn} from '@/lib/utils'
import {createClient} from '@/lib/supabase/client'
import {Button} from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import {useRouter} from 'next/navigation'
import React, {useState} from 'react'
import {passwordSchemaRequired} from "@/lib/validation/schemas/common-schemas";
import {FormProvider, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import {toast} from "sonner";
import FormField from "@/components/forms/form-field";

export function UpdatePasswordForm({className, ...props}: React.ComponentPropsWithoutRef<'div'>) {
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const formSchema = z.object({
        password: passwordSchemaRequired,
        repeatPassword: passwordSchemaRequired,
    }).refine((data) => data.password === data.repeatPassword, {
        message: 'Parolele nu coincid',
        path: ['repeatPassword']
    });

    type FormData = z.infer<typeof formSchema>;

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema)
    });

    const handleSubmit = async (data: FormData) => {
        const supabase = createClient();
        const {password} = data;
        setIsLoading(true);
        try {
            const {error} = await supabase.auth.updateUser({password});

            if (error) {
                throw error;
            }
            router.push('/my-account');
        } catch (error) {
            console.error(error);
            toast.error("S-a produs o eroare de sistem, vă rugăm încercați din nou.")
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className={cn('flex flex-col gap-6', className)} {...props}>
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">Resetează parola</CardTitle>
                    <CardDescription>Introduceți noua parolă.</CardDescription>
                </CardHeader>
                <CardContent>
                    <FormProvider {...form}>
                        <form onSubmit={form.handleSubmit(handleSubmit)}>
                            <div className="flex flex-col gap-6">
                                <FormField
                                    name="password"
                                    label="Parola nouă"
                                    type="password"
                                    autocomplete="new-password"
                                    required
                                />
                                <FormField
                                    name="repeatPassword"
                                    label="Confirmă parola"
                                    type="password"
                                    autocomplete="new-password"
                                    required
                                />
                                <Button type="submit" className="w-full" disabled={isLoading} loading={isLoading}>
                                    Salvează noua parolă
                                </Button>
                            </div>
                        </form>
                    </FormProvider>
                </CardContent>
            </Card>
        </div>
    )
}
