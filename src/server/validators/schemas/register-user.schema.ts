import Joi from "@hapi/joi";

/**
 * Schema for
 * - Validating an incoming request to register a user
 */
export const registerUserSchema = Joi.object({
  email: Joi.string().email().email({ minDomainSegments: 2 }),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{8,15}$")),
});
