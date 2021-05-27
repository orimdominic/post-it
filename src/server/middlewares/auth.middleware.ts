import { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import { AppHttpError } from "../helpers";
import { Message } from "../helpers/constants";
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
