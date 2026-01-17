import * as Sentry from "@sentry/nextjs";

export const runtime = 'nodejs'

import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, validateBody } from "@/lib/server/api/utils";
import { downloadTaskSchema } from "@/lib/validation/schemas/download-task-schema";
import { fetchTasks } from "@/lib/supabase/utils/tasks/tasks.common";
import { renderToBuffer } from '@react-pdf/renderer';
import { format } from 'date-fns';
import {TasksPDFTemplate} from "@/lib/pdf/templates/report";

export async function POST(request: NextRequest) {
    try {
        const auth = await requireAdmin();

        if (auth.error) {
            return auth.error;
        }

        const validation = await validateBody(request, downloadTaskSchema);

        if (validation.error) {
            return validation.error;
        }

        const { supabase } = auth;
        const { export_year, quarters } = validation.data!;

        // Fetch tasks for all quarters
        const results = await Promise.all(
            quarters.map(quarter =>
                fetchTasks(supabase, {
                    year: export_year,
                    quarter: quarter,
                    search: null,
                    done: true,
                })
            )
        );

        // Format data for PDF template
        const quarterData = quarters.map((quarter, index) => ({
            quarter,
            tasks: results[index] || [],
        }));

        // Generate PDF
        const pdfBuffer = await renderToBuffer(TasksPDFTemplate({year: export_year, quarterData: quarterData}));

        const formattedDate = format(new Date(), 'dd_MM_yyyy');
        const fileName = `raport_sarcini_${export_year}_${formattedDate}.pdf`;

        return new NextResponse(new Uint8Array(pdfBuffer), {
            status: 200,
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="${fileName}"`,
                'Content-Length': pdfBuffer.length.toString(),
            },
        });
    } catch (error) {
        Sentry.captureException(error, {
            level: 'error',
            tags: {
                section: 'tasks/download/route.ts',
                action: 'create'
            }
        });
        return NextResponse.json(
            { error: "Eroare internă a serverului" },
            { status: 500 }
        );
    }
}