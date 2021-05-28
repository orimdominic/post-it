import { RequestHandler } from "express";
import {
  createPostSchema,
  updatePostSchema,
  registerUserSchema,
  userLoginSchema,
  forgotPasswordSchema,
} from "./schemas";
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

export const registerUserSchemaValidator: RequestHandler = async (
  req,
  res,
  next
) => {
  const { user: form } = req.body;

  try {
    trimInputs(form);

    await registerUserSchema.validateAsync(form, { abortEarly: false });

    return next();
  } catch (err) {
    return next(
      new AppHttpError(StatusCodes.UNPROCESSABLE_ENTITY, err.message)
    );
  }
};

export const updatePostSchemaValidator: RequestHandler = async (
  req,
  res,
  next
) => {
  const { post: form } = req.body;

  try {
    trimInputs(form);

    await updatePostSchema.validateAsync(form, { abortEarly: false });
    return next();
  } catch (err) {
    return next(
      new AppHttpError(StatusCodes.UNPROCESSABLE_ENTITY, err.message)
    );
  }
};

export const userLoginSchemaValidator: RequestHandler = async (
  req,
  res,
  next
) => {
  const { post: form } = req.body;

  try {
    trimInputs(form);

    await userLoginSchema.validateAsync(form, { abortEarly: false });
    return next();
  } catch (err) {
    return next(
      new AppHttpError(StatusCodes.UNPROCESSABLE_ENTITY, err.message)
    );
  }
};

export const forgotPasswordSchemaValidator: RequestHandler = async (
  req,
  res,
  next
) => {
  const { post: form } = req.body;

  try {
    trimInputs(form);

    await forgotPasswordSchema.validateAsync(form, { abortEarly: false });
    return next();
  } catch (err) {
    return next(
      new AppHttpError(StatusCodes.UNPROCESSABLE_ENTITY, err.message)
    );
  }
};
