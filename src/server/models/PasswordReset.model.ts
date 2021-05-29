import { model, Schema } from "mongoose";
import { ModelName } from "../helpers/constants";

const passwordResetSchema = new Schema(
  {
    email: String,
    code: String,
  },
  { versionKey: false }
);

export const PasswordResetModel = model(
  ModelName.PasswordRest,
  passwordResetSchema
);
