import { DigitalCard } from "@/components/DigitalCard";
import { LogOut, Zap, TrendingUp, TrendingDown, Shield, Code, FolderOpen, BookOpen } from "lucide-react";
import { useState, useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useAuth } from "../../auth";
import Flag from "react-world-flags";
import { formatBytes } from "../../lib/utils";
import {
  UserIDsDocument,
  type UserIDsQuery,
  UserInfoDocument,
  type UserInfoQuery,
  UserXpAndLevelDocument,
  type UserXpAndLevelQuery,
  type ProjectXpTransactionsQuery,
  ProjectXpTransactionsDocument,
} from "@/graphql/graphql";
import { GRAPHQL_API } from "@/api/queries/user";
import { useQuery } from "@tanstack/react-query";
import request from "graphql-request";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  XAxis,
  YAxis
} from "recharts";
import { ModeToggle } from "@/components/mode-toggle";

export const Route = createFileRoute("/_auth/profile")({
  component: RouteComponent,
});

function RouteComponent() {
  const { userToken, logout } = useAuth();
  const navigation = useNavigate();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleLogout = () => {
    logout();
    navigation({ to: "/" });
  };

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
  const rootEventId = firstUser?.labels?.[0]?.eventId;

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

  const { data: xpData } = useQuery<UserXpAndLevelQuery>({
    queryKey: ["xpAndLevel", selectedUserId, rootEventId],
    queryFn: async () =>
      request(
        GRAPHQL_API,
        UserXpAndLevelDocument,
        {
          userId: selectedUserId as number,
          rootEventId: rootEventId as number,
        },
        { Authorization: `Bearer ${userToken}` },
      ),
    enabled: !!selectedUserId && !!rootEventId && !!userToken,
  });

  const { data: projectProgressData } = useQuery<ProjectXpTransactionsQuery>({
    queryKey: ["projectProgress", selectedUserId, rootEventId],
    queryFn: async () =>
      request(
        GRAPHQL_API,
        ProjectXpTransactionsDocument,
        { userId: selectedUserId as number, eventId: rootEventId as number, limit: null },
        { Authorization: `Bearer ${userToken}` },
      ),
    enabled: !!selectedUserId && !!rootEventId && !!userToken,
  });

  // Derived Data
  const currentXP = xpData?.xp?.aggregate?.sum?.amount ?? userInfoData?.user?.totalUp ?? 0;
  const currentLevel = xpData?.level?.[0]?.amount ?? 0;
  const auditRatio = ((userInfoData?.user?.totalUp ?? 1) / (userInfoData?.user?.totalDown ?? 1)).toFixed(1);
  const login = firstUser?.login ?? "AGENT_PENDING";

  // Chart Data Preparation - Last 6 Months Cumulative XP
  const xpTransactions = projectProgressData?.transaction ?? [];

  const xpHistory = (() => {
    const sortedTxs = [...xpTransactions].sort((a, b) =>
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    const dataPoints = [];
    const now = new Date();

    // We want 6 points representing the status at the end of each of the last 6 months
    for (let i = 5; i >= 0; i--) {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - i + 1, 0); // Last day of month 'i' months ago

      // Sum all transactions up to this date
      const xpAtDate = sortedTxs
        .filter(tx => new Date(tx.createdAt) <= monthDate)
        .reduce((sum, tx) => sum + tx.amount, 0);

      dataPoints.push({
        label: "", // Generic label as requested
        xp: xpAtDate || 0
      });
    }

    // Ensure we have at least some data for the chart if no transactions exist
    if (dataPoints.every(p => p.xp === 0)) {
      return [
        { label: "", xp: 0 },
        { label: "", xp: currentXP * 0.2 },
        { label: "", xp: currentXP * 0.4 },
        { label: "", xp: currentXP * 0.6 },
        { label: "", xp: currentXP * 0.8 },
        { label: "", xp: currentXP },
      ];
    }

    return dataPoints;
  })();

  // Best Skills Data Extraction
  const bestSkills = (userInfoData?.user?.transactions ?? [])
    .map((t: any) => ({
      name: t.name || (t.type || "").replace("skill_", "").toUpperCase(),
      level: typeof t.level === 'number' ? t.level : (t.amount || 0),
    }))
    .filter((s) => s.level > 0)
    .sort((a, b) => b.level - a.level)
    .slice(0, 5);

  const skillChartData = bestSkills;

  // Activity Log
  const recentProjects = (projectProgressData?.transaction ?? []).slice(0, 3).map((tx) => ({
    name: tx.path.split("/").pop(),
    xp: tx.amount,
    status: "VALIDATED"
  }));

  const userAttrs = userInfoData?.user?.attrs as any;
  const countryName = userAttrs?.country;

  const { data: countryApiData } = useQuery({
    queryKey: ["countryCode", countryName],
    queryFn: async () => {
      if (!countryName) return null;
      const res = await fetch(`https://restcountries.com/v3.1/name/${countryName.toLowerCase()}?fullText=true&fields=cca2`);
      if (!res.ok) return null;
      const json = await res.json();
      return json?.[0]?.cca2;
    },
    enabled: !!countryName,
  });

  const resolvedCountryCode = countryApiData || userAttrs?.cc2a || "BH";

  if (!idsData && userToken) return <div className="p-4 text-primary animate-pulse font-mono">INITIALIZING SYSTEM...</div>;

  return (
    <div className="max-w-6xl mx-auto p-4 pb-12 flex flex-col gap-6 min-h-screen">
      {/* Top Header - Unified for Desktop/Mobile */}
      <header className="flex justify-between items-center pt-2">
        <div className="flex items-center gap-4">
          <div className="relative w-14 h-14 md:w-16 md:h-16">
            <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping opacity-20"></div>
            <div className="absolute inset-0 rounded-full border border-primary/50"></div>
            <img
              alt="User Avatar"
              className="w-full h-full rounded-full border-2 border-primary object-cover relative z-10"
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${login}`}
            />
          </div>
          <div>
            <h1 className="font-bold text-xl md:text-2xl leading-tight uppercase tracking-widest text-foreground">
              {login}<span className="text-primary">.ID</span>
            </h1>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="font-mono text-[10px] text-slate-500 uppercase tracking-tighter">Verified Agent #{selectedUserId}-XC-01</span>
              <div className="w-4 h-2.5 overflow-hidden rounded-[1px] opacity-70 border border-white/5 flex-shrink-0">
                <Flag code={resolvedCountryCode} className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <ModeToggle />
          <button
            onClick={handleLogout}
            className="group relative px-4 py-2 bg-transparent border border-red-500/50 hover:border-red-500 hover:bg-red-500/10 text-red-500 text-xs font-mono uppercase tracking-widest transition-all clip-corner flex items-center gap-2"
          >
            <LogOut className="size-3" />
            <span className="hidden sm:inline">LOGOUT</span>
          </button>
        </div>
      </header>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Column: Stats & Actions (1/3 weight) */}
        <div className="flex flex-col gap-6 lg:col-span-1">
          {/* Total XP Card */}
          <div className="relative group">
            <div className="absolute inset-0 bg-primary/20 blur opacity-30 group-hover:opacity-50 transition-opacity rounded-xl"></div>
            <DigitalCard className="bg-card dark:bg-card-dark border-border/50 p-6 clip-corner">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xs font-mono text-slate-400 uppercase tracking-widest mb-1">Total Accumulated XP</h3>
                  <div className="text-4xl font-bold font-mono tracking-tighter text-foreground">{formatBytes(currentXP)}</div>
                </div>
                <Zap className="text-primary size-10 fill-primary/10 animate-pulse" />
              </div>
              <div className="relative pt-2">
                <div className="flex justify-between text-xs font-mono mb-2 text-slate-400">
                  <span className="bg-primary/10 text-primary px-2 py-0.5 rounded border border-primary/20">LEVEL {currentLevel}</span>
                </div>
              </div>
            </DigitalCard>
          </div>

          {/* Core Stats */}
          <DigitalCard variant="glass" className="p-5 border-l-4 border-l-accent relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
              <Shield className="size-12 text-accent" />
            </div>
            <h3 className="text-xs font-mono text-slate-400 uppercase tracking-widest mb-2">Audit Ratio Index</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-accent">{auditRatio}</span>
              <span className="text-[10px] text-slate-500 font-mono uppercase bg-accent/10 px-2 py-0.5 rounded">Stable Status</span>
            </div>
            <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between text-[11px] font-mono">
              <div className="flex flex-col">
                <span className="text-slate-500 uppercase text-[9px]">Upload</span>
                <span className="text-accent flex items-center mt-1"><TrendingUp className="size-3 mr-1" /> {formatBytes(userInfoData?.user?.totalUp ?? 0)}</span>
              </div>
              <div className="w-px h-8 bg-white/10"></div>
              <div className="flex flex-col items-end">
                <span className="text-slate-500 uppercase text-[9px]">Download</span>
                <span className="text-orange-400 flex items-center mt-1"><TrendingDown className="size-3 mr-1" /> {formatBytes(userInfoData?.user?.totalDown ?? 0)}</span>
              </div>
            </div>
          </DigitalCard>

          {/* Best Skills (Bar Chart) */}
          <DigitalCard variant="neon" className="p-5 relative overflow-hidden group">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-mono text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                Best Skills
              </h3>
              <div className="text-[9px] font-mono text-primary/50">TOP_5_RANKING</div>
            </div>
            <div className="h-[200px] w-full">
              {isMounted && (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={skillChartData} layout="vertical" margin={{ left: 0, right: 20, top: 0, bottom: 0 }}>
                    <XAxis type="number" hide domain={[0, 100]} />
                    <YAxis
                      dataKey="name"
                      type="category"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#94a3b8", fontSize: 10, fontFamily: "monospace" }}
                      width={85}
                    />
                    <Tooltip
                      cursor={{ fill: 'rgba(13, 185, 242, 0.05)' }}
                      contentStyle={{ backgroundColor: '#020617', borderColor: '#0db9f2', fontSize: '10px' }}
                    />
                    <Bar
                      dataKey="level"
                      fill="#0db9f2"
                      radius={[0, 4, 4, 0]}
                      barSize={12}
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </DigitalCard>

          {/* Quick Actions (Grid) */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => navigation({ to: "/projects" })}
              className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-card-dark border border-border/50 hover:border-primary hover:bg-primary/5 transition-all group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-primary/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              <FolderOpen className="size-6 text-slate-400 group-hover:text-primary transition-colors relative z-10" />
              <span className="text-[10px] uppercase font-mono tracking-widest text-slate-500 group-hover:text-primary-foreground relative z-10">Projects</span>
            </button>

            <button
              onClick={() => navigation({ to: "/skills" })}
              className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-card-dark border border-border/50 hover:border-primary hover:bg-primary/5 transition-all group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-primary/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              <BookOpen className="size-6 text-slate-400 group-hover:text-primary transition-colors relative z-10" />
              <span className="text-[10px] uppercase font-mono tracking-widest text-slate-500 group-hover:text-primary-foreground relative z-10">Skills</span>
            </button>
          </div>
        </div>

        {/* Right Column: Experience Chart & Activity (2/3 weight) */}
        <div className="flex flex-col gap-6 lg:col-span-2">
          {/* Evolution Chart (XP Trend) */}
          <DigitalCard variant="glass" className="p-6 border-primary/20 bg-primary/5 h-full min-h-[300px] flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-base font-bold uppercase text-foreground flex items-center gap-2">
                  <span className="w-1.5 h-4 bg-primary rounded-sm shadow-[0_0_8px_rgba(13,185,242,0.5)]"></span>
                  Evolution Path
                </h2>
                <p className="text-[10px] text-slate-500 font-mono mt-1 font-normal tracking-wide uppercase">EXPONENTIAL GROWTH ANALYTICS</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-primary font-mono font-bold tracking-widest uppercase">XP TRENDLINE</span>
              </div>
            </div>
            <div className="flex-1 w-full min-h-[200px]">
              {isMounted && (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={xpHistory}>
                    <defs>
                      <linearGradient id="colorXp" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0db9f2" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#0db9f2" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid vertical={false} stroke="#1f2937" strokeDasharray="3 3" opacity={0.5} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(2, 6, 23, 0.95)',
                        borderColor: '#0db9f2',
                        fontSize: '11px',
                        fontFamily: 'monospace',
                        borderRadius: '4px',
                        borderWidth: '1px'
                      }}
                      itemStyle={{ color: '#0db9f2', padding: 0 }}
                      labelStyle={{ display: 'none' }}
                      formatter={(value: any) => [formatBytes(value), 'TOTAL XP']}
                    />
                    <Area
                      type="monotone"
                      dataKey="xp"
                      stroke="#0db9f2"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorXp)"
                      animationDuration={2000}
                      activeDot={{ r: 6, fill: '#0db9f2', stroke: '#fff', strokeWidth: 2 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </DigitalCard>

          {/* Activity Log */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-xs font-mono text-slate-400 uppercase tracking-widest">Recent Node Access</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-3">
              {recentProjects.map((proj, i) => (
                <DigitalCard key={i} className="p-3 bg-card-dark/40 border-border/30 hover:bg-card-dark/60 transition-colors flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded bg-slate-800/50 text-slate-400 group-hover:text-primary transition-colors">
                      <Code className="size-4" />
                    </div>
                    <div>
                      <div className="text-[10px] font-mono text-slate-500 uppercase tracking-tighter">PROJECT_VALIDATED</div>
                      <div className="text-sm font-bold text-foreground group-hover:text-primary transition-colors leading-tight">{proj.name}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-primary font-bold font-mono text-xs">+{formatBytes(proj.xp)}</div>
                  </div>
                </DigitalCard>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
