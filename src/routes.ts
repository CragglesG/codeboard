import { type RouteConfig, route, index } from "@react-router/dev/routes";

export default [
  route("/newscribble", "routes/newscribble.tsx"),
  route("/dashboard", "routes/Dashboard.tsx"),
  route("/api/images/*", "routes/api.images.$.ts"),
  route("/api/md/*", "routes/api.md.$.ts"),
  route("/api/auth/*", "routes/api.auth.$.ts"),
  route("/api/listmd/*", "routes/api.listmd.$.ts"),
  route("/scribbles", "routes/Scribbles.tsx"),
  route("/signup", "routes/signup.tsx"),
  route("/signin", "routes/signin.tsx"),
  index("routes/home.tsx"),
  route("*", "catchall.tsx"),
] satisfies RouteConfig;
