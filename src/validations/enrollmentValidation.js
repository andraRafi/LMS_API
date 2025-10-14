import Joi from "joi";

export const courseIdParamSchema = Joi.object({
  courseId: Joi.number().integer().positive().required(),
});
