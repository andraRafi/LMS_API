import express from "express";
import { validateToken } from "../middlewares/tokenHandler.js";
import {
  createMaterial,
  getMaterialsByCourse,
  getMaterialById,
  deleteMaterial,
} from "../controllers/materialController.js";
import upload from "../middlewares/uploadHandler.js";
import { authorize } from "../middlewares/roleHandler.js";
import { validate } from "../middlewares/validate.js";
import {
  createMaterialBodySchema,
  materialIdParamSchema,
} from "../validations/materialValidation.js";
const router = express.Router({ mergeParams: true });

router.post(
  "/",
  validateToken,
  authorize(["INSTRUCTOR"]),
  upload.single("materialFile"),
  validate(createMaterialBodySchema, "body"),
  createMaterial
);

router.get(
  "/",
  validateToken,
  authorize(["INSTRUCTOR", "STUDENT"]),
  getMaterialsByCourse
);

router.get(
  "/:materialId",
  validateToken,
  authorize(["INSTRUCTOR", "STUDENT"]),
  validate(materialIdParamSchema, "params"),
  getMaterialById
);

router.delete(
  "/:materialId",
  validateToken,
  authorize(["INSTRUCTOR"]),
  validate(materialIdParamSchema, "params"),
  deleteMaterial
);

export default router;
