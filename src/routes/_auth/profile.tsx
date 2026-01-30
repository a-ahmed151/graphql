import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LogOut, Trophy, TrendingUp } from "lucide-react";
import { AuditRatioChart } from "@/components/AuditRatioChart";
import { XPProgressionChart } from "@/components/XPProgressionChart";
import { ProjectSuccessChart } from "@/components/ProjectSuccessChart";
import { TransactionsTable } from "@/components/TransactionsTable";
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
  UserProjectProgressDocument,
  type UserProjectProgressQuery,
  PendingAuditsDocument,
  type PendingAuditsQuery,
} from "@/graphql/graphql";
import { GRAPHQL_API } from "@/api/queries/user";
import { useQuery } from "@tanstack/react-query";
import request from "graphql-request";

export const Route = createFileRoute("/_auth/profile")({
  component: RouteComponent,
});

function RouteComponent() {
  const { userToken, logout } = useAuth();
  const navigation = useNavigate();

  const handleLogout = () => {
    logout();
    navigation({ to: "/" });
  };

  const { data: idsData } = useQuery<UserIDsQuery>({
    queryKey: ["userIDs"],
    queryFn: async () =>
      request(GRAPHQL_API, UserIDsDocument, {}, { Authorization: `Bearer ${userToken}` }),
    enabled: !!userToken,
  });

  // Mock data (fallbacks)
  const mockUserData = {
    id: 10,
    login: "mockuser",
    rank: 1,
    totalXP: 123456,
    level: 5,
    auditUp: 2048000,
    auditDown: 1024000,
    countryCode: "US",
    skills: [
      { name: "Go", level: 8 },
      { name: "JavaScript", level: 9 },
      { name: "SQL", level: 7 },
      { name: "Docker", level: 6 },
      { name: "React", level: 8 },
      { name: "Git", level: 9 },
    ],
  };

  // Pick the first user and first label.eventId as requested
  const firstUser = idsData?.user?.[0];
  const firstUserName = `${firstUser?.firstName ?? ""} ${firstUser?.lastName ?? ""}`.trim();
  const selectedUserId = firstUser?.id;
  const rootEventId = firstUser?.labels?.[0]?.eventId;

  const { data: userInfoData } = useQuery<UserInfoQuery>({
    queryKey: ["userInfo", selectedUserId],
    queryFn: async () =>
      request(GRAPHQL_API, UserInfoDocument, { userId: selectedUserId as number }, { Authorization: `Bearer ${userToken}` }),
    enabled: !!userToken && !!selectedUserId,
  });

  // Parse attrs for country (attrs may be stringified JSON)
  const attrsRaw = userInfoData?.user?.attrs as any;
  let parsedAttrs: any;
  try {
    parsedAttrs = attrsRaw && typeof attrsRaw === "string" ? JSON.parse(attrsRaw) : attrsRaw;
  } catch (e) {
    parsedAttrs = undefined;
  }
  const countryName = parsedAttrs?.country ?? parsedAttrs?.Country ?? undefined;

  const { data: countryCodeData } = useQuery({
    queryKey: ["countryCode", countryName],
    queryFn: async () => {
      if (!countryName) return null;
      const res = await fetch(
        `https://restcountries.com/v3.1/name/${encodeURIComponent(countryName)}?fullText=true&fields=cca2`,
      );
      if (!res.ok) throw new Error("Country lookup failed");
      const json = await res.json();
      return json?.[0]?.cca2 ?? null;
    },
    enabled: !!countryName,
  });

  const { data: xpData } = useQuery<UserXpAndLevelQuery>({
    queryKey: ["xpAndLevel", selectedUserId, rootEventId],
    queryFn: async () =>
      request(
        GRAPHQL_API,
        UserXpAndLevelDocument,
        { userId: selectedUserId as number, rootEventId: rootEventId as number },
        { Authorization: `Bearer ${userToken}` },
      ),
    enabled: !!selectedUserId && !!rootEventId && !!userToken,
  });

  const { data: _projectProgressData } = useQuery<UserProjectProgressQuery>({
    queryKey: ["projectProgress", selectedUserId, rootEventId],
    queryFn: async () =>
      request(
        GRAPHQL_API,
        UserProjectProgressDocument,
        { userId: selectedUserId as number, eventId: rootEventId as number },
        { Authorization: `Bearer ${userToken}` },
      ),
    enabled: !!selectedUserId && !!rootEventId && !!userToken,
  });

  const campus = userInfoData?.user?.campus;
  const { data: _pendingAuditsData } = useQuery<PendingAuditsQuery>({
    queryKey: ["pendingAudits", selectedUserId, campus],
    queryFn: async () =>
      request(
        GRAPHQL_API,
        PendingAuditsDocument,
        { userId: selectedUserId as number, campus: campus as string },
        { Authorization: `Bearer ${userToken}` },
      ),
    enabled: !!selectedUserId && !!campus && !!userToken,
  });

  // Derive user data with sensible fallbacks
  const fetchedUserData = {
    id: selectedUserId ?? mockUserData.id,
    login: firstUser?.login ?? userInfoData?.user?.login ?? mockUserData.login,
    name:firstUserName || userInfoData?.user ? `${userInfoData?.user?.firstName ?? ""} ${userInfoData?.user?.lastName ?? ""}`.trim() : mockUserData.login,
    rank: 1,
    totalXP: xpData?.xp?.aggregate?.sum?.amount ?? userInfoData?.user?.totalUp ?? mockUserData.totalXP,
    level: xpData?.level?.[0]?.amount ?? mockUserData.level,
    auditUp: userInfoData?.user?.totalUp ?? mockUserData.auditUp,
    auditDown: userInfoData?.user?.totalDown ?? mockUserData.auditDown,
    countryCode: countryCodeData ?? mockUserData.countryCode,
    skills:
      (userInfoData?.user?.transactions ?? []).map((t) => ({
        name: (t.type ?? "").replace(/^skill_/, ""),
        level: Math.min(10, Math.max(1, Math.round(((t.amount as number) ?? 0) / 1000))),
      })) ?? mockUserData.skills,
  };

  const userData = {
    ...mockUserData,
    ...fetchedUserData,
    skills: (fetchedUserData.skills && fetchedUserData.skills.length > 0) ? fetchedUserData.skills : mockUserData.skills,
  };

  // Show a simple loading state while initial IDs are being fetched
  if (!idsData && userToken) return <div className="p-4">Loading profile...</div>;

  const mockXPProgression = [
    { date: "Jan", xp: 45000 },
    { date: "Feb", xp: 78000 },
    { date: "Mar", xp: 112000 },
    { date: "Apr", xp: 145000 },
    { date: "May", xp: 189000 },
    { date: "Jun", xp: 245680 },
  ];

  const mockProjectSuccess = [
    { name: "Q1", pass: 12, fail: 2 },
    { name: "Q2", pass: 15, fail: 1 },
    { name: "Q3", pass: 18, fail: 3 },
    { name: "Q4", pass: 14, fail: 1 },
  ];

  const mockTransactions = [
    {
      id: "1",
      projectName: "ascii-art",
      type: "XP" as const,
      amount: 15420,
      status: "PASS" as const,
      date: "Jan 25, 2026",
    },
    {
      id: "2",
      projectName: "graphql-query",
      type: "XP" as const,
      amount: 12800,
      status: "PASS" as const,
      date: "Jan 22, 2026",
    },
    {
      id: "3",
      projectName: "tetris-optimizer",
      type: "Audit" as const,
      amount: 524288,
      status: "PASS" as const,
      date: "Jan 20, 2026",
    },
    {
      id: "4",
      projectName: "groupie-tracker",
      type: "XP" as const,
      amount: 18900,
      status: "PASS" as const,
      date: "Jan 18, 2026",
    },
    {
      id: "5",
      projectName: "make-your-game",
      type: "XP" as const,
      amount: 24500,
      status: "FAIL" as const,
      date: "Jan 15, 2026",
    },
    {
      id: "6",
      projectName: "net-cat",
      type: "Audit" as const,
      amount: 262144,
      status: "PASS" as const,
      date: "Jan 12, 2026",
    },
  ];

  return (
    <div className="min-h-screen bg-[#09090b]">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-[#18181b]/95 backdrop-blur border-b border-[#27272a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="size-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                <svg
                  className="size-6 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              </div>
              <span className="text-xl font-semibold text-white">
                z01 Platform
              </span>
            </div>

            {/* User Info */}
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <div className="text-sm text-zinc-100 font-medium">
                  {userData.login}
                </div>
                <div className="text-xs text-zinc-400">
                  ID: {userData.id}
                </div>
              </div>
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="border-[#27272a] bg-transparent text-zinc-300 hover:bg-[#27272a] hover:text-white"
              >
                <LogOut className="size-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="mb-8">
          <Card className="bg-linear-to-br from-indigo-950/50 to-purple-950/50 border-[#27272a]">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                <Avatar className="size-24 border-4 border-indigo-500/50">
                  <AvatarImage
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.login}`}
                  />
                  <AvatarFallback className="bg-indigo-600 text-white text-2xl">
                    {userData.login?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 text-center md:text-left">
                  <div className="flex items-center gap-3 justify-center md:justify-start mb-2">
                    <h1 className="text-3xl font-bold text-white">
                      {userData.name}
                    </h1>
                    <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/50">
                      <Trophy className="size-3 mr-1" />
                      Rank #{userData.rank} -{" "}
                      <Flag
                        code={userData.countryCode || "BH"}
                        fallback={
                          <span className="inline size-4 ml-1">Mars</span>
                        }
                        className="inline size-6 ml-1"
                      />
                    </Badge>
                  </div>
                  <p className="text-zinc-400 mb-4">
                    Student Developer • Level {userData.level}
                  </p>

                  <div className="inline-flex items-center gap-2 bg-[#18181b] border border-[#27272a] rounded-lg px-6 py-3">
                    <TrendingUp className="size-5 text-indigo-400" />
                    <div>
                      <div className="text-xs text-zinc-400 uppercase tracking-wide">
                        Total XP
                      </div>
                      <div className="text-3xl font-extrabold text-white">
                        {formatBytes(userData.totalXP)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Audit Ratio */}
          <AuditRatioChart
            auditUp={userData.auditUp}
            auditDown={userData.auditDown}
          />

          {/* Level/Grades */}
          <Card className="bg-[#18181b] border-[#27272a] hover:border-[#3f3f46] transition-colors">
            <CardHeader>
              <CardTitle className="text-zinc-100">Level & Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">Current Level</span>
                <span className="text-3xl font-extrabold text-white">
                  {userData.level}
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">
                    Progress to Level {mockUserData.level + 1}
                  </span>
                  <span className="text-zinc-200">68%</span>
                </div>
                <div className="h-3 bg-[#27272a] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-linear-to-r from-indigo-500 to-purple-500"
                    style={{ width: "68%" }}
                  />
                </div>
              </div>

              <div className="pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">Projects Completed</span>
                  <span className="text-zinc-100 font-semibold">47</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">Success Rate</span>
                  <span className="text-green-400 font-semibold">94%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Skills */}
          <Card className="bg-[#18181b] border-[#27272a] hover:border-[#3f3f46] transition-colors">
            <CardHeader>
              <CardTitle className="text-zinc-100">Skills</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {userData.skills.map((skill) => (
                  <Badge
                    key={skill.name}
                    variant="outline"
                    className="border-indigo-500/50 text-indigo-300 bg-indigo-950/30 hover:bg-indigo-900/40 transition-colors"
                  >
                    {skill.name}
                    <span className="ml-1 text-xs text-indigo-400">
                      Lv.{skill.level}
                    </span>
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <XPProgressionChart data={mockXPProgression} />
          <ProjectSuccessChart data={mockProjectSuccess} />
        </div>

        {/* Transactions Table */}
        <TransactionsTable transactions={mockTransactions} />
      </main>
    </div>
  );
}
