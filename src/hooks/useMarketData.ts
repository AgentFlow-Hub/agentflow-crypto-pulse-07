
import { useQuery } from '@tanstack/react-query';
import { apiService, MarketOverviewResponse, TokenHeatmapResponse, TrendingTweetsResponse } from '../services/api';

export const useMarketOverview = (periodHours: number = 24) => {
  return useQuery({
    queryKey: ['marketOverview', periodHours],
    queryFn: () => apiService.getMarketOverview(periodHours),
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
    retry: 3,
  });
};

export const useTokenHeatmap = (limit: number = 20) => {
  return useQuery({
    queryKey: ['tokenHeatmap', limit],
    queryFn: () => apiService.getTokenHeatmap(limit),
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
    retry: 3,
  });
};

export const useTrendingTweets = (
  limit: number = 50,
  hoursBack: number = 24,
  minEngagement: number = 10,
  topTokensLimit: number = 20
) => {
  return useQuery({
    queryKey: ['trendingTweets', limit, hoursBack, minEngagement, topTokensLimit],
    queryFn: () => apiService.getTrendingTweets(limit, hoursBack, minEngagement, topTokensLimit),
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
    retry: 3,
  });
};
