import { GRAPHQL_API } from "@/api/queries/user";
import { useAuth } from "@/auth";
import { Header } from "@/components/Header";
import { UserinfoDocument, type UserinfoQuery } from "@/graphql/graphql";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import request from "graphql-request";

export const Route = createFileRoute("/_auth/dashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  const { userToken, logout } = useAuth();
  const navigation = useNavigate();
  const handleLogout = () => {
    logout();
    navigation({ to: "/" });
  };

  const { data, isLoading, error } = useQuery<UserinfoQuery>({
    queryKey: ["userProfile"],
    queryFn: async () =>
      request(
        GRAPHQL_API,
        UserinfoDocument,
        {},
        {
          Authorization: `Bearer ${userToken}`,
        },
      ),
    enabled: !!userToken,
  });
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!data || !data.user || data.user.length === 0) return <div>No data</div>;

  return (
    <>
      <div className="flex flex-col w-140">
        <Header logoutHandler={handleLogout} />
      </div>
    </>
  );
}
