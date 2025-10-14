import prisma from "../config/db.js";
import AppError from "../utils/appError.js";

export const createMaterial = async (req, res, next) => {
  try {
    const { title } = req.body;
    const { courseId } = req.params;
    const fileUrl = req.file?.path;
    const userId = req.user.userId;

    const course = await prisma.course.findUnique({
      where: { id: parseInt(courseId) },
    });
    if (!course || course.instructorId !== userId) {
      return next(
        new AppError(
          `Course with id ${courseId} not found or you do not have permission to add materials`,
          404
        )
      );
    }

    if (!fileUrl) {
      return next(new AppError("File upload failed", 400));
    }
    const newMaterial = await prisma.material.create({
      data: {
        title,
        url: fileUrl,
        courseId: parseInt(courseId),
      },
    });
    res.status(201).json({
      status: "success",
      message: "Material created successfully",
      data: newMaterial,
    });
  } catch (error) {
    next(error);
  }
};

export const getMaterialsByCourse = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const materials = await prisma.material.findMany({
      where: { courseId: parseInt(courseId) },
    });
    res.status(200).json({
      status: "success",
      data: materials,
    });
  } catch (error) {
    next(error);
  }
};

export const getMaterialById = async (req, res, next) => {
  try {
    const { materialId } = req.params;
    const id = materialId;
    const material = await prisma.material.findUnique({
      where: { id: parseInt(id) },
    });
    if (!material) {
      return next(new AppError(`Material with id ${id} not found`, 404));
    }
    res.status(200).json({
      status: "success",
      data: material,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteMaterial = async (req, res, next) => {
  try {
    const { materialId } = req.params;
    const { userId } = req.user;
    const material = await prisma.material.findUnique({
      where: { id: parseInt(materialId) },
      include: {
        course: true,
      },
    });

    if (!material) {
      return next(new AppError(`Material with id ${id} not found`, 404));
    }

    if (material.course.instructorId !== userId) {
      return next(
        new AppError("You do not have permission to delete this material", 403)
      );
    }

    await prisma.material.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).json({
      status: "success",
      message: "Material deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
