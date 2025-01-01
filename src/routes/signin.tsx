import { Form } from "react-router";
import { useState } from "react";
import { authClient } from "../lib/auth.client";
import React from "react";

export function meta() {
  return [
    { title: "Sign In - Codeboard" },
    {
      name: "description",
      content:
        "Sign in to Codeboard, the platform that helps you to develop faster.",
    },
  ];
}

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signIn = async () => {
    await authClient.signIn.email(
      {
        email,
        password,
      },
      {
        onRequest: (ctx) => {
          // show loading state
        },
        onSuccess: (ctx) => {
          window.location.href = "/dashboard";
        },
        onError: (ctx) => {
          console.log(ctx.error);
          alert(ctx.error);
        },
      }
    );
  };

  return (
    <div>
      <h2>Sign In</h2>
      <Form onSubmit={signIn}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Sign In</button>
      </Form>
      <p>
        Don't have an account? Sign up <a href="/signup">here</a>.
      </p>
    </div>
  );
}
