
import { useMemo } from 'react';

interface HeatmapCardProps {
  trendName?: string;
}

const HeatmapCard = ({ trendName = 'default' }: HeatmapCardProps) => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const hours = ['12am', '4am', '8am', '12pm', '4pm', '8pm'];

  // Generate heatmap data based on trend name
  const heatmapData = useMemo(() => {
    const hash = trendName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    
    const random = (seed: number) => {
      const x = Math.sin(seed) * 10000;
      return x - Math.floor(x);
    };

    return hours.map((_, hourIndex) => 
      days.map((_, dayIndex) => {
        const seed = hash + hourIndex * 7 + dayIndex;
        return Math.max(0.1, random(seed));
      })
    );
  }, [trendName]);

  const getHeatColor = (intensity: number) => {
    const alpha = Math.max(0.1, intensity);
    return `rgba(59, 130, 246, ${alpha})`;
  };

  return (
    <div className="bg-gradient-to-br from-slate-800/50 to-blue-900/30 backdrop-blur-sm border border-blue-500/20 rounded-2xl p-6 shadow-2xl shadow-blue-500/10">
      <h3 className="text-xl font-bold text-white mb-4">Heatmap</h3>
      
      <div className="space-y-2">
        {/* Days header */}
        <div className="grid grid-cols-8 gap-1 mb-2">
          <div className="text-xs text-gray-400"></div>
          {days.map((day) => (
            <div key={day} className="text-xs text-gray-400 text-center">
              {day}
            </div>
          ))}
        </div>

        {/* Heatmap grid */}
        {heatmapData.map((row, hourIndex) => (
          <div key={hourIndex} className="grid grid-cols-8 gap-1">
            <div className="text-xs text-gray-400 text-right pr-2 flex items-center">
              {hours[hourIndex]}
            </div>
            {row.map((intensity, dayIndex) => (
              <div
                key={`${hourIndex}-${dayIndex}`}
                className="aspect-square rounded border border-blue-500/10 flex items-center justify-center text-xs font-medium text-white cursor-pointer hover:border-blue-400/50 transition-colors"
                style={{ backgroundColor: getHeatColor(intensity) }}
                title={`${days[dayIndex]} ${hours[hourIndex]}: ${Math.round(intensity * 100)}% activity`}
              >
                {intensity > 0.7 && (
                  <span className="text-white font-bold">
                    {Math.round(intensity * 100)}
                  </span>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-blue-500/20">
        <span className="text-xs text-gray-400">Less</span>
        <div className="flex space-x-1">
          {[0.1, 0.3, 0.5, 0.7, 0.9].map((intensity) => (
            <div
              key={intensity}
              className="w-3 h-3 rounded"
              style={{ backgroundColor: getHeatColor(intensity) }}
            />
          ))}
        </div>
        <span className="text-xs text-gray-400">More</span>
      </div>
    </div>
  );
};

export default HeatmapCard;
