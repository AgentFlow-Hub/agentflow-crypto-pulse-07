
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { useMemo } from 'react';

interface SmartSocialChartProps {
  trendName: string;
}

const SmartSocialChart = ({ trendName }: SmartSocialChartProps) => {
  const { data, influencers } = useMemo(() => {
    const hash = trendName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const random = (seed: number) => {
      const x = Math.sin(seed) * 10000;
      return x - Math.floor(x);
    };

    // Generate data based on trend
    const chartData = [];
    let prevCelebrity = random(hash) * 20 + 10;
    let prevPlatform = random(hash + 100) * 20 + 15;

    for (let i = 0; i < 8; i++) {
      const day = `${1 + i * 4}D`;
      
      // Add some volatility but maintain general trend
      const celebrityChange = (random(hash + i * 10) - 0.5) * 20;
      const platformChange = (random(hash + i * 20) - 0.5) * 25;
      
      prevCelebrity = Math.max(5, Math.min(95, prevCelebrity + celebrityChange));
      prevPlatform = Math.max(5, Math.min(95, prevPlatform + platformChange));
      
      chartData.push({
        day,
        celebrity: Math.round(prevCelebrity),
        platform: Math.round(prevPlatform)
      });
    }

    // Generate influencer data
    const influencerNames = ['Elon', 'CZ', 'Heyi', 'Vitalik', 'SBF', 'Cathie'];
    const influencerEmojis = ['🚀', '⚡', '🔥', '💎', '🌟', '📈'];
    
    const selectedInfluencers = [];
    for (let i = 0; i < 3; i++) {
      const index = Math.floor(random(hash + i * 30) * influencerNames.length);
      selectedInfluencers.push({
        name: influencerNames[index],
        avatar: influencerEmojis[index],
        day: chartData[2 + i * 2]?.day || `${9 + i * 8}D`,
        x: 20 + i * 30
      });
    }

    return { data: chartData, influencers: selectedInfluencers };
  }, [trendName]);

  return (
    <div className="bg-gradient-to-br from-slate-800/50 to-emerald-900/30 backdrop-blur-sm border border-emerald-500/20 rounded-2xl p-6 shadow-2xl shadow-emerald-500/10">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-white mb-2">Smart Social</h3>
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-cyan-400 rounded-full"></div>
            <span className="text-gray-300 text-sm">Celebrity Attention</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-emerald-400 rounded-full"></div>
            <span className="text-gray-300 text-sm">Platform Popularity</span>
          </div>
        </div>
      </div>

      <div className="relative h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <XAxis 
              dataKey="day" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#9ca3af', fontSize: 12 }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#9ca3af', fontSize: 12 }}
              domain={[0, 100]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(30, 41, 59, 0.9)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                borderRadius: '8px',
                color: '#ffffff',
              }}
            />
            <Line
              type="monotone"
              dataKey="celebrity"
              stroke="#06b6d4"
              strokeWidth={3}
              dot={{ fill: '#06b6d4', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, fill: '#06b6d4' }}
            />
            <Line
              type="monotone"
              dataKey="platform"
              stroke="#10b981"
              strokeWidth={3}
              dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, fill: '#10b981' }}
            />
          </LineChart>
        </ResponsiveContainer>

        {/* Influencer Avatars */}
        {influencers.map((influencer) => (
          <div
            key={influencer.name}
            className="absolute top-12 transform -translate-x-1/2"
            style={{ left: `${influencer.x}%` }}
          >
            <div className="bg-gray-800 border border-gray-600 rounded-full p-2 shadow-lg">
              <div className="text-lg">{influencer.avatar}</div>
            </div>
            <div className="text-xs text-gray-300 text-center mt-1 font-medium">
              {influencer.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SmartSocialChart;
