import { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import { AppHttpError, AppHttpResponse } from "../helpers";
import { hashPassword, createJwt, comparePassword } from "../helpers/util-fns";
import { UserModel, PasswordResetModel } from "../models";
import { NodeMailer, MailService } from "../services/emails";
import { NodeMailerConfig, Message, Key } from "../helpers/constants";
const { email: mailerEmail, password: mailerPassword } = NodeMailerConfig;

export class AuthController {
  private static mailer: MailService = new NodeMailer(
    mailerEmail,
    mailerPassword
  );
  /**
   * Express middleware - Controller
   *
   * Persist a user to the database and authenticate the user
   *
   * Attaches `token` and `X-Access-Token` to header if successful
   */
  static register: RequestHandler = async (req, res, next) => {
    const { email, password } = req.body.user;
    try {
      const hashedPassword = await hashPassword(password);
      const userDoc = await UserModel.create({
        email,
        password: hashedPassword,
      });
      delete userDoc._doc.password;

      AuthController.mailer
        .setSubject(Message.RegMailSubject.replace("%useremail%", email))
        .setContent(
          "text",
          Message.RegMailContent.replace("%useremail%", email)
        )
        .addRecipient(email);
      await AuthController.mailer.send();

      const token = await createJwt(userDoc.toJSON());
      res.set("Location", `/users/${userDoc._id}`);
      res.set(Key.AccessToken, token);
      res.cookie(Key.Token, token);

      return AppHttpResponse.send(
        res,
        StatusCodes.CREATED,
        {
          user: userDoc.toJSON(),
        },
        Message.RegistrationSuccessful
      );
    } catch (err) {
      await UserModel.findOneAndRemove({ email });
      return next(
        new AppHttpError(StatusCodes.INTERNAL_SERVER_ERROR, err.message)
      );
    }
  };

  /**
   * Express middleware - Controller
   *
   * Authenticate a user via their email and password
   *
   * Attaches `token` and `X-Access-Token` to header if successful
   */
  static login: RequestHandler = async (req, res, next) => {
    const { email, password } = req.body;
    try {
      const userDoc = await UserModel.findOne({ email });
      if (!userDoc) {
        return AppHttpResponse.send(res, StatusCodes.UNAUTHORIZED, null);
      }

      const passwordsMatch = await comparePassword(password, userDoc.password);
      if (!passwordsMatch) {
        return AppHttpResponse.send(res, StatusCodes.UNAUTHORIZED, null);
      }

      delete userDoc._doc.password;
      const token = await createJwt(userDoc.toJSON());
      res.set(Key.AccessToken, token);
      res.cookie(Key.Token, token);

      return AppHttpResponse.send(
        res,
        StatusCodes.OK,
        {
          user: userDoc.toJSON(),
        },
        Message.LoginSuccessful
      );
    } catch (err) {
      return next(
        new AppHttpError(StatusCodes.INTERNAL_SERVER_ERROR, err.message)
      );
    }
  };

  /**
   * Express middleware - Controller
   *
   * Send password reset code to user email
   */
  static sendPasswordResetCode: RequestHandler = async (req, res, next) => {
    const { email } = req.body;
    const [code] = (Math.random() * Math.pow(10, 6)).toString().split("."); // Generate 6-digit code
    try {
      await PasswordResetModel.create({
        code,
        email,
      });

      AuthController.mailer
        .setSubject(Message.ForgotPasswordMailSubject)
        .setContent(
          "text",
          Message.ForgotPasswordMailContent.replace(
            "%useremail%",
            email
          ).replace("%code%", code)
        )
        .addRecipient(email);
      await AuthController.mailer.send();

      return AppHttpResponse.send(
        res,
        StatusCodes.OK,
        null,
        Message.PasswordResetCodeSent
      );
    } catch (err) {
      await PasswordResetModel.findOneAndRemove({ code, email });
      return next(
        new AppHttpError(StatusCodes.INTERNAL_SERVER_ERROR, err.message)
      );
    }
  };

  /**
   * Express middleware - Controller
   *
   * Reset a user's password
   */
  static resetPassword: RequestHandler = async (req, res, next) => {
    const { email, code, password } = req.body;
    try {
      const passwordResetDoc = await PasswordResetModel.findOne({
        code,
        email,
      });

      if (!passwordResetDoc) {
        return AppHttpResponse.send(res, StatusCodes.FORBIDDEN, null);
      }

      const userDoc = await UserModel.findOne({ email });
      const hashedPassword = await hashPassword(password);
      userDoc.password = hashedPassword;
      const updatedUserDoc = userDoc.save();
      delete updatedUserDoc._doc.password;
      await PasswordResetModel.findOneAndRemove({ code, email });

      const mailer = new NodeMailer(mailerEmail, mailerPassword)
        .addRecipient(updatedUserDoc.email)
        .setSubject(Message.ResetPasswordMailSubject)
        .setContent(
          "text",
          Message.ResetPasswordMailContent.replace(
            "%useremail%",
            updatedUserDoc.email
          )
        );
      await AuthController.mailer.send();

      return AppHttpResponse.send(
        res,
        StatusCodes.OK,
        null,
        Message.PasswordResetSuccessful
      );
    } catch (err) {
      return next(
        new AppHttpError(StatusCodes.INTERNAL_SERVER_ERROR, err.message)
      );
    }
  };
}
