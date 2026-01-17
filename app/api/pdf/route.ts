/* eslint-disable @typescript-eslint/no-explicit-any */
import {ProjectPrivate} from "@/lib/types/project";

export const runtime = 'nodejs'

import {NextRequest, NextResponse} from "next/server";
import {renderToBuffer} from '@react-pdf/renderer';
import {FormTemplate} from "@/lib/pdf/templates/form";
import {format} from "date-fns";
import {requireAuth} from "@/lib/server/api/utils";
import * as Sentry from "@sentry/nextjs";

export async function POST(request: NextRequest) {
    try {
        const auth = await requireAuth();

        if (auth.error) {
            return auth.error;
        }

        const data: ProjectPrivate = await request.json();
        const now = Date.now();
        const formattedDate = format(now, 'dd_MM_yyyy')

        const pdfBuffer = await renderToBuffer(FormTemplate({data}))

        return new Response(new Uint8Array(pdfBuffer), {
            status: 200,
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename=declaratie_de_esalonare_${data.code}_${formattedDate}.pdf`,
                'Content-Length': pdfBuffer.length.toString(),
            },
        });
    } catch (error: any) {
        Sentry.captureException(error, {
            level: 'error',
            tags: {
                section: 'api/pdf/route.ts',
                action: 'create'
            }
        });
        return NextResponse.json(
            {error: "Eroare internă a serverului"},
            {status: 500}
        );
    }
}