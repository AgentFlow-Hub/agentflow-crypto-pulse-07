import { useState, useCallback, useEffect } from 'react';
import { AlertCircle, RefreshCw, TrendingUp, TrendingDown, Eye, Heart } from 'lucide-react';
import { useTokenHeatmap } from '../hooks/useMarketData';

interface Token {
  name: string;
  price: string;
  priceChange: number;
  mentions: number;
  marketCap: number;
  volume: number;
}

interface TokenDetailModalProps {
  token: Token | null;
  isOpen: boolean;
  onClose: () => void;
}

const TokenDetailModal = ({ token, isOpen, onClose }: TokenDetailModalProps) => {
  if (!isOpen || !token) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div 
        className="relative bg-gradient-to-br from-slate-800/95 to-blue-900/95 backdrop-blur-lg border border-blue-500/30 rounded-3xl p-6 max-w-md w-full shadow-2xl shadow-blue-500/20 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
              {token.name.slice(0, 2)}
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">{token.name}</h3>
              <p className="text-sm text-gray-300">Token Details</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-700/50 hover:bg-gray-600/50 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
          >
            ×
          </button>
        </div>

        {/* Price Section */}
        <div className="mb-6 text-center">
          <div className="text-3xl font-bold text-white mb-2">{token.price}</div>
          <div className={`flex items-center justify-center space-x-1 ${token.priceChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {token.priceChange >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            <span className="text-lg font-semibold">
              {token.priceChange >= 0 ? '+' : ''}{token.priceChange.toFixed(2)}%
            </span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-xl p-4 border border-purple-500/30">
            <div className="flex items-center space-x-2 mb-2">
              <Eye className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-gray-300">Mentions</span>
            </div>
            <div className="text-xl font-bold text-white">{token.mentions.toLocaleString()}</div>
          </div>
          
          <div className="bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-xl p-4 border border-green-500/30">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="w-4 h-4 text-green-400" />
              <span className="text-sm text-gray-300">Market Cap</span>
            </div>
            <div className="text-xl font-bold text-white">${formatMarketCap(token.marketCap)}</div>
          </div>
        </div>

        {/* Volume */}
        <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl p-4 border border-blue-500/30 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm text-gray-300">24h Volume</span>
              <div className="text-xl font-bold text-white">${formatVolume(token.volume)}</div>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl py-3 text-white font-semibold transition-all duration-300 transform hover:scale-105">
            Track Token
          </button>
          <button className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-xl py-3 text-white font-semibold transition-all duration-300 transform hover:scale-105">
            Add to Watchlist
          </button>
        </div>
      </div>
    </div>
  );
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

const TokenHeatMapEnhanced = () => {
  const [hoveredToken, setHoveredToken] = useState<Token | null>(null);
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const { data: heatmapData, isLoading, error, refetch, isFetching } = useTokenHeatmap(20);

  const transformTokens = (): Token[] => {
    if (!heatmapData?.tokens) {
      return [
        { name: 'BTC', price: '$67,420', priceChange: 2.4, mentions: 15420, marketCap: 1200000000000, volume: 25000000000 },
        { name: 'ETH', price: '$3,245', priceChange: 4.1, mentions: 12890, marketCap: 800000000000, volume: 18000000000 },
        { name: 'SOL', price: '$189', priceChange: 8.7, mentions: 8934, marketCap: 400000000000, volume: 12000000000 },
        { name: 'ADA', price: '$0.89', priceChange: -1.2, mentions: 5670, marketCap: 300000000000, volume: 8000000000 },
        { name: 'DOT', price: '$12.45', priceChange: 3.5, mentions: 4230, marketCap: 250000000000, volume: 6000000000 },
        { name: 'AVAX', price: '$45.67', priceChange: 6.2, mentions: 3890, marketCap: 200000000000, volume: 5500000000 },
        { name: 'LINK', price: '$23.89', priceChange: -2.7, mentions: 3450, marketCap: 180000000000, volume: 4800000000 },
        { name: 'UNI', price: '$8.92', priceChange: -5.1, mentions: 2890, marketCap: 150000000000, volume: 4200000000 },
        { name: 'MATIC', price: '$1.23', priceChange: 4.9, mentions: 2560, marketCap: 120000000000, volume: 3800000000 },
        { name: 'ATOM', price: '$15.34', priceChange: 1.7, mentions: 1890, marketCap: 100000000000, volume: 3200000000 },
        { name: 'ALGO', price: '$0.45', priceChange: -3.2, mentions: 1650, marketCap: 80000000000, volume: 2800000000 },
        { name: 'XTZ', price: '$2.89', priceChange: 0.8, mentions: 1200, marketCap: 60000000000, volume: 2200000000 },
        { name: 'NEAR', price: '$4.56', priceChange: 7.3, mentions: 1890, marketCap: 75000000000, volume: 2600000000 },
        { name: 'FTM', price: '$0.78', priceChange: -2.1, mentions: 1450, marketCap: 55000000000, volume: 2100000000 },
        { name: 'SAND', price: '$1.12', priceChange: 12.4, mentions: 2340, marketCap: 65000000000, volume: 2400000000 },
        { name: 'MANA', price: '$0.89', priceChange: 9.8, mentions: 1980, marketCap: 58000000000, volume: 2000000000 },
        { name: 'APE', price: '$3.45', priceChange: -4.7, mentions: 1670, marketCap: 52000000000, volume: 1900000000 },
        { name: 'LRC', price: '$0.34', priceChange: 5.6, mentions: 1230, marketCap: 45000000000, volume: 1700000000 },
        { name: 'CRV', price: '$1.89', priceChange: -1.8, mentions: 1100, marketCap: 42000000000, volume: 1600000000 },
        { name: 'SUSHI', price: '$2.34', priceChange: 3.2, mentions: 980, marketCap: 38000000000, volume: 1400000000 }
      ].slice(0, 20);
    }

    return heatmapData.tokens.map(token => ({
      name: token.token_symbol,
      price: token.price,
      priceChange: token.price_change_24h || 0,
      mentions: token.mentions_count || Math.floor(Math.random() * 10000) + 1000,
      marketCap: token.market_cap || 0,
      volume: token.volume || 0
    }));
  };

  const getTokenStyle = (token: Token, index: number) => {
    const isHovered = hoveredToken === token;
    const isFavorite = favorites.has(token.name);
    
    let bgColor = '';
    if (token.priceChange >= 10) bgColor = 'from-green-600 to-green-500';
    else if (token.priceChange >= 5) bgColor = 'from-green-500 to-green-400';
    else if (token.priceChange > 0) bgColor = 'from-green-400 to-green-300';
    else if (token.priceChange <= -10) bgColor = 'from-red-600 to-red-500';
    else if (token.priceChange <= -5) bgColor = 'from-red-500 to-red-400';
    else if (token.priceChange < 0) bgColor = 'from-red-400 to-red-300';
    else bgColor = 'from-gray-500 to-gray-400';

    return `
      bg-gradient-to-br ${bgColor} 
      ${isHovered ? 'scale-110 shadow-2xl z-20 brightness-110' : 'scale-100'} 
      ${isFavorite ? 'ring-2 ring-yellow-400' : ''}
      transition-all duration-300 ease-out
      cursor-pointer relative overflow-hidden
      hover:shadow-lg hover:shadow-blue-500/30
      animate-fade-in
    `;
  };

  const handleTokenClick = useCallback((token: Token) => {
    setSelectedToken(token);
    setIsModalOpen(true);
  }, []);

  const toggleFavorite = useCallback((tokenName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(tokenName)) {
        newFavorites.delete(tokenName);
      } else {
        newFavorites.add(tokenName);
      }
      return newFavorites;
    });
  }, []);

  const tokens = transformTokens();
  const sortedTokens = [...tokens].sort((a, b) => b.marketCap - a.marketCap);

  const handleRefresh = async () => {
    await refetch();
  };

  if (error) {
    return (
      <div className="h-full flex flex-col overflow-hidden">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md">
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Unable to Load Token Data</h3>
            <p className="text-gray-400 mb-4">
              {error instanceof Error ? error.message : 'Unknown error occurred'}
            </p>
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

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <div className="flex items-center space-x-2">
          {(isLoading || isFetching) && <RefreshCw className="w-4 h-4 animate-spin text-purple-400" />}
          <span className="text-sm text-gray-400">
            {heatmapData ? '🟢 Live Data' : '🟡 Demo Data'}
          </span>
        </div>
        <button
          onClick={handleRefresh}
          className="p-2 rounded-lg bg-gradient-to-r from-blue-600/20 to-purple-600/20 hover:from-blue-600/30 hover:to-purple-600/30 border border-blue-500/30 transition-all duration-300"
        >
          <RefreshCw className="w-4 h-4 text-blue-400" />
        </button>
      </div>

      {/* Enhanced Token Grid */}
      <div className="flex-1 min-h-0">
        <div className="grid grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-2 h-full overflow-y-auto pr-2">
          {sortedTokens.map((token, index) => {
            const isFavorite = favorites.has(token.name);
            
            return (
              <div
                key={token.name}
                className={getTokenStyle(token, index)}
                style={{ 
                  aspectRatio: '1',
                  animationDelay: `${index * 0.05}s`
                }}
                onMouseEnter={() => setHoveredToken(token)}
                onMouseLeave={() => setHoveredToken(null)}
                onClick={() => handleTokenClick(token)}
              >
                {/* Shimmer Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-1000" />
                
                {/* Favorite Button */}
                <button
                  onClick={(e) => toggleFavorite(token.name, e)}
                  className={`absolute top-1 right-1 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isFavorite ? 'bg-yellow-400 text-yellow-900' : 'bg-black/20 text-white/60 hover:bg-black/40'
                  }`}
                >
                  <Heart className={`w-3 h-3 ${isFavorite ? 'fill-current' : ''}`} />
                </button>

                {/* Content */}
                <div className="p-2 h-full flex flex-col justify-center items-center text-white relative z-10">
                  <div className="font-bold text-sm mb-1 text-center leading-tight">
                    {token.name}
                  </div>
                  <div className="font-medium text-xs mb-1 text-center opacity-90">
                    {isLoading ? '...' : token.price}
                  </div>
                  <div className="font-semibold text-center text-sm">
                    {isLoading ? '...' : `${token.priceChange > 0 ? '+' : ''}${token.priceChange.toFixed(1)}%`}
                  </div>
                </div>

                {/* High Activity Pulse */}
                {Math.abs(token.priceChange) > 8 && (
                  <div className="absolute inset-0 rounded-lg animate-pulse bg-white/10" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Token Detail Modal */}
      <TokenDetailModal 
        token={selectedToken} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
};

export default TokenHeatMapEnhanced;