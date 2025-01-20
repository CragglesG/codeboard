import { Route } from "../project/+types";
import fs from "node:fs";

export async function action({ request }: Route.ActionArgs) {
  const requestForm = await request.formData();
  const id = requestForm.get("user");

  if (id != null) {
    const files = fs.readdirSync("mdStorage/" + id);
    return new Response(JSON.stringify(files));
  } else {
    return new Response(JSON.stringify([{ id: "error" }]), { status: 400 });
  }
}
