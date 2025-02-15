import React, { useEffect, useState } from "react";
import { authClient } from "../lib/auth.client";
import { useNavigate } from "react-router";

export default function ProtectedRoute({
  children,
  redirect,
  setUserId,
  navigateState,
}: {
  children: React.ReactNode;
  redirect: string;
  setUserId?: React.Dispatch<React.SetStateAction<string | null>>;
  navigateState?: any;
}) {
  const [loading, setLoading] = useState<boolean>(true);
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  let navigate = useNavigate();

  const checkSession = async () => {
    if (loading) {
      try {
        const { data } = await authClient.getSession();
        if (data != null) {
          setAuthenticated(true);
          setUserId?.(data.user.id);
          setLoading(false);
        } else {
          setAuthenticated(false);
          if (navigateState) {
            navigate("/signin", {
              state: { redirect: redirect, misc: navigateState },
            });
          } else {
            navigate("/signin", {
              state: { redirect: redirect },
            });
          }
        }
      } catch (error) {
        console.error("Error checking session:", error);
        setAuthenticated(false);
        if (navigateState) {
          navigate("/signin", {
            state: { redirect: redirect, misc: navigateState },
          });
        } else {
          navigate("/signin", {
            state: { redirect: redirect },
          });
        }
      }
    }
  };

  useEffect(() => {
    checkSession();
  });

  if (loading) {
    return <div />;
  }

  if (authenticated) {
    return <>{children}</>;
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
