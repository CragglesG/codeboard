import { authClient } from "../lib/auth.client.ts";

export default async function Dashboard() {
  const { data } = await authClient.getSession();
  const session = data != null;

  if (!session) {
    window.location.href = "/signin";
  } else {
    return (
      <div>
        <h1>Dashboard</h1>
      </div>
    );
  }
}
