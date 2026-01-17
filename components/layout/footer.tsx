import Link from "next/link";
import {navItems} from "@/lib/utils/nav-items";
import {Separator} from "@/components/ui/separator";
import {CONSTANTS} from "@/lib/utils/constants";

import europe from "@/public/europe.svg";
import gov from "@/public/gov.svg";
import Image from "next/image";

export default function Footer() {
    return (
        <footer className="bg-primary/5 space-y-12 py-4 text-sm text-muted-foreground border-t">
            <div
                className="h-14 w-full bg-repeat-x"
                style={{
                    backgroundImage: 'url(/banner.svg)',
                    backgroundSize: 'auto 100%',
                }}
            />
            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-4 text-center sm:text-left px-4">
                <div className="col-span-1 md:col-span-4 order-1">
                    <div className="font-bold text-lg text-primary">
                        <Link href="/">{CONSTANTS.PRODUCT_NAME}</Link>
                    </div>
                </div>

                <div className="col-span-1 md:col-span-2 flex flex-col order-3 md:order-2">
                    <p className="text-muted-foreground text-sm">
                        {CONSTANTS.PRODUCT_DESCRIPTION}
                    </p>
                    <div className="w-24 my-3 mx-auto sm:mx-0">
                        <Separator/>
                    </div>
                    <p className="text-muted-foreground text-sm">
                        &copy; Copyright 2021 - {new Date().getFullYear()} GAL. Toate
                        drepturile rezervate.
                    </p>
                    <p className="text-muted-foreground text-sm">
                        Dezvoltat de{" "}
                        <Link href="https://kaluxlabs.com/" target="_blank">
                            Kalux Labs
                        </Link>
                        .
                    </p>
                    <div className="mt-5 flex flex-col sm:flex-row gap-4 items-start">
                        <Image
                            src={europe}
                            alt={"europe"}
                            width={80}
                            height={80}
                            priority={false}
                            className="rounded-md h-20 w-auto pointer-events-none select-none"
                        />
                        <Image
                            src={gov}
                            alt={"gov"}
                            width={80}
                            height={80}
                            priority={false}
                            className="rounded-md h-20 w-auto pointer-events-none select-none"
                        />
                    </div>
                </div>

                <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 order-2 md:order-3">
                    {navItems.map((item, i) => (
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
            <div
                className="h-14 w-full bg-repeat-x"
                style={{
                    backgroundImage: 'url(/banner.svg)',
                    backgroundSize: 'auto 100%',
                }}
            />
        </footer>
    );
}