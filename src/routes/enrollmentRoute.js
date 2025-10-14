import express from "express";
import { validateToken } from "../middlewares/tokenHandler.js";
import { authorize } from "../middlewares/roleHandler.js";
import { validate } from "../middlewares/validate.js";

import {
  enrollInCourse,
  unEnrollInCourse,
  listEnrollment,
} from "../controllers/enrollmentController.js";
import { courseIdParamSchema } from "../validations/enrollmentRoute.js";

const router = express.Router({ mergeParams: true });

router.post(
  "/",
  validateToken,
  authorize(["STUDENT"]),
  validate(courseIdParamSchema, "params"),
  enrollInCourse
);
router.get(
  "/",
  validateToken,
  authorize(["STUDENT", "INSTRUCTOR"]),
  validate(courseIdParamSchema, "params"),
  listEnrollment
);
router.delete(
  "/",
  validateToken,
  authorize(["STUDENT"]),
  validate(courseIdParamSchema, "params"),
  unEnrollInCourse
);

export default router;
