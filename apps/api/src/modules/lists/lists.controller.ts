import type { Request, Response } from "express";

import { listsService } from "./lists.service.js";

export const listsController = {
  async list(request: Request, response: Response) {
    const result = await listsService.getByUser(request.auth!.userId);
    return response.status(200).json(result);
  },
  async create(request: Request, response: Response) {
    const result = await listsService.create(
      request.auth!.userId,
      request.body.name,
      request.body.description,
    );
    return response.status(201).json(result);
  },
  async addItem(request: Request, response: Response) {
    const result = await listsService.addItem(
      request.auth!.userId,
      String(request.params.id),
      request.body.tmdbId,
    );
    return response.status(201).json(result);
  },
};
