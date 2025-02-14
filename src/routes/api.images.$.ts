import { Route } from "../project/+types";
import fs from "node:fs";
import { put } from "@vercel/blob";

export async function action({ request }: Route.ActionArgs) {
  const requestForm = await request.formData();
  const file = requestForm.get("image") as File;
  const id = requestForm.get("id") as string;

  const data = await put("imgStorage/" + id, file, { access: "public" });

  return Response.json({
    url: data.url,
  });
}

export async function loader({ request }: Route.LoaderArgs) {
  const query = new URLSearchParams(request.url.split("?")[1]);
  const file = query.get("file") as string;
  const data = fs.readFileSync("imgStorage/" + file);
  return new Response(data);
}
