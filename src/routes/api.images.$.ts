import { Route } from "../project/+types";
import ImageKit from "imagekit-javascript";
import jwt from "jsonwebtoken";
import { type Secret } from "jsonwebtoken";
import { isRegExp } from "node:util/types";
import fs from "node:fs";

export async function action({ request }: Route.ActionArgs) {
  const requestForm = await request.formData();
  const file = requestForm.get("image");
  const fileName = requestForm.get("name") as string;
  const tags = "scribbles-img";
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + 3600;
  const id = requestForm.get("id") as string;

  fs.writeFile("../../imgStorage" + id, file.toString(), (err) => {
    if (err) throw err;
  });

  let body = new FormData();
  body.append(
    "file",
    process.env.VITE_PROJECT_URL + "/api/images/get?file=" + id
  );
  body.append("fileName", fileName);
  body.append("tags", tags);

  const token = jwt.sign(
    {
      fileName: fileName,
      tags: tags,
      iat: iat,
      exp: exp,
    },
    process.env.IK_PRIVATE_KEY as Secret,
    {
      header: {
        alg: "HS256",
        typ: "JWT",
        kid: process.env.IK_PUBLIC_KEY,
      },
    }
  );

  body.append("token", token);

  const result = await fetch(process.env.IK_URL_ENDPOINT as string, {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: `Basic ${Buffer.from(
        process.env.IK_PRIVATE_KEY || "oops, no private key"
      ).toString("base64")}:`,
    },
    body: body,
  });

  fs.rm("../../imgStorage" + id, (err) => {
    if (err) throw err;
  });

  return Response.json(await result.json());
}
