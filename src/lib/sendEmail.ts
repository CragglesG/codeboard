import { LoopsClient } from "loops";

const loops = new LoopsClient(process.env.LOOPS_API_KEY as string);

export function sendEmailVerification({
  name,
  email,
  link,
}: {
  name: string;
  email: string;
  link: string;
}) {
  return loops.sendTransactionalEmail({
    transactionalId: "cm7mdqsh801mw16uuejovhyed",
    email: email,
    dataVariables: {
      userName: name,
      verifyLink: link,
    },
  });
}
