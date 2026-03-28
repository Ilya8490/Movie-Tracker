import { Router } from "express";

import { asyncHandler } from "../../lib/async-handler.js";
import { authMiddleware } from "../../middleware/auth-middleware.js";
import { analyticsController } from "./analytics.controller.js";

export const analyticsRouter = Router();

analyticsRouter.use(authMiddleware);
analyticsRouter.get("/summary", asyncHandler(analyticsController.getSummary));
