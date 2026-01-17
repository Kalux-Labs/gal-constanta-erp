import {Book, Handshake, LucideIcon} from "lucide-react";

export type NavItem = {
    href: string;
    label: string;
    icon?: LucideIcon;
    children?: NavItem[];
}

export const navItems: NavItem[] = [
    {
        href: "#",
        label: "Informații utile",
        children: [
            {
                href: "https://www.galconstantacentru.ro/contact",
                label: "Contact"
            },
            {
                href: "https://www.galconstantacentru.ro/articol/17-prezentarea-generala",
                label: "Despre GAL"
            },
            {
                href: "https://www.galconstantacentru.ro/categorie/3-strategie",
                label: "Strategie"
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
            },
            {
                href: "/politica-de-confidentialitate",
                label: "Politică de confidențialitate",
                icon: Handshake
            },
            {
                href: "/ghid",
                label: "Ghid de utilizare",
                icon: Book
            }
        ]
    }
]