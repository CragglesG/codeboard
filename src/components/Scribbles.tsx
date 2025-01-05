import {
  AdmonitionDirectiveDescriptor,
  KitchenSinkToolbar,
  MDXEditor,
  codeBlockPlugin,
  codeMirrorPlugin,
  diffSourcePlugin,
  directivesPlugin,
  frontmatterPlugin,
  headingsPlugin,
  imagePlugin,
  linkDialogPlugin,
  linkPlugin,
  listsPlugin,
  markdownShortcutPlugin,
  quotePlugin,
  sandpackPlugin,
  tablePlugin,
  thematicBreakPlugin,
  toolbarPlugin,
  type MDXEditorMethods,
} from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";
import Header from "./Header.jsx";
import { LenisProvider } from "./LenisInstance.jsx";
import "../assets/css/Scribbles.css";
import React from "react";
import { useLocation, useNavigate } from "react-router";
import fs from "node:fs";
import { authClient } from "../lib/auth.client";

function makeid(length: number) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

async function imageUploadHandler(image: File): Promise<string> {
  const formData = new FormData();
  const imgTempId = makeid(12);
  formData.append("image", image);
  formData.append("id", imgTempId);
  const response = await fetch("/api/images/upload", {
    method: "POST",
    body: formData,
  });
  const data = await response.json();

  return data.url;
}

const defaultSnippet = `
  export default function App() {
    return (
      <div className="App">
        <h1>Hello World</h1>
        <h2>Start editing to see some magic happen!</h2>
      </div>
    );
  }
`.trim();

const defaultSnippetHTML = `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Document</title>
    </head>
    <body>
      <h1>Hello World</h1>
      <h2>Start editing to see some magic happen!</h2>
    </body>
  </html>
`.trim();

const simpleSandpackConfig = {
  defaultPreset: "react",
  presets: [
    {
      label: "React",
      name: "react",
      meta: "live react",
      sandpackTemplate: "react",
      sandpackTheme: "dark",
      snippetFileName: "/App.js",
      snippetLanguage: "jsx",
      initialSnippetContent: defaultSnippet,
    },
    {
      label: "HTML",
      name: "static",
      meta: "live html",
      sandpackTemplate: "static",
      sandpackTheme: "dark",
      snippetFileName: "/index.html",
      snippetLanguage: "html",
      initialSnippetContent: defaultSnippetHTML,
    },
  ],
};

export function meta() {
  return [
    { title: "Scribbles - Codeboard" },
    {
      name: "description",
      content: "Codeboard Scribbles",
    },
  ];
}

/* separate toolbar and editor */
export default function Scribbles() {
  const [loading, setLoading] = React.useState(true);
  const [authenticated, setAuthenticated] = React.useState(false);
  let data;
  let file: string, user: string;
  const ref = React.useRef<MDXEditorMethods>(null);
  const { state } = useLocation();
  let navigate = useNavigate();

  React.useEffect(() => {
    const checkSession = async () => {
      try {
        ({ data } = await authClient.getSession());
        if (data != null) {
          setAuthenticated(true);
          ({ file, user } = state || {
            file: makeid(12),
            user: data.user.id,
          });
          console.log(
            "Authentication complete. File ID: " + file + ". User ID: " + user
          );
        } else {
          setAuthenticated(false);
          navigate("/signin", { state: { redirect: "/scribbles" } });
        }
      } catch (error) {
        console.error("Error checking session:", error);
        setAuthenticated(false);
        navigate("/signin", { state: { redirect: "/scribbles" } });
      }
    };

    checkSession();
  }, []);

  React.useEffect(() => {
    const setMarkdown = async () => {
      const md = await fetch(
        import.meta.env.VITE_PROJECT_URL +
          "/api/md/get?file=" +
          file +
          "&user=" +
          user,
        {
          method: "GET",
        }
      );
      ref.current?.setMarkdown(await md.text());
    };
    setMarkdown();
    setLoading(false);
  }, [file, user]);

  let saveCounter = 0;

  React.useEffect(() => {
    const interval = setInterval(() => {
      const saveMarkdown = async () => {
        console.log("Saving md.. step 1");
        if (file != undefined && user != undefined) {
          console.log("Saving md.. step 2");
          if (saveCounter % 20 == 0) {
            console.log("Saving md.. step 3");
            const formData = new FormData();
            formData.append("md", ref.current?.getMarkdown() | "");
            formData.append("id", file);
            formData.append("user", user);
            await fetch(import.meta.env.VITE_PROJECT_URL + "/api/md/save", {
              method: "POST",
              body: formData,
            });
            saveCounter += 1;
          } else {
            console.log("Saving md.. step 3 failed");
            saveCounter += 1;
          }
        }
      };
      saveMarkdown();
    }, 20000);

    return () => {
      clearInterval(interval);
    };
  });

  if (loading) {
    return <div />;
  }

  if (authenticated) {
    return (
      <LenisProvider>
        <MDXEditor
          ref={ref}
          className="dark-editor"
          markdown={ref.current?.getMarkdown() || ""}
          plugins={[
            headingsPlugin(),
            quotePlugin(),
            listsPlugin(),
            thematicBreakPlugin(),
            linkPlugin(),
            linkDialogPlugin(),
            imagePlugin({
              imageUploadHandler: imageUploadHandler,
            }),
            tablePlugin(),
            codeBlockPlugin({ defaultCodeBlockLanguage: "js" }),
            codeMirrorPlugin({
              codeBlockLanguages: {
                js: "JavaScript",
                css: "CSS",
                html: "HTML",
                python: "Python",
              },
            }),
            markdownShortcutPlugin(),
            directivesPlugin({
              directiveDescriptors: [AdmonitionDirectiveDescriptor],
            }),
            diffSourcePlugin({ viewMode: "rich-text" }),
            frontmatterPlugin(),
            sandpackPlugin({ sandpackConfig: simpleSandpackConfig }),
            toolbarPlugin({
              toolbarClassName: "toolbar",
              toolbarContents: () => (
                <>
                  <Header
                    className="header"
                    extraItem={<KitchenSinkToolbar />}
                  />
                </>
              ),
            }),
          ]}
        />
      </LenisProvider>
    );
  }
}
