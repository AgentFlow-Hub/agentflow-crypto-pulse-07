
import { Heart, MessageCircle, Repeat2 } from 'lucide-react';

interface Tweet {
  id: string;
  username: string;
  handle: string;
  avatar: string;
  content: string;
  hashtags: string[];
  keywords: string[];
  likes: number;
  comments: number;
  reposts: number;
  timestamp: string;
}

const TrendingTweets = () => {
  const tweets: Tweet[] = [
    {
      id: '1',
      username: 'Crypto Beginner',
      handle: '@cryptonewbie',
      avatar: '🤓',
      content: 'Just bought my first Bitcoin! Started with $50 and learning about dollar-cost averaging. Small steps but excited to be part of this journey! 🚀',
      hashtags: ['Bitcoin', 'FirstBuy', 'DCA'],
      keywords: ['beginner', 'learning'],
      likes: 890,
      comments: 67,
      reposts: 234,
      timestamp: '3h ago'
    },
    {
      id: '2',
      username: 'DeFi Explorer',
      handle: '@defilearner',
      avatar: '🔍',
      content: 'Finally understand what "HODL" means! It\'s not just holding, it\'s believing in the technology long-term. Also learned about staking rewards today 💎',
      hashtags: ['HODL', 'Learning', 'Staking'],
      keywords: ['education', 'long-term'],
      likes: 1200,
      comments: 89,
      reposts: 456,
      timestamp: '5h ago'
    }
  ];

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toString();
  };

  // Show only 2 tweets to prevent overflow
  const displayedTweets = tweets.slice(0, 2);

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Tweets Container - Full Height */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto pr-2" style={{
          scrollbarWidth: 'thin',
          scrollbarColor: '#4a5568 transparent'
        }}>
          <div className="space-y-3">
            {displayedTweets.map((tweet, index) => (
              <div
                key={tweet.id}
                className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-lg p-3 hover:border-purple-500/50 transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Tweet Header */}
                <div className="flex items-start space-x-3 mb-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-sm flex-shrink-0">
                    {tweet.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-white text-sm truncate">{tweet.username}</h3>
                      <span className="text-gray-400 text-sm">{tweet.handle}</span>
                      <span className="text-gray-500 text-sm">•</span>
                      <span className="text-gray-500 text-sm">{tweet.timestamp}</span>
                    </div>
                  </div>
                </div>

                {/* Tweet Content */}
                <div className="mb-3">
                  <p className="text-gray-300 leading-relaxed text-sm">{tweet.content}</p>
                </div>

                {/* Engagement Metrics - More Compact */}
                <div className="flex items-center space-x-4 pt-2 border-t border-gray-700/50">
                  <button className="flex items-center space-x-1 text-gray-400 hover:text-red-400 transition-colors duration-200">
                    <Heart className="w-4 h-4" />
                    <span className="text-xs">{formatNumber(tweet.likes)}</span>
                  </button>
                  
                  <button className="flex items-center space-x-1 text-gray-400 hover:text-blue-400 transition-colors duration-200">
                    <MessageCircle className="w-4 h-4" />
                    <span className="text-xs">{formatNumber(tweet.comments)}</span>
                  </button>
                  
                  <button className="flex items-center space-x-1 text-gray-400 hover:text-green-400 transition-colors duration-200">
                    <Repeat2 className="w-4 h-4" />
                    <span className="text-xs">{formatNumber(tweet.reposts)}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #4a5568;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #718096;
        }
      `}</style>
    </div>
  );
};

export default TrendingTweets;
