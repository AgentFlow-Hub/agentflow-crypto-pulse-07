
import { useQuery } from '@tanstack/react-query';
import { 
  apiService, 
  MarketOverviewResponse, 
  TokenHeatmapResponse, 
  TrendingTweetsResponse,
  HotTrendsResponse,
  KOLRankingsResponse,
  TokenSocialRankingsResponse
} from '../services/api';

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

export const useHotTrends = (hoursBack: number = 24, limit: number = 30) => {
  return useQuery({
    queryKey: ['hotTrends', hoursBack, limit],
    queryFn: () => apiService.getHotTrends(hoursBack, limit),
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
    retry: 3,
  });
};

export const useKOLRankings = (limit: number = 20, chartFormat: boolean = false) => {
  return useQuery({
    queryKey: ['kolRankings', limit, chartFormat],
    queryFn: async () => {
      console.log(`🎯 useKOLRankings hook called with limit: ${limit}, chartFormat: ${chartFormat}`);
      try {
        const result = chartFormat 
          ? await apiService.getKOLRankingsChart(limit) 
          : await apiService.getKOLRankings(limit);
        console.log(`✅ useKOLRankings hook success:`, result);
        return result;
      } catch (error) {
        console.error(`❌ useKOLRankings hook error:`, error);
        throw error;
      }
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
    retry: 3
  });
};

export const useTokenSocialRankings = (limit: number = 20, timeframe: string = '24h') => {
  return useQuery({
    queryKey: ['tokenSocialRankings', limit, timeframe],
    queryFn: () => apiService.getTokenSocialRankings(limit, timeframe),
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
    retry: 3,
  });
};
