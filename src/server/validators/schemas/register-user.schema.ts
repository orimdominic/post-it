import Joi from "@hapi/joi";

export const registerUserSchema = Joi.object({
  email: Joi.string().email().email({ minDomainSegments: 2 }),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{8,15}$")),
});
