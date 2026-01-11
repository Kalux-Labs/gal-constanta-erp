import County from "@/lib/types/county";
import City from "@/lib/types/city";
import {MapPin} from "lucide-react";

export default function LocationCell({county, city}: {
    county: County,
    city: City,
}) {
    return <div className="flex flex-row items-start gap-1 min-w-[120px]">
        <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5"/>
        <div className="flex-1 min-w-0">
            <p>{city.name}</p>
            <p className="text-xs text-muted-foreground">{county.name}</p>
        </div>
    </div>
}