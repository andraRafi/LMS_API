import prisma from "../config/db.js";
import AppError from "../utils/appError.js";

export const enrollInCourse = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const { userId } = req.user;

    const enrollment = await prisma.enrollment.create({
      data: {
        courseId: parseInt(courseId),
        studentId: userId,
      },
    });

    res.status(201).json({
      status: "success",
      message: "Enrolled in course successfully",
      data: enrollment,
    });
  } catch (error) {
    next(error);
  }
};

export const unEnrollInCourse = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const { userId } = req.user;

    const existing = await prisma.enrollment.findUnique({
      where: {
        studentId_courseId: {
          studentId: userId,
          courseId: parseInt(courseId),
        },
      },
    });

    if (!existing) {
      return next(new AppError("You are not enrolled in this course", 400));
    }

    await prisma.enrollment.delete({
      where: {
        studentId_courseId: {
          studentId: userId,
          courseId: parseInt(courseId),
        },
      },
    });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const listEnrollment = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const enrollments = await prisma.enrollment.findMany({
      where: { courseId: parseInt(courseId) },
      include: {
        student: { select: { id: true, name: true, email: true } },
      },
    });

    res.status(200).json({
      status: "success",
      message: "Enrollments retrieved successfully",
      data: enrollments,
    });
  } catch (error) {
    next(error);
  }
};
