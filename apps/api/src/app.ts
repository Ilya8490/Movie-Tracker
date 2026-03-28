import cors from "cors";
import express from "express";
import morgan from "morgan";

import { env } from "./config/env.js";
import { errorMiddleware } from "./middleware/error-middleware.js";
import { analyticsRouter } from "./modules/analytics/analytics.routes.js";
import { authRouter } from "./modules/auth/auth.routes.js";
import { libraryRouter } from "./modules/library/library.routes.js";
import { listsRouter } from "./modules/lists/lists.routes.js";
import { moviesRouter } from "./modules/movies/movies.routes.js";

export const app = express();

app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true,
  }),
);
app.use(morgan("dev"));
app.use(express.json());

app.get("/health", (_request, response) => {
  response.status(200).json({ ok: true });
});

app.use("/auth", authRouter);
app.use("/movies", moviesRouter);
app.use("/library", libraryRouter);
app.use("/lists", listsRouter);
app.use("/analytics", analyticsRouter);

app.use(errorMiddleware);
