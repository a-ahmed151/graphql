import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../auth";
import {  GRAPHQL_API } from "../../api/queries/user";
import { request } from "graphql-request";
import { UserinfoDocument, type UserinfoQuery } from "../../graphql/graphql";

export const Route = createFileRoute("/_auth/profile")({
  component: RouteComponent,
});

function RouteComponent() {
  const { userToken,logout } = useAuth();
  const navigation = useNavigate()

  const handleLogout = () => {
    logout();
    navigation({to: '/'})
  }

  const { data, isLoading, error } = useQuery<UserinfoQuery>({
    queryKey: ["userProfile"],
    queryFn: async () => request<UserinfoQuery>(GRAPHQL_API, UserinfoDocument, {}, {
        Authorization: `Bearer ${userToken}`,
      }),
    enabled: !!userToken,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!data || !data.user || data.user.length === 0) return <div>No data</div>;

const user = data.user[0]
  return (
    <div>
      <header><button onClick={handleLogout}>Logout</button></header>
      <h1>Profile</h1>
      <p>
        Name: {user.firstName} {user.lastName}
      </p>
      <p>Email: {user.email}</p>
      <p>Login: {user.login}</p>
      <p>Campus: {user.campus}</p>
      <p>Audit Ratio: {user.auditRatio}</p>
    </div>
  );
}
