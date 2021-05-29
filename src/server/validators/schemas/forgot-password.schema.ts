import Joi from "@hapi/joi";

/**
 * Schema for
 * - Validating an incoming request to send password reset code
 */
export const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().email({ minDomainSegments: 2 }),
});
