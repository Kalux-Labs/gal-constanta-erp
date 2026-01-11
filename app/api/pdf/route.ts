/* eslint-disable @typescript-eslint/no-explicit-any */
import {ProjectPrivate} from "@/lib/types/project";

export const runtime = 'nodejs'

import { NextRequest } from "next/server";
import {renderToBuffer} from '@react-pdf/renderer';
import { FormTemplate } from "@/lib/pdf/templates/form";
import {format} from "date-fns";

export async function POST(request: NextRequest) {
    try {
        const data: ProjectPrivate = await request.json();
        const now = Date.now();
        const formattedDate = format(now, 'dd_MM_yyyy')

        const pdfBuffer = await renderToBuffer(FormTemplate({data}))

        return new Response(new Uint8Array(pdfBuffer), {
            status: 200,
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename=declaratie_de_esalonare_${data.code}_${formattedDate}.pdf`,
            },
        });
    } catch (error: any) {
        return new Response(JSON.stringify({
            error: error.message
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}