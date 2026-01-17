import Link from "next/link"
import {docs} from "@/lib/docs/get-docs"
import {Button} from "@/components/ui/button";
import {ArrowLeftIcon, ArrowRightIcon} from "lucide-react";

export default function PrevNext({slug}: {
    slug: string | undefined
}) {

    if (!slug) {
        return null;
    }

    const index = docs.findIndex(d => d.slug === slug)
    const prev = docs[index - 1]
    const next = docs[index + 1]

    return (
        <div className="flex flex-row justify-end lg:justify-between mt-12 gap-4">
            {prev ? (
                <Button asChild variant="secondary">
                    <Link href={`/ghid/${prev.slug}`} className="flex flex-row gap-2">
                        <ArrowLeftIcon className="h-5 w-5"/>
                        <p className="hidden sm:flex">{prev.title}</p>
                    </Link>
                </Button>
            ) : <div/>}

            {next ? (

                <Button asChild variant="secondary">
                    <Link href={`/ghid/${next.slug}`} className="flex flex-row gap-2">
                        <p className="hidden sm:flex">{next.title}</p>
                        <ArrowRightIcon className="h-5 w-5"/>
                    </Link>
                </Button>
            ) : <div/>}
        </div>
    )
}
