import {Handshake, LucideIcon} from "lucide-react";

export type NavItem = {
    href: string;
    label: string;
    icon?: LucideIcon;
    children?: NavItem[];
}

export const businessNavItemList: NavItem[] = [
    {
        href: "#",
        label: "Business",
        children: [
            {
                href: "/business",
                label: "Pentru companii"
            }
        ]
    },
    {
        href: "#",
        label: "Resurse",
        children: [
            {
                href: "/termeni-si-conditii",
                label: "Termeni si conditii",
                icon: Handshake
            }
        ]
    }
]