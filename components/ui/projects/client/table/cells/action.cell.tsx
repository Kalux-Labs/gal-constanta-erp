"use client"

import ConfirmDialog from "@/components/dialogs/confirm-dialog";
import {Button} from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem, DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {Pencil, Trash2, MoreHorizontal, History, Download} from "lucide-react";
import {toast} from "sonner";
import {useConfirmDialog} from "@/lib/hooks/use-confirm-dialog";
import {useState} from "react";
import {ProjectPrivate} from "@/lib/types/project";
import NewProjectSheet from "@/components/ui/projects/client/new-project-sheet";
import {useDeleteProject} from "@/lib/hooks/project/use-delete-project";
import HistoryFinancialRecordsSheet from "@/components/ui/projects/client/history-financial-records-sheet";
import {format} from "date-fns";
import {downloadPdf} from "@/lib/utils/pdf-download";

interface ActionCellProps {
    project: ProjectPrivate;
}

export default function ActionCell({project}: ActionCellProps) {
    const [editSheetOpen, setEditSheetOpen] = useState(false);
    const [financialRecordsHistorySheetOpen, setFinancialRecordsHistorySheetOpen] = useState(false);
    const {open, config, isLoading, handleConfirm, handleCancel, confirm} = useConfirmDialog();
    const {mutate: deleteProject} = useDeleteProject();

    const handleDeleteClick = () => {
        confirm(
            "Șterge proiect",
            async () => {
                await deleteProject(project.id);
            },
            `Ești sigur că vrei să ștergi acest proiect "${project.name}"? Această acțiune nu poate fi anulată.`,
            {
                actionLabel: "Șterge",
                cancelLabel: "Anulează",
                variant: "destructive",
            }
        );
    };

    const handleDownloadClick = async () => {
        try {
            const formattedDate = format(Date.now(), 'dd_MM_yyyy');
            const filename = `declaratie_de_esalonare_${project.code}_${formattedDate}.pdf`;

            await downloadPdf(project, filename);
            toast.success("Formular descărcat cu succes!");
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Eroare în descărcarea formularului.");
        }
    };

    return (
        <div className="flex flex-row justify-end">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4"/>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                    <DropdownMenuItem
                        onClick={() => setEditSheetOpen(true)}
                        className="flex items-center gap-2 cursor-pointer"
                    >
                        <Pencil className="w-4 h-4"/>
                        <span>Editează</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => setFinancialRecordsHistorySheetOpen(true)}
                        className="flex items-center gap-2 cursor-pointer"
                    >
                        <History className="w-4 h-4"/>
                        <span>Istoric D.E.P.</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => handleDownloadClick()}
                        className="flex items-center gap-2 cursor-pointer"
                    >
                        <Download className="w-4 h-4"/>
                        <span>Descarcă formularul</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator/>
                    <DropdownMenuItem
                        onClick={handleDeleteClick}
                        className="flex items-center gap-2 cursor-pointer text-red-400"
                    >
                        <Trash2 className="w-4 h-4 text-red-400"/>
                        <span>Șterge</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <NewProjectSheet
                project={project}
                open={editSheetOpen}
                onOpenChange={setEditSheetOpen}
            />

            <HistoryFinancialRecordsSheet
                project={project}
                open={financialRecordsHistorySheetOpen}
                onOpenChange={setFinancialRecordsHistorySheetOpen}
            />

            <ConfirmDialog
                open={open}
                onOpenChange={handleCancel}
                title={config.title}
                description={config.description}
                actionLabel={config.actionLabel}
                cancelLabel={config.cancelLabel}
                isLoading={isLoading}
                onConfirm={handleConfirm}
                variant={config.variant}
            />
        </div>
    );
}