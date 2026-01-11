import {ProjectPrivate} from "@/lib/types/project";
import React, {useState} from "react";
import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger} from "@/components/ui/sheet";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {format, formatDistanceToNow} from "date-fns";
import {ro} from "date-fns/locale";
import {CalendarClock, History} from "lucide-react";
import {Badge} from "@/components/ui/badge";

interface HistoryFinancialRecordsSheetProps {
    project: ProjectPrivate;
    trigger?: React.ReactNode;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}

export default function HistoryFinancialRecordsSheet({
                                                         project,
                                                         trigger,
                                                         open: externalOpen,
                                                         onOpenChange: externalOnOpenChange
                                                     }: HistoryFinancialRecordsSheetProps) {
    const [internalOpen, setInternalOpen] = useState(false);

    const open = externalOpen !== undefined ? externalOpen : internalOpen;
    const setOpen = externalOnOpenChange || setInternalOpen;

    const formatDateToNow = (date: string) => {
        return formatDistanceToNow(new Date(date), {
            addSuffix: true,
            locale: ro
        });
    }

    const formatDayMonthYear = (dateString: string) => {
        return format(new Date(dateString), "d MMMM yyyy", {locale: ro});
    };

    const formatInstallmentsNumber = (count: number) => {
        if (count > 1) {
            return `${count} trașe`;
        } else {
            return `o tranșă`;
        }
    }

    const formatFinancialRecordType = (index: number) => {
        if (index == 1) {
            return 'Inițială';
        } else {
            return 'Rectificată'
        }
    }

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            {trigger && (
                <SheetTrigger asChild>
                    {trigger}
                </SheetTrigger>
            )}
            <SheetContent
                onInteractOutside={(e) => e.preventDefault()}
                onEscapeKeyDown={(e) => e.preventDefault()}
                className="w-full sm:max-w-lg max-h-full overflow-y-auto pb-4">
                <SheetHeader>
                    <SheetTitle>Istoric depunere declarații</SheetTitle>
                    <SheetDescription>
                        Vizualizează istoricul complet al depunerilor declaraților de eșalonare a depunerii dosarelor
                        cererilor de plată.
                    </SheetDescription>
                </SheetHeader>
                <div className="grid flex-1 auto-rows-min gap-4 px-4">
                    <p className="text-sm font-medium">Valoare totală
                        eligibilă: {project.total_eligible_financing_amount}</p>
                    {project.financial_records.map((financialRecord, index) => (
                        <Card key={financialRecord.id} className="shadow-lg border-l-4 py-0 border-l-primary gap-4">
                            <CardHeader className="text-md font-medium px-4 bg-muted py-4 rounded-xl">
                                <CardTitle className="flex flex-row justify-between items-center">
                                    <p>Depunere declarație nr. {project.financial_records.length - index}</p>
                                    <div className="flex flex-row gap-2">
                                        <Badge variant="outline" className="text-sm">
                                            {formatFinancialRecordType(project.financial_records.length - index)}
                                        </Badge>
                                        <Badge variant="outline" className="text-sm">
                                            {formatInstallmentsNumber(financialRecord.installments.length)}
                                        </Badge>
                                    </div>
                                </CardTitle>
                                <CardDescription className="flex flex-row gap-2 items-center">
                                    <History className="h-4 w-4"/>
                                    {formatDateToNow(financialRecord.created_at)}</CardDescription>
                            </CardHeader>
                            <CardContent className="px-4 grid flex-1 auto-rows-min gap-4 pb-4">
                                {financialRecord.installments.map((installment, index) => (
                                    <Card key={`installment-${index}`} className="shadow-none py-4 px-4 gap-4">
                                        <div className="flex flex-row justify-between items-center">
                                            <Badge variant={"secondary"} className="text-sm">Tranșa {index + 1}</Badge>
                                            <div className="flex flex-row gap-2 items-center text-muted-foreground">
                                                <CalendarClock className="h-4 w-4"/>
                                                <p className="text-sm font-medium">{formatDayMonthYear(installment.date)}</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <p className="text-sm text-muted-foreground">Valoare totală</p>
                                            <p className="text-lg font-bold">{installment.total_amount} RON</p>
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <p className="text-sm text-muted-foreground">Ajutor financiar
                                                nerambursabil</p>
                                            <p className="text-lg font-bold">{installment.total_financial_help} RON</p>
                                        </div>
                                    </Card>
                                ))}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </SheetContent>
        </Sheet>
    )
}