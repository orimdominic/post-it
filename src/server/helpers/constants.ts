import { config } from "dotenv";

process.env.NODE_ENV === "production"
  ? config()
  : config({ path: ".local.env" });

export const Server = {
  ENV: process.env.NODE_ENV ? process.env.NODE_ENV.toString() : "development",
  PORT: process.env.PORT ? parseInt(process.env.PORT) : 5000,
  BaseApiRoute: "/api",
};

/**
 * Message string constants
 */
export enum Message {
  RouteNotFound = "Route not found",
}

/**
 * Application routes
 */
export enum Route {
  Register = "/auth/register",
  Login = "/auth/login",
  ResetPassword = "auth/password-reset",
  Posts = "/posts",
  PostWithIdParam = "/posts/:id",
}
