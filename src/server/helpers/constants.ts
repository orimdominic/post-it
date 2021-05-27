import { config } from "dotenv";

process.env.NODE_ENV === "production"
  ? config()
  : config({ path: ".local.env" });

export const Server = {
  ENV: process.env.NODE_ENV ? process.env.NODE_ENV.toString() : "development",
  PORT: process.env.PORT ? parseInt(process.env.PORT) : 5000,
  ApiV1BaseRoute: "/api/v1"
};
