import Joi from "joi";

// Skema untuk memvalidasi parameter :assignmentId
export const assignmentIdParamSchema = Joi.object({
  assignmentId: Joi.number().integer().positive().required(),
});

// Skema untuk memvalidasi parameter :submissionId
export const submissionIdParamSchema = Joi.object({
  submissionId: Joi.number().integer().positive().required(),
});

// Skema untuk body saat siswa mengirimkan tugas
export const sendSubmissionBodySchema = Joi.object({
  // 'answer' bisa jadi opsional, tergantung kebutuhan Anda
  answer: Joi.string().trim().allow("").optional(),
});

// Skema untuk body saat instruktur memberikan nilai
export const gradeSubmissionBodySchema = Joi.object({
  grade: Joi.number().integer().min(0).max(100).required(),
  feedback: Joi.string().trim().allow("").optional(),
});
