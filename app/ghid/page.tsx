import PrevNext from "@/components/docs/prev-next";

export default async function Page() {
    const { default: Post } = await import(`@/content/introducere.mdx`)

    return (
        <div className="flex flex-col">
            <Post />
            <PrevNext slug={"introducere"}/>
        </div>
    )
}