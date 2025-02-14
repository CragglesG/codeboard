import type { Route } from "./+types/api.images.$";
import { put } from "@vercel/blob";

export async function action({ request }: Route.ActionArgs) {
  const requestForm = await request.formData();
  const file = requestForm.get("image") as File;
  const id = requestForm.get("id") as string;

  await put("imgStorage/" + id, file, {
    access: "public",
    contentType: file.type,
    addRandomSuffix: false,
  });

  return Response.json({
    url: import.meta.env.VITE_PROJECT_URL + "/api/images?id=" + id,
  });
}

export async function loader({ request }: Route.LoaderArgs) {
  const id = new URLSearchParams(request.url.split("?")[1]).get("id");

  const data = await fetch(`${process.env.BLOB_PUBLIC_URL}/imgStorage/${id}`);
  if (!data.ok) {
    return new Response("Failed to fetch image");
  }
  return new Response(data.body);
}
