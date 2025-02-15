import { authClient } from "../lib/auth.client";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import Header from "../components/Header";
import ProtectedRoute from "../utils/ProtectedRoute";
import "../assets/css/Dashboard.css";

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
  const [scribbles, setScribbles] = useState<object>();

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
        <li key={i}>
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
        </li>
      );
    }
    return <ul>{rows}</ul>;
  }
}

export default function Dashboard() {
  const [userId, setUserId] = useState<string | null>(null);

  return (
    <ProtectedRoute redirect="/dashboard" setUserId={setUserId}>
      <div id="dashboard">
        <Header actionlink={false} />
        <h1>Dashboard</h1>
        <h2>Scribbles</h2>
        {<ListScribbles id={userId || ""} />}
        <a href="/newscribble">New Scribble</a>
      </div>
    </ProtectedRoute>
  );
}
