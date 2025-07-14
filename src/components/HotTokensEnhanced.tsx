import { useState, useCallback, useEffect } from 'react';
import { Flame, AlertCircle, RefreshCw, TrendingUp, TrendingDown, Eye, Heart, Trophy, Zap, BarChart3, DollarSign } from 'lucide-react';
import { useTokenSocialRankings } from '../hooks/useMarketData';

interface HotTokenData {
  symbol: string;
  name: string;
  trendScore: number;
  icon: string;
  rank: number;
  price?: string;
  priceChange?: number;
  marketCap?: number;
  volume?: number;
}

interface TokenDetailModalProps {
  token: HotTokenData | null;
  isOpen: boolean;
  onClose: () => void;
}

const TokenDetailModal = ({ token, isOpen, onClose }: TokenDetailModalProps) => {
  if (!isOpen || !token) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div 
        className="relative bg-gradient-to-br from-slate-800/95 to-orange-900/95 backdrop-blur-lg border border-orange-500/30 rounded-3xl p-6 max-w-md w-full shadow-2xl shadow-orange-500/20 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
              {token.icon}
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">{token.symbol}</h3>
              <p className="text-sm text-gray-300">{token.name}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-700/50 hover:bg-gray-600/50 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
          >
            ×
          </button>
        </div>

        {/* Rank Badge */}
        <div className="flex items-center justify-center mb-6">
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full px-6 py-3 flex items-center space-x-2">
            <Trophy className="w-5 h-5 text-white" />
            <span className="text-white font-bold">Rank #{token.rank}</span>
          </div>
        </div>

        {/* Trend Score Section */}
        <div className="mb-6 text-center">
          <div className="text-3xl font-bold text-white mb-2 flex items-center justify-center space-x-2">
            <Flame className="w-8 h-8 text-red-500" />
            <span>
              {token.trendScore > 1000 
                ? `${(token.trendScore / 1000).toFixed(1)}K`
                : token.trendScore.toString()
              }
            </span>
          </div>
          <div className="text-orange-400 font-semibold">Trend Score</div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-xl p-4 border border-orange-500/30">
            <div className="flex items-center space-x-2 mb-2">
              <Eye className="w-4 h-4 text-orange-400" />
              <span className="text-sm text-gray-300">Social Mentions</span>
            </div>
            <div className="text-xl font-bold text-white">{token.trendScore.toLocaleString()}</div>
          </div>
          
          <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-xl p-4 border border-yellow-500/30">
            <div className="flex items-center space-x-2 mb-2">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span className="text-sm text-gray-300">Heat Level</span>
            </div>
            <div className="text-xl font-bold text-white">
              {token.rank <= 3 ? 'EXTREME' : token.rank <= 6 ? 'HIGH' : 'MODERATE'}
            </div>
          </div>
        </div>

        {/* Performance Indicator */}
        <div className="bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-xl p-4 border border-red-500/30 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm text-gray-300">Trend Performance</span>
              <div className="text-xl font-bold text-white">
                {token.rank <= 3 ? '🔥 Blazing' : token.rank <= 6 ? '⚡ Hot' : '📈 Rising'}
              </div>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center">
              <Flame className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button className="flex-1 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 rounded-xl py-3 text-white font-semibold transition-all duration-300 transform hover:scale-105">
            Track Token
          </button>
          <button className="flex-1 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 rounded-xl py-3 text-white font-semibold transition-all duration-300 transform hover:scale-105">
            Add to Watchlist
          </button>
        </div>
      </div>
    </div>
  );
};

// Hover Tooltip Component
const HoverTooltip = ({ token, position, maxScore }: { token: HotTokenData; position: { x: number; y: number }; maxScore: number }) => {
  return (
    <div 
      className="fixed z-50 pointer-events-none"
      style={{
        left: `${position.x + 20}px`,
        top: `${position.y - 80}px`,
        transform: 'translateY(-50%)'
      }}
    >
      <div className="bg-gradient-to-br from-slate-800/95 to-orange-900/95 backdrop-blur-lg border border-orange-500/30 rounded-xl p-4 shadow-2xl shadow-orange-500/20 min-w-[280px] animate-scale-in">
        {/* Header */}
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold">
            {token.icon}
          </div>
          <div>
            <h4 className="text-white font-bold">{token.symbol}</h4>
            <p className="text-xs text-gray-300">{token.name}</p>
          </div>
          <div className="ml-auto">
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full px-2 py-1 text-xs font-bold text-white">
              #{token.rank}
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="bg-orange-500/20 rounded-lg p-2 border border-orange-500/30">
            <div className="flex items-center space-x-1 mb-1">
              <Flame className="w-3 h-3 text-red-400" />
              <span className="text-xs text-gray-300">Trend Score</span>
            </div>
            <div className="text-sm font-bold text-white">
              {token.trendScore > 1000 
                ? `${(token.trendScore / 1000).toFixed(1)}K`
                : token.trendScore.toString()
              }
            </div>
          </div>
          
          <div className="bg-blue-500/20 rounded-lg p-2 border border-blue-500/30">
            <div className="flex items-center space-x-1 mb-1">
              <BarChart3 className="w-3 h-3 text-blue-400" />
              <span className="text-xs text-gray-300">Heat Level</span>
            </div>
            <div className="text-sm font-bold text-white">
              {token.rank <= 3 ? 'EXTREME' : token.rank <= 6 ? 'HIGH' : 'MODERATE'}
            </div>
          </div>
        </div>

        {/* Performance */}
        <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-lg p-2 border border-green-500/30">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs text-gray-300">Performance</span>
              <div className="text-sm font-bold text-white">
                {token.rank <= 3 ? '🔥 Blazing' : token.rank <= 6 ? '⚡ Hot' : '📈 Rising'}
              </div>
            </div>
            <div className="text-green-400 text-xs">
              +{Math.round((token.trendScore / maxScore) * 100)}%
            </div>
          </div>
        </div>

        {/* Tooltip Arrow */}
        <div className="absolute left-[-8px] top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-8 border-b-8 border-r-8 border-transparent border-r-orange-500/30"></div>
      </div>
    </div>
  );
};

const HotTokensEnhanced = () => {
  const [activeTimeframe, setActiveTimeframe] = useState('1D');
  const [hoveredToken, setHoveredToken] = useState<HotTokenData | null>(null);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });
  const [selectedToken, setSelectedToken] = useState<HotTokenData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  
  const timeframes = ['4H', '1D', '1W', '30D'];
  
  // Map timeframes to API-compatible format
  const timeframeMap = {
    '4H': '4h',
    '1D': '24h', 
    '1W': '7d',
    '30D': '30d'
  };
  
  const { data: tokenRankingsData, isLoading, error, refetch, isFetching } = useTokenSocialRankings(20, timeframeMap[activeTimeframe as keyof typeof timeframeMap]);
  
  const fallbackTokens: HotTokenData[] = [
    { symbol: 'BTC', name: 'Bitcoin', trendScore: 6817, icon: '₿', rank: 1 },
    { symbol: 'ETH', name: 'Ethereum', trendScore: 5420, icon: 'Ξ', rank: 2 },
    { symbol: 'SOL', name: 'Solana', trendScore: 4250, icon: '◎', rank: 3 },
    { symbol: 'ADA', name: 'Cardano', trendScore: 3890, icon: '₳', rank: 4 },
    { symbol: 'AVAX', name: 'Avalanche', trendScore: 3650, icon: '🔺', rank: 5 },
    { symbol: 'DOT', name: 'Polkadot', trendScore: 3420, icon: '●', rank: 6 },
    { symbol: 'MATIC', name: 'Polygon', trendScore: 3200, icon: '🔷', rank: 7 },
    { symbol: 'LINK', name: 'Chainlink', trendScore: 2980, icon: '🔗', rank: 8 },
    { symbol: 'UNI', name: 'Uniswap', trendScore: 2750, icon: '🦄', rank: 9 },
    { symbol: 'ATOM', name: 'Cosmos', trendScore: 2560, icon: '⚛', rank: 10 },
    { symbol: 'ALGO', name: 'Algorand', trendScore: 2340, icon: '▲', rank: 11 },
    { symbol: 'XTZ', name: 'Tezos', trendScore: 2120, icon: '🅧', rank: 12 }
  ];

  // Generate token icon based on symbol
  const getTokenIcon = (symbol: string): string => {
    const iconMap: { [key: string]: string } = {
      'BTC': '₿',
      'ETH': 'Ξ',
      'SOL': '◎',
      'ADA': '₳',
      'AVAX': '🔺',
      'DOT': '●',
      'MATIC': '🔷',
      'LINK': '🔗',
      'UNI': '🦄',
      'ATOM': '⚛',
      'ALGO': '▲'
    };
    return iconMap[symbol] || '🔸';
  };

  // Use API data or fallback
  let hotTokens: HotTokenData[] = [];
  if (tokenRankingsData?.tokens && tokenRankingsData.tokens.length > 0) {
    hotTokens = tokenRankingsData.tokens.map((token, index) => ({
      symbol: token.token_symbol,
      name: token.token_name || token.token_symbol,
      trendScore: Math.round(token.social_score || token.mentions_count || 0),
      icon: getTokenIcon(token.token_symbol),
      rank: index + 1
    }));
  } else {
    hotTokens = fallbackTokens;
  }

  const sortedTokens = [...hotTokens].sort((a, b) => b.trendScore - a.trendScore);

  const getBubbleSize = (score: number, maxScore: number, rank: number) => {
    const baseSize = 70;
    const maxSize = 110;
    const ratio = score / maxScore;
    const rankBonus = rank <= 3 ? 15 : rank <= 6 ? 10 : 5;
    const variation = Math.sin(rank * 0.5) * 6;
    return Math.max(baseSize, baseSize + (maxSize - baseSize) * ratio + rankBonus + variation);
  };

  const maxScore = Math.max(...hotTokens.map(token => token.trendScore), 1);

  const getTextSizes = (bubbleSize: number) => {
    const iconSize = Math.max(16, bubbleSize / 6);
    const symbolSize = Math.max(12, bubbleSize / 8);
    const scoreSize = Math.max(10, bubbleSize / 10);
    
    return { iconSize, symbolSize, scoreSize };
  };

  const handleTokenClick = useCallback((token: HotTokenData) => {
    setSelectedToken(token);
    setIsModalOpen(true);
  }, []);

  const toggleFavorite = useCallback((tokenSymbol: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(tokenSymbol)) {
        newFavorites.delete(tokenSymbol);
      } else {
        newFavorites.add(tokenSymbol);
      }
      return newFavorites;
    });
  }, []);

  const handleRefresh = async () => {
    await refetch();
  };

  if (error) {
    return (
      <div className="h-full flex flex-col overflow-hidden">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md">
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Unable to Load Hot Tokens</h3>
            <p className="text-gray-400 mb-4">
              {error instanceof Error ? error.message : 'Unknown error occurred'}
            </p>
            <button
              onClick={handleRefresh}
              className="px-6 py-2 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 rounded-xl text-white font-medium transition-all duration-300"
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
          {(isLoading || isFetching) && <RefreshCw className="w-4 h-4 animate-spin text-orange-400" />}
          <span className="text-sm text-gray-400">
            {tokenRankingsData ? '🟢 Live Data' : '🟡 Demo Data'}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          {/* Timeframe Selection */}
          <div className="flex space-x-1">
            {timeframes.map((timeframe) => (
              <button
                key={timeframe}
                onClick={() => setActiveTimeframe(timeframe)}
                className={`px-3 py-1.5 rounded text-sm font-medium transition-all ${
                  activeTimeframe === timeframe
                    ? 'bg-orange-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {timeframe}
              </button>
            ))}
          </div>
          <button
            onClick={handleRefresh}
            className="p-2 rounded-lg bg-gradient-to-r from-orange-600/20 to-red-600/20 hover:from-orange-600/30 hover:to-red-600/30 border border-orange-500/30 transition-all duration-300"
          >
            <RefreshCw className="w-4 h-4 text-orange-400" />
          </button>
        </div>
      </div>

      {/* Enhanced Bubble Grid */}
      <div className="flex-1 min-h-0 relative">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 place-items-center w-full h-full overflow-y-auto pr-2">
          {sortedTokens.map((token, index) => {
            const size = getBubbleSize(token.trendScore, maxScore, token.rank);
            const { iconSize, symbolSize, scoreSize } = getTextSizes(size);
            const isHovered = hoveredToken === token;
            const isFavorite = favorites.has(token.symbol);
            
            return (
              <div
                key={token.symbol}
                className="group cursor-pointer transform transition-all duration-500 hover:scale-110 hover:z-20 relative"
                style={{ 
                  width: `${size}px`, 
                  height: `${size}px`,
                  animationDelay: `${index * 0.1}s`
                }}
                onMouseEnter={(e) => {
                  setHoveredToken(token);
                  setHoverPosition({ x: e.clientX, y: e.clientY });
                }}
                onMouseMove={(e) => {
                  setHoverPosition({ x: e.clientX, y: e.clientY });
                }}
                onMouseLeave={() => setHoveredToken(null)}
                onClick={() => handleTokenClick(token)}
              >
                <div 
                  className={`
                    w-full h-full rounded-full flex flex-col items-center justify-center 
                    border-2 transition-all duration-500 shadow-lg relative overflow-hidden
                    ${token.rank <= 3 
                      ? 'border-yellow-400/80 shadow-orange-500/50 bg-gradient-to-br from-yellow-400/20 via-orange-500/30 to-red-500/20' 
                      : token.rank <= 6
                      ? 'border-orange-400/60 shadow-orange-500/40 bg-gradient-to-br from-orange-400/20 via-red-500/30 to-orange-600/20'
                      : 'border-orange-400/40 shadow-orange-500/30 bg-gradient-to-br from-orange-400/15 via-red-500/25 to-orange-600/15'
                    }
                    ${isHovered ? 'border-orange-400/90 shadow-orange-500/60 brightness-110' : ''}
                    ${isFavorite ? 'ring-2 ring-yellow-400' : ''}
                    backdrop-blur-sm animate-fade-in
                  `}
                  style={{ 
                    animationDelay: `${index * 0.1}s`
                  }}
                >
                  {/* Shimmer Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 rounded-full" />
                  
                  {/* Rank indicator for top tokens */}
                  {token.rank <= 3 && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-lg z-10 animate-pulse">
                      {token.rank}
                    </div>
                  )}

                  {/* Favorite Button - Fixed positioning and clear states */}
                  <button
                    onClick={(e) => toggleFavorite(token.symbol, e)}
                    className={`
                      absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center 
                      transition-all duration-300 z-20 border transform hover:scale-110 shadow-lg
                      ${isFavorite 
                        ? 'bg-red-500 border-red-400 shadow-red-500/50' 
                        : 'bg-white/95 border-gray-300 shadow-gray-500/30 hover:bg-white hover:border-red-300'
                      }
                    `}
                  >
                    <Heart className={`w-4 h-4 transition-all duration-300 ${
                      isFavorite 
                        ? 'fill-white text-white' 
                        : 'text-gray-600 hover:text-red-500'
                    }`} />
                    {isFavorite && (
                      <div className="absolute inset-0 rounded-full animate-ping bg-red-400/20" />
                    )}
                  </button>
                  
                  <div className="text-center z-10 relative flex flex-col items-center justify-center h-full space-y-1">
                    {/* Icon with responsive sizing */}
                    <div 
                      className="font-bold text-white group-hover:scale-110 transition-transform duration-300"
                      style={{ fontSize: `${iconSize}px`, lineHeight: '1' }}
                    >
                      {token.icon}
                    </div>
                    
                    {/* Symbol with responsive sizing */}
                    <div 
                      className="text-white font-bold group-hover:text-orange-200 transition-colors"
                      style={{ 
                        fontSize: `${symbolSize}px`, 
                        lineHeight: '1.1',
                        textShadow: '0 1px 2px rgba(0,0,0,0.5)'
                      }}
                    >
                      {token.symbol}
                    </div>
                    
                    {/* Trend score with responsive sizing */}
                    <div 
                      className="flex items-center justify-center space-x-1 text-orange-400 group-hover:text-orange-300 transition-colors"
                      style={{ fontSize: `${scoreSize}px` }}
                    >
                      <Flame size={Math.max(10, scoreSize)} className="text-red-500 group-hover:animate-pulse" />
                      <span className="font-semibold">
                        {token.trendScore > 1000 
                          ? `${(token.trendScore / 1000).toFixed(1)}K`
                          : token.trendScore.toString()
                        }
                      </span>
                    </div>
                  </div>
                  
                  {/* Pulse animation for top performers */}
                  {token.rank <= 3 && (
                    <div className="absolute inset-0 rounded-full border-2 border-orange-400/30 animate-ping"></div>
                  )}

                  {/* High activity pulse */}
                  {token.rank <= 6 && (
                    <div className="absolute inset-0 rounded-full animate-pulse bg-white/5" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Hover Tooltip */}
      {hoveredToken && (
        <HoverTooltip token={hoveredToken} position={hoverPosition} maxScore={maxScore} />
      )}

      {/* Legend */}
      <div className="mt-4 flex items-center justify-center space-x-6 text-sm text-gray-400 flex-shrink-0">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"></div>
          <span>Top 3</span>
        </div>
        <div className="flex items-center space-x-2">
          <Flame size={14} className="text-red-500" />
          <span>Trend Score</span>
        </div>
        <div className="flex items-center space-x-2">
          <Heart size={14} className="text-yellow-400" />
          <span>Favorites</span>
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

export default HotTokensEnhanced;