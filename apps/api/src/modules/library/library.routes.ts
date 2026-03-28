import { Router } from "express";

import { asyncHandler } from "../../lib/async-handler.js";
import { authMiddleware } from "../../middleware/auth-middleware.js";
import { validateRequest } from "../../middleware/validate-request.js";
import { libraryController } from "./library.controller.js";
import { createLibraryItemSchema, updateLibraryItemSchema } from "./library.schemas.js";

export const libraryRouter = Router();

libraryRouter.use(authMiddleware);
libraryRouter.get("/", asyncHandler(libraryController.list));
libraryRouter.post("/", validateRequest(createLibraryItemSchema), asyncHandler(libraryController.create));
libraryRouter.patch(
  "/:id",
  validateRequest(updateLibraryItemSchema),
  asyncHandler(libraryController.update),
);
