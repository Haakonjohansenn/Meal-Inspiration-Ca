import { Router, Route, RootRoute } from "@tanstack/react-router";
import Root from "./App";
import HomePage from "./pages/Home";

const rootRoute = new RootRoute({
  component: Root,
});

// NOTE: @see https://tanstack.com/router/v1/docs/guide/routes

const indexRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
]);

export const router = new Router({ routeTree });

export default router;
