import { Form, useNavigate, useLocation } from "react-router";
import { useState } from "react";
import { authClient } from "../lib/auth.client";
import React from "react";
import "../assets/css/auth-forms.css";

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
  const { state } = useLocation();
  const { redirect, misc } = state || { redirect: "/dashboard", misc: {} };
  let navigate = useNavigate();

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
          navigate(redirect, { state: misc });
        },
        onError: (ctx) => {
          alert(ctx.error.message);
        },
      }
    );
  };

  const toSignIn = () => {
    navigate("/signin", { state: { redirect: redirect, misc: misc } });
  };

  return (
    <div>
      <h2 style={{ width: "5.7rem", marginBottom: "0.5rem" }}>Sign Up</h2>
      <p style={{ width: "22.6rem" }}>
        Sign up to Codeboard to start developing faster.
      </p>
      <Form
        onSubmit={signUp}
        style={{ width: "13rem", marginBottom: "0.5rem" }}
      >
        <input
          className="top-input"
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
      <p style={{ width: "18.1rem" }}>
        Already have an account? Sign in <a onClick={toSignIn}>here</a>.
      </p>
    </div>
  );
}
