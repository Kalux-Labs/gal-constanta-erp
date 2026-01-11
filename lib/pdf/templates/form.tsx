import {Document, Page, Text, View, StyleSheet, Font, DocumentProps} from '@react-pdf/renderer';
import {ProjectPrivate} from '@/lib/types/project';
import {format} from 'date-fns';
import {ro} from 'date-fns/locale';
import React from "react";

Font.register({
    family: 'Roboto',
    fonts: [
        {
            src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf',
        },
        {
            src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf',
            fontWeight: 'bold',
        },
    ],
});

const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontSize: 11,
        fontFamily: 'Roboto',
        lineHeight: 1.5,
    },
    header: {
        marginBottom: 30,
        borderBottom: 2,
        borderBottomColor: '#333',
        paddingBottom: 10,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 10,
        color: '#666',
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
        borderBottom: 1,
        borderBottomColor: '#ddd',
        paddingBottom: 4,
    },
    row: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    label: {
        fontSize: 10,
        color: '#666',
        width: '40%',
        fontWeight: 'bold',
    },
    value: {
        fontSize: 10,
        width: '60%',
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#f0f0f0',
        paddingVertical: 6,
        paddingHorizontal: 10,
        fontWeight: 'bold',
        fontSize: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    tableRow: {
        flexDirection: 'row',
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        fontSize: 9,
    },
    tableCell: {
        flex: 1, // all cells use flex, will adjust individually in JSX if needed
        textAlign: 'left',
    },
    tableCellCenter: {
        flex: 1,
        textAlign: 'left',
    },
    tableCellRight: {
        flex: 1,
        textAlign: 'right',
    },
    recordHeader: {
        backgroundColor: '#e8e8e8',
        padding: 6,
        marginTop: 10,
        marginBottom: 5,
        fontSize: 10,
        fontWeight: 'bold',
    },
    installmentRow: {
        flexDirection: 'row',
        paddingVertical: 6,
        paddingHorizontal: 15,
        borderBottom: 1,
        borderBottomColor: '#f0f0f0',
        fontSize: 9,
    },
    footer: {
        position: 'absolute',
        bottom: 30,
        left: 40,
        right: 40,
        textAlign: 'center',
        fontSize: 8,
        color: '#999',
        borderTop: 1,
        borderTopColor: '#ddd',
        paddingTop: 10,
    },
});

interface FormDocumentProps {
    data: ProjectPrivate;
}

export function FormTemplate({data}: FormDocumentProps) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('ro-RO', {
            style: 'currency',
            currency: 'RON',
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return format(new Date(dateString), 'd MMMM yyyy', {locale: ro});
    };

    const formatPercentage = (rate: number) => {
        return `${rate}%`;
    };

    // Calculate totals from all financial records
    const financialTotals = data.financial_records?.reduce(
        (acc, record) => {
            const recordTotals = record.installments.reduce(
                (installmentAcc, installment) => ({
                    totalAmount: installmentAcc.totalAmount + installment.total_amount,
                    totalHelp: installmentAcc.totalHelp + installment.total_financial_help,
                }),
                {totalAmount: 0, totalHelp: 0}
            );
            return {
                totalAmount: acc.totalAmount + recordTotals.totalAmount,
                totalHelp: acc.totalHelp + recordTotals.totalHelp,
            };
        },
        {totalAmount: 0, totalHelp: 0}
    ) || {totalAmount: 0, totalHelp: 0};

    const isInitial = data.financial_records?.length === 0;
    const lastFinancialRecord = data.financial_records
        ?.slice()
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .at(0);
    const type = isInitial ? "INITIALA" : "RECTIFICATA"

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.title}>DECLARATIA DE ESALONARE A DEPUNERII DOSARELOR CERERILOR DE PLATA</Text>
                    <Text style={styles.subtitle}>Formularul AP 0.1 | Submasura {data.submeasure} | {type}</Text>
                </View>

                {/* Beneficiary Information */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Informatii beneficiar</Text>
                    <View style={styles.row}>
                        <Text style={styles.label}>Nume:</Text>
                        <Text style={styles.value}>{data.beneficiary.name}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>CUI:</Text>
                        <Text style={styles.value}>{data.beneficiary.cui}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Reprezentant legal:</Text>
                        <Text style={styles.value}>{data.beneficiary.legal_representative}</Text>
                    </View>
                </View>

                {/* Project Details */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Detalii proiect</Text>
                    <View style={styles.row}>
                        <Text style={styles.label}>Titlul proiectului:</Text>
                        <Text style={styles.value}>{data.name}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Cod contract de finantare:</Text>
                        <Text style={styles.value}>{data.code}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Data contract de finantare:</Text>
                        <Text style={styles.value}>{formatDate(data.financed_at)}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Perioada de implementare:</Text>
                        <Text style={styles.value}>{data.implementation_period} luni</Text>
                    </View>
                </View>

                {/* Financial Information */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Informatii financiare</Text>
                    <View style={styles.row}>
                        <Text style={styles.label}>Valoare totală eligibilă:</Text>
                        <Text style={styles.value}>
                            {formatCurrency(data.total_eligible_financing_amount)}
                        </Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Rată ajutor nerambursabil:</Text>
                        <Text style={styles.value}>
                            {formatPercentage(data.non_refundable_financing_aid_rate)}
                        </Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Suma ajutor nerambursabil:</Text>
                        <Text style={styles.value}>
                            {formatCurrency(data.non_refundable_financing_aid_amount)}
                        </Text>
                    </View>
                </View>

                {/* Financial Records */}
                {data.financial_records && data.financial_records.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Transe de plata</Text>

                        {
                            lastFinancialRecord && (
                                <View key={lastFinancialRecord.id}>
                                    {/* Installments Table */}
                                    <View style={styles.tableHeader}>
                                        <Text style={[styles.tableCellCenter, {flex: 0.5}]}>Nr.</Text>
                                        <Text style={[styles.tableCellCenter, {flex: 2}]}>Data transei</Text>
                                        <Text style={[styles.tableCellCenter, {flex: 1.5}]}>Valoare totală</Text>
                                        <Text style={[styles.tableCellCenter, {flex: 1.5}]}>Ajutor financiar</Text>
                                    </View>

                                    {lastFinancialRecord.installments.map((installment, installmentIndex) => (
                                        <View key={installmentIndex} style={styles.tableRow}>
                                            <Text style={[styles.tableCellCenter, {flex: 0.5}]}>
                                                {installmentIndex + 1}
                                            </Text>
                                            <Text style={[styles.tableCellCenter, {flex: 2}]}>
                                                {formatDate(installment.date)}
                                            </Text>
                                            <Text style={[styles.tableCellCenter, {flex: 1.5}]}>
                                                {formatCurrency(installment.total_amount)}
                                            </Text>
                                            <Text style={[styles.tableCellCenter, {flex: 1.5}]}>
                                                {formatCurrency(installment.total_financial_help)}
                                            </Text>
                                        </View>
                                    ))}
                                </View>
                            )
                        }
                        {/* Financial Summary */}
                        <View style={[styles.tableHeader, {marginTop: 10, backgroundColor: '#d0d0d0'}]}>
                            <Text style={[styles.tableCell, {flex: 1.5}]}>Total</Text>
                            <Text style={styles.tableCell}>
                                {formatCurrency(financialTotals.totalAmount)}
                            </Text>
                            <Text style={styles.tableCell}>
                                {formatCurrency(financialTotals.totalHelp)}
                            </Text>
                        </View>
                    </View>
                )}

                {/* Footer */}
                <View style={styles.footer}>
                    <Text>
                        Document generat la {formatDate(new Date().toISOString())}
                    </Text>
                </View>
            </Page>
        </Document>
    ) as React.ReactElement<DocumentProps>;
}