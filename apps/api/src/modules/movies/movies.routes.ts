import { Router } from "express";

import { asyncHandler } from "../../lib/async-handler.js";
import { validateRequest } from "../../middleware/validate-request.js";
import { moviesController } from "./movies.controller.js";
import { movieParamsSchema, searchMoviesSchema } from "./movies.schemas.js";

export const moviesRouter = Router();

moviesRouter.get("/genres", asyncHandler(moviesController.getGenres));
moviesRouter.get("/search", validateRequest(searchMoviesSchema), asyncHandler(moviesController.search));
moviesRouter.get("/:id", validateRequest(movieParamsSchema), asyncHandler(moviesController.getById));
