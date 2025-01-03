import { Form } from "react-router";
import { useState } from "react";
import { authClient } from "../lib/auth.client";
import React from "react";
import "../assets/css/auth-forms.css";

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
      <h2 style={{ width: "5.2rem", marginBottom: "0.5rem" }}>Sign In</h2>
      <p style={{ width: "24.1rem" }}>
        Sign in to Codeboard to continue developing faster.
      </p>
      <br />
      <Form
        onSubmit={signIn}
        style={{ width: "13rem", marginBottom: "0.5rem" }}
      >
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />
        <button type="submit">Sign In</button>
      </Form>
      <p style={{ width: "17.4rem" }}>
        Don't have an account? Sign up <a href="/signup">here</a>.
      </p>
    </div>
  );
}
