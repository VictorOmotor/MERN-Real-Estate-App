import Joi from 'joi'

export const createUserValidator = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  email: Joi.string()
    .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
    .required()
    .messages({
      'string.pattern.base': 'Email is not a valid email format/address',
    }),
  password: Joi.string().required(),
  confirmPassword: Joi.string().valid(Joi.ref('password')).required(),
}).strict()

export const loginUserValidator = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
}).strict()
