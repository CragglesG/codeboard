import { authClient } from "../lib/auth.client";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import Header from "../components/Header";
import "../assets/css/Dashboard.css";
import { cp } from "node:fs";

export function meta() {
  return [
    {
      title: "Dashboard",
    },
    {
      name: "description",
      content: "Codeboard Dashboard",
    },
  ];
}

export function ListScribbles({ id }: { id: string }) {
  const [loading, setLoading] = useState(true);
  let navigate = useNavigate();
  const [scribbles, setScribbles] = useState();

  const fetchScribbles = async () => {
    if (loading) {
      const form = new FormData();
      form.append("user", id);
      setScribbles(
        await (
          await fetch(import.meta.env.VITE_PROJECT_URL + "/api/listmd", {
            method: "POST",
            body: form,
          })
        ).json()
      );
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScribbles();
  });

  if (!loading && scribbles) {
    const rows = [];
    for (let i = 0; i < scribbles.files.length; i++) {
      rows.push(
        <>
          <a
            onClick={() => {
              navigate("/scribbles", {
                state: { file: scribbles.files[i], user: id },
              });
            }}
          >
            {scribbles.titles[i]}
          </a>
          <br />
        </>
      );
    }
    return <div>{rows}</div>;
  }
}

export default function Dashboard() {
  const [loading, setLoading] = useState<boolean>(true);
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | null>(null);
  let navigate = useNavigate();

  const checkSession = async () => {
    if (loading) {
      try {
        const { data } = await authClient.getSession();
        if (data != null) {
          setAuthenticated(true);
          setUserId(data.user.id);
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
    }
  };

  useEffect(() => {
    checkSession();
  });

  if (loading) {
    return <div />;
  }

  if (authenticated) {
    return (
      <div id="dashboard">
        <Header actionlink={false} />
        <h1>Dashboard</h1>
        <h2>Scribbles</h2>
        {<ListScribbles id={userId || ""} />}
        <a href="/newscribble">New Scribble</a>
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
