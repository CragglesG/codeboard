import { Route } from "../project/+types";
import fs from "node:fs";

export async function action({ request }: Route.ActionArgs) {
  const requestForm = await request.formData();
  const file = requestForm.get("md") as string;
  const user = requestForm.get("user") as string;
  const id = requestForm.get("id") as string;

  if (!fs.existsSync("mdStorage/" + user)) {
    fs.mkdirSync("mdStorage/" + user, { recursive: true });
  }

  fs.writeFileSync("mdStorage/" + user + "/" + id, Buffer.from(file));

  console.log("Writing md to file");

  return new Response("Success");
}

export async function loader({ request }: Route.LoaderArgs) {
  console.log("Reading md from file");
  const query = new URLSearchParams(request.url.split("?")[1]);
  const file = query.get("file") as string;
  const user = query.get("user") as string;
  const path = "mdStorage/" + user + "/" + file;
  if (!fs.existsSync("mdStorage/" + user)) {
    fs.mkdirSync("mdStorage/" + user, { recursive: true });
  }
  if (!fs.existsSync(path)) {
    fs.writeFileSync(path, "");
  }
  const data = fs.readFileSync(path);
  return new Response(data.toString());
}
