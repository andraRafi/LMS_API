// middlewares/validate.js

import AppError from "../utils/appError.js";

export const validate = (schema, source = "body") => {
  return (req, res, next) => {
    // 1. 'source' akan menjadi 'body' atau 'params' sesuai yang Anda kirim dari router.
    // 2. req[source] akan menjadi req['body'] atau req['params'] secara dinamis.
    const { error } = schema.validate(req[source], {
      abortEarly: false, // Tampilkan semua detail error
    });

    if (error) {
      // Ambil semua pesan error dari Joi
      const errorDetails = error.details.map((detail) => detail.message);

      // 3. Gunakan error handler terpusat Anda, jangan kirim respons langsung.
      // Ini membuat penanganan error Anda konsisten di seluruh aplikasi.
      return next(new AppError("Validation error", 400, errorDetails));
    }

    // Jika tidak ada error, lanjutkan ke proses berikutnya
    return next();
  };
};
