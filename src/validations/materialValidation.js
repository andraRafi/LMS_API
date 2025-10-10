import Joi from "joi";

export const createMaterialBodySchema = Joi.object({
  title: Joi.string().trim().min(3).max(255).required(),
});

export const courseIdParamSchema = Joi.object({
  courseId: Joi.number().integer().positive().required(),
});

export const materialIdParamSchema = Joi.object({
  courseId: Joi.number().integer().positive().required(),

  materialId: Joi.number().integer().positive().required(),
});
