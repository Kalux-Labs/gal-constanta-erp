import {Card, CardContent} from "@/components/ui/card";
import {Table2Icon} from "lucide-react";

export default function Title({title}: { title: string}) {
    return <Card className="shadow-none bg-sidebar">
        <CardContent className="flex items-center gap-2">
            <Table2Icon/>
            <h1 className="text-lg font-semibold">{title}</h1>
        </CardContent>
    </Card>
}