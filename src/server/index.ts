import http from "http";
import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import { StatusCodes } from "http-status-codes"
import { Server } from "./helpers/constants";

// Set up the express app
const app: Application = express();

app.use(helmet());
app.set("trust proxy", 1);
app.use(cors({ exposedHeaders: "X-Access-Token" }));
app.use(compression());
app.use(express.json(), express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  if(req.path === Server.ApiV1BaseRoute || req.path === "/"){
    return res.status(StatusCodes.OK).send("🤝👌")
  }
  next()
})

// app.use(Server.ApiV1BaseRoute, v1Router)

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.locals.message = err.message;
  res.locals.error = Server.ENV === "production" ? {} : err;
  next();
});

const server = http.createServer(app);
server.listen(Server.PORT, () => {
  console.info(`Server is running on http://localhost:${Server.PORT}${Server.ApiV1BaseRoute}`);
});