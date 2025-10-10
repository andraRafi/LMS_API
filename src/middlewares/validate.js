import AppError from "../utils/appError.js";

export const validate = (schema, source = "body") => {
  return (req, res, next) => {
    const { error } = schema.validate(req[source], {
      abortEarly: false,
    });

    if (error) {
      const errorDetails = error.details.map((detail) => detail.message);

      return next(new AppError("Validation error", 400, errorDetails));
    }
    return next();
  };
};
