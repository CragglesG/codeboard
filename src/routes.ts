import { type RouteConfig, route } from "@react-router/dev/routes";

export default [
  // * matches all URLs, the ? makes it optional so it will match / as well
  route("/api/auth/*", "routes/api.auth.$.ts"),
  route("/scribbles", "components/Scribbles.jsx"),
  route("/signup", "routes/signup.tsx"),
  route("/signin", "routes/signin.tsx"),
  route("*?", "catchall.tsx"),
] satisfies RouteConfig;
