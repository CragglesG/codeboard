import { Form } from "react-router";
import { useState } from "react";
import { authClient } from "../lib/auth.client";
import React from "react";

export function meta() {
  return [
    { title: "Sign Up - Codeboard" },
    {
      name: "description",
      content:
        "Sign up to Codeboard, the platform that helps you to develop faster.",
    },
  ];
}

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const signUp = async () => {
    await authClient.signUp.email(
      {
        email,
        password,
        name,
      },
      {
        onRequest: (ctx) => {
          // loading state
        },
        onSuccess: (ctx) => {
          window.location.href = "/dashboard";
        },
        onError: (ctx) => {
          alert(ctx.error.message);
        },
      }
    );
  };

  return (
    <div>
      <h2>Sign Up</h2>
      <Form onSubmit={signUp}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button type="submit">Sign Up</button>
      </Form>
      <p>
        Already have an account? Sign in <a href="/signin">here</a>.
      </p>
    </div>
  );
}
