import { Router } from "express";

import { asyncHandler } from "../../lib/async-handler.js";
import { validateRequest } from "../../middleware/validate-request.js";
import { authController } from "./auth.controller.js";
import { loginSchema, registerSchema } from "./auth.schemas.js";

export const authRouter = Router();

authRouter.post("/register", validateRequest(registerSchema), asyncHandler(authController.register));
authRouter.post("/login", validateRequest(loginSchema), asyncHandler(authController.login));
