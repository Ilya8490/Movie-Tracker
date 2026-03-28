import { Router } from "express";

import { asyncHandler } from "../../lib/async-handler.js";
import { authMiddleware } from "../../middleware/auth-middleware.js";
import { validateRequest } from "../../middleware/validate-request.js";
import { addListItemSchema, createListSchema } from "./lists.schemas.js";
import { listsController } from "./lists.controller.js";

export const listsRouter = Router();

listsRouter.use(authMiddleware);
listsRouter.get("/", asyncHandler(listsController.list));
listsRouter.post("/", validateRequest(createListSchema), asyncHandler(listsController.create));
listsRouter.post(
  "/:id/items",
  validateRequest(addListItemSchema),
  asyncHandler(listsController.addItem),
);
