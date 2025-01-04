import { Route } from "../project/+types";
import fs from "node:fs";

export async function action({ request }: Route.ActionArgs) {
  const requestForm = await request.formData();
  const file = requestForm.get("md") as File;
  const user = requestForm.get("user") as string;
  const id = requestForm.get("id") as string;

  if (!fs.existsSync("mdStorage/" + user)) {
    fs.mkdirSync("mdStorage/" + user, { recursive: true });
  }

  fs.writeFileSync(
    "mdStorage/" + user + "/" + id,
    Buffer.from(await file.arrayBuffer())
  );

  return new Response("Success");
}

export async function loader({ request }: Route.LoaderArgs) {
  const query = new URLSearchParams(request.url.split("?")[1]);
  const file = query.get("file") as string;
  const user = query.get("user") as string;
  const data = fs.readFileSync("mdStorage/" + file + "/" + user);
  return new Response(data.toString());
}
