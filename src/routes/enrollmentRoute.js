import express from "express";
import { validateToken } from "../middlewares/tokenHandler.js";
import { authorize } from "../middlewares/roleHandler.js";
import { validate } from "../middlewares/validate.js";

import {
  enrollInCourse,
  unEnrollInCourse,
  listEnrollment,
} from "../controllers/enrollmentController.js";

const router = express.Router({ mergeParams: true });

router.post("/", validateToken, authorize(["STUDENT"]), enrollInCourse);
router.get(
  "/",
  validateToken,
  authorize(["STUDENT", "INSTRUCTOR"]),

  listEnrollment
);
router.delete("/", validateToken, authorize(["STUDENT"]), unEnrollInCourse);

export default router;
