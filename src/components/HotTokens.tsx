
import { useState } from 'react';
import { Flame } from 'lucide-react';

interface HotTokenData {
  symbol: string;
  name: string;
  trendScore: number;
  icon: string;
}

const HotTokens = () => {
  const [activeTimeframe, setActiveTimeframe] = useState('1H');
  
  const timeframes = ['1H', '4H', '1D', '1W'];
  
  const hotTokens: HotTokenData[] = [
    { symbol: 'BTC', name: 'Bitcoin', trendScore: 6817, icon: '₿' },
    { symbol: 'ETH', name: 'Ethereum', trendScore: 5420, icon: 'Ξ' },
    { symbol: 'SOL', name: 'Solana', trendScore: 4250, icon: '◎' },
    { symbol: 'ADA', name: 'Cardano', trendScore: 3890, icon: '₳' },
    { symbol: 'AVAX', name: 'Avalanche', trendScore: 3650, icon: '🔺' },
    { symbol: 'DOT', name: 'Polkadot', trendScore: 3420, icon: '●' },
    { symbol: 'MATIC', name: 'Polygon', trendScore: 3200, icon: '🔷' },
    { symbol: 'LINK', name: 'Chainlink', trendScore: 2980, icon: '🔗' },
    { symbol: 'UNI', name: 'Uniswap', trendScore: 2750, icon: '🦄' },
    { symbol: 'ATOM', name: 'Cosmos', trendScore: 2560, icon: '⚛' },
    { symbol: 'ALGO', name: 'Algorand', trendScore: 2340, icon: '▲' },
    { symbol: 'XTZ', name: 'Tezos', trendScore: 2120, icon: '🅧' }
  ];

  const sortedTokens = [...hotTokens].sort((a, b) => b.trendScore - a.trendScore);

  const getBubbleSize = (score: number, maxScore: number, index: number) => {
    const baseSize = 80;
    const maxSize = 120;
    const ratio = score / maxScore;
    const variation = Math.sin(index * 0.5) * 6;
    return Math.max(baseSize, baseSize + (maxSize - baseSize) * ratio + variation);
  };

  const maxScore = Math.max(...hotTokens.map(token => token.trendScore));

  const getTextSizes = (bubbleSize: number) => {
    const iconSize = Math.max(16, bubbleSize / 6);
    const symbolSize = Math.max(12, bubbleSize / 8);
    const scoreSize = Math.max(10, bubbleSize / 10);
    
    return { iconSize, symbolSize, scoreSize };
  };

  return (
    <div className="bg-gradient-to-br from-slate-800/50 to-orange-900/30 backdrop-blur-sm border border-orange-500/20 rounded-2xl p-6 shadow-2xl shadow-orange-500/10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
          Hot Tokens
        </h2>
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
      </div>

      <div className="relative min-h-[400px] flex items-center justify-center">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 place-items-center w-full max-w-6xl">
          {sortedTokens.map((token, index) => {
            const size = getBubbleSize(token.trendScore, maxScore, index);
            const { iconSize, symbolSize, scoreSize } = getTextSizes(size);
            
            return (
              <div
                key={token.symbol}
                className="group cursor-pointer transform transition-all duration-500 hover:scale-105 hover:z-10 relative"
                style={{ 
                  width: `${size}px`, 
                  height: `${size}px`,
                  animationDelay: `${index * 0.1}s`
                }}
              >
                <div 
                  className={`
                    w-full h-full rounded-full flex flex-col items-center justify-center 
                    border-2 transition-all duration-500 shadow-lg relative overflow-hidden
                    ${index < 3 
                      ? 'border-yellow-400/60 shadow-orange-500/40' 
                      : 'border-orange-400/40 shadow-orange-500/20'
                    }
                    group-hover:border-orange-400/80 group-hover:shadow-orange-500/50
                    backdrop-blur-sm
                  `}
                  style={{ 
                    background: `linear-gradient(135deg, 
                      rgba(249, 115, 22, ${0.15 + (token.trendScore / maxScore) * 0.2}) 0%, 
                      rgba(234, 88, 12, ${0.25 + (token.trendScore / maxScore) * 0.25}) 50%, 
                      rgba(194, 65, 12, ${0.15 + (token.trendScore / maxScore) * 0.15}) 100%)`
                  }}
                >
                  {/* Rank indicator for top tokens */}
                  {index < 3 && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-lg z-10">
                      {index + 1}
                    </div>
                  )}
                  
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
                  {index < 3 && (
                    <div className="absolute inset-0 rounded-full border-2 border-orange-400/30 animate-ping"></div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 flex items-center justify-center space-x-6 text-sm text-gray-400">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"></div>
          <span>Top Performers</span>
        </div>
        <div className="flex items-center space-x-2">
          <Flame size={14} className="text-red-500" />
          <span>Trend Score</span>
        </div>
      </div>
    </div>
  );
};

export default HotTokens;
