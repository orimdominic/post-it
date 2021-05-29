import Joi from "@hapi/joi";

/**
 * Schema for
 * - Validating an incoming login request
 */
export const userLoginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});
