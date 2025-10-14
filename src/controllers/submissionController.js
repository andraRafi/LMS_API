import prisma from "../config/db.js";
import AppError from "../utils/appError.js";

export const sendSubmission = async (req, res, next) => {
  try {
    const { assignmentId } = req.params;
    const { userId } = req.user;
    const url = req.file?.path;
    const { answer } = req.body;

    const assignment = await prisma.assignment.findFirst({
      where: {
        id: parseInt(assignmentId),
        course: {
          enrollments: {
            some: { studentId: userId },
          },
        },
      },
    });

    if (!assignment) {
      return next(new AppError("Assignment not found", 404));
    }

    if (new Date() > assignment.deadline) {
      return next(
        new AppError("The deadline for this assignment has passed", 403)
      );
    }

    const submission = await prisma.submission.create({
      data: {
        assignmentId: parseInt(assignmentId),
        studentId: userId,
        url,
        answer,
        submittedAt: new Date(),
      },
    });

    res.status(201).json({
      status: "success",
      message: "Submission sent successfully",
      data: submission,
    });
  } catch (error) {
    next(error);
  }
};

export const getSubmissionsByAssignment = async (req, res, next) => {
  try {
    const { assignmentId } = req.params;
    const { userId } = req.user;
    const assignment = await prisma.assignment.findFirst({
      where: {
        id: parseInt(assignmentId),
        course: {
          instructorId: userId,
        },
      },
    });

    if (!assignment) {
      return next(new AppError("Assignment not found", 404));
    }

    const submissions = await prisma.submission.findMany({
      where: { assignmentId: parseInt(assignmentId) },
      include: { student: { select: { id: true, name: true, email: true } } },
    });

    res.status(200).json({
      status: "success",
      results: submissions.length,
      data: submissions,
    });
  } catch (error) {
    next(error);
  }
};

export const gradeSubmission = async (req, res, next) => {
  try {
    const { submissionId } = req.params;
    const { userId } = req.user;
    const { grade, feedback } = req.body;

    const findSubmission = await prisma.submission.findUnique({
      where: {
        id: parseInt(submissionId),
      },
      include: {
        assignment: {
          include: {
            course: true,
          },
        },
      },
    });

    if (!findSubmission) {
      return next(new AppError("submission notfound"));
    }
    if (findSubmission.assignment.course.instructorId !== userId) {
      return next(
        new AppError("You are not authorized to grade this submission", 403)
      );
    }

    const gradedSubmission = await prisma.submission.update({
      where: {
        id: parseInt(submissionId),
      },
      data: {
        grade,
        feedback,
      },
    });

    res.status(200).json({
      status: "success",
      message: "Submission graded successfully",
      data: gradedSubmission,
    });
  } catch (error) {
    next(error);
  }
};
