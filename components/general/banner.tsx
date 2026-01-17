import {Card, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {ArrowRightIcon, RocketIcon} from "lucide-react";
import {Button} from "@/components/ui/button";
import Link from "next/link";

export default function Banner() {
    return (
        <Card className="shadow-none mt-4 py-4 border-l-4 border-l-primary">
            <CardHeader className="px-4 flex flex-col gap-2">
                <div className="flex flex-row justify-between items-center w-full">
                    <CardTitle className="flex flex-row items-center gap-2 ">
                        <RocketIcon className="h-5 w-5 text-primary"/>
                        Lansare oficială - mesaj comunicativ
                    </CardTitle>
                </div>
                <CardDescription>
                    Platforma Grupului de Acțiune Locală Constanța vine în sprijinul dezvoltării comunității noastre
                    locale.
                </CardDescription>
            </CardHeader>
            <CardFooter className="px-4 flex flex-row gap-4">
                <Button asChild>
                    <Link href="/contul-meu">
                        Către contul meu
                    </Link>
                </Button>
                <Button asChild variant="outline">
                    <Link href="/ghid">
                        Ghid de utilizare
                        <ArrowRightIcon className="h-5 w-5 text-primary"/>
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    );
}