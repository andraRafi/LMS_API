import express from "express";
import { validateToken } from "../middlewares/tokenHandler.js";
import {
  createCourse,
  deleteCourse,
  getCourseById,
  getCourses,
  updateCourse,
} from "../controllers/courseController.js";
import { validate } from "../middlewares/validate.js";
import {
  courseCreateSchema,
  courseUpdateSchema,
  paramIdSchema,
} from "../validations/courseValidation.js";
import { authorize } from "../middlewares/roleHandler.js";
import materialRouter from "./materialRoute.js";
import enrollmentRouter from "./enrollmentRoute.js";
import assignmentRouter from "./assignmentRoute.js";

const router = express.Router();
router.use("/:courseId/materials", materialRouter);
router.use("/:courseId/enrollments", enrollmentRouter);
router.use("/:courseId/assignments", assignmentRouter);

router.post(
  "/",
  validateToken,
  authorize(["INSTRUCTOR"]),
  validate(courseCreateSchema),
  createCourse
);

router.get(
  "/",
  validateToken,
  authorize(["INSTRUCTOR", "STUDENT"]),
  getCourses
);

router.get(
  "/:id",
  validateToken,
  authorize(["INSTRUCTOR", "STUDENT"]),
  validate(paramIdSchema, "params"),
  getCourseById
);

router.patch(
  "/:id",
  validateToken,
  validate(paramIdSchema, "params"),
  authorize(["INSTRUCTOR"]),
  validate(courseUpdateSchema, "body"),
  updateCourse
);

router.delete(
  "/:id",
  validateToken,
  authorize(["INSTRUCTOR"]),
  validate(paramIdSchema, "params"),
  deleteCourse
);

export default router;
