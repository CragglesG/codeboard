import type { Route } from "./+types/api.boards.$";
import { put } from "@vercel/blob";

export async function action({ request }: Route.ActionArgs) {
  const requestForm = await request.formData();
  const user = requestForm.get("user") as string;
  const file = requestForm.get("board") as string;
  const id = requestForm.get("id") as string;

  await put(`boards/${user}/${id}`, file, {
    access: "public",
    contentType: "application/json",
    cacheControlMaxAge: 10,
    addRandomSuffix: false,
  });

  return new Response();
}

export async function loader({ request }: Route.LoaderArgs) {
  const query = new URLSearchParams(request.url.split("?")[1]);
  const file = query.get("file") as string;
  const user = query.get("user") as string;

  console.log({ user: user, file: file });

  const data = await fetch(
    `${process.env.BLOB_PUBLIC_URL}/boards/${user}/${file}`
  );
  if (!data.ok && data.status === 404) {
    await put(`boards/${user}/${file}`, "{}", {
      access: "public",
      contentType: "application/json",
      cacheControlMaxAge: 10,
      addRandomSuffix: false,
    });
    return new Response("{}");
  }
  return new Response(await data.text());
}
