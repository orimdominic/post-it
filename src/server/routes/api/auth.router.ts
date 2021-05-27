import { Router } from "express";
import { Route } from "../../helpers/constants";
import { AuthController } from "../../controllers";
import { registerUserSchemaValidator } from "../../validators";
import { emailExists } from "../../middlewares";

// TODO: Write tests
// TODO: Include relevant middlewares

const router = Router();

router.post(Route.Register, [
  registerUserSchemaValidator,
  emailExists,
  AuthController.register,
]);

export default router;
