import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import { env } from "../config/env.js";
import { HttpError } from "../lib/http-error.js";

type AuthPayload = {
  userId: string;
  email: string;
};

declare global {
  namespace Express {
    interface Request {
      auth?: AuthPayload;
    }
  }
}

export const authMiddleware = (request: Request, _response: Response, next: NextFunction) => {
  const authorizationHeader = request.headers.authorization;

  if (!authorizationHeader?.startsWith("Bearer ")) {
    throw new HttpError(401, "Unauthorized");
  }

  const token = authorizationHeader.replace("Bearer ", "");

  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as AuthPayload;
    request.auth = payload;
    next();
  } catch {
    throw new HttpError(401, "Invalid token");
  }
};
