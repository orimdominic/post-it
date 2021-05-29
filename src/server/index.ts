import http from "http";
import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import { initMongoDb } from "./configs";
import { getReasonPhrase, StatusCodes } from "http-status-codes";
import apiRouter from "./routes/api";
import { Message, Server } from "./helpers/constants";
import { AppHttpResponse, AppHttpError } from "./helpers";

// Start the database
initMongoDb();

// Set up the express app
const app: Application = express();

app.use(helmet());
app.set("trust proxy", 1);
app.use(cors({ exposedHeaders: "X-Access-Token" }));
app.use(compression());
app.use(express.json(), express.urlencoded({ extended: true, limit: "50mb" }));
// TODO: Add Logger.stream as stream
app.use(
  morgan(":remote-addr - [:date] :method :url :status - :response-time ms")
);

app.use((req, res, next) => {
  if (
    req.method === "GET" &&
    (req.path === Server.BaseApiRoute || req.path === "/")
  ) {
    return res.status(StatusCodes.OK).send("🤝👌");
  }
  next();
});

app.use(Server.BaseApiRoute, apiRouter);

// Error handling
app.use((req, res, next) => {
  const err = new AppHttpError(StatusCodes.BAD_REQUEST, Message.RouteNotFound);
  next(err);
});

app.use(
  (err: AppHttpError, req: Request, res: Response, next: NextFunction) => {
    err.message =
      err.message || getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR);
    err.code =
      !err.code ||
      err.code < StatusCodes.CONTINUE ||
      err.code > StatusCodes.HTTP_VERSION_NOT_SUPPORTED
        ? err.code
        : StatusCodes.INTERNAL_SERVER_ERROR;
    res.locals.message = err.message;
    res.locals.error = Server.ENV === "production" ? {} : err;
    // TODO: Log error with logger
    AppHttpResponse.send(res, err.code, null, err.message);
    next();
  }
);

const server = http.createServer(app);
server.listen(Server.PORT, () => {
  console.info(
    `Server is running on http://localhost:${Server.PORT}${Server.BaseApiRoute}`
  );
});

// TODO: Setup Logger
// TODO: Setup Swagger
// TODO: Email service setup
// Make HTTP fit proper response and request styles
