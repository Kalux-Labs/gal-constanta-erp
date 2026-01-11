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
import Link from 'next/link'
import React, {useState} from 'react'
import {z} from "zod";
import {emailSchemaRequired} from "@/lib/validation/schemas/common-schemas";
import {FormProvider, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {toast} from "sonner";
import FormField from "@/components/forms/form-field";
import {BadgeCheck} from "lucide-react";
import {AuthError} from "@supabase/auth-js";

export function ForgotPasswordForm({className, ...props}: React.ComponentPropsWithoutRef<'div'>) {
    const [success, setSuccess] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const formSchema = z.object({
        email: emailSchemaRequired
    });

    type FormData = z.infer<typeof formSchema>;


    const form = useForm<FormData>({
        resolver: zodResolver(formSchema)
    });

    const handleSubmit = async (data: FormData) => {
        const supabase = createClient()
        const {email} = data;
        setIsLoading(true)
        try {
            const {error} = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/auth/update-password`,
            })

            if (error) {
                throw error;
            }

            setSuccess(true)
        } catch (error: unknown) {
            if (error instanceof AuthError) {
                const status = error.status;

                if (status === 429) {
                    form.setError("email", {
                        type: 'custom',
                        message: 'Prea multe încercări.'
                    });
                    toast.error("Prea multe încercări. Vă rugăm reîncercați mai târziu.");
                }
            } else {
                toast.error("Am întâmpinat probleme. Vă rugăm reîncercați mai târziu.");
            }
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className={cn('flex flex-col gap-6', className)} {...props}>
            {success ? (
                <Card className="shadow-xs">
                    <CardHeader>
                        <CardTitle className="text-2xl flex flex-row gap-2 items-center">
                            <BadgeCheck className="text-green-600 h-8 w-8"/>
                            Verifică adresa de e-mail</CardTitle>
                        <CardDescription>Dacă adresa este asociată unui cont, ți-am trimis
                            instrucțiuni.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">
                            Vei primi un e-mail cu pașii necesari pentru resetarea parolei.
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <Card className="shadow-xs">
                    <CardHeader>
                        <CardTitle className="text-2xl">Resetează parola</CardTitle>
                        <CardDescription>
                            Completează cu e-mail-ul și vă vom trimite intrucțiuni de resetare a parolei.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <FormProvider {...form}>
                            <form onSubmit={form.handleSubmit(handleSubmit)}>
                                <div className="flex flex-col gap-6">
                                    <FormField
                                        name="email"
                                        label="E-mail"
                                        type="email"
                                        autocomplete="email"
                                        required
                                        placeholder="exemplu@email.ro"
                                    />
                                    <Button type="submit" className="w-full" disabled={isLoading} loading={isLoading}>
                                        Trimite e-mail de resetare
                                    </Button>
                                </div>
                                <div className="mt-4 text-center text-sm">
                                    Ai deja un cont?{' '}
                                    <Link href="/auth/login" className="underline underline-offset-4">
                                        Autentificare
                                    </Link>
                                </div>
                            </form>
                        </FormProvider>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
