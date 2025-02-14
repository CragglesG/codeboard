import { Route } from "../project/+types";
import { Blob } from "@vercel/blob";

export async function action({ request }: Route.ActionArgs) {
  const requestForm = await request.formData();
  const file = requestForm.get("image") as File;
  const id = requestForm.get("id") as string;

  await Blob.write("imgStorage/" + id, Buffer.from(await file.arrayBuffer()));

  return Response.json({
    url: process.env.VITE_PROJECT_URL + "/api/images/get?file=" + id,
  });
}

export async function loader({ request }: Route.LoaderArgs) {
  const query = new URLSearchParams(request.url.split("?")[1]);
  const file = query.get("file") as string;
  const data = await Blob.read("imgStorage/" + file);
  return new Response(data);
}
