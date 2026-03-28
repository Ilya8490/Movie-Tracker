import type { NextFunction, Request, Response } from "express";
import type { AnyZodObject } from "zod";

export const validateRequest =
  (schema: AnyZodObject) => (request: Request, _response: Response, next: NextFunction) => {
    schema.parse({
      body: request.body,
      query: request.query,
      params: request.params,
    });

    next();
  };
