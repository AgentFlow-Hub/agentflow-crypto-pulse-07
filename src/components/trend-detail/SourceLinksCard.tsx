
import { ExternalLink } from 'lucide-react';

interface SourceLinksCardProps {
  trendName: string;
}

const SourceLinksCard = ({ trendName }: SourceLinksCardProps) => {
  const sources = [
    {
      platform: 'X',
      url: `https://x.com/${trendName.toLowerCase()}_trend`,
      icon: '𝕏',
      color: 'text-gray-300'
    },
    {
      platform: 'TikTok',
      url: `https://tiktok.com/@${trendName.toLowerCase()}trend`,
      icon: '🎵',
      color: 'text-pink-400'
    },
    {
      platform: 'Media',
      url: `https://cnn.com/trends/${trendName.toLowerCase()}`,
      icon: '📺',
      color: 'text-blue-400'
    }
  ];

  return (
    <div className="bg-gradient-to-br from-slate-800/50 to-gray-900/30 backdrop-blur-sm border border-gray-500/20 rounded-2xl p-6 shadow-2xl shadow-gray-500/10">
      <h3 className="text-xl font-bold text-white mb-4">Source Links</h3>
      
      <div className="space-y-3">
        {sources.map((source) => (
          <div key={source.platform} className="flex items-center justify-between group">
            <div className="flex items-center space-x-3">
              <span className="text-xl">{source.icon}</span>
              <span className={`font-medium ${source.color}`}>{source.platform}</span>
            </div>
            <a
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors group-hover:text-blue-400"
            >
              <span className="text-sm font-mono">{source.url}</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SourceLinksCard;
