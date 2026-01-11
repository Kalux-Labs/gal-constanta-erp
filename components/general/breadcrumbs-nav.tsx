"use client";

import {useMemo} from "react";
import {usePathname} from "next/navigation";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {useTranslations} from "next-intl";

export function useBreadcrumbs() {
    const pathname = usePathname();

    return useMemo(() => {
        if (!pathname) return [];

        const paths = pathname.split("/").filter(Boolean);

        return paths.map((path: string, index: number) => {
            const href = `/${paths.slice(0, index + 1).join("/")}`;
            const label =
                path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, " ");
            const isLast = index === paths.length - 1;

            return {href, label, isLast};
        });
    }, [pathname]);
}

export function BreadcrumbsNav() {
    const breadcrumbs = useBreadcrumbs();
    const t = useTranslations();

    if (breadcrumbs.length <= 0) return null;

    return (
        <Breadcrumb>
            <BreadcrumbList>
                {breadcrumbs.map((breadcrumb) => {
                    const label = t(
                        `sidebar.breadcrumbs.${breadcrumb.label.toLowerCase()}`
                    );

                    return (
                        <BreadcrumbItem key={breadcrumb.href}>
                            {breadcrumb.isLast ? (
                                <BreadcrumbPage>{label}</BreadcrumbPage>
                            ) : (
                                <>
                                    <BreadcrumbLink aria-disabled={true}>{label}</BreadcrumbLink>
                                    <BreadcrumbSeparator className="hidden md:block"/>
                                </>
                            )}
                        </BreadcrumbItem>
                    );
                })}
            </BreadcrumbList>
        </Breadcrumb>
    );
}
