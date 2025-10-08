import prisma from "../config/db.js";
import AppError from "../utils/appError.js";

export const addAssignment = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const { tittle, description } = req.body;
    const deadline = new Date(req.body.deadline);

    const newAssignment = await prisma.assignment.create({
      data: {
        tittle,
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
