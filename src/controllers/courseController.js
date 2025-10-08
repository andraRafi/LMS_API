import prisma from "../config/db.js";
import AppError from "../utils/appError.js";

export const createCourse = async (req, res, next) => {
  try {
    const { title, description } = req.body;
    const { userId } = req.user;

    const newCourse = await prisma.course.create({
      data: {
        title,
        description,
        instructorId: userId,
      },
    });
    res.status(201).json({
      status: "success",
      message: "Course created successfully",
      course: newCourse,
    });
  } catch (error) {
    next(error);
  }
};

export const getCourses = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const [courses, totalCourses] = await prisma.$transaction([
      prisma.course.findMany({
        skip: skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          instructor: { select: { id: true, name: true, email: true } },
        },
      }),
      prisma.course.count(),
    ]);

    const totalPages = Math.ceil(totalCourses / limit);
    res.status(200).json({
      status: "success",
      pagination: {
        currentPage: page,
        totalPages,
        totalCourses,
      },
      data: courses,
    });
  } catch (error) {
    next(error);
  }
};

export const getCourseById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const course = await prisma.course.findUnique({
      where: { id: parseInt(id) },
      include: {
        instructor: { select: { id: true, name: true, email: true } },
        materials: true,
      },
    });

    if (!course) {
      return next(new AppError(`Course with id ${id} not found`, 404));
    }

    res.status(200).json({
      status: "success",
      course,
    });
  } catch (error) {
    next(error);
  }
};

export const updateCourse = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;
    const { userId } = req.user;
    const updatedCourse = await prisma.course.update({
      where: { id: parseInt(id), instructorId: userId },
      data: { title, description },
    });

    res.status(200).json({
      status: "success",
      message: "Course updated successfully",
      course: updatedCourse,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCourse = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userId } = req.user;
    const course = await prisma.course.delete({
      where: { id: parseInt(id), instructorId: userId },
    });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
