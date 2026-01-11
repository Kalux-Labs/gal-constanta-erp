"use client"

import {BeneficiaryPrivate} from "@/lib/types/beneficiary";
import ConfirmDialog from "@/components/dialogs/confirm-dialog";
import {Button} from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem, DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {Pencil, Trash2, MoreHorizontal} from "lucide-react";
import {useConfirmDialog} from "@/lib/hooks/use-confirm-dialog";
import {useDeleteBeneficiary} from "@/lib/hooks/beneficiary/use-delete-beneficiary";
import {useState} from "react";
import NewBeneficiarySheet from "@/components/ui/beneficiaries/client/new-beneficiary-sheet";

interface ActionCellProps {
    beneficiary: BeneficiaryPrivate;
}

export default function ActionCell({beneficiary}: ActionCellProps) {
    const [editSheetOpen, setEditSheetOpen] = useState(false);
    const {open, config, isLoading, handleConfirm, handleCancel, confirm} = useConfirmDialog();
    const {mutate: deleteBeneficiary} = useDeleteBeneficiary();

    const handleDeleteClick = () => {
        confirm(
            "Șterge beneficiar",
            async () => {
                await deleteBeneficiary(beneficiary.id)
            },
            `Ești sigur că vrei să ștergi beneficiarul "${beneficiary.name}"? Această acțiune nu poate fi anulată.`,
            {
                actionLabel: "Șterge",
                cancelLabel: "Anulează",
                variant: "destructive",
            }
        );
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

            <NewBeneficiarySheet
                key={beneficiary?.id}
                beneficiary={beneficiary}
                open={editSheetOpen}
                onOpenChange={setEditSheetOpen}
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