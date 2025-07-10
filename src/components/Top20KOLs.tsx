
import { useState } from 'react';
import { useKOLRankings } from '../hooks/useMarketData';

interface KOL {
  id: string;
  username: string;
  profileImage: string;
  popularity: string;
  rank: number;
  trendData: number[];
}

const Top20KOLs = () => {
  const [timeFilter, setTimeFilter] = useState('30D');
  const [useChartFormat, setUseChartFormat] = useState(false);
  
  const timeFilters = ['7D', '30D', '3M', '6M', '12M'];
  const { data: kolRankingsData, isLoading, error } = useKOLRankings(20, useChartFormat);
  
  const generateTrendData = () => {
    return Array.from({ length: 20 }, () => Math.random() * 40 + 10);
  };

  // Different avatar images for each KOL
  const avatarImages = [
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1552058544-f2b08422138a?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1463453091185-61582044d556?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face'
  ];

  const fallbackKOLs: KOL[] = Array.from({ length: 20 }, (_, index) => ({
    id: `kol-${index + 1}`,
    username: [
      'CryptoKing.eth', 'BlockchainGuru', 'DefiMaster', 'NFTCollector',
      'CoinAnalyst', 'TradingPro', 'MetaExpert', 'Web3Builder',
      'TokenHunter', 'DappDeveloper', 'CryptoWhale', 'ChainAnalyst',
      'DigitalAsset', 'SmartContract', 'DeFiProtocol', 'YieldFarmer',
      'LiquidityPool', 'GovernanceDAO', 'StakingReward', 'BridgeBuilder'
    ][index],
    profileImage: avatarImages[index],
    popularity: `${(Math.random() * 2 + 0.1).toFixed(2)}%`,
    rank: index + 1,
    trendData: generateTrendData()
  }));

  // Use API data or fallback
  let kols: KOL[] = [];
  if (kolRankingsData?.kols && kolRankingsData.kols.length > 0) {
    console.log('👑 Using API KOL rankings:', kolRankingsData.kols);
    kols = kolRankingsData.kols.map((kol, index) => ({
      id: kol.id || `kol-api-${index}`,
      username: kol.username || kol.display_name || `KOL${index + 1}`,
      profileImage: kol.profile_image_url || avatarImages[index] || avatarImages[0],
      popularity: `${(kol.engagement_rate || Math.random() * 2 + 0.1).toFixed(2)}%`,
      rank: kol.rank || index + 1,
      trendData: kol.trend_data || generateTrendData()
    }));
  } else {
    console.log('👑 Using fallback KOLs');
    kols = fallbackKOLs;
  }

  const getRankStyle = (rank: number) => {
    if (rank === 1) return 'border-yellow-400 bg-gradient-to-br from-yellow-500/20 to-amber-600/20';
    if (rank === 2) return 'border-gray-300 bg-gradient-to-br from-gray-300/20 to-gray-500/20';
    if (rank === 3) return 'border-orange-400 bg-gradient-to-br from-orange-500/20 to-amber-700/20';
    return 'border-gray-600/30 bg-gray-800/60';
  };

  const generateMiniChart = (data: number[]) => {
    // Normalize data to fit in our chart area (leaving space for axes)
    const chartWidth = 80;
    const chartHeight = 35;
    const padding = 5;
    
    const minValue = Math.min(...data);
    const maxValue = Math.max(...data);
    const valueRange = maxValue - minValue || 1;
    
    return data.map((point, index) => {
      const x = padding + (index / (data.length - 1)) * (chartWidth - padding * 2);
      const y = padding + ((maxValue - point) / valueRange) * (chartHeight - padding * 2);
      return `${x},${y}`;
    }).join(' ');
  };

  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-slate-800/50 to-indigo-900/30 backdrop-blur-sm border border-indigo-500/20 rounded-2xl p-6 shadow-2xl shadow-indigo-500/10">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 gap-4">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Top 20 KOLs
          </h2>
        </div>
        <div className="min-h-[400px] flex items-center justify-center">
          <div className="text-gray-400 text-lg">Loading KOL rankings...</div>
        </div>
      </div>
    );
  }

  if (error) {
    console.error('👑 KOL rankings API error:', error);
  }

  return (
    <div className="bg-gradient-to-br from-slate-800/50 to-indigo-900/30 backdrop-blur-sm border border-indigo-500/20 rounded-2xl p-6 shadow-2xl shadow-indigo-500/10">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 gap-4">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
          Top 20 KOLs
        </h2>
        
        {/* Time Filter and Chart Format Toggle */}
        <div className="flex space-x-1">
          {timeFilters.map((filter) => (
            <button
              key={filter}
              onClick={() => setTimeFilter(filter)}
              className={`px-3 py-1.5 rounded text-sm font-medium transition-all ${
                timeFilter === filter
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {filter}
            </button>
          ))}
          <button
            onClick={() => setUseChartFormat(!useChartFormat)}
            className={`px-3 py-1.5 rounded text-sm font-medium transition-all ${
              useChartFormat
                ? 'bg-purple-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
            title="Toggle chart data format"
          >
            📊
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {kols.map((kol) => (
          <div
            key={kol.id}
            className={`${getRankStyle(kol.rank)} border rounded-xl p-4 hover:bg-gray-700/60 transition-all duration-300 cursor-pointer group relative`}
          >
            {/* Crown for top 3 */}
            {kol.rank <= 3 && (
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-xs">
                👑
              </div>
            )}
            
            <div className="flex items-center space-x-3 mb-3">
              <img
                src={kol.profileImage}
                alt={kol.username}
                className="w-10 h-10 rounded-full border-2 border-gray-600"
              />
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-medium text-sm truncate" title={kol.username}>
                  {kol.username}
                </h3>
                <p className="text-indigo-400 text-xs font-semibold">
                  {kol.popularity}
                </p>
              </div>
            </div>
            
            {/* Mini Chart with Axes */}
            <div className="h-12 w-full">
              <svg className="w-full h-full" viewBox="0 0 90 45">
                {/* X-axis */}
                <line
                  x1="5"
                  y1="40"
                  x2="85"
                  y2="40"
                  stroke="#6b7280"
                  strokeWidth="0.5"
                />
                {/* Y-axis */}
                <line
                  x1="5"
                  y1="5"
                  x2="5"
                  y2="40"
                  stroke="#6b7280"
                  strokeWidth="0.5"
                />
                {/* Data line */}
                <polyline
                  fill="none"
                  stroke={kol.rank <= 3 ? '#fbbf24' : '#6366f1'}
                  strokeWidth="1.5"
                  points={generateMiniChart(kol.trendData)}
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

export default Top20KOLs;
