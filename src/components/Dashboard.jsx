import { authClient } from "../lib/auth.client";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  let navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const data = await authClient.getSession();
        if (data != null) {
          setAuthenticated(true);
        } else {
          setAuthenticated(false);
          navigate("/signin", { state: { redirect: "/dashboard" } });
        }
      } catch (error) {
        console.error("Error checking session:", error);
        setAuthenticated(false);
        navigate("/signin", { state: { redirect: "/dashboard" } });
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  });

  if (loading) {
    return <div />;
  }

  if (authenticated) {
    return (
      <div>
        <h1>Dashboard</h1>
      </div>
    );
  } else {
    return (
      <div>
        <p>Redirecting...</p>
        <p>
          If you are not redirected, click <a href="/signin">here</a>.
        </p>
      </div>
    );
  }
}
