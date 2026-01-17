"use client";

import {Menu, UserIcon} from "lucide-react";
import Link from "next/link";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import {Button} from "@/components/ui/button";

import {
    NavigationMenu,
} from "@/components/ui/navigation-menu";
import React from "react";
import {CONSTANTS} from "@/lib/utils/constants";
import {ModeToggle} from "@/components/mode-toggle";

export default function Header() {
    const [open, setOpen] = React.useState(false);

    return (
        <header className="py-3 border-b fixed top-0 left-0 bg-background z-50 w-full">
            <div className="flex flex-row justify-between items-center max-w-4xl mx-auto px-4">
                <Link
                    href="/"
                    className="text-xl font-bold text-primary select-none"
                >
                    {CONSTANTS.PRODUCT_NAME}
                </Link>

                {/* Desktop Nav */}
                <NavigationMenu viewport={false} className="hidden md:flex gap-4 z-20">
                    <ModeToggle/>
                    <Button asChild>
                        <Link href="/contul-meu">
                            <UserIcon/>
                            Contul meu</Link>
                    </Button>
                </NavigationMenu>

                {/* Mobile Menu Button */}
                <div className="md:hidden select-none flex flex-row gap-4">
                    <ModeToggle/>
                    <Sheet open={open} onOpenChange={setOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <Menu className="h-6 w-6"/>
                            </Button>
                        </SheetTrigger>
                        <SheetContent
                            side="right"
                        >
                            <SheetHeader>
                                <SheetTitle>Acțiuni autorizate</SheetTitle>
                                <SheetDescription>Accesează funcțiile disponibile pentru contul tău.</SheetDescription>
                            </SheetHeader>
                            <div className="grid flex-1 auto-rows-min px-4">
                                <Button asChild>
                                    <Link href="/contul-meu" onClick={() => setOpen(false)}>
                                        <UserIcon/>
                                        Contul meu</Link>
                                </Button>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    );
}
