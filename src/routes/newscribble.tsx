import { authClient } from "../lib/auth.client";
import React from "react";
import { Form, useNavigate, useLocation } from "react-router";
import { makeid } from "../utils/ScribblesUtils";
import "../assets/css/forms.css";

export default function NewScribble() {
  const [loading, setLoading] = React.useState(true);
  const [authenticated, setAuthenticated] = React.useState(false);
  const [file, setFile] = React.useState("");
  const [user, setUser] = React.useState("");
  let navigate = useNavigate();
  let { state } = useLocation();
  const [title, setTitle] = React.useState("");

  const checkSession = async () => {
    if (loading) {
      try {
        const { data } = await authClient.getSession();
        if (data != null) {
          setAuthenticated(true);
          const { file, user } = state || {
            file: makeid(12),
            user: data.user.id,
          };
          setFile(file);
          setUser(user);
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

  React.useEffect(() => {
    checkSession();
  });

  const createScribble = async (e) => {
    e.preventDefault();
    let formData = new FormData();
    formData.append("md", `---\ntitle: ${title}\n---\n`);
    formData.append("user", user);
    formData.append("id", file);
    await fetch(import.meta.env.VITE_PROJECT_URL + "/api/md/save", {
      method: "POST",
      body: formData,
    });
    navigate("/scribbles", { state: { file: file, user: user } });
  };

  if (!loading && authenticated) {
    return (
      <div>
        <h2>Create a New Scribble</h2>
        <Form onSubmit={createScribble}>
          <input
            type="text"
            name="title"
            placeholder="Title"
            className="top-input"
            onChange={(e) => {
              setTitle(e.target.value);
            }}
          />
          <br />
          <button type="submit">Create</button>
        </Form>
      </div>
    );
  }
}
