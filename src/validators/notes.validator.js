import Joi from '@hapi/joi';

export const notesValidator = (req, res, next) => {
  const schema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    color: Joi.string(),
    isArchive: Joi.string().default(false),
    isTrashed: Joi.string().default(false),
    createdBy: Joi.string()
  });
  const { error, value } = schema.validate(req.body);
  if (error) next(error);
  else next();
};
