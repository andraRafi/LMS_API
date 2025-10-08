import AppError from "../utils/appError.js";

export function prismaErrorHandler(err, req, res, next) {
  if (err.code) {
    switch (err.code) {
      case "P2002":
        return next(
          new AppError(`Duplicate value for field: ${err.meta?.target}`, 400)
        );

      case "P2025":
        return next(new AppError("Record not found", 404));

      case "P2003":
        return next(new AppError("Invalid reference to another resource", 400));

      default:
        return next(new AppError("Database error occurred", 500));
    }
  }

  next(err);
}
