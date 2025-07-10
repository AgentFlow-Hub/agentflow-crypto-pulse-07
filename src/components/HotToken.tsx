
import { useState } from 'react';

interface HotTokenData {
  symbol: string;
  name: string;
  mentions: number;
  icon: string;
}

const HotToken = () => {
  const [activeTimeframe, setActiveTimeframe] = useState('1H');
  
  const timeframes = ['1H', '4H', '1D', '1W'];
  
  const hotTokens: HotTokenData[] = [
    { symbol: 'BTC', name: 'Bitcoin', mentions: 6617, icon: '₿' },
    { symbol: 'ETH', name: 'Ethereum', mentions: 3817, icon: 'Ξ' },
    { symbol: 'ETH', name: 'Ethereum', mentions: 3817, icon: 'Ξ' },
    { symbol: 'ETH', name: 'Ethereum', mentions: 3817, icon: 'Ξ' },
    { symbol: 'ETH', name: 'Ethereum', mentions: 3817, icon: 'Ξ' },
    { symbol: 'ETH', name: 'Ethereum', mentions: 3817, icon: 'Ξ' },
    { symbol: 'ETH', name: 'Ethereum', mentions: 3817, icon: 'Ξ' },
    { symbol: 'ETH', name: 'Ethereum', mentions: 3817, icon: 'Ξ' },
  ];

  return (
    <div className="bg-gradient-to-br from-slate-800/50 to-green-900/30 backdrop-blur-sm border border-green-500/20 rounded-2xl p-6 shadow-2xl shadow-green-500/10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
          Hot Token
        </h2>
        <div className="flex space-x-1">
          {timeframes.map((timeframe) => (
            <button
              key={timeframe}
              onClick={() => setActiveTimeframe(timeframe)}
              className={`px-3 py-1 rounded text-sm font-medium transition-all ${
                activeTimeframe === timeframe
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {timeframe}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {hotTokens.map((token, index) => (
          <div
            key={`${token.symbol}-${index}`}
            className="bg-gray-800/60 border border-gray-600/30 rounded-xl p-4 hover:bg-gray-700/60 transition-all duration-300 cursor-pointer group flex flex-col items-center text-center"
          >
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-3 group-hover:scale-105 transition-transform duration-300 border-2 border-green-400">
              <span className="text-2xl font-bold text-gray-800">{token.icon}</span>
            </div>
            
            <h3 className="text-white font-bold text-lg mb-1">{token.symbol}</h3>
            
            <div className="flex items-center space-x-1 text-orange-400">
              <span className="text-sm">🔥</span>
              <span className="text-sm font-semibold">{token.mentions}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HotToken;
