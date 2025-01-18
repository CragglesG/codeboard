import { authClient } from "../lib/auth.client";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
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

export function ListScribbles(id: string) {
  const [loading, setloading] = useState(true);
  let scribbles: string;

  useEffect(() => {
    const fetchScribbles = async () => {
      const form = new FormData();
      form.append("user", id);
      scribbles = await (
        await fetch(import.meta.env.VITE_PROJECT_URL + "/api/listmd", {
          method: "POST",
          body: form,
        })
      ).json();
      setloading(false);
    };

    fetchScribbles();
  });

  if (!loading && scribbles) {
    const rows = [];
    for (let i = 0; i < scribbles.length; i++) {
      rows.push(
        <li>
          <a href={"/scribbles/" + scribbles[i].id}>{scribbles[i].id}</a>
        </li>
      );
    }
    return (
      <div>
        <ul>{rows}</ul>
      </div>
    );
  }
}

// TODO: Fix above function. It currently sends null to the server and improperly decodes the response.

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  let navigate = useNavigate();
  let id: string;

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data } = await authClient.getSession();
        if (data != null) {
          setAuthenticated(true);
          id = data.user.id;
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
      <div style={{ width: "100%" }}>
        <Header actionlink={false} />
        <h1>Dashboard</h1>
        <h2>Scribbles</h2>
        {<ListScribbles id={id} />}
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
