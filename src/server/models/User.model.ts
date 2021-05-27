import { model, Schema } from "mongoose";
import { ModelName } from "../helpers/constants";

const userSchema = new Schema(
  {
    email: String,
    password: String,
  },
  { versionKey: false }
);

export const UserModel = model(ModelName.User, userSchema);
