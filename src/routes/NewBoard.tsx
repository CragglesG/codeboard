import React, { useState, useEffect } from "react";
import { Form, useNavigate, useLocation } from "react-router";
import { makeid } from "../utils/ScribblesUtils";
import ProtectedRoute from "../utils/ProtectedRoute";
import "../assets/css/forms.css";

export function ListScribbles({
  id,
  submit,
}: {
  id: string;
  submit: (title?: string) => Promise<void>;
}) {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
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
            onClick={async (e) => {
              e.preventDefault();
              submit(scribbles.titles[i]);
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

export default function NewBoard() {
  const [userId, setUserId] = useState<string>("");
  let navigate = useNavigate();
  let { state } = useLocation();
  const [title, setTitle] = useState<string>("");

  const file = makeid(20);

  const createBoard = async (titleArg?: string) => {
    let formData = new FormData();
    formData.append(
      "board",
      JSON.stringify([
        {
          id: "1",
          position: { x: 0, y: 0 },
          data: { label: titleArg ? titleArg : title },
          type: "basic",
        },
        {
          id: "2",
          position: { x: 50, y: 50 },
          data: {
            selectedLanguage: "JavaScript",
            recommendedLanguage: "JavaScript",
          },
          type: "languageDropdown",
        },
        {
          id: "3",
          position: { x: 100, y: 100 },
          data: {
            selectedFramework: "React",
            recommendedFramework: "React",
          },
          type: "frameworkDropdown",
        },
      ])
    );
    formData.append("user", userId);
    formData.append("id", file);
    await fetch(import.meta.env.VITE_PROJECT_URL + "/api/boards", {
      method: "POST",
      body: formData,
    });
    navigate("/boards", { state: { file: file, user: userId } });
  };

  return (
    <ProtectedRoute redirect="/signin" setUserId={setUserId}>
      <div>
        <h2>Create A New Board</h2>
        <h3>Create From Scribble:</h3>
        {
          <ListScribbles
            id={userId || ""}
            setTitle={setTitle}
            submit={createBoard}
          />
        }
        <h3>Create From Scratch:</h3>
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            createBoard();
          }}
        >
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
    </ProtectedRoute>
  );
}
