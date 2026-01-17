import PrevNext from "@/components/docs/prev-next";
import {docs} from "@/lib/docs/get-docs";

export default async function Page({params}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params
    const { default: Post } = await import(`@/content/${slug}.mdx`)

    return (
        <div className="flex flex-col">
            <Post />
            <PrevNext slug={slug}/>
        </div>
    )
}

export function generateStaticParams() {
    return docs
}

export const dynamicParams = false