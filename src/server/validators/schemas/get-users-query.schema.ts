import Joi from '@hapi/joi';

export const getUsersQuerySchema =  Joi.object({
  limit: Joi.string().regex(/^\d+$/), // that `limit` is a string that contains only numbers
  page: Joi.string().regex(/^\d+$/),
});
