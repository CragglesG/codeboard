export function makeid(length: number) {
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

export async function imageUploadHandler(image: File): Promise<string> {
  const formData = new FormData();
  const imgTempId = makeid(20);
  formData.append("image", image);
  formData.append("id", imgTempId);
  const response = await fetch("/api/images", {
    method: "POST",
    body: formData,
  });
  const data = await response.json();

  return data.url;
}

export const defaultSnippet = `
  export default function App() {
    return (
      <div className="App">
        <h1>Hello World</h1>
        <h2>Start editing to see some magic happen!</h2>
      </div>
    );
  }
`.trim();

export const defaultSnippetHTML = `
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

export const simpleSandpackConfig = {
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
