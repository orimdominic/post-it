import Joi from "@hapi/joi";

/**
 * Schema for
 * - Validating image uploads
 */
export const postImageSchema = Joi.array();
