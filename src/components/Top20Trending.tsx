
import { useState } from 'react';

interface TrendingToken {
  name: string;
  symbol: string;
  percentage: string;
  icon: string;
  chartColor: string;
}

const Top20Trending = () => {
  const [activeTimeframe, setActiveTimeframe] = useState('7D');
  
  const timeframes = ['7D', '30D', '3M', '6M', '12M'];
  
  const trendingTokens: TrendingToken[] = [
    { name: 'IcoBe...', symbol: 'ICO', percentage: '0.70%', icon: '🪙', chartColor: 'text-yellow-400' },
    { name: 'Yueya.eth', symbol: 'YUE', percentage: '0.59%', icon: '👑', chartColor: 'text-purple-400' },
    { name: 'mert | helius....', symbol: 'MERT', percentage: '0.55%', icon: '🌟', chartColor: 'text-blue-400' },
    { name: 'BREAD', symbol: 'BREAD', percentage: '0.53%', icon: '🍞', chartColor: 'text-orange-400' },
    { name: 'The Bitc...', symbol: 'BTC', percentage: '0.48%', icon: '🪙', chartColor: 'text-orange-500' },
    { name: 'nairolf', symbol: 'NAIR', percentage: '0.42%', icon: '👤', chartColor: 'text-gray-400' },
    { name: 'alvin617...', symbol: 'ALV', percentage: '0.40%', icon: '🔥', chartColor: 'text-green-400' },
    { name: 'Clemente', symbol: 'CLEM', percentage: '0.38%', icon: '💎', chartColor: 'text-cyan-400' },
    { name: 'jesse....', symbol: 'JESSE', percentage: '0.67%', icon: '👑', chartColor: 'text-purple-400' },
    { name: 'aixbt', symbol: 'AIXBT', percentage: '0.38%', icon: '🤖', chartColor: 'text-blue-500' },
    { name: '土澳大狮兄...', symbol: 'LION', percentage: '0.35%', icon: '🦁', chartColor: 'text-yellow-500' },
    { name: 'Haseeb >...', symbol: 'HAS', percentage: '0.34%', icon: '💫', chartColor: 'text-green-500' },
    { name: 'Unipcs (...', symbol: 'UNI', percentage: '0.45%', icon: '🦄', chartColor: 'text-pink-400' },
    { name: '孤鶴.hl', symbol: 'GUH', percentage: '0.34%', icon: '🐦', chartColor: 'text-blue-300' },
    { name: 'anymose', symbol: 'ANY', percentage: '0.33%', icon: '👻', chartColor: 'text-purple-300' },
    { name: 'gabri...', symbol: 'GAB', percentage: '0.64%', icon: '💎', chartColor: 'text-cyan-500' },
    { name: 'wale.mo...', symbol: 'WALE', percentage: '0.45%', icon: '🐋', chartColor: 'text-blue-600' },
    { name: 'davi...', symbol: 'DAVI', percentage: '0.37%', icon: '⚡', chartColor: 'text-yellow-600' },
    { name: 'Yu Hu', symbol: 'YU', percentage: '0.32%', icon: '🐅', chartColor: 'text-orange-600' },
    { name: 'TylerD', symbol: 'TYL', percentage: '0.31%', icon: '🎯', chartColor: 'text-red-400' }
  ];

  const generateMiniChart = () => {
    const points = Array.from({ length: 20 }, () => Math.random() * 40 + 10);
    return points.map((point, index) => `${index * 5},${point}`).join(' ');
  };

  return (
    <div className="bg-gradient-to-br from-slate-800/50 to-purple-900/30 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-6 shadow-2xl shadow-purple-500/10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Top20
        </h2>
        <div className="flex space-x-1">
          {timeframes.map((timeframe) => (
            <button
              key={timeframe}
              onClick={() => setActiveTimeframe(timeframe)}
              className={`px-3 py-1 rounded text-sm font-medium transition-all ${
                activeTimeframe === timeframe
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {timeframe}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-h-[600px] overflow-y-auto">
        {trendingTokens.map((token, index) => (
          <div
            key={token.symbol}
            className="bg-gray-800/60 border border-gray-600/30 rounded-lg p-4 hover:bg-gray-700/60 transition-all duration-300 cursor-pointer group"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-2">
                <span className="text-lg">{token.icon}</span>
                <div>
                  <h3 className="text-white font-medium text-sm truncate" title={token.name}>
                    {token.name}
                  </h3>
                  <p className={`text-xs font-semibold ${token.chartColor}`}>
                    {token.percentage}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Mini Chart */}
            <div className="h-12 w-full">
              <svg className="w-full h-full" viewBox="0 0 100 50">
                <polyline
                  fill="none"
                  stroke={`rgb(${token.chartColor.includes('yellow') ? '251 191 36' : 
                    token.chartColor.includes('purple') ? '168 85 247' :
                    token.chartColor.includes('blue') ? '59 130 246' :
                    token.chartColor.includes('green') ? '34 197 94' :
                    token.chartColor.includes('orange') ? '249 115 22' :
                    token.chartColor.includes('pink') ? '236 72 153' :
                    token.chartColor.includes('cyan') ? '6 182 212' :
                    token.chartColor.includes('red') ? '239 68 68' : '156 163 175'})`}
                  strokeWidth="1.5"
                  points={generateMiniChart()}
                  className="group-hover:stroke-2 transition-all duration-300"
                />
              </svg>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Top20Trending;
