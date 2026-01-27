import {Resend} from "resend";
import {ManualTriggerTemplate} from "@/lib/email/templates/manual-trigger-template";
import {NextRequest, NextResponse} from "next/server";
import {requireAdmin, validateBody} from "@/lib/server/api/utils";
import * as Sentry from "@sentry/nextjs";
import {z} from "zod";
import {emailSchemaRequired, nameSchema} from "@/lib/validation/schemas/common-schemas";
import React from "react";

const resend = new Resend(process.env.RESEND_API_KEY);

const formSchema = z.object({
    email: emailSchemaRequired,
    legal_representative: z.string()
        .min(1, "Reprezentantul legal este obligatoriu")
        .min(3, "Numele reprezentantului legal trebuie să aibă cel puțin 3 caractere")
        .max(255, "Numele reprezentantului legal nu trebuie să depășească 255 caractere"),
    name: nameSchema,
});

export async function POST(request: NextRequest) {
    try {
        const origin = request.headers.get('origin') || request.headers.get('referer')?.split('/').slice(0, 3).join('/');

        const auth = await requireAdmin();
        if (auth.error) {
            return auth.error;
        }

        const validation = await validateBody(request, formSchema);
        if (validation.error) {
            return validation.error;
        }

        const validatedData = validation.data!;

        const {data, error} = await resend.emails.send({
            from: 'Asociatia GAL Constanta Centru <contact@asociatiagalconstantacentru.ro>',
            to: [validatedData.email],
            subject: 'Notificare privind tranșele de plată',
            react: React.createElement(ManualTriggerTemplate, {
                beneficiary: validatedData,
                redirectUrl: `${origin}/contul-meu`
            })
        });

        if (error) {
            Sentry.captureException(error, {
                level: 'error',
                tags: {
                    section: 'api/send/route.ts',
                    action: 'create - resend'
                }
            });
            return NextResponse.json({error: "Eroare la trimiterea emailului"}, {status: 500});
        }

        return NextResponse.json(data);
    } catch (error) {
        Sentry.captureException(error, {
            level: 'error',
            tags: {
                section: 'api/beneficiaries/route.ts',
                action: 'create'
            }
        });
        return NextResponse.json(
            {error: "Eroare internă a serverului"},
            {status: 500}
        );
    }
}