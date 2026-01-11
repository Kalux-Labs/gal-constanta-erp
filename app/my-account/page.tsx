import {createClient} from "@/lib/supabase/server";
import {redirect} from "next/navigation";
import {CalendarCheck, FolderOpen, UsersIcon} from "lucide-react";
import NavigationCard from "@/components/cards/navigation-card";
import ActionsCard from "@/components/cards/actions-card";

export default async function MyAccount() {
    const supabase = await createClient()

    const {data, error} = await supabase.auth.getClaims()
    if (error || !data?.claims) {
        redirect('/auth/login');
    }

    const email = data?.claims?.email;
    const displayName = data?.claims?.displayName ?? data?.claims?.user_metadata?.displayName;
    const isAdmin = data?.claims?.user_role === 'admin';

    const projectsDisplayedTitle = isAdmin ? "Proiectele" : "Proiectele mele";
    const projectsActionLabel = isAdmin ? "Către proiectele" : "Către proiectele mele";

    return (
        <div className="max-w-4xl mx-auto mb-8 flex flex-col gap-4 px-4">
            <div>
                <h1 className="font-medium text-2xl">Contul meu</h1>
                <p className="text-muted-foreground">Accesează rapid informațiile și instrumentele contului tău.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <ActionsCard
                    title="Acțiuni rapide"
                    description="Operațiuni frecvente"
                    body="Accesează rapid cele mai utilizate funcționalități ale contului tău."
                    icon="zap"
                    actions={[
                        {
                            label: "Adaugă un nou proiect",
                            href: "/my-account/projects?new=1",
                            variant: "default",
                            icon: "plus"
                        },
                        {
                            label: "Adaugă un nou beneficiar",
                            href: "/my-account/beneficiaries?new=1",
                            variant: "default",
                            icon: "plus"
                        },
                    ]}/>
                <NavigationCard
                    title={projectsDisplayedTitle}
                    description="Administrare proiecte"
                    body="Vizualizează, organizează și gestionează toate proiectele tale într-un singur loc."
                    href="/my-account/projects"
                    actionLabel={projectsActionLabel}
                    icon={FolderOpen}
                />
                <NavigationCard
                    title="Beneficiari"
                    description="Administrare beneficiari"
                    body="Accesează și gestionează rapid informațiile beneficiarilor pe care îi reprezinți."
                    href="/my-account/beneficiaries"
                    actionLabel="Către beneficiari"
                    icon={UsersIcon}
                />
                {isAdmin && (
                    <NavigationCard
                        title="Planificator"
                        description="Administrează planificările și alertele"
                        body="Accesează și gestionează rapid informațiile despre planificări și alertele acestora."
                        href="/protected"
                        actionLabel="Către planificator"
                        icon={CalendarCheck}
                    />
                )}
                <ActionsCard
                    title="Contul meu"
                    description="Informații personale"
                    body="Actualizează datele contului și gestionează setările tale personale."
                    icon="user"
                    email={email}
                    displayName={displayName}
                    actions={[
                        {
                            label: "Actualizează datele",
                            actionType: "openUpdateAccountDialog",
                            variant: "outline",
                            icon: "userPen",
                        },
                        {
                            label: "Deconectare",
                            actionType: "logout",
                            variant: "outline",
                            icon: "logOut"
                        }
                    ]}/>
            </div>
        </div>
    )
}