import type { Request, Response } from "express";

import { analyticsService } from "./analytics.service.js";

export const analyticsController = {
  async getSummary(request: Request, response: Response) {
    const result = await analyticsService.getSummary(request.auth!.userId);
    return response.status(200).json(result);
  },
};
