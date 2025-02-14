import { Route } from "../project/+types";
import { Blob } from "@vercel/blob";

export async function action({ request }: Route.ActionArgs) {
  const requestForm = await request.formData();
  const file = requestForm.get("md") as string;
  const user = requestForm.get("user") as string;
  const id = requestForm.get("id") as string;

  await Blob.write("mdStorage/" + user + "/" + id, Buffer.from(file));

  return new Response("Success");
}

export async function loader({ request }: Route.LoaderArgs) {
  const query = new URLSearchParams(request.url.split("?")[1]);
  const file = query.get("file") as string;
  const user = query.get("user") as string;
  const path = "mdStorage/" + user + "/" + file;

  const data = await Blob.read(path);
  return new Response(data.toString());
}
