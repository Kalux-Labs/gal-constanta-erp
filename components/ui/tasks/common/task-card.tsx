"use client"

import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {BellOff, BellRing, Calendar, CheckCircle2, Circle, CircleMinus, Pencil, PlusCircle, Trash2} from "lucide-react";
import {cn, getRecurrencyIcon, getRecurrencyVariant} from "@/lib/utils";
import {Separator} from "@/components/ui/separator";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";
import {Task} from "@/lib/types/task";
import {RecurrencyOption} from "@/lib/types/recurrency";
import {formatDateMediumFull} from "@/lib/utils/date-formats";
import {useTaskSheet} from "@/lib/hooks/tasks/use-task-sheet";
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuSeparator,
    ContextMenuTrigger
} from "@/components/ui/context-menu";
import React, {useRef, useState} from "react";
import {motion} from "motion/react";
import {useMobile} from "@/hooks/use-mobile";
import {useDeleteTask} from "@/lib/hooks/tasks/use-delete-task";
import {useConfirmDialog} from "@/lib/hooks/use-confirm-dialog";
import ConfirmDialog from "@/components/dialogs/confirm-dialog";
import {useUpdateTask} from "@/lib/hooks/tasks/use-update-task";

export function TaskCard({task}: { task: Task }) {
    const {openTaskSheet} = useTaskSheet();

    return (
        <Card
            className={cn(
                "transition-shadow duration-200 shadow-none shadow-border/70 hover:shadow-lg hover:shadow-border/80 py-4 gap-4",
                task.done && "bg-muted/50",
            )}>
            <TaskContextMenu task={task}>
                <CardHeader
                    className="px-0 mx-4 py-2 hover:bg-muted rounded-md transition-bg duration-200 cursor-pointer select-none"
                    onClick={() => openTaskSheet(task)}>
                    <div className="flex items-center gap-2">
                        <div className="flex items-start gap-2 flex-1 min-w-0">
                            <DoneIcon done={task.done}/>
                            <div className="flex-1 min-w-0">
                                <CardTitle className={cn(
                                    "text-lg font-semibold leading-tight line-clamp-1",
                                    task.done && "line-through text-muted-foreground"
                                )}>
                                    {task.name}
                                </CardTitle>
                            </div>
                        </div>
                        {task.notify && <RecurrencyBadge recurrency={task.recurrency}/>}
                        <NotifyBadge notify={task.notify}/>
                    </div>

                    {task.description && task.description.length > 0 && (
                        <CardDescription className="mt-2 text-sm line-clamp-3">
                            {task.description}
                        </CardDescription>
                    )}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4"/>
                            <span>
                        {task.start_date && formatDateMediumFull(task.start_date)}
                                {task.start_date && task.end_date && " → "}
                                {task.end_date && formatDateMediumFull(task.end_date)}
                    </span>
                        </div>
                        <span className="font-semibold text-sm">Vezi detalii</span>
                    </div>
                </CardHeader>
            </TaskContextMenu>

            {task.children.length > 0 && (
                <CardContent className="pt-0 space-y-3 px-4">

                    <>
                        <Separator/>
                        <div className="flex flex-col gap-2">
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                Activități secundare ({task.children.length})
                            </p>
                            <ul className="flex flex-col gap-2">
                                {task.children.map(child => (
                                    <TaskContextMenu key={child.id} task={child}>
                                        <li
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                openTaskSheet(child);
                                            }}
                                            key={child.id}
                                            className="flex items-start gap-2 text-sm group hover:bg-muted rounded-md transition-bg duration-200 py-2 cursor-pointer select-none"
                                        >
                                            <div className="flex flex-1 flex-col gap-2">

                                                <div className="flex flex-row w-full items-center gap-2">
                                                    <DoneIcon done={child.done}/>
                                                    <span className={cn(
                                                        "block font-medium line-clamp-1 flex-1",
                                                        child.done && "line-through text-muted-foreground"
                                                    )}>
                                                    {child.name}
                                                </span>
                                                    {child.notify && <RecurrencyBadge recurrency={child.recurrency}/>}

                                                    <NotifyBadge notify={child.notify}/>
                                                </div>

                                                {child.description && child.description.length > 0 && (
                                                    <span className={cn(
                                                        "block line-clamp-3",
                                                        child.done && "line-through text-muted-foreground"
                                                    )}>
                                                {child.description}
                                            </span>
                                                )}
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <div className="flex flex-row gap-1 items-center">
                                                        <Calendar className="w-3 h-3"/>
                                                        <span>
                                                    {child.start_date && formatDateMediumFull(child.start_date)}
                                                            {child.start_date && child.end_date && " → "}
                                                            {child.end_date && formatDateMediumFull(child.end_date)}
                                                </span>
                                                    </div>
                                                    <span className="font-semibold text-xs">Vezi detalii</span>
                                                </div>
                                            </div>
                                        </li>
                                    </TaskContextMenu>
                                ))}
                            </ul>
                        </div>
                    </>
                </CardContent>
            )}
        </Card>
    );
}

function RecurrencyBadge({recurrency}: { recurrency: RecurrencyOption }) {
    const Icon = getRecurrencyIcon(recurrency);

    return <Tooltip>
        <TooltipTrigger>
            <Badge
                variant={getRecurrencyVariant(recurrency) as "secondary" | "default" | "outline" | "destructive" | null | undefined}
                className="text-sm"
            >
                <Icon/>
                {recurrency.label}
            </Badge>
        </TooltipTrigger>
        <TooltipContent>
            Tip recurență notificare
        </TooltipContent>
    </Tooltip>
}

function NotifyBadge({notify}: {
    notify: boolean
}) {

    const displayedText = notify ? "Notificări active" : "Notificări inactive"

    return <Tooltip>
        <TooltipTrigger>
            <Badge
                variant={notify ? "outline" : "secondary"}

                className="text-sm rounded-full py-1.5 px-1.5"
            >
                {notify ? <BellRing/> : <BellOff/>}
            </Badge>
        </TooltipTrigger>
        <TooltipContent>
            {displayedText}
        </TooltipContent>
    </Tooltip>
}

function DoneIcon({done}: { done: boolean }) {
    return done ? (
        <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0"/>
    ) : (
        <Circle className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0"/>
    )
}

function TaskContextMenu({task, children}: { task: Task, children: React.ReactNode }) {
    const {openTaskSheet} = useTaskSheet();

    const isMobile = useMobile();
    const [isLongPressed, setIsLongPressed] = useState(false);

    const longPressTimer = useRef<NodeJS.Timeout | null>(null);

    const {mutate: deleteTask} = useDeleteTask();
    const {mutate: updateTask, isPending: isPendingTask} = useUpdateTask(task.id);
    const {open, config, isLoading, handleConfirm, handleCancel, confirm} = useConfirmDialog();

    const handleDeleteClick = () => {
        confirm(
            "Șterge activitatea",
            async () => {
                deleteTask(task.id);
            },
            `Ești sigur că vrei să ștergi activitatea? Această acțiune nu poate fi anulată.`,
            {
                actionLabel: "Șterge",
                cancelLabel: "Anulează",
                variant: "destructive",
            }
        );
    };

    const handleUpdateClick = async () => {
        updateTask({...task, done: !task.done})
    }


    const handlePointerDown = () => {
        if (!isMobile) return;

        longPressTimer.current = setTimeout(() => {
            setIsLongPressed(true);
        }, 400);
    };

    const handlePointerUp = () => {
        if (longPressTimer.current) {
            clearTimeout(longPressTimer.current);
        }
        setIsLongPressed(false);
    };

    const handlePointerLeave = () => {
        if (longPressTimer.current) {
            clearTimeout(longPressTimer.current);
        }
        setIsLongPressed(false);
    };


    return (
        <>
            <ContextMenu>
                <ContextMenuTrigger asChild>
                    <motion.div
                        onPointerUp={handlePointerUp}
                        onPointerDown={handlePointerDown}
                        onPointerLeave={handlePointerLeave}
                        animate={{
                            scale: isLongPressed ? 0.95 : 1,
                            opacity: isPendingTask ? 0.5 : 1,
                        }}
                        transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 17,
                        }}
                        className={cn(
                            isPendingTask && "pointer-events-none"
                        )}
                    >
                        {children}
                    </motion.div>
                </ContextMenuTrigger>

                <ContextMenuContent className="rounded-lg shadow-lg">
                    <ContextMenuItem onClick={handleUpdateClick}>
                        {task.done ? (
                            <>
                                <CircleMinus/>
                                Redeschide
                            </>
                        ) : (
                            <>
                                <CheckCircle2 className="text-green-600"/>
                                Finalizează
                            </>
                        )}
                    </ContextMenuItem>

                    <ContextMenuSeparator/>
                    <ContextMenuItem onClick={() => openTaskSheet(task)}>
                        <Pencil/>
                        Editează
                    </ContextMenuItem>
                    {!task.parent_id && (
                        <ContextMenuItem onClick={() => {
                            openTaskSheet(undefined, {parentId: task.id, year: task.year, quarter: task.quarter});
                        }}>
                            <PlusCircle/>
                            Activitate secundară
                        </ContextMenuItem>
                    )}

                    <ContextMenuSeparator/>
                    <ContextMenuItem onClick={handleDeleteClick} variant="destructive">
                        <Trash2/>
                        Șterge
                    </ContextMenuItem>

                </ContextMenuContent>
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
            </ContextMenu>
        </>
    )
}