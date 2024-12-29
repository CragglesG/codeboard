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
} from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";
import Header from "./Header";
import { LenisProvider } from "./LenisInstance";
import "./Scribbles.css";

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
  return (
    <LenisProvider>
      <MDXEditor
        className="dark-editor"
        markdown=""
        plugins={[
          headingsPlugin(),
          quotePlugin(),
          listsPlugin(),
          thematicBreakPlugin(),
          linkPlugin(),
          linkDialogPlugin(),
          imagePlugin(),
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
                <Header className="header" extraItem={<KitchenSinkToolbar />} />
              </>
            ),
          }),
        ]}
      />
    </LenisProvider>
  );
}
