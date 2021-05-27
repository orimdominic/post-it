import Joi from "@hapi/joi";

export const createPostSchema = Joi.object({
  authorId: Joi.string().required().min(24),
  content: Joi.string().required().min(10),
  timestamp: Joi.date().required(),
});
