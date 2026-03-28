import type { AnalyticsSummary, UserMovieStatus } from "@movie-tracker/shared";

import { userMovieRepository } from "../../repositories/user-movie.repository.js";

const emptyStatusCounts: Record<UserMovieStatus, number> = {
  plan_to_watch: 0,
  watching: 0,
  watched: 0,
  dropped: 0,
};

export const analyticsService = {
  async getSummary(userId: string): Promise<AnalyticsSummary> {
    const [watchedCount, averageRatingAggregate, groupedStatuses] =
      await userMovieRepository.analyticsByUserId(userId);

    const moviesPerStatus = { ...emptyStatusCounts };

    for (const item of groupedStatuses) {
      moviesPerStatus[item.status as UserMovieStatus] = item._count.status;
    }

    return {
      totalWatchedMovies: watchedCount,
      averageRating:
        averageRatingAggregate._avg.rating === null
          ? null
          : Number(averageRatingAggregate._avg.rating.toFixed(1)),
      moviesPerStatus,
    };
  },
};
