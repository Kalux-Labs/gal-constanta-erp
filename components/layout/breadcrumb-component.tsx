import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function BreadcrumbComponent({
                                                items,
                                            }: {
    items: { href: string; title: string; disabled?: boolean }[];
}) {
    return (
        <Breadcrumb className="mb-0">
            <BreadcrumbList className="flex flex-row gap-2 sm:gap-2.5 text-md font-medium">
                {items.map((item, index) => (
                    <div
                        key={index}
                        className="flex flex-row gap-2 sm:gap-2.5 items-center"
                    >
                        <BreadcrumbItem>
                            <BreadcrumbLink asChild>
                                <Link
                                    href={item.href}
                                    className={cn(
                                        index === items.length - 1 && "text-primary",
                                        item.disabled && "pointer-events-none",
                                    )}
                                    aria-disabled={item.disabled}
                                >
                                    {item.title}
                                </Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        {index < items.length - 1 && <BreadcrumbSeparator />}
                    </div>
                ))}
            </BreadcrumbList>
        </Breadcrumb>
    );
}