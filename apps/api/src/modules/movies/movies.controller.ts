import type { Request, Response } from "express";

import { moviesService } from "./movies.service.js";

export const moviesController = {
  async search(request: Request, response: Response) {
    const result = await moviesService.search(String(request.query.q));
    return response.status(200).json(result);
  },
  async getById(request: Request, response: Response) {
    const result = await moviesService.getByTmdbId(Number(request.params.id));
    return response.status(200).json(result);
  },
  async getGenres(_request: Request, response: Response) {
    const result = await moviesService.getGenres();
    return response.status(200).json(result);
  },
};
