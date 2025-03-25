'use client'

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import React from "react";
import {Button} from "@/components/ui/button";

export function ConfirmDialog({
                                  children,
                                  onConfirm,
                                  title = "Вы уверены?",
                                  description = "Это действие нельзя отменить"
                              }: {
    children: React.ReactNode
    onConfirm: () => void
    title?: string
    description?: string
}) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>
                        {description}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button>Отмена</Button>
                    <Button onClick={onConfirm}>
                        Подтвердить
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}