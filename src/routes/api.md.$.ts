import type { Route } from "./+types/api.md.$";
import { put } from "@vercel/blob";

export async function action({ request }: Route.ActionArgs) {
  const requestForm = await request.formData();
  const file = requestForm.get("md") as string;
  const user = requestForm.get("user") as string;
  const id = requestForm.get("id") as string;

  await put(`mdStorage/${user}/${id}`, file, {
    access: "public",
    contentType: "text/markdown",
    cacheControlMaxAge: 10,
    addRandomSuffix: false,
  });

  return new Response();
}

export async function loader({ request }: Route.LoaderArgs) {
  const query = new URLSearchParams(request.url.split("?")[1]);
  const file = query.get("file") as string;
  const user = query.get("user") as string;

  const data = await fetch(
    `${process.env.BLOB_PUBLIC_URL}/mdStorage/${user}/${file}`
  );
  if (!data.ok && data.status === 404) {
    await put(
      `mdStorage/${user}/${file}`,
      "Something went wrong while loading this scribble. Please try again later, and if the problem persists, contact support.",
      {
        access: "public",
        contentType: "text/markdown",
        cacheControlMaxAge: 10,
        addRandomSuffix: false,
      }
    );
    return new Response("");
  }
  return new Response(await data.text());
}
