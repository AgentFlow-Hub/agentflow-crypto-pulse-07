
import { useQuery } from '@tanstack/react-query';
import { apiService, MarketOverviewResponse, TokenHeatmapResponse } from '../services/api';

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
