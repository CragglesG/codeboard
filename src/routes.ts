import { type RouteConfig, route, index } from "@react-router/dev/routes";

export default [
  route("/boards", "routes/Boards.tsx"),
  route("/newboard", "routes/NewBoard.tsx"),
  route("/newscribble", "routes/NewScribble.tsx"),
  route("/dashboard", "routes/Dashboard.tsx"),
  route("/api/images/*", "routes/api.images.$.ts"),
  route("/api/md/*", "routes/api.md.$.ts"),
  route("/api/auth/*", "routes/api.auth.$.ts"),
  route("/api/listmd/*", "routes/api.listmd.$.ts"),
  route("/api/boards/*", "routes/api.boards.$.ts"),
  route("/api/listboards/*", "routes/api.listboards.$.ts"),
  route("/scribbles", "routes/Scribbles.tsx"),
  route("/signup", "routes/signup.tsx"),
  route("/signin", "routes/signin.tsx"),
  index("routes/Home.tsx"),
  route("*", "catchall.tsx"),
] satisfies RouteConfig;
