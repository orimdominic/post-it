import Joi from "@hapi/joi";

/**
 * Schema for
 * - Validating an incoming request reset password
 */
export const resetPasswordSchema = Joi.object({
  code: Joi.string().required().min(6).max(6),
  email: Joi.string().email().email({ minDomainSegments: 2 }),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{8,15}$")),
});
