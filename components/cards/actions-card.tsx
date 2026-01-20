"use client"

import {FolderOpen, X, Settings, User, Users, Zap, Plus, UserPen, LogOut} from "lucide-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import React from "react";
import {useConfirmDialog} from "@/lib/hooks/use-confirm-dialog";
import ConfirmDialog from "@/components/dialogs/confirm-dialog";
import {createClient} from "@/lib/supabase/client";
import {useRouter} from "next/navigation";
import UpdateAccountDialog from "@/components/dialogs/update-account-dialog";

const icons = {
    user: User,
    users: Users,
    userPen: UserPen,
    folder: FolderOpen,
    settings: Settings,
    x: X,
    zap: Zap,
    plus: Plus,
    logOut: LogOut
};

interface ActionItem {
    label: string
    href?: string
    actionType?: "changePassword" | "deleteAccount" | "openUpdateAccountDialog" | "logout"
    variant?: "default" | "outline" | "destructive" | "secondary"
    icon?: keyof typeof icons
}

interface ActionCardProps {
    title: string
    description: string
    body: string
    actions: ActionItem[]
    icon: keyof typeof icons
    email?: string
    displayName?: string
}

export default function ActionsCard({
                                        title,
                                        description,
                                        body,
                                        icon,
                                        actions, email, displayName
                                    }: ActionCardProps) {
    const Icon = icons[icon];

    const {open, config, isLoading, handleConfirm, handleCancel, confirm} = useConfirmDialog();
    const [openUpdateAccountDialog, setOpenUpdateAccountDialog] = React.useState<boolean>(false);
    const supabase = createClient();
    const router = useRouter();

    const handlers = {
        deleteAccount: () => {
        },
        changePassword: () => {
        },
        openUpdateAccountDialog: () => {
            setOpenUpdateAccountDialog(true);
        },
        logout: () => {
            confirm(
                "Deconectează-te",
                async () => {
                    await supabase.auth.signOut();
                    router.push("/auth/login");
                },
                `Ești sigur că vrei să te deconectezi?`,
                {
                    actionLabel: "Deconectare",
                    cancelLabel: "Anulează",
                    variant: "default"
                }
            )
        }
    }

    return (
        <div>
            <Card
                className="flex flex-col transition-shadow duration-200 shadow-xs shadow-border/70 hover:shadow-lg hover:shadow-border/80">
                <CardHeader className="pb-3">
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 rounded-lg bg-primary/10 p-2">
                            <Icon className="h-6 w-6 text-primary"/>
                        </div>

                        <div className="flex-1">
                            <CardTitle className="text-xl font-bold tracking-tight">
                                {title}
                            </CardTitle>
                            <CardDescription>{description}</CardDescription>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="flex-1 pb-4">
                    <p className="text-sm text-muted-foreground">{body}</p>
                </CardContent>

                <CardFooter className="pt-0 flex flex-col gap-2">
                    {actions.map((action, index) => {
                        const {label, href, actionType, variant = "default", icon: actionIcon} = action;
                        const ActionIcon = actionIcon ? icons[actionIcon] : null;
                        if (href) {
                            return (
                                <Button key={index} variant={variant} className="w-full" asChild>
                                    <Link href={href}>
                                        {ActionIcon && <ActionIcon className="h-4 w-4"/>}
                                        {label}</Link>
                                </Button>
                            );
                        }

                        if (actionType) {
                            return (
                                <Button
                                    key={index}
                                    variant={variant}
                                    className="w-full"
                                    size="lg"
                                    onClick={handlers[actionType]}
                                >
                                    {ActionIcon && <ActionIcon className="h-4 w-4"/>}
                                    {label}
                                </Button>
                            )
                        }
                    })}
                </CardFooter>
            </Card>
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
            <UpdateAccountDialog
                open={openUpdateAccountDialog}
                onOpenChange={setOpenUpdateAccountDialog}
                email={email}
                displayName={displayName}
            />
        </div>
    );
}
