import {useQuery, useQueryClient} from "@tanstack/react-query";
import {getCounties} from "@/lib/supabase/utils/counties/counties.client";

export function useCounties({onlyAllowed}: { onlyAllowed?: boolean } = {onlyAllowed: false}) {
    const queryClient = useQueryClient();

    return useQuery({
        queryKey: ["counties", onlyAllowed],
        queryFn: async () => {
            const counties = await getCounties({
                onlyAllowed: onlyAllowed,
            });

            await queryClient.invalidateQueries({
                queryKey: ["cities"],
            });

            return counties;
        },
    });
}