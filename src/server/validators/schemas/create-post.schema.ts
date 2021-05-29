import Joi from "@hapi/joi";

/**
 * Schema for
 * - Creating a post from a nodejs incoming message
 */
export const createPostSchema = Joi.object({
  content: Joi.string().required().min(10),
  timestamp: Joi.date().required(),
});
