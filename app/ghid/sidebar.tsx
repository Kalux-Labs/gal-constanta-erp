import Link from "next/link"
import {docs} from "@/lib/docs/get-docs"
import {Button} from "@/components/ui/button";

export default function Sidebar() {
    return (
        <aside className="w-36 md:w-52 border-r p-4 h-svh hidden sm:flex">
            <nav className="flex flex-col gap-1 items-start -ml-4 ">
                {docs.map(doc => (
                    <Button key={doc.slug} asChild variant="ghost">
                        <Link href={`/ghid/${doc.slug}`}>
                            {doc.title}
                        </Link>
                    </Button>
                ))}
            </nav>
        </aside>
    )
}
