import Joi from "@hapi/joi";

export const updatePostSchema = Joi.object({
  content: Joi.string().required().min(10),
  timestamp: Joi.date().required(),
});
