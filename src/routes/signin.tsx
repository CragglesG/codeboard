import { Form, useLocation, useNavigate } from "react-router";
import { useState } from "react";
import { authClient } from "../lib/auth.client";
import React from "react";
import "../assets/css/forms.css";

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
  const { state } = useLocation();
  const { redirect, misc } = state || { redirect: "/dashboard", misc: {} };
  let navigate = useNavigate();

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
          navigate(redirect, { state: misc });
        },
        onError: (ctx) => {
          console.log(ctx.error);
          alert(ctx.error.message);
        },
      }
    );
  };

  const toSignUp = () => {
    navigate("/signup", { state: { redirect: redirect, misc: misc } });
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
        Don't have an account? Sign up <a onClick={toSignUp}>here</a>.
      </p>
    </div>
  );
}
