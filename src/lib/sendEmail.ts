import { LoopsClient } from "loops";

const loops = new LoopsClient(process.env.LOOPS_API_KEY as string);

export function sendChangeEmailVerification({
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
    transactionalId: "cm7novp1800ckugcj9v1egovq",
    email: email,
    dataVariables: {
      userName: name,
      verifyLink: link,
    },
  });
}

export function sendResetPassword({
  name,
  email,
  link,
}: {
  name: string;
  email: string;
  link: string;
}) {
  return loops.sendTransactionalEmail({
    transactionalId: "cm7npdoy601u42x8k6zszkbtf",
    email: email,
    dataVariables: {
      userName: name,
      resetLink: link,
    },
  });
}
