import { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import { AppHttpError } from "../helpers";
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
  const { email } = req.body.user;
  try {
    const emailExists = await UserModel.exists({ email });
    if (!emailExists) {
      return next();
    }
    return next(new AppHttpError(StatusCodes.BAD_REQUEST, Message.EmailExists));
  } catch (err) {
    return next(err);
  }
};

/**
 * Express middleware
 *
 * Check if an email already exists
 *
 * Allows continuation if exists
 *
 * @throws {AppHttpError} if email does not exist
 */
export const emailExists: RequestHandler = async (req, res, next) => {
  const { email } = req.body.user;
  try {
    const emailExists = await UserModel.exists({ email });
    if (emailExists) {
      return next();
    }
    return next(
      new AppHttpError(StatusCodes.BAD_REQUEST, Message.EmailInexistent)
    );
  } catch (err) {
    return next(err);
  }
};

/**
 * Express middleware
 *
 * Check if a user is authenticated via the authorization header or
 * cookie token
 *
 * Attaches `user` to `req.body` if authenticated
 * @throws {AppHttpError} if not authenticated
 */
export const isAuthenticated: RequestHandler = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    res.status(StatusCodes.UNAUTHORIZED).send();
  }
  const token =
    authorization && authorization.includes("Bearer")
      ? authorization.replace("Bearer ", "")
      : req.cookies.token;
  if (!token) {
    res.status(StatusCodes.UNAUTHORIZED).send();
  }
  try {
    const { _id } = (await decryptJwt(token)) as { [_id: string]: string };
    const userDoc = await UserModel.findOne({ _id });
    if (!userDoc) {
      return res.status(StatusCodes.UNAUTHORIZED).send();
    }

    req.body.user = userDoc.toJSON();
    return next();
  } catch (err) {
    console.error(err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send();
  }
};
// TODO: Refactor codes wherever duplicitoues
