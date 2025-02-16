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
import Header from "../components/Header";
import "../assets/css/Scribbles.css";
import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router";
import useKeyPress from "../utils/useKeyPress";
import { authClient } from "../lib/auth.client";
import * as utils from "../utils/ScribblesUtils";

export const meta = utils.meta;

export default function Scribbles() {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  let file: string, user: string;
  const codeRef = useRef<MDXEditorMethods>(null);
  const { state } = useLocation();
  let navigate = useNavigate();

  const setMarkdown = async () => {
    const md = await fetch(
      import.meta.env.VITE_PROJECT_URL +
        "/api/md?file=" +
        file +
        "&user=" +
        user,
      {
        method: "GET",
      }
    );
    codeRef.current?.setMarkdown(await md.text());
  };

  let saveCallback = (e) => {
    e.preventDefault();
    saveMarkdown();
  };

  const checkSession = async () => {
    if (loading) {
      try {
        const { data } = await authClient.getSession();
        if (data != null) {
          setAuthenticated(true);
          ({ file, user } = state);
          navigate(".", { state: { file: file, user: user } });
          setMarkdown();
          document.addEventListener("beforeunload", saveCallback);
          document.addEventListener("pagehide", saveCallback);
          document.addEventListener("visibilitychange", saveCallback);
          setLoading(false);
        } else {
          setAuthenticated(false);
          navigate("/signin", {
            state: { redirect: "/scribbles", misc: state },
          });
        }
      } catch (error) {
        console.error("Error checking session:", error);
        setAuthenticated(false);
        navigate("/signin", { state: { redirect: "/scribbles", misc: state } });
      }
    }
  };

  useEffect(() => {
    checkSession();
    return () => {
      document.removeEventListener("beforeunload", saveCallback);
      document.removeEventListener("pagehide", saveCallback);
      document.removeEventListener("visibilitychange", saveCallback);
    };
  });

  useKeyPress(["s"], saveCallback, null, true);

  let lastMarkdown = "";

  const saveMarkdown = async () => {
    if (file != undefined && user != undefined) {
      if (codeRef.current?.getMarkdown() != lastMarkdown) {
        const formData = new FormData();
        formData.append("md", codeRef.current?.getMarkdown() || "");
        formData.append("id", file);
        formData.append("user", user);
        await fetch(import.meta.env.VITE_PROJECT_URL + "/api/md", {
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
      markdown={authenticated ? codeRef.current?.getMarkdown() || "" : ""}
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
              <Header
                className="header"
                actionLink={false}
                extraItem={<KitchenSinkToolbar />}
              />
            </>
          ),
        }),
      ]}
    />
  );
}
