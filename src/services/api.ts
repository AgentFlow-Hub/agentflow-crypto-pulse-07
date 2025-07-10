
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
}

export const apiService = new ApiService();
