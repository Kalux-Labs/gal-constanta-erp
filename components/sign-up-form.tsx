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
import {useRouter} from 'next/navigation'
import React, {useState} from 'react'
import {emailSchemaRequired, passwordSchemaRequired} from "@/lib/validation/schemas/common-schemas";
import {z} from "zod";
import {FormProvider, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {toast} from "sonner";
import FormField from "@/components/forms/form-field";

export function SignUpForm({className, ...props}: React.ComponentPropsWithoutRef<'div'>) {
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const formSchema = z.object({
        email: emailSchemaRequired,
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
        const {email, password} = data;
        setIsLoading(true);
        try {
            const {error} = await supabase.auth.signUp({
                email,
                password,
                options: {
                    emailRedirectTo: `${window.location.origin}/contul-meu`,
                },

            });
            if (error) {
                throw error;
            }

            router.push('/auth/sign-up-success')
        } catch (error: unknown) {
            console.error(error);
            form.setError("email", {
                type: 'server',
                message: 'Credențiale invalide'
            });
            form.setError("password", {
                type: 'server',
                message: 'Credențiale invalide'
            })
            toast.error("Adresa de e-mail sau parola introduse sunt invalide")
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className={cn('flex flex-col gap-6', className)} {...props}>
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">Înregistrare</CardTitle>
                    <CardDescription>Creează un nou cont.</CardDescription>
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
                                <FormField
                                    name="password"
                                    label="Parolă"
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
                                    Înregistrare
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
        </div>
    )
}
