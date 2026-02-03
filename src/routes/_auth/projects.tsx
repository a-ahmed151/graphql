import { DigitalCard } from "@/components/DigitalCard";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useAuth } from "../../auth";
import {
    UserIDsDocument,
    type UserIDsQuery,
    ProjectXpTransactionsDocument,
    type ProjectXpTransactionsQuery,
} from "@/graphql/graphql";
import { GRAPHQL_API } from "@/api/queries/user";
import { useQuery } from "@tanstack/react-query";
import request from "graphql-request";
import { ModeToggle } from "@/components/mode-toggle";
import { ArrowLeft, FolderOpen, CheckCircle, Code } from "lucide-react";
import { formatBytes, linkToProject } from "@/lib/utils";

export const Route = createFileRoute("/_auth/projects")({
    component: ProjectsRoute,
});

function ProjectsRoute() {
    const { userToken } = useAuth();
    const navigate = useNavigate();

    const { data: idsData } = useQuery<UserIDsQuery>({
        queryKey: ["userIDs"],
        queryFn: async () =>
            request(
                GRAPHQL_API,
                UserIDsDocument,
                {},
                { Authorization: `Bearer ${userToken} ` },
            ),
        enabled: !!userToken,
    });

    const firstUser = idsData?.user?.[0];
    const selectedUserId = firstUser?.id;
    const rootEventId = firstUser?.labels?.[0]?.eventId;

    const { data: allProjectsData, isLoading } = useQuery<ProjectXpTransactionsQuery>({
        queryKey: ["allProjects", selectedUserId, rootEventId],
        queryFn: async () =>
            request(
                GRAPHQL_API,
                ProjectXpTransactionsDocument,
                { userId: selectedUserId as number, eventId: rootEventId as number, limit: null },
                { Authorization: `Bearer ${userToken} ` },
            ),
        enabled: !!selectedUserId && !!rootEventId && !!userToken,
    });

    const projects = allProjectsData?.transaction ?? [];

    return (
        <div className="max-w-6xl mx-auto p-4 pb-12 flex flex-col gap-6 min-h-screen">
            {/* Header */}
            <header className="flex justify-between items-center pt-2">
                <button
                    onClick={() => navigate({ to: "/profile" })}
                    className="flex items-center gap-2 text-slate-400 hover:text-primary transition-colors group"
                >
                    <div className="p-2 rounded-full border border-slate-700 group-hover:border-primary/50 transition-colors">
                        <ArrowLeft className="size-4" />
                    </div>
                    <span className="font-mono text-xs uppercase tracking-widest hidden sm:block">Back to Control</span>
                </button>
                <h1 className="font-bold text-xl uppercase tracking-widest text-foreground flex items-center gap-2">
                    Projects<span className="text-primary font-mono opacity-50">.Log</span>
                </h1>
                <ModeToggle />
            </header>

            {/* Grid Header Info */}
            <div className="flex items-center justify-between px-1 mb-[-10px]">
                <h2 className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.3em]">Validated Repository Units</h2>
                <div className="text-[10px] font-mono text-primary/60 border-b border-primary/20 pb-0.5">STATUS: ALL_SYSTEMS_GO</div>
            </div>

            {/* Projects List - Responsive Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {isLoading && (
                    <div className="col-span-full p-20 text-center flex flex-col items-center gap-4">
                        <div className="size-12 border-2 border-t-primary border-primary/20 rounded-full animate-spin"></div>
                        <p className="text-primary font-mono text-xs tracking-[0.5em] animate-pulse uppercase">Syncing Project Records...</p>
                    </div>
                )}

                {!isLoading && projects.length === 0 && (
                    <div className="col-span-full py-20">
                        <DigitalCard className="p-12 text-center border-dashed border-slate-700 bg-slate-900/10">
                            <FolderOpen className="size-12 text-slate-700 mx-auto mb-4 opacity-30" />
                            <p className="text-slate-500 font-mono text-sm uppercase tracking-widest">No project nodes detected in current sequence.</p>
                        </DigitalCard>
                    </div>
                )}

                {projects.map((proj, i) => {
                    const projectName = proj.path.split("/").pop();
                    const date = new Date(proj.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });

                    return (
                        <DigitalCard key={i} className="group p-5 hover:border-primary/70 transition-all hover:-translate-y-1 relative overflow-hidden bg-card-dark/40">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 -translate-y-1/2 translate-x-1/2 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors"></div>

                            <div className="flex flex-col h-full gap-5 relative z-10">
                                <div className="flex justify-between items-start">
                                    <div className="size-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300">
                                        <Code className="size-6 shadow-[0_0_10px_rgba(13,185,242,0.3)]" />
                                    </div>
                                    <div className="text-right">
                                        <span className="block text-primary font-bold font-mono text-xl tracking-tighter">+{formatBytes(proj.amount)}</span>
                                        <span className="text-[9px] text-slate-500 uppercase font-mono tracking-tighter">XP GAINED</span>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <h3 className="font-bold text-base text-foreground tracking-wide group-hover:text-primary transition-colors truncate">{projectName}</h3>
                                    <div className="flex items-center gap-2 text-[10px] font-mono">
                                        <span className="flex items-center gap-1 text-green-400/80 uppercase">
                                            <CheckCircle className="size-3" />
                                            VALIDATED
                                        </span>
                                        <span className="text-slate-700">•</span>
                                        <span className="text-slate-500 uppercase">{date}</span>
                                    </div>
                                </div>

                                <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
                                    <div className="flex gap-1">
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary/60"></div>
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary/30"></div>
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary/10"></div>
                                    </div>
                                    <a href={linkToProject(proj)} target="_blank" className="text-[9px] font-mono text-slate-400 group-hover:text-primary transition-colors flex items-center gap-1">
                                        VIEW_DETAILS <ArrowLeft className="size-2 rotate-180" />
                                    </a>
                                </div>
                            </div>
                        </DigitalCard>
                    )
                })}
            </div>
        </div>
    );
}
