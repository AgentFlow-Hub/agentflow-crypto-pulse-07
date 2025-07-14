
// API Types
export interface MarketOverviewResponse {
  market_cap: {
    value: string;
    change: {
      percentage: number;
      direction: string;
    };
  };
  trading_volume: {
    value: string;
    change: {
      percentage: number;
      direction: string;
    };
  };
  sentiment: {
    value: string;
    label: string;
    change: {
      percentage: number;
      direction: string;
    } | null;
  };
  mentions: {
    value: string;
    change: {
      percentage: number;
      direction: string;
    } | null;
  };
  engagements: {
    value: string;
    change: {
      percentage: number;
      direction: string;
    } | null;
  };
  last_updated: string;
}

export interface TokenHeatmapItem {
  token_symbol: string;
  token_name: string;
  price: string;
  price_change_24h: number;
  market_cap: number | null;
  volume: number | null;
  mentions_count?: number;
}

export interface TokenHeatmapResponse {
  tokens: TokenHeatmapItem[];
  total_count: number;
  timestamp: string;
}

export interface TrendingTweet {
  id: string;
  username: string;
  handle: string;
  avatar?: string;
  content: string;
  hashtags?: string[];
  keywords?: string[];
  likes: number;
  comments: number;
  reposts: number;
  timestamp: string;
  engagement_score?: number;
}

export interface TrendingTweetsResponse {
  trending_tweets: TrendingTweet[];
  metadata: {
    total_count: number;
    parameters: {
      limit: number;
      hours_back: number;
      min_engagement: number;
      top_tokens_limit: number;
    };
    generated_at: string;
  };
}

export interface HotTrend {
  trend: string;
  strength: number;
  category: string;
  mentions_count: number;
  growth_rate?: number;
}

export interface HotTrendsResponse {
  trends: HotTrend[];
  metadata: {
    total_count: number;
    hours_back: number;
    limit: number;
    generated_at: string;
  };
}

export interface KOLRanking {
  rank: number;
  username: string;
  name: string;
  base_authority_score: number;
  followers_count: number;
  historical_engagement_rate: number;
  follower_quality_score: number;
  crypto_expertise_bonus: number;
  is_verified: boolean;
  profile_picture: string;
}

export interface KOLRankingsResponse {
  kol_rankings: KOLRanking[];
  metadata: {
    total_count: number;
    limit: number;
    generated_at: string;
  };
}

export interface TokenSocialRanking {
  token_symbol: string;
  token_name: string;
  social_score: number;
  mentions_count: number;
  sentiment_score: number;
  rank: number;
  price_change_24h?: number;
  market_cap?: number;
}

export interface TokenSocialRankingsResponse {
  tokens: TokenSocialRanking[];
  metadata: {
    total_count: number;
    timeframe: string;
    limit: number;
    generated_at: string;
  };
}

// API Service Class
class ApiService {
  private baseUrl = 'https://agentflow-api-1049105662092.europe-west1.run.app/api';

  private async fetchApi<T>(endpoint: string): Promise<T> {
    console.log(`🔄 Making API request to: ${this.baseUrl}${endpoint}`);
    
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'GET',
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json',
        },
        mode: 'cors', // Explicitly set CORS mode
      });

      console.log(`📡 API Response status: ${response.status} ${response.statusText}`);
      console.log(`📡 API Response headers:`, Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ API Error Response:`, errorText);
        throw new Error(`API Error: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();
      console.log(`✅ API Success:`, data);
      return data;
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        console.error(`🚫 Network Error - Likely CORS issue:`, error);
        throw new Error('Network Error: Unable to connect to API. This is likely due to CORS configuration on the API server.');
      }
      console.error(`❌ API Request failed:`, error);
      throw error;
    }
  }

  async getMarketOverview(periodHours: number = 24): Promise<MarketOverviewResponse> {
    console.log(`📊 Fetching market overview for ${periodHours} hours`);
    return this.fetchApi<MarketOverviewResponse>(`/market/overview/summary?period_hours=${periodHours}`);
  }

  async getTokenHeatmap(limit: number = 20): Promise<TokenHeatmapResponse> {
    console.log(`🔥 Fetching token heatmap with limit ${limit}`);
    return this.fetchApi<TokenHeatmapResponse>(`/tokens/heatmap?limit=${limit}`);
  }

  async getTrendingTweets(
    limit: number = 50,
    hoursBack: number = 24,
    minEngagement: number = 10,
    topTokensLimit: number = 20,
    offset: number = 0
  ): Promise<TrendingTweetsResponse> {
    console.log(`🐦 Fetching trending tweets with limit ${limit}, offset ${offset}`);
    const params = new URLSearchParams({
      limit: limit.toString(),
      hours_back: hoursBack.toString(),
      min_engagement: minEngagement.toString(),
      top_tokens_limit: topTokensLimit.toString(),
      offset: offset.toString()
    });
    return this.fetchApi<TrendingTweetsResponse>(`/trending-tweets?${params}`);
  }

  async getHotTrends(hoursBack: number = 24, limit: number = 30): Promise<HotTrendsResponse> {
    console.log(`🔥 Fetching hot trends for ${hoursBack} hours, limit ${limit}`);
    const params = new URLSearchParams({
      hours_back: hoursBack.toString(),
      limit: limit.toString()
    });
    return this.fetchApi<HotTrendsResponse>(`/hot-trends?${params}`);
  }

  async getKOLRankings(limit: number = 20): Promise<KOLRankingsResponse> {
    console.log(`👑 Fetching KOL rankings with limit ${limit}`);
    return this.fetchApi<KOLRankingsResponse>(`/kol-rankings?limit=${limit}`);
  }

  async getKOLRankingsChart(limit: number = 20): Promise<KOLRankingsResponse> {
    console.log(`📊 Fetching KOL rankings chart with limit ${limit}`);
    return this.fetchApi<KOLRankingsResponse>(`/kol-rankings/chart?limit=${limit}`);
  }

  async getTokenSocialRankings(limit: number = 20, timeframe: string = '24h'): Promise<TokenSocialRankingsResponse> {
    console.log(`🎯 Fetching token social rankings for ${timeframe}, limit ${limit}`);
    const params = new URLSearchParams({
      limit: limit.toString()
    });
    // Note: timeframe might be handled differently by the API, but we'll include it in logs for now
    return this.fetchApi<TokenSocialRankingsResponse>(`/tokens/social-rankings?${params}`);
  }
}

export const apiService = new ApiService();
