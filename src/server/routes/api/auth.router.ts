import { Router } from "express";
import { Route } from "../../helpers/constants";
import { AuthController } from "../../controllers";
import {
  registerUserSchemaValidator,
  userLoginSchemaValidator,
  forgotPasswordSchemaValidator,
  resetPasswordSchemaValidator,
} from "../../validators";
import { emailInexistent, emailExists } from "../../middlewares";

const router = Router();

router.post(Route.Register, [
  registerUserSchemaValidator,
  emailInexistent,
  AuthController.register,
]);

router.post(Route.Login, [userLoginSchemaValidator, AuthController.login]);

router.post(Route.ForgotPassword, [
  forgotPasswordSchemaValidator,
  emailExists,
  AuthController.sendPasswordResetCode,
]);

router.patch(Route.ResetPassword, [
  resetPasswordSchemaValidator,
  emailExists,
  AuthController.resetPassword,
]);

export default router;
