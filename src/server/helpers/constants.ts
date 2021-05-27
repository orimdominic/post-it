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

  EmailExists = "Email already exists",
  UsernameExists = "Username already exists",
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

/**
 * The URI for the mongodb database used
 */
export const dbURI = process.env.DB_URI
  ? process.env.DB_URI
  : "mongodb://localhost:27017/posts-db";

export enum ModelName {
  Post = "Post",
  User = "User",
}
