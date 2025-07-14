
import { useState } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { useTokenHeatmap } from '../hooks/useMarketData';
import TokenHeatMapEnhanced from './TokenHeatMapEnhanced';

interface Token {
  name: string;
  price: string;
  priceChange: number;
  mentions: number;
  marketCap: number;
  volume: number;
}

const TokenHeatMap = () => {
  const [hoveredToken, setHoveredToken] = useState<Token | null>(null);
  const { data: heatmapData, isLoading, error, refetch, isFetching } = useTokenHeatmap(20);

  console.log('🔥 TokenHeatMap render - data:', heatmapData, 'loading:', isLoading, 'error:', error);

  const formatPrice = (price: number): string => {
    if (price >= 1000) return `$${(price / 1000).toFixed(1)}K`;
    if (price >= 1) return `$${price.toFixed(2)}`;
    if (price >= 0.01) return `$${price.toFixed(3)}`;
    return `$${price.toFixed(6)}`;
  };

  const formatMarketCap = (marketCap: number): string => {
    if (marketCap >= 1e12) return (marketCap / 1e12).toFixed(1) + 'T';
    if (marketCap >= 1e9) return (marketCap / 1e9).toFixed(1) + 'B';
    if (marketCap >= 1e6) return (marketCap / 1e6).toFixed(1) + 'M';
    if (marketCap >= 1e3) return (marketCap / 1e3).toFixed(1) + 'K';
    return marketCap.toString();
  };

  const formatVolume = (volume: number): string => {
    if (volume >= 1e9) return (volume / 1e9).toFixed(1) + 'B';
    if (volume >= 1e6) return (volume / 1e6).toFixed(1) + 'M';
    if (volume >= 1e3) return (volume / 1e3).toFixed(1) + 'K';
    return volume.toString();
  };

  const transformTokens = (): Token[] => {
    if (!heatmapData?.tokens) {
      // Fallback mock data when API is not available
      return [
        { name: 'BTC', price: '$67,420', priceChange: 2.4, mentions: 15420, marketCap: 1200000, volume: 25000 },
        { name: 'ETH', price: '$3,245', priceChange: 4.1, mentions: 12890, marketCap: 800000, volume: 18000 },
        { name: 'SOL', price: '$189', priceChange: 8.7, mentions: 8934, marketCap: 400000, volume: 12000 },
        { name: 'ADA', price: '$0.89', priceChange: -1.2, mentions: 5670, marketCap: 300000, volume: 8000 },
        { name: 'DOT', price: '$12.45', priceChange: 3.5, mentions: 4230, marketCap: 250000, volume: 6000 },
        { name: 'AVAX', price: '$45.67', priceChange: 6.2, mentions: 3890, marketCap: 200000, volume: 5500 },
        { name: 'LINK', price: '$23.89', priceChange: -2.7, mentions: 3450, marketCap: 180000, volume: 4800 },
        { name: 'UNI', price: '$8.92', priceChange: -5.1, mentions: 2890, marketCap: 150000, volume: 4200 },
        { name: 'MATIC', price: '$1.23', priceChange: 4.9, mentions: 2560, marketCap: 120000, volume: 3800 },
        { name: 'ATOM', price: '$15.34', priceChange: 1.7, mentions: 1890, marketCap: 100000, volume: 3200 },
        { name: 'ALGO', price: '$0.45', priceChange: -3.2, mentions: 1650, marketCap: 80000, volume: 2800 },
        { name: 'XTZ', price: '$2.89', priceChange: 0.8, mentions: 1200, marketCap: 60000, volume: 2200 },
        { name: 'NEAR', price: '$4.56', priceChange: 7.3, mentions: 1890, marketCap: 75000, volume: 2600 },
        { name: 'FTM', price: '$0.78', priceChange: -2.1, mentions: 1450, marketCap: 55000, volume: 2100 },
        { name: 'SAND', price: '$1.12', priceChange: 12.4, mentions: 2340, marketCap: 65000, volume: 2400 },
        { name: 'MANA', price: '$0.89', priceChange: 9.8, mentions: 1980, marketCap: 58000, volume: 2000 },
        { name: 'APE', price: '$3.45', priceChange: -4.7, mentions: 1670, marketCap: 52000, volume: 1900 },
        { name: 'LRC', price: '$0.34', priceChange: 5.6, mentions: 1230, marketCap: 45000, volume: 1700 },
        { name: 'CRV', price: '$1.89', priceChange: -1.8, mentions: 1100, marketCap: 42000, volume: 1600 },
        { name: 'SUSHI', price: '$2.34', priceChange: 3.2, mentions: 980, marketCap: 38000, volume: 1400 }
      ].slice(0, 20);
    }

    return heatmapData.tokens.map(token => ({
      name: token.token_symbol,
      price: token.price, // API already returns formatted price
      priceChange: token.price_change_24h || 0,
      mentions: token.mentions_count || Math.floor(Math.random() * 10000) + 1000,
      marketCap: token.market_cap || 0,
      volume: token.volume || 0
    }));
  };

  const getTokenColor = (priceChange: number) => {
    if (priceChange >= 5) return 'bg-green-500';
    if (priceChange > 0) return 'bg-green-400';
    if (priceChange <= -5) return 'bg-red-500';
    if (priceChange < 0) return 'bg-red-400';
    return 'bg-gray-500';
  };

  const getTextColor = (priceChange: number) => {
    return 'text-white';
  };

  const tokens = transformTokens();
  const sortedTokens = [...tokens].sort((a, b) => b.marketCap - a.marketCap);

  const handleRefresh = async () => {
    console.log('🔄 Manual refresh triggered for heatmap');
    await refetch();
  };

  if (error) {
    console.error('🔥 TokenHeatMap error:', error);
    return (
      <div className="h-full flex flex-col overflow-hidden">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md">
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Unable to Load Token Data</h3>
            <p className="text-gray-400 mb-4">
              {error instanceof Error ? error.message : 'Unknown error occurred'}
            </p>
            {error instanceof Error && error.message.includes('CORS') && (
              <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-3 mb-4 text-left">
                <h4 className="text-yellow-400 font-semibold text-sm mb-1">CORS Issue Detected</h4>
                <p className="text-gray-300 text-xs">
                  API server needs proper CORS headers configured
                </p>
              </div>
            )}
            <button
              onClick={handleRefresh}
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-xl text-white font-medium transition-all duration-300"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Use the enhanced version by default
  return <TokenHeatMapEnhanced />;
};

export default TokenHeatMap;
