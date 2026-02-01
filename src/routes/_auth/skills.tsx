import { DigitalCard } from "@/components/DigitalCard";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useAuth } from "../../auth";
import {
  UserIDsDocument,
  type UserIDsQuery,
  UserInfoDocument,
  type UserInfoQuery,
} from "@/graphql/graphql";
import { GRAPHQL_API } from "@/api/queries/user";
import { useQuery } from "@tanstack/react-query";
import request from "graphql-request";
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import { ModeToggle } from "@/components/mode-toggle";
import { ArrowLeft, BookOpen, Star } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_auth/skills")({
  component: SkillsRoute,
});

function SkillsRoute() {
  const { userToken } = useAuth();
  const navigate = useNavigate();

  const { data: idsData } = useQuery<UserIDsQuery>({
    queryKey: ["userIDs"],
    queryFn: async () =>
      request(
        GRAPHQL_API,
        UserIDsDocument,
        {},
        { Authorization: `Bearer ${userToken}` },
      ),
    enabled: !!userToken,
  });

  const firstUser = idsData?.user?.[0];
  const selectedUserId = firstUser?.id;

  const { data: userInfoData } = useQuery<UserInfoQuery>({
    queryKey: ["userInfo", selectedUserId],
    queryFn: async () =>
      request(
        GRAPHQL_API,
        UserInfoDocument,
        { userId: selectedUserId as number },
        { Authorization: `Bearer ${userToken}` },
      ),
    enabled: !!userToken && !!selectedUserId,
  });

  const rawSkills = (userInfoData?.user?.transactions ?? [])
    .map((t: any) => ({
      subject: t.name || (t.type || "").replace("skill_", "").toUpperCase(),
      level: typeof t.level === 'number' ? t.level : (t.amount || 0),
      fullMark: 100,
    }))
    .filter((skill) => skill.level > 0);

  // Categorize for charts (based on user request)
  const techSkillKeys = ['PROG', 'TCP', 'GAME', 'AI', 'STATS', 'BACK-END', 'FRONT-END', 'SYS-ADMIN', 'ALGO'];
  const technologyKeys = ['GO', 'GIT', 'SQL', 'DOCKER', 'UNIX', 'CSS', 'HTML', 'JS'];

  // Helper to find skill level (default to 0 if not found to maintain chart shape if desired, or filter)
  // The user image shows full polygons, suggesting all axes exist even if 0, or maybe they have data.
  // We will map strict keys to ensure the chart looks exactly like the requested categories.

  const getSkillLevel = (key: string) => {
    // Try exact match or partial match (e.g. "GO" matches "GO")
    const found = rawSkills.find(s => s.subject === key || s.subject.includes(key));
    return found ? found.level : 0;
  };

  const technicalSkillsData = techSkillKeys.map(key => ({ subject: key, A: getSkillLevel(key), fullMark: 100 }));
  const technologiesData = technologyKeys.map(key => ({ subject: key, A: getSkillLevel(key), fullMark: 100 }));

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
          <span className="font-mono text-xs uppercase tracking-widest hidden sm:block">Return to Base</span>
        </button>
        <h1 className="font-bold text-xl uppercase tracking-widest text-foreground flex items-center gap-2">
          Skills<span className="text-primary font-mono opacity-50">.Matrix</span>
        </h1>
        <ModeToggle />
      </header>

      {/* Charts Section - Responsive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Technical Skills Chart */}
        <DigitalCard variant="neon" className="p-6 relative overflow-hidden group">
          <div className="absolute inset-0 bg-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="flex items-center justify-between mb-4 relative z-10">
            <h2 className="text-sm font-bold uppercase text-foreground flex items-center gap-2">
              <span className="w-1.5 h-4 bg-purple-500 rounded-sm shadow-[0_0_8px_rgba(168,85,247,0.5)]"></span>
              Core Proficiencies
            </h2>
            <div className="text-[9px] font-mono text-purple-400/70 border border-purple-500/30 px-2 py-0.5 rounded">SYSTEM_ANALYSIS</div>
          </div>
          <div className="h-[300px] w-full flex justify-center relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={technicalSkillsData}>
                <PolarGrid stroke="#3b4e54" strokeOpacity={0.5} />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={{ fill: "#94a3b8", fontSize: 10, fontFamily: "JetBrains Mono", fontWeight: 500 }}
                />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar
                  name="Proficiency"
                  dataKey="A"
                  stroke="#a855f7"
                  strokeWidth={2}
                  fill="#a855f7"
                  fillOpacity={0.3}
                  animationDuration={1500}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </DigitalCard>

        {/* Technologies Chart */}
        <DigitalCard variant="neon" className="p-6 relative overflow-hidden group">
          <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="flex items-center justify-between mb-4 relative z-10">
            <h2 className="text-sm font-bold uppercase text-foreground flex items-center gap-2">
              <span className="w-1.5 h-4 bg-accent rounded-sm shadow-[0_0_8px_rgba(0,255,157,0.5)]"></span>
              Tech Stack Delta
            </h2>
            <div className="text-[9px] font-mono text-accent/70 border border-accent/30 px-2 py-0.5 rounded">STACK_VERIFICATION</div>
          </div>
          <div className="h-[300px] w-full flex justify-center relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={technologiesData}>
                <PolarGrid stroke="#3b4e54" strokeOpacity={0.5} />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={{ fill: "#94a3b8", fontSize: 10, fontFamily: "JetBrains Mono", fontWeight: 500 }}
                />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar
                  name="Stack Depth"
                  dataKey="A"
                  stroke="#00ff9d"
                  strokeWidth={2}
                  fill="#00ff9d"
                  fillOpacity={0.3}
                  animationDuration={1500}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </DigitalCard>
      </div>

      {/* Skills List - Multi-column Database View */}
      <div>
        <div className="flex items-center justify-between mb-4 px-1">
          <h3 className="font-mono text-xs text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
            Skill Repository.DB
          </h3>
          <span className="text-[10px] font-mono text-slate-600">RECORDS_COUNT: {rawSkills.length}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {rawSkills.map((skill, i) => (
            <div key={i} className="group bg-card-dark/40 border border-border/30 p-4 rounded-xl flex items-center justify-between hover:border-primary/50 transition-all hover:bg-card-dark/60">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/5 border border-primary/10 flex items-center justify-center text-primary group-hover:bg-primary/20 transition-all duration-300">
                  <Star className="size-4 group-hover:scale-110 transition-transform" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-foreground tracking-wider group-hover:text-primary transition-colors">{skill.subject}</h4>
                  <div className="w-20 h-1 bg-slate-800/50 rounded-full mt-1.5 overflow-hidden">
                    <div
                      className="h-full bg-primary/40 group-hover:bg-primary transition-all duration-1000 ease-out"
                      style={{ width: `${Math.min(skill.level, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-baseline justify-end gap-1">
                  <span className="text-xl font-bold font-mono text-primary leading-none">{skill.level}</span>
                  <span className="text-[8px] text-slate-600 uppercase font-mono">LVL</span>
                </div>
                <div className="text-[9px] text-slate-500 font-mono mt-0.5 uppercase opacity-0 group-hover:opacity-100 transition-opacity">RANK_A</div>
              </div>
            </div>
          ))}

          {rawSkills.length === 0 && (
            <div className="col-span-full text-center p-12 border border-dashed border-slate-800 rounded-2xl bg-slate-900/10">
              <BookOpen className="size-10 text-slate-700 mx-auto mb-3 opacity-20" />
              <p className="text-slate-500 font-mono text-xs tracking-widest uppercase">No skill entries detected in local storage.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
