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
import "../assets/css/Scribbles.css";
import React from "react";
import { useLocation, useNavigate } from "react-router";
import { authClient } from "../lib/auth.client";
import useKeyPress from "./useKeyPress";
import * as utils from "./ScribblesUtils";

export const meta = utils.meta;

export default function Scribbles() {
  const [loading, setLoading] = React.useState(true);
  const [authenticated, setAuthenticated] = React.useState(false);
  let data;
  let file: string, user: string;
  const codeRef = React.useRef<MDXEditorMethods>(null);
  const { state } = useLocation();
  let navigate = useNavigate();

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
    codeRef.current?.setMarkdown(await md.text());
  };

  const saveCallback = (e) => {
    saveMarkdown();
    navigate(".", { state: { file: file, user: user } });
  };

  useKeyPress(["s"], saveCallback, null, true);

  const checkSession = async () => {
    if (loading) {
      try {
        ({ data } = await authClient.getSession());
        if (data != null) {
          setAuthenticated(true);
          ({ file, user } = state || {
            file: utils.makeid(12),
            user: data.user.id,
          });
          setMarkdown();
          setLoading(false);
          document.addEventListener("beforeunload", saveCallback);
          document.addEventListener("pagehide", saveCallback);
        } else {
          setAuthenticated(false);
          navigate("/signin", { state: { redirect: "/scribbles" } });
        }
      } catch (error) {
        console.error("Error checking session:", error);
        setAuthenticated(false);
        navigate("/signin", { state: { redirect: "/scribbles" } });
      }
    }
  };

  React.useEffect(() => {
    checkSession();
    return () => {
      document.removeEventListener("beforeunload", saveCallback);
      document.removeEventListener("pagehide", saveCallback);
    };
  });

  let lastMarkdown = "";

  const saveMarkdown = async () => {
    if (file != undefined && user != undefined) {
      if (codeRef.current?.getMarkdown() != lastMarkdown) {
        const formData = new FormData();
        formData.append("md", codeRef.current?.getMarkdown() || "");
        formData.append("id", file);
        formData.append("user", user);
        await fetch(import.meta.env.VITE_PROJECT_URL + "/api/md/save", {
          method: "POST",
          body: formData,
        });
        lastMarkdown = codeRef.current?.getMarkdown() || "";
      }
    }
  };

  const interval = setInterval(() => {
    saveMarkdown();
  }, 5000);

  return (
    <MDXEditor
      ref={codeRef}
      className="dark-editor"
      markdown={authenticated ? codeRef.current?.getMarkdown() : ""}
      plugins={[
        headingsPlugin(),
        quotePlugin(),
        listsPlugin(),
        thematicBreakPlugin(),
        linkPlugin(),
        linkDialogPlugin(),
        imagePlugin({
          imageUploadHandler: utils.imageUploadHandler,
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
        sandpackPlugin({ sandpackConfig: utils.simpleSandpackConfig }),
        toolbarPlugin({
          toolbarClassName: "toolbar",
          toolbarContents: () => (
            <>
              <Header className="header" extraItem={<KitchenSinkToolbar />} />
            </>
          ),
        }),
      ]}
    />
  );
}
