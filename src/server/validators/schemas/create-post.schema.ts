import Joi from "@hapi/joi";

export const createPostSchema = Joi.object({
  content: Joi.string().required().min(10),
  timestamp: Joi.date().required(),
});
