import { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import { AppHttpError } from "../helpers";
import { Message } from "../helpers/constants";
import { decryptJwt } from "../helpers/util-fns";
import { UserModel } from "../models";

export const emailExists: RequestHandler = async (req, res, next) => {
  const { email } = req.body.user;
  try {
    const emailExists = await UserModel.exists({ email });
    if (!emailExists) {
      return next();
    }
    return next(new AppHttpError(StatusCodes.OK, Message.EmailExists));
  } catch (err) {
    return next(err);
  }
};

export const isLoggedIn: RequestHandler = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    res.status(401).send();
  }
  const token =
    authorization && authorization.includes("Bearer")
      ? authorization.replace("Bearer ", "")
      : req.cookies.token;
  if (!token) {
    // unauthorized
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
