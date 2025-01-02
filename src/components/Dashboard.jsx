import { authClient } from "../lib/auth.client";
import { useState, useEffect } from "react";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const data = await authClient.getSession();
        if (data != null) {
          setAuthenticated(true);
        } else {
          setAuthenticated(false);
          window.location.href = "/signin";
        }
      } catch (error) {
        console.error("Error checking session:", error);
        setAuthenticated(false);
        window.location.href = "/signin";
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

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
