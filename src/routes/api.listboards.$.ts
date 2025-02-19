import type { Route } from "./+types/api.listboards.$";
import { list } from "@vercel/blob";

export async function action({ request }: Route.ActionArgs) {
  const requestForm = await request.formData();
  const id = requestForm.get("user");

  if (id != null) {
    const files = (await list({ prefix: `boards/${id}/` })).blobs;
    let fileTitles: string[] = [];
    for (let i = 0; i < files.length; i++) {
      let board = await fetch(
        import.meta.env.VITE_PROJECT_URL +
          "/api/boards?file=" +
          files[i].pathname.split("/")[2] +
          "&user=" +
          id,
        {
          method: "GET",
        }
      );
      let boardData = await board.text();
      if (boardData) {
        if (boardData === "{}") {
          continue;
        } else {
          let title = JSON.parse(boardData)[0].data.label;
          fileTitles.push(title);
        }
      } else {
        fileTitles.push("Untitled");
      }
    }
    return new Response(JSON.stringify({ files: files, titles: fileTitles }));
  } else {
    return new Response(
      JSON.stringify({ error: "id value should not be null" }),
      { status: 400 }
    );
  }
}
