import type { Route } from "./+types/api.listmd.$";
import { list } from "@vercel/blob";

export async function action({ request }: Route.ActionArgs) {
  const requestForm = await request.formData();
  const id = requestForm.get("user");

  if (id != null) {
    const files = (await list({ prefix: `mdStorage/${id}/` })).blobs;
    const fileNames = files.map((file) => file.pathname.split("/")[2]);
    let fileTitles: string[] = [];
    for (let i = 0; i < files.length; i++) {
      let md = await fetch(
        import.meta.env.VITE_PROJECT_URL +
          "/api/md?file=" +
          files[i].pathname.split("/")[2] +
          "&user=" +
          id,
        {
          method: "GET",
        }
      );
      let mdText = await md.text();
      let title = mdText.match(/title: (.*)/);
      if (title != null) {
        fileTitles.push(title[1]);
      } else {
        fileTitles.push("Untitled");
      }
    }
    return new Response(
      JSON.stringify({ files: fileNames, titles: fileTitles })
    );
  } else {
    return new Response(JSON.stringify([{ id: "error" }]), { status: 400 });
  }
}
