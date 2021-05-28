import Joi from "@hapi/joi";

export const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().email({ minDomainSegments: 2 }),
});
