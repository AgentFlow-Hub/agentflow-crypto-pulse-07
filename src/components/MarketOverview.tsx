
import { ArrowUp, ArrowDown, RefreshCw, AlertCircle } from 'lucide-react';
import { useMarketOverview } from '../hooks/useMarketData';

interface MetricCard {
  title: string;
  value: string;
  change: number;
  description: string;
}

const MarketOverview = () => {
  const { data: marketData, isLoading, error, refetch, isFetching } = useMarketOverview();

  console.log('🏠 MarketOverview render - data:', marketData, 'loading:', isLoading, 'error:', error);

  const formatCurrency = (value: number, decimals = 2): string => {
    if (value >= 1e12) return `$${(value / 1e12).toFixed(decimals)}T`;
    if (value >= 1e9) return `$${(value / 1e9).toFixed(decimals)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(decimals)}M`;
    if (value >= 1e3) return `$${(value / 1e3).toFixed(decimals)}K`;
    return `$${value.toFixed(decimals)}`;
  };

  const formatPercentage = (value: number): string => {
    return `${value.toFixed(1)}%`;
  };

  const parseFormattedValue = (formattedValue: string): number => {
    if (!formattedValue) return 0;
    
    // Remove $ and get the numeric part
    const cleanValue = formattedValue.replace('$', '').replace(',', '');
    const lastChar = cleanValue.slice(-1).toLowerCase();
    const numericPart = parseFloat(cleanValue.slice(0, -1));
    
    if (isNaN(numericPart)) return 0;
    
    switch (lastChar) {
      case 't': return numericPart * 1e12;
      case 'b': return numericPart * 1e9;
      case 'm': return numericPart * 1e6;
      case 'k': return numericPart * 1e3;
      default: return parseFloat(cleanValue) || 0;
    }
  };

  const getChangeValue = (changeData: any): number => {
    if (!changeData) return 0;
    const percentage = changeData.percentage || 0;
    return changeData.direction === 'down' ? -Math.abs(percentage) : Math.abs(percentage);
  };

  const getMetrics = (): MetricCard[] => {
    if (!marketData) {
      return [
        { title: "Market Cap", value: "$2.78T", change: 5.2, description: "Total market capitalization of all cryptocurrencies" },
        { title: "Trading Volume", value: "$98.4B", change: 12.3, description: "24-hour trading volume across all exchanges" },
        { title: "BTC Dominance", value: "42.5%", change: 8.1, description: "Bitcoin's share of total market capitalization" },
        { title: "Active Cryptos", value: "425K", change: 15.7, description: "Number of active cryptocurrencies" },
        { title: "DeFi Volume", value: "1.2B", change: -3.4, description: "24-hour DeFi trading volume" }
      ];
    }

    return [
      {
        title: "Market Cap",
        value: marketData.market_cap?.value || "N/A",
        change: getChangeValue(marketData.market_cap?.change),
        description: "Total market capitalization of all cryptocurrencies"
      },
      {
        title: "Trading Volume",
        value: marketData.trading_volume?.value || "N/A",
        change: getChangeValue(marketData.trading_volume?.change),
        description: "24-hour trading volume across all exchanges"
      },
      {
        title: "Market Sentiment",
        value: marketData.sentiment?.value || "N/A",
        change: getChangeValue(marketData.sentiment?.change),
        description: "Overall market sentiment analysis"
      },
      {
        title: "Social Mentions",
        value: marketData.mentions?.value || "N/A",
        change: getChangeValue(marketData.mentions?.change),
        description: "Total social media mentions across platforms"
      },
      {
        title: "Engagements",
        value: marketData.engagements?.value || "N/A",
        change: getChangeValue(marketData.engagements?.change),
        description: "Social media engagement metrics"
      }
    ];
  };

  const handleRefresh = async () => {
    console.log('🔄 Manual refresh triggered');
    await refetch();
  };

  const metrics = getMetrics();

  const gradients = [
    'from-cyan-500/20 to-blue-600/20',
    'from-purple-500/20 to-pink-600/20',
    'from-emerald-500/20 to-teal-600/20',
    'from-orange-500/20 to-red-600/20',
    'from-indigo-500/20 to-purple-600/20'
  ];

  const borderColors = [
    'border-cyan-500/30',
    'border-purple-500/30',
    'border-emerald-500/30',
    'border-orange-500/30',
    'border-indigo-500/30'
  ];

  if (error) {
    console.error('📊 MarketOverview error:', error);
    return (
      <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 shadow-2xl shadow-slate-900/20">
        <div className="flex items-center justify-center py-8">
          <div className="text-center max-w-2xl">
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Unable to Load Market Data</h3>
            <p className="text-gray-400 mb-4">
              {error instanceof Error ? error.message : 'Unknown error occurred'}
            </p>
            {error instanceof Error && error.message.includes('CORS') && (
              <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4 mb-4 text-left">
                <h4 className="text-yellow-400 font-semibold mb-2">🔧 CORS Configuration Needed</h4>
                <p className="text-gray-300 text-sm mb-2">
                  Your API server needs to include these headers in responses:
                </p>
                <pre className="text-xs text-gray-400 bg-gray-800/50 p-2 rounded">
{`Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, OPTIONS
Access-Control-Allow-Headers: Content-Type, Accept`}
                </pre>
              </div>
            )}
            <button
              onClick={handleRefresh}
              className="px-6 py-2 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700 rounded-xl text-white font-medium transition-all duration-300"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 shadow-2xl shadow-slate-900/20">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-2">
            Market Overview
          </h2>
          <p className="text-gray-400 text-lg">
            {marketData ? 'Real-time cryptocurrency market intelligence' : 'Using fallback data - API unavailable'}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-400">
            {isLoading ? 'Loading...' : marketData ? 'Live data' : 'Fallback data'}
          </div>
          <button
            onClick={handleRefresh}
            disabled={isFetching}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700 rounded-xl transition-all duration-300 text-white font-medium shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
            <span>{isFetching ? 'Refreshing...' : 'Refresh'}</span>
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {metrics.map((metric, index) => (
          <div
            key={metric.title}
            className={`group relative bg-gradient-to-br ${gradients[index]} backdrop-blur-sm border ${borderColors[index]} rounded-xl p-6 hover:border-opacity-60 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-xl ${isLoading ? 'animate-pulse' : ''}`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {/* Tooltip */}
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 -translate-y-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
              <div className="bg-black/90 backdrop-blur-sm text-white text-xs px-4 py-3 rounded-lg border border-gray-600 max-w-48 text-center shadow-xl">
                {metric.description}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 bg-black/90 border-r border-b border-gray-600 rotate-45"></div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-gray-300 text-sm font-medium uppercase tracking-wider">{metric.title}</h3>
              
              <div className="space-y-3">
                <div className="text-3xl font-bold text-white">
                  {isLoading ? '...' : metric.value}
                </div>
                
                {metric.change !== 0 && (
                  <div className="flex items-center space-x-2">
                    {metric.change > 0 ? (
                      <ArrowUp className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <ArrowDown className="w-5 h-5 text-red-400" />
                    )}
                    <span className={`text-sm font-semibold ${
                      metric.change > 0 ? 'text-emerald-400' : 'text-red-400'
                    }`}>
                      {isLoading ? '...' : `${Math.abs(metric.change).toFixed(1)}%`}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Subtle gradient overlay */}
            <div className={`absolute inset-0 bg-gradient-to-br ${gradients[index]} rounded-xl opacity-0 group-hover:opacity-30 transition-opacity duration-300`}></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarketOverview;
