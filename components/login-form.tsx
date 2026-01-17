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
import FormField from "@/components/forms/form-field";
import {toast} from "sonner";

export function LoginForm({className, ...props}: React.ComponentPropsWithoutRef<'div'>) {
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const formSchema = z.object({
        email: emailSchemaRequired,
        password: passwordSchemaRequired,
    })

    type FormData = z.infer<typeof formSchema>;

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
    })

    const handleSubmit = async (data: FormData) => {
        const supabase = createClient();
        const {email, password} = data;
        setIsLoading(true);
        try {
            const {error} = await supabase.auth.signInWithPassword({
                email,
                password
            });

            if (error) {
                throw error;
            }

            router.push('/contul-meu')
        } catch(error: unknown) {
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
            <Card className="shadow-none">
                <CardHeader>
                    <CardTitle className="text-2xl">Intră în cont</CardTitle>
                    <CardDescription>Introduceți adresa de email și parola.</CardDescription>
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
                                    autocomplete="current-password"
                                    forgotPassword="/auth/forgot-password"
                                    required
                                />
                                <Button type="submit" className="w-full" disabled={isLoading} loading={isLoading}>
                                    Autentificare
                                </Button>
                            </div>
                            <div className="mt-4 text-center text-sm">
                                Nu ai cont?{' '}
                                <Link href="/auth/sign-up" className="underline underline-offset-4">
                                    Înregistrează-te
                                </Link>
                            </div>
                        </form>
                    </FormProvider>
                </CardContent>
            </Card>
        </div>
    )
}