import express, { Application, Request, Response } from "express";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import wineRouterV1 from "./routes/wineRoutes";
import "./helpers/database";
import { swaggerSpec } from "./helpers/swagger";

const app: Application = express();

dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
  ["/docs", "/api/v1/docs"],
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec),
);
app.use("/api/v1", wineRouterV1);
app.use("/", (_, res) => {
  res.status(404).json({
    error: {
      message: "This a unknown route of the wine API",
      code: "PathNotFoundError",
    },
    docsUrl: "/docs",
  });
});
app.use((err: Error, req: Request, res: Response) => {
  console.error("Unhandled Error:", err);
  res.status(500).json({
    error: {
      message: "Internal server error",
      code: "InternalError",
      details: err,
    },
  });
});

export default app;
