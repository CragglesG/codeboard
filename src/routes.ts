import { type RouteConfig, route } from "@react-router/dev/routes";

export default [
  // * matches all URLs, the ? makes it optional so it will match / as well
  route("/newscribble", "routes/newscribble.tsx"),
  route("/dashboard", "routes/Dashboard.tsx"),
  route("/api/images/*", "routes/api.images.$.ts"),
  route("/api/md/*", "routes/api.md.$.ts"),
  route("/api/auth/*", "routes/api.auth.$.ts"),
  route("/api/listmd/*", "routes/api.listmd.$.ts"),
  route("/errorout", "routes/errorout.tsx"),
  route("/scribbles", "routes/Scribbles.tsx"),
  route("/signup", "routes/signup.tsx"),
  route("/signin", "routes/signin.tsx"),
  route("*?", "catchall.tsx"),
] satisfies RouteConfig;
