import Joi from "joi";

export const createMaterialBodySchema = Joi.object({
  title: Joi.string().trim().min(3).max(255).required(),
});

export const courseIdParamSchema = Joi.object({
  courseId: Joi.number().integer().positive().required(),
});

export const materialIdParamSchema = Joi.object({
  // TAMBAHKAN VALIDASI UNTUK courseId DI SINI
  courseId: Joi.number().integer().positive().required(),

  // Validasi untuk materialId sudah benar
  materialId: Joi.number().integer().positive().required(),
});
