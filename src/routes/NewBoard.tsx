import React, { useState, useEffect } from "react";
import { Form, useNavigate, useSubmit } from "react-router";
import { makeid } from "../utils/ScribblesUtils";
import ProtectedRoute from "../utils/ProtectedRoute";
import "../assets/css/forms.css";

type scribblesObject = {
  files: string[];
  titles: string[];
};

export function ListScribbles({
  id,
  submit,
  scribbles,
  setScribbles,
}: {
  id: string;
  submit: (title?: string, file?: string) => Promise<void>;
  scribbles: scribblesObject;
  setScribbles: React.Dispatch<React.SetStateAction<scribblesObject>>;
}) {
  const [loading, setLoading] = useState(true);

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
              submit(scribbles.titles[i], scribbles.files[i]);
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
  const submit = useSubmit();
  const [title, setTitle] = useState<string>("");
  const [scribbles, setScribbles] = useState<scribblesObject>();
  const [loadingCompletion, setLoadingCompletion] = useState(false);

  const file = makeid(20);

  const createBoard = async (titleArg?: string, scribbleFile?: string) => {
    let aiCompletion: { nodes: object[]; edges: object[] } = {
      nodes: [{}],
      edges: [{}],
    };
    if (scribbleFile) {
      const id = scribbleFile;
      const md = await (
        await fetch(
          import.meta.env.VITE_PROJECT_URL +
            "/api/md?file=" +
            id +
            "&user=" +
            userId,
          {
            method: "GET",
          }
        )
      ).text();
      const body = new FormData();
      body.append("md", md);
      setLoadingCompletion(true);
      aiCompletion = JSON.parse(
        await (
          await fetch(import.meta.env.VITE_PROJECT_URL + "/api/stb", {
            method: "POST",
            body: body,
          })
        ).text()
      );
    }
    let formData = new FormData();
    formData.append(
      "board",
      JSON.stringify([
        [
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
          ...aiCompletion.nodes,
        ],
        [...aiCompletion.edges],
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

  if (!loadingCompletion) {
    return (
      <ProtectedRoute redirect="/signin" setUserId={setUserId}>
        <div>
          <h2>Create A New Board</h2>
          <h3>Create From Scribble:</h3>
          <ListScribbles
            id={userId}
            submit={createBoard}
            scribbles={scribbles}
            setScribbles={setScribbles}
          />
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
  } else {
    return <h2>Loading...</h2>;
  }
}
