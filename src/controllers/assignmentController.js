import prisma from "../config/db.js";
import AppError from "../utils/appError.js";

export const addAssignment = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const { title, description } = req.body;
    const deadline = new Date(req.body.deadline);
    const { userId } = req.user;

    const course = await prisma.course.findUnique({
      where: { id: parseInt(courseId) },
    });

    if (!course || course.instructorId !== userId) {
      return next(
        new AppError(
          "You do not have permission to add assignments to this course",
          403
        )
      );
    }

    const newAssignment = await prisma.assignment.create({
      data: {
        title,
        description,
        deadline,
        courseId: parseInt(courseId),
      },
    });
    res.status(201).json({
      status: "success",
      message: "Assignment created successfully",
      data: newAssignment,
    });
  } catch (error) {
    next(error);
  }
};

export const getAssignmentByCourses = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const { userId } = req.user;

    const course = await prisma.course.findUnique({
      where: { id: parseInt(courseId) },
    });

    if (!course) {
      return next(new AppError(`Course with id ${courseId} not found`, 404));
    }
    const isInstructor = course.instructorId === userId;
    const isEnrolled = await prisma.enrollment.findUnique({
      where: {
        studentId_courseId: {
          studentId: userId,
          courseId: parseInt(courseId),
        },
      },
    });

    if (!isEnrolled && !isInstructor) {
      return next(new AppError("You are not enrolled in this course", 403));
    }

    const assignments = await prisma.assignment.findMany({
      where: { courseId: parseInt(courseId) },
    });
    res.status(200).json({
      status: "success",
      data: assignments,
    });
  } catch (error) {
    next(error);
  }
};

export const getAssignmentById = async (req, res, next) => {
  try {
    const { assignmentId } = req.params;
    const { userId } = req.user;

    const assignment = await prisma.assignment.findUnique({
      where: { id: parseInt(assignmentId) },
      include: {
        Course: true,
      },
    });

    if (!assignment) {
      return next(
        new AppError(`Assignment with id ${assignmentId} not found`, 404)
      );
    }
    const isInstructor = assignment.Course.instructorId === userId;
    const isEnrolled = await prisma.enrollment.findUnique({
      where: {
        studentId_courseId: {
          studentId: userId,
          courseId: assignment.Course.id,
        },
      },
    });
    if (!isEnrolled && !isInstructor) {
      return next(new AppError("You are not enrolled in this course", 403));
    }

    res.status(200).json({
      status: "success",
      data: assignment,
    });
  } catch (error) {
    next(error);
  }
};

export const editAssignment = async (req, res, next) => {
  try {
    const { assignmentId } = req.params;
    const { title, description } = req.body;
    const deadline = new Date(req.body.deadline);
    const { userId } = req.user;

    const assignment = await prisma.assignment.findUnique({
      where: { id: parseInt(assignmentId) },
    });

    if (!assignment) {
      return next(
        new AppError(`Assignment with id ${assignmentId} not found`, 404)
      );
    }
    const authorized = await prisma.course.findFirst({
      where: { id: assignment.courseId, instructorId: userId },
    });

    if (!authorized) {
      return next(
        new AppError("You are not authorized to edit this assignment", 403)
      );
    }

    const updatedAssignment = await prisma.assignment.update({
      where: { id: parseInt(assignmentId) },
      data: {
        title,
        description,
        deadline,
      },
    });

    res.status(200).json({
      status: "success",
      message: "Assignment updated successfully",
      data: updatedAssignment,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteAssignment = async (req, res, next) => {
  try {
    const { assignmentId } = req.params;
    const { userId } = req.user;

    const assignment = await prisma.assignment.findUnique({
      where: { id: parseInt(assignmentId) },
    });

    if (!assignment) {
      return next(
        new AppError(`Assignment with id ${assignmentId} not found`, 404)
      );
    }

    const authorized = await prisma.course.findFirst({
      where: { id: assignment.courseId, instructorId: userId },
    });

    if (!authorized) {
      return next(
        new AppError("You are not authorized to delete this assignment", 403)
      );
    }

    await prisma.assignment.delete({
      where: { id: parseInt(assignmentId) },
    });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
