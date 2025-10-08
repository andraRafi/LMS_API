import Joi from "joi";

export const paramIdSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
});

const baseCourseSchema = Joi.object({
  title: Joi.string().trim().min(3).max(100),
  description: Joi.string().trim().min(10).max(1000),
});

export const courseCreateSchema = baseCourseSchema.options({
  presence: "required",
});

export const courseUpdateSchema = baseCourseSchema.min(1).messages({
  "object.min":
    "At least one field (title or description) must be provided for update",
});
