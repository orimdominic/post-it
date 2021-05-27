import { RequestHandler } from "express";
import { createPostSchema } from "./schemas/create-post.schema";
import { trimInputs } from "../helpers/util-fns";
import { AppHttpError } from "../helpers/AppHttpError";
import { StatusCodes } from "http-status-codes";

export const createPostSchemaValidator: RequestHandler = async (
  req,
  res,
  next
) => {
  const { post: form } = req.body;

  try {
    trimInputs(form);

    await createPostSchema.validateAsync(form, { abortEarly: false });
    return next();
  } catch (err) {
    return next(
      new AppHttpError(StatusCodes.UNPROCESSABLE_ENTITY, err.message)
    );
  }
};
