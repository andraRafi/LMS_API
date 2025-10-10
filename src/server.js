import express from "express";
import "dotenv/config";
import authRoute from "./routes/authRoute.js";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger.js";
import { prismaErrorHandler } from "./middlewares/prismaErrorHandler.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import courseRoute from "./routes/courseRoute.js";
import assignmentRouter from "./routes/assignmentRoute.js";

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(cookieParser());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api/auth", authRoute);
app.use("/api/courses", courseRoute);
app.use("/api/assignments", assignmentRouter);

app.use(prismaErrorHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
