import { connection, connect } from "mongoose";
import { dbURI } from "../helpers/constants";

connect(dbURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
})
  .catch((reason) =>
    console.error("mongodb connection failed", JSON.stringify(reason, null, 2))
  )
  .then(() => console.log("mongodb connection successful"));

const db = connection;

db.on("error", (err) => console.error(err));

export { db };
