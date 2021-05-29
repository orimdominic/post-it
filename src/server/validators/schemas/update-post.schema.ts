import Joi from "@hapi/joi";

/**
 * Schema for
 * - Validating an incoming request to update a post
 */
export const updatePostSchema = Joi.object({
  content: Joi.string().required().min(10),
  images: Joi.binary(),
  timestamp: Joi.date().required(),
});
