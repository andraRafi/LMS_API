import express from "express";
import { validateToken } from "../middlewares/tokenHandler.js";
import { authorize } from "../middlewares/roleHandler.js";
import { validate } from "../middlewares/validate.js";
import submissionRoute from "./submissionRoute.js";
const router = express.Router({ mergeParams: true });
router.use("/:assignmentId", submissionRoute);

import {
  addAssignment,
  getAssignmentByCourses,
  getAssignmentById,
  editAssignment,
  deleteAssignment,
} from "../controllers/assignmentController.js";

router.post("/", validateToken, authorize(["INSTRUCTOR"]), addAssignment);
router.get(
  "/",
  validateToken,
  authorize(["INSTRUCTOR", "STUDENT"]),
  getAssignmentByCourses
);
router.get(
  "/:assignmentId",
  validateToken,
  authorize(["INSTRUCTOR", "STUDENT"]),
  getAssignmentById
);
router.patch(
  "/:assignmentId",
  validateToken,
  authorize(["INSTRUCTOR"]),
  editAssignment
);
router.delete(
  "/:assignmentId",
  validateToken,
  authorize(["INSTRUCTOR"]),
  deleteAssignment
);

export default router;
