
import { useState } from "react";

interface ConfirmConfig {
    title: string;
    description: string;
    actionLabel: string;
    cancelLabel: string;
    variant: "default" | "destructive";
}

export function useConfirmDialog() {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [config, setConfig] = useState<ConfirmConfig>({
        title: "",
        description: "",
        actionLabel: "Confirmă",
        cancelLabel: "Anulează",
        variant: "default",
    });
    const [onConfirmCallback, setOnConfirmCallback] = useState<() => Promise<void>>(() => Promise.resolve());

    const confirm = (
        title: string,
        onConfirm: () => Promise<void>,
        description?: string,
        options?: {
            actionLabel?: string;
            cancelLabel?: string;
            variant?: "default" | "destructive";
        }
    ) => {
        setConfig({
            title,
            description: description || "",
            actionLabel: options?.actionLabel || "Confirmă",
            cancelLabel: options?.cancelLabel || "Anulează",
            variant: options?.variant || "default",
        });
        setOnConfirmCallback(() => onConfirm);
        setOpen(true);
    };

    const handleConfirm = async () => {
        setIsLoading(true);
        try {
            await onConfirmCallback();
            setOpen(false);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        // Nu se închide dacă e în loading
        if (!isLoading) {
            setOpen(false);
        }
    };

    return {
        open,
        setOpen,
        config,
        isLoading,
        confirm,
        handleConfirm,
        handleCancel,
    };
}