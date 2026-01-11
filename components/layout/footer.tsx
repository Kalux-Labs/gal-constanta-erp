import Link from "next/link";
import { businessNavItemList } from "@/lib/utils/nav-items";
import { Separator } from "@/components/ui/separator";
import {CONSTANTS} from "@/lib/utils/constants";

export default function Footer() {
    return (
        <footer className="bg-primary/5 py-12 text-sm text-muted-foreground border-t">
            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-4 text-center sm:text-left px-4">
                {/* Top: logo */}
                <div className="col-span-1 md:col-span-4 order-1">
                    <div className="font-bold text-lg text-primary">
                        <Link href="/">{CONSTANTS.PRODUCT_NAME}</Link>
                    </div>
                </div>

                {/* Left: company info */}
                <div className="col-span-1 md:col-span-2 flex flex-col order-3 md:order-2">
                    <p className="text-muted-foreground text-sm">
                        {CONSTANTS.PRODUCT_DESCRIPTION}
                    </p>
                    <div className="w-24 my-3 mx-auto sm:mx-0">
                        <Separator />
                    </div>
                    <p className="text-muted-foreground text-sm">
                        &copy; {new Date().getFullYear()} Kalux Labs. Toate
                        drepturile rezervate.
                    </p>
                    <p className="text-muted-foreground text-sm">
                        Dezvoltat de{" "}
                        <Link href="https://kaluxlabs.com/" target="_blank">
                            Kalux Labs
                        </Link>
                        .
                    </p>
                </div>

                {/* Right: quick links */}
                <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 order-2 md:order-3">
                    {businessNavItemList.map((item, i) => (
                        <div key={i}>
                            <h4 className="font-semibold mb-2 text-foreground">
                                {item.label}
                            </h4>
                            <ul className="space-y-1">
                                {item.children?.map((child, i) => (
                                    <li key={i}>
                                        <Link
                                            href={child.href}
                                            className="hover:text-foreground transition-colors"
                                        >
                                            {child.label}
                                        </Link>
                                    </li>
                                ))}
                                {!item.children && (
                                    <li>
                                        <Link
                                            href={item.href}
                                            className="hover:text-foreground transition-colors"
                                        >
                                            {item.label}
                                        </Link>
                                    </li>
                                )}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </footer>
    );
}