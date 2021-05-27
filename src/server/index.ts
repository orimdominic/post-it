import http from "http";
import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import { getReasonPhrase, StatusCodes } from "http-status-codes";
import { Message, Server } from "./helpers/constants";
import { AppHttpResponse } from "./helpers/AppHttpResponse";
import { AppHttpError } from "./helpers/AppHttpError";

// Set up the express app
const app: Application = express();

app.use(helmet());
app.set("trust proxy", 1);
app.use(cors({ exposedHeaders: "X-Access-Token" }));
app.use(compression());
app.use(express.json(), express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  if (
    req.method === "GET" &&
    (req.path === Server.BaseRoute || req.path === "/")
  ) {
    return res.status(StatusCodes.OK).send("🤝👌");
  }
  next();
});

// app.use(Server.BaseRoute, v1Router)

// Error handling
app.use((req, res, next) => {
  const err = new AppHttpError(StatusCodes.BAD_REQUEST, Message.RouteNotFound);
  next(err);
});

app.use(
  (err: AppHttpError, req: Request, res: Response, next: NextFunction) => {
    err.message =
      err.message || getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR);
    res.locals.message = err.message;
    res.locals.error = Server.ENV === "production" ? {} : err;
    // TODO: Log error with logger
    AppHttpResponse.send(
      res,
      err.code || StatusCodes.INTERNAL_SERVER_ERROR,
      null,
      err.message
    );
    next();
  }
);

const server = http.createServer(app);
server.listen(Server.PORT, () => {
  console.info(
    `Server is running on http://localhost:${Server.PORT}${Server.BaseRoute}`
  );
});
