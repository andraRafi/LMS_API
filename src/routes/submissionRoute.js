import express from "express";
import { validateToken } from "../middlewares/tokenHandler.js";
import { authorize } from "../middlewares/roleHandler.js";
import {
  sendSubmission,
  getSubmissionsByAssignment,
  gradeSubmission,
} from "../controllers/submissionController.js";
import upload from "../middlewares/uploadHandler.js";
import { validate } from "../middlewares/validate.js";
import {
  gradeSubmissionBodySchema,
  sendSubmissionBodySchema,
  submissionIdParamSchema,
} from "../validations/submissionValidation.js";

const router = express.Router({ mergeParams: true });

router.post(
  "/",
  validateToken,
  authorize(["STUDENT"]),
  upload.single("submissionFile"),
  validate(sendSubmissionBodySchema, "body"),
  sendSubmission
);

router.get(
  "/",
  validateToken,
  authorize(["INSTRUCTOR"]),
  getSubmissionsByAssignment
);

router.patch(
  "/:submissionId/grade",
  validateToken,
  validate(submissionIdParamSchema, "params"),
  validate(gradeSubmissionBodySchema, "body"),
  authorize(["INSTRUCTOR"]),
  gradeSubmission
);

export default router;
