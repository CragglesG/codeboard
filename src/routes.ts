import { type RouteConfig, route } from "@react-router/dev/routes";

export default [
  // * matches all URLs, the ? makes it optional so it will match / as well
  route("/dashboard", "components/Dashboard.jsx"),
  route("/api/images/*", "routes/api.images.$.ts"),
  route("/api/md/*", "routes/api.md.$.ts"),
  route("/api/auth/*", "routes/api.auth.$.ts"),
  route("/scribbles", "components/Scribbles.tsx"),
  route("/signup", "routes/signup.tsx"),
  route("/signin", "routes/signin.tsx"),
  route("*?", "catchall.tsx"),
] satisfies RouteConfig;
