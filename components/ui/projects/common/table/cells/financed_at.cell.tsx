import { Badge } from "@/components/ui/badge"
import { format, parseISO } from "date-fns"
import { ro } from "date-fns/locale"

export default function FinancedAtCell({ date }: { date: string }) {
    const formattedDate = format(parseISO(date), "dd MMMM yyyy", { locale: ro })

    return <Badge variant="outline">{formattedDate}</Badge>
}
