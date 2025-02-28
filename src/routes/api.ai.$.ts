import type { Route } from "./+types/api.ai.$";
import OpenAI from "openai";

export async function action({ request }: Route.ActionArgs) {
  const requestForm = await request.formData();
  const requestContent = requestForm.get("requestContent");

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  if (!requestContent) {
    return new Response("Missing requestContent", { status: 400 });
  }

  if (typeof requestContent !== "string") {
    return new Response("Invalid requestContent", { status: 400 });
  }

  const response = await openai.chat.completions.create(
    JSON.parse(requestContent)
  );

  return new Response(JSON.stringify(response));
}
