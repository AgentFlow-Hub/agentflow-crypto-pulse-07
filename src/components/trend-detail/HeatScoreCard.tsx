
import { TrendingUp, TrendingDown } from 'lucide-react';

interface HeatScoreCardProps {
  heatScore: number;
  heatScoreChange: number;
  mentions: {
    x: number;
    tiktok: number;
    media: number;
  };
}

const HeatScoreCard = ({ heatScore, heatScoreChange, mentions }: HeatScoreCardProps) => {
  const isPositive = heatScoreChange > 0;

  return (
    <div className="bg-gradient-to-br from-slate-800/50 to-blue-900/30 backdrop-blur-sm border border-blue-500/20 rounded-2xl p-6 shadow-2xl shadow-blue-500/10">
      <div className="text-center mb-8">
        {/* Circular Progress Chart with Multiple Segments - Bigger Size */}
        <div className="relative w-48 h-48 mx-auto mb-4">
          <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 180 180">
            {/* Background circle */}
            <circle
              cx="90"
              cy="90"
              r="81"
              stroke="rgba(255, 255, 255, 0.1)"
              strokeWidth="12"
              fill="transparent"
            />
            
            {/* Orange segment */}
            <circle
              cx="90"
              cy="90"
              r="81"
              stroke="#f59e0b"
              strokeWidth="12"
              fill="transparent"
              strokeDasharray="127.2 381.7"
              strokeDashoffset="0"
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
            
            {/* Purple segment */}
            <circle
              cx="90"
              cy="90"
              r="81"
              stroke="#a855f7"
              strokeWidth="12"
              fill="transparent"
              strokeDasharray="114.5 394.4"
              strokeDashoffset="-127.2"
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
            
            {/* Cyan segment */}
            <circle
              cx="90"
              cy="90"
              r="81"
              stroke="#06b6d4"
              strokeWidth="12"
              fill="transparent"
              strokeDasharray="101.9 407.0"
              strokeDashoffset="-241.7"
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
            
            {/* Blue segment */}
            <circle
              cx="90"
              cy="90"
              r="81"
              stroke="#3b82f6"
              strokeWidth="12"
              fill="transparent"
              strokeDasharray="165.0 343.9"
              strokeDashoffset="-343.5"
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-xs text-gray-400 mb-1">Heat Score</div>
            </div>
          </div>
        </div>

        <div className="text-3xl font-bold text-white mb-2">
          {heatScore.toLocaleString()}
        </div>
        <div className={`flex items-center justify-center space-x-1 ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
          {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
          <span className="font-semibold">{Math.abs(heatScoreChange)}%</span>
        </div>
      </div>

      {/* Mentions List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
            <span className="text-gray-300">X</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-white font-semibold">{mentions.x}</span>
            <div className="w-16 h-6 bg-purple-500/20 rounded flex items-center">
              <div className="w-3/4 h-1 bg-purple-500 rounded ml-1"></div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-gray-300">TikTok</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-white font-semibold">{mentions.tiktok}</span>
            <div className="w-16 h-6 bg-green-500/20 rounded flex items-center">
              <div className="w-2/3 h-1 bg-green-500 rounded ml-1"></div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            <span className="text-gray-300">Media</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-white font-semibold">{mentions.media}</span>
            <div className="w-16 h-6 bg-orange-500/20 rounded flex items-center">
              <div className="w-1/2 h-1 bg-orange-500 rounded ml-1"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeatScoreCard;
