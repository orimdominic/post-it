import { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import { AppHttpError } from "../helpers";
import { hashPassword, createJwt } from "../helpers/util-fns";
import { UserModel, PasswordResetModel } from "../models";
import { NodeMailer } from "../services/emails";
import { NodeMailerConfig, Message } from "../helpers/constants";
const { email: mailerEmail, password: mailerPassword } = NodeMailerConfig;

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
      const mailer = new NodeMailer(mailerEmail as string, mailerPassword)
        .setSubject(Message.RegMailSubject.replace("%useremail%", email))
        .setContent(
          "text",
          Message.RegMailContent.replace("%useremail%", email)
        )
        .addRecipient(email);
      await mailer.send();
      res.header("X-Access-Token", token);
      res.cookie("token", token);
      res.status(StatusCodes.CREATED).json(userDoc.toJSON());
    } catch (err) {
      await UserModel.findOneAndRemove({ email });
      next(new AppHttpError(StatusCodes.INTERNAL_SERVER_ERROR, err.message));
    }
  };

  static login: RequestHandler = async (req, res, next) => {
    const { email, password } = req.body;
    try {
      const userDoc = await UserModel.findOne({ email });
      if (!userDoc) {
        res.status(StatusCodes.FORBIDDEN).send();
      }
      const hashedPassword = await createJwt(password);
      if (hashedPassword !== userDoc.password) {
        res.status(StatusCodes.FORBIDDEN).send();
      }
      delete userDoc._doc.password;
      const token = await createJwt(userDoc.toJSON());
      res.header("X-Access-Token", token);
      res.cookie("token", token);
      res.status(StatusCodes.OK).json(userDoc.toJSON());
    } catch (err) {
      next(new AppHttpError(StatusCodes.INTERNAL_SERVER_ERROR, err.message));
    }
  };

  static sendPasswordResetCode: RequestHandler = async (req, res, next) => {
    const { email } = req.body;
    try {
      // Generate 6-digit code
      const [code] = (Math.random() * Math.pow(10, 6)).toString().split(".");
      await PasswordResetModel.create({
        code, email
      })
    } catch (err) {}
  };
}

// TODO: set stings to mssage constants
