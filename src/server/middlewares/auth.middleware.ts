import { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import { AppHttpError, AppHttpResponse } from "../helpers";
import { Message } from "../helpers/constants";
import { decryptJwt } from "../helpers/util-fns";
import { UserModel } from "../models";

/**
 * Express middleware
 *
 * Check if an email does not already exist
 *
 * Allows continuation if email does not exist
 *
 * @throws {AppHttpError} if email exists
 */
export const emailInexistent: RequestHandler = async (req, res, next) => {
  const email = req.body.user || req.body.email;
  try {
    const emailExists = await UserModel.exists({ email });
    if (!emailExists) {
      return next();
    }
    return next(new AppHttpError(StatusCodes.BAD_REQUEST, Message.EmailExists));
  } catch (err) {
    return next(
      new AppHttpError(StatusCodes.INTERNAL_SERVER_ERROR, err.message)
    );
  }
};

/**
 * Express middleware
 *
 * Check if an email already exists
 *
 * Allows continuation if it exists
 *
 * @throws {AppHttpError} if email does not exist
 */
export const emailExists: RequestHandler = async (req, res, next) => {
  const email = req.body.user || req.body.email;
  try {
    const emailExists = await UserModel.exists({ email });
    if (emailExists) {
      return next();
    }
    return next(
      new AppHttpError(StatusCodes.BAD_REQUEST, Message.EmailInexistent)
    );
  } catch (err) {
    return next(new AppHttpError(StatusCodes.BAD_REQUEST, err.message));
  }
};

/**
 * Express middleware
 *
 * Check if a user is authenticated via the authorization header or
 * cookie token
 *
 * Attaches `user` to `req.body` if authenticated.
 * Terminates request if unauthenticated
 */
export const isAuthenticated: RequestHandler = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return AppHttpResponse.send(res, StatusCodes.UNAUTHORIZED, null);
  }
  const token =
    authorization && authorization.includes("Bearer")
      ? authorization.replace("Bearer ", "")
      : req.cookies.token;
  if (!token) {
    return AppHttpResponse.send(res, StatusCodes.UNAUTHORIZED, null);
  }
  try {
    const { _id } = (await decryptJwt(token)) as { [_id: string]: string };
    const userDoc = await UserModel.findOne({ _id });
    if (!userDoc) {
      return AppHttpResponse.send(res, StatusCodes.UNAUTHORIZED, null);
    }

    req.body.user = userDoc.toJSON();
    return next();
  } catch (err) {
    return next(new AppHttpError(StatusCodes.BAD_REQUEST, err.message));
  }
};
