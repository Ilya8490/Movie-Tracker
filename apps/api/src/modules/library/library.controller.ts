import type { Request, Response } from "express";

import { libraryService } from "./library.service.js";

export const libraryController = {
  async list(request: Request, response: Response) {
    const result = await libraryService.getByUser(request.auth!.userId);
    return response.status(200).json(result);
  },
  async create(request: Request, response: Response) {
    const result = await libraryService.create(request.auth!.userId, request.body);
    return response.status(201).json(result);
  },
  async update(request: Request, response: Response) {
    const result = await libraryService.update(
      request.auth!.userId,
      String(request.params.id),
      request.body,
    );
    return response.status(200).json(result);
  },
};
