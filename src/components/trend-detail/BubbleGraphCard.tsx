
import { useState, useMemo } from 'react';

interface BubbleGraphCardProps {
  trendName: string;
}

const BubbleGraphCard = ({ trendName }: BubbleGraphCardProps) => {
  const [selectedTimeRange, setSelectedTimeRange] = useState('1M');
  const timeRanges = ['1W', '1M', '3M', '1Y', 'All'];

  // Generate unique bubbles based on trend name and time range
  const bubbles = useMemo(() => {
    const hash = trendName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const timeMultiplier = timeRanges.indexOf(selectedTimeRange) + 1;
    
    const random = (seed: number) => {
      const x = Math.sin(seed) * 10000;
      return x - Math.floor(x);
    };

    const bubbleData = [
      { label: trendName, isCenter: true, baseSize: 120 },
      { label: 'Elon', isCenter: false, baseSize: 85 },
      { label: 'CNN', isCenter: false, baseSize: 80 },
      { label: 'CZ', isCenter: false, baseSize: 75 },
      { label: 'Heyi', isCenter: false, baseSize: 70 },
      { label: 'AB', isCenter: false, baseSize: 65 },
      { label: 'News', isCenter: false, baseSize: 60 },
      { label: 'Viral', isCenter: false, baseSize: 55 },
    ];

    return bubbleData.map((bubble, index) => {
      const seed = hash + index + timeMultiplier * 10;
      const angle = random(seed) * Math.PI * 2;
      const distance = bubble.isCenter ? 0 : random(seed + 100) * 30 + 25;
      
      const centerX = 50;
      const centerY = 50;
      const x = bubble.isCenter ? centerX : centerX + Math.cos(angle) * distance;
      const y = bubble.isCenter ? centerY : centerY + Math.sin(angle) * distance;
      
      const baseScore = Math.floor(random(seed + 200) * 15000 + 8000);
      const score = Math.floor(baseScore * timeMultiplier * 0.8);
      
      // Color schemes based on the reference image: deep blue core to vibrant red edge
      const colors = [
        // Central/dominant bubble - deep blue core to red edge (high authority)
        { 
          gradient: 'radial-gradient(circle at 40% 40%, #1e3a8a, #1e40af, #dc2626)',
          border: '#dc2626', 
          glow: '#ef4444', 
          shadow: 'rgba(239, 68, 68, 0.8)' 
        },
        // Medium authority - blue to red gradient
        { 
          gradient: 'radial-gradient(circle at 35% 35%, #1e40af, #dc2626)',
          border: '#dc2626', 
          glow: '#ef4444', 
          shadow: 'rgba(239, 68, 68, 0.6)' 
        },
        // Lower authority - more red dominant with blue center
        { 
          gradient: 'radial-gradient(circle at 30% 30%, #3730a3, #dc2626)',
          border: '#ef4444', 
          glow: '#dc2626', 
          shadow: 'rgba(220, 38, 38, 0.6)' 
        },
        // Purple variants for variety
        { 
          gradient: 'radial-gradient(circle at 30% 30%, #581c87, #a855f7)',
          border: '#a855f7', 
          glow: '#c084fc', 
          shadow: 'rgba(192, 132, 252, 0.5)' 
        }
      ];
      
      // Central bubble gets the most dominant color scheme
      const colorIndex = bubble.isCenter ? 0 : (index % 4);
      const color = colors[colorIndex];

      return {
        id: index,
        x: Math.max(15, Math.min(85, x)),
        y: Math.max(15, Math.min(85, y)),
        size: bubble.baseSize,
        label: bubble.label,
        score: score.toLocaleString(),
        color,
        isCenter: bubble.isCenter
      };
    });
  }, [trendName, selectedTimeRange]);

  const metrics = useMemo(() => {
    const hash = trendName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const timeMultiplier = timeRanges.indexOf(selectedTimeRange) + 1;
    
    const random = (seed: number) => {
      const x = Math.sin(seed) * 10000;
      return x - Math.floor(x);
    };

    return {
      kolFollowers: Math.floor(random(hash + 400) * 300 * timeMultiplier + 150),
      socialReach: Math.floor(random(hash + 500) * 50000 * timeMultiplier + 20000),
      smartScore: Math.floor(random(hash + 600) * 200 * timeMultiplier + 200)
    };
  }, [trendName, selectedTimeRange]);

  return (
    <div className="bg-gradient-to-br from-slate-800/50 to-purple-900/30 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-6 shadow-2xl shadow-purple-500/10">
      {/* Time Range Filter */}
      <div className="flex justify-center mb-6">
        <div className="flex bg-gray-800/50 rounded-lg p-1 space-x-1">
          {timeRanges.map((range) => (
            <button
              key={range}
              onClick={() => setSelectedTimeRange(range)}
              className={`px-3 py-1 rounded text-sm font-medium transition-all ${
                selectedTimeRange === range
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Bubble Cluster */}
      <div className="relative h-80 bg-gradient-to-br from-slate-900/60 to-slate-800/40 rounded-xl border border-purple-500/20 overflow-hidden">
        {/* Concentric rings for grouping */}
        <div className="absolute inset-8 border border-purple-500/20 rounded-full"></div>
        <div className="absolute inset-12 border border-blue-500/15 rounded-full"></div>
        <div className="absolute inset-16 border border-red-500/15 rounded-full"></div>
        <div className="absolute inset-20 border border-gray-500/10 rounded-full"></div>
        
        {bubbles.map((bubble) => (
          <div
            key={bubble.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group transition-all duration-300 hover:scale-110"
            style={{
              left: `${bubble.x}%`,
              top: `${bubble.y}%`,
              width: `${bubble.size}px`,
              height: `${bubble.size}px`,
            }}
          >
            <div
              className="w-full h-full rounded-full flex items-center justify-center text-white font-semibold transition-all duration-300 relative overflow-hidden"
              style={{
                background: bubble.color.gradient,
                border: `2px solid ${bubble.color.border}`,
                boxShadow: `
                  0 0 20px ${bubble.color.shadow},
                  0 0 40px ${bubble.color.shadow},
                  0 4px 15px rgba(0, 0, 0, 0.3),
                  inset 0 1px 0 rgba(255, 255, 255, 0.2)
                `,
              }}
            >
              {/* Content */}
              <div className="text-center relative z-10">
                <div 
                  className="font-bold drop-shadow-lg"
                  style={{
                    fontSize: bubble.isCenter ? '18px' : bubble.size > 60 ? '14px' : bubble.size > 45 ? '12px' : '10px',
                    textShadow: '0 0 10px rgba(0,0,0,0.8), 0 2px 4px rgba(0,0,0,0.8)'
                  }}
                >
                  {bubble.label}
                </div>
                {bubble.size > 40 && (
                  <div 
                    className="opacity-90 font-medium"
                    style={{
                      fontSize: bubble.size > 70 ? '12px' : '10px',
                      textShadow: '0 0 8px rgba(0,0,0,0.8), 0 1px 2px rgba(0,0,0,0.8)'
                    }}
                  >
                    {bubble.score}
                  </div>
                )}
              </div>

              {/* Hover glow effect */}
              <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: `radial-gradient(circle, ${bubble.color.glow}40, transparent 70%)`,
                  animation: 'pulse 2s infinite'
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      {/* Metrics */}
      <div className="flex justify-between items-center mt-6 pt-6 border-t border-purple-500/20">
        <div className="text-center">
          <div className="text-2xl font-bold text-white">{metrics.kolFollowers}</div>
          <div className="text-sm text-gray-400">KOL Followers</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-white">{metrics.socialReach.toLocaleString()}</div>
          <div className="text-sm text-gray-400">Social Reach</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-white">{metrics.smartScore}</div>
          <div className="text-sm text-gray-400">Smart Social Score</div>
        </div>
      </div>
    </div>
  );
};

export default BubbleGraphCard;
