
const GlobalTrendCard = () => {
  const countries = [
    { name: 'Nigeria', flag: '🇳🇬', percentage: 28.6 },
    { name: 'Japan', flag: '🇯🇵', percentage: 14.3 },
    { name: 'Italy', flag: '🇮🇹', percentage: 14.3 },
    { name: 'Germany', flag: '🇩🇪', percentage: 14.3 },
    { name: 'South Korea', flag: '🇰🇷', percentage: 14.3 },
    { name: 'Brazil', flag: '🇧🇷', percentage: 14.2 },
  ];

  return (
    <div className="bg-gradient-to-br from-slate-800/50 to-purple-900/30 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-6 shadow-2xl shadow-purple-500/10">
      <h3 className="text-xl font-bold text-white mb-6">Global Trend Distribution</h3>
      
      <div className="space-y-4">
        {countries.map((country, index) => (
          <div key={country.name} className="flex items-center space-x-3">
            <span className="text-2xl">{country.flag}</span>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-gray-300 text-sm font-medium">{country.name}</span>
                <span className="text-white text-sm font-bold">{country.percentage}%</span>
              </div>
              <div className="w-full bg-gray-700/50 rounded-full h-2">
                <div
                  className="h-2 rounded-full transition-all duration-1000 ease-out"
                  style={{
                    width: `${country.percentage}%`,
                    backgroundColor: index === 0 ? '#10b981' : '#3b82f6',
                    background: index === 0 
                      ? 'linear-gradient(90deg, #10b981, #059669)' 
                      : `linear-gradient(90deg, #3b82f6, #2563eb)`,
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GlobalTrendCard;
