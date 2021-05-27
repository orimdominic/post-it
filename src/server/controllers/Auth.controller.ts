import { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import { AppHttpError } from "../helpers";
import { hashPassword, createJwt } from "../helpers/util-fns";
import { UserModel } from "../models";

export class AuthController {
  static register: RequestHandler = async (req, res, next) => {
    const { email, password } = req.body.user;
    try {
      const hashedPassword = await hashPassword(password);
      const userDoc = await UserModel.create({
        email,
        password: hashedPassword,
      });
      delete userDoc._doc.password;
      const token = await createJwt(userDoc.toJSON());
      // TODO: Send email
      res.setHeader("token", token);
      res.status(StatusCodes.CREATED).json(userDoc);
    } catch (err) {
      next(new AppHttpError(StatusCodes.INTERNAL_SERVER_ERROR, err.message));
    }
  };
}
