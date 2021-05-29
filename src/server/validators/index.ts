import { RequestHandler } from "express";
import {
  createPostSchema,
  updatePostSchema,
  registerUserSchema,
  userLoginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  postImageSchema,
  getUsersQuerySchema,
} from "./schemas";
import { trimInputs } from "../helpers/util-fns";
import { AppHttpError } from "../helpers/AppHttpError";
import { StatusCodes } from "http-status-codes";

export const createPostSchemaValidator: RequestHandler = async (
  req,
  res,
  next
) => {
  const form = req.body;
  const files = req.files;
  try {
    trimInputs(form);

    await createPostSchema.validateAsync(form, { abortEarly: false });
    await postImageSchema.validateAsync(files, { abortEarly: false });

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
  const form = req.body;
  const files = req.files;

  try {
    trimInputs(form);

    await updatePostSchema.validateAsync(form, { abortEarly: false });
    await postImageSchema.validateAsync(files, { abortEarly: false });

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
  const form = req.body;
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
  const form = req.body;

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

export const resetPasswordSchemaValidator: RequestHandler = async (
  req,
  res,
  next
) => {
  const form = req.body;

  try {
    trimInputs(form);

    await resetPasswordSchema.validateAsync(form, { abortEarly: false });

    return next();
  } catch (err) {
    return next(
      new AppHttpError(StatusCodes.UNPROCESSABLE_ENTITY, err.message)
    );
  }
};

export const getUsersQuerySchemaValidator: RequestHandler = async (
  req,
  res,
  next
) => {
  const form = req.query;

  try {
    trimInputs(form);

    await getUsersQuerySchema.validateAsync(form, { abortEarly: false });

    return next();
  } catch (err) {
    return next(
      new AppHttpError(StatusCodes.UNPROCESSABLE_ENTITY, err.message)
    );
  }
};
