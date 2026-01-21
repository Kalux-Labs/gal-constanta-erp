import * as React from 'react';
import {BeneficiaryPrivate} from "@/lib/types/beneficiary";

type BeneficiaryPrivateEmail = Pick<BeneficiaryPrivate, 'legal_representative' | 'name' | 'email'>;

interface ManualTriggerTemplateProps {
    beneficiary: BeneficiaryPrivateEmail;
    redirectUrl: string;
}

export function ManualTriggerTemplate({beneficiary, redirectUrl}: ManualTriggerTemplateProps) {
    return (
        <div
            style={{
                maxWidth: '600px',
                margin: '0 auto',
                fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                backgroundColor: '#fffffe',
                padding: '32px',
                borderRadius: '12px',
                border: '1px solid #e5e7eb'
            }}
        >
            <h2
                style={{
                    color: '#020817',
                    marginBottom: '16px',
                    fontSize: '24px',
                    fontWeight: '600',
                    letterSpacing: '-0.01em'
                }}
            >
                Notificare privind tranșele de plată
            </h2>

            <p style={{ color: '#334155', fontSize: '15px', lineHeight: '1.6', marginBottom: '16px' }}>
                Bună ziua {beneficiary.legal_representative},
            </p>

            <p style={{color: '#334155', fontSize: '15px', lineHeight: '1.6', marginBottom: '16px'}}>
                Te informăm că există actualizări importante în platforma{' '}
                <strong>Asociației GAL Constanța Centru</strong>.
            </p>

            <p style={{color: '#334155', fontSize: '15px', lineHeight: '1.6', marginBottom: '24px'}}>
                Te rugăm să accesezi platforma pentru a consulta detaliile privind tranșele de plată și alte informații relevante.
            </p>

            <div style={{margin: '32px 0'}}>
                <a
                    href={redirectUrl}
                    style={{
                        backgroundColor: '#000001',
                        color: '#fffffe',
                        textDecoration: 'none',
                        padding: '12px 20px',
                        borderRadius: '8px',
                        fontSize: '15px',
                        fontWeight: '500',
                        display: 'inline-block'
                    }}
                >
                    Accesează platforma
                </a>
            </div>

            <p style={{color: '#64748b', fontSize: '13px', lineHeight: '1.5', marginBottom: '24px'}}>
                Pentru orice întrebări sau clarificări, nu ezita să ne contactezi la adresa de e-mail{' '}
                <a href="mailto:galconstantacentru@gmail.com" style={{ color: '#64748b', textDecoration: 'underline' }}>
                    galconstantacentru@gmail.com
                </a>
                .
            </p>

            <div
                style={{
                    borderTop: '1px solid #e5e7eb',
                    paddingTop: '16px',
                    color: '#475569',
                    fontSize: '14px'
                }}
            >
                Cu stimă,
                <br/>
                <strong style={{color: '#020817'}}>Asociația GAL Constanța Centru</strong>
            </div>
        </div>
    );
}