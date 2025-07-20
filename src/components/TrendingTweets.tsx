
import { Heart, MessageCircle, Repeat2, Loader2 } from 'lucide-react';
import { useInfiniteTrendingTweets } from '../hooks/useMarketData';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';

interface Tweet {
  id: string;
  username: string;
  displayName: string;
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
  console.log('🐦 TrendingTweets component mounting...');
  
  const { 
    data: infiniteData, 
    isLoading, 
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useInfiniteTrendingTweets(10, 24, 10, 20);

  const { sentinelRef } = useInfiniteScroll({
    hasNextPage: hasNextPage ?? false,
    fetchNextPage,
    isFetchingNextPage
  });
  
  console.log('🐦 TrendingTweets infinite hook state:', { 
    data: infiniteData, 
    isLoading, 
    error: error?.message || error,
    hasNextPage,
    isFetchingNextPage
  });

  // Fallback data if API fails
  const fallbackTweets: Tweet[] = [
    {
      id: '1',
      username: 'cryptonewbie',
      displayName: 'Crypto Beginner',
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
      username: 'defilearner',
      displayName: 'DeFi Explorer',
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

  const formatNumber = (num: number | undefined | null) => {
    if (!num || typeof num !== 'number' || isNaN(num)) {
      return '0';
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toString();
  };

  // Safe data mapping with error handling
  const mapApiTweet = (tweet: any): Tweet => {
    try {
      // Extract username and construct handle from it
      const username = tweet.username || 'Anonymous';
      const handle = tweet.username ? `@${tweet.username}` : '@unknown';
      const displayName = (tweet.user_display_name && tweet.user_display_name.trim()) || username;
      
      return {
        id: tweet.id || `fallback-${Date.now()}`,
        username: username,
        displayName: displayName,
        handle: handle,
        avatar: (tweet.user_profile_image_url && tweet.user_profile_image_url.trim()) || tweet.avatar || '🔥',
        content: tweet.content || tweet.text || 'No content available',
        hashtags: Array.isArray(tweet.hashtags) ? tweet.hashtags : [],
        keywords: Array.isArray(tweet.keywords) ? tweet.keywords : [],
        likes: Number(tweet.likes || tweet.favorite_count || 0) || 0,
        comments: Number(tweet.comments || tweet.reply_count || 0) || 0,
        reposts: Number(tweet.reposts || tweet.retweet_count || 0) || 0,
        timestamp: tweet.timestamp || tweet.created_at || 'Unknown time'
      };
    } catch (err) {
      console.error('Error mapping tweet:', err, tweet);
      return {
        id: `error-${Date.now()}`,
        username: 'Error User',
        displayName: 'Error User',
        handle: '@error',
        avatar: '⚠️',
        content: 'Failed to load tweet content',
        hashtags: [],
        keywords: [],
        likes: 0,
        comments: 0,
        reposts: 0,
        timestamp: 'Error'
      };
    }
  };

  // Use API data or fallback with safe mapping
  let tweets: Tweet[] = [];
  try {
    // Flatten all pages of infinite data
    const allApiTweets = infiniteData?.pages?.flatMap(page => page?.trending_tweets || []) || [];
    console.log('🐦 Raw API tweets from all pages:', allApiTweets);
    
    if (allApiTweets.length > 0) {
      tweets = allApiTweets.map(mapApiTweet);
      console.log('🐦 Mapped tweets:', tweets);
    } else {
      tweets = fallbackTweets;
      console.log('🐦 Using fallback tweets');
    }
  } catch (err) {
    console.error('🐦 Error processing tweets:', err);
    tweets = fallbackTweets;
  }

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {error && (
        <div className="mb-2 text-xs text-amber-400 bg-amber-900/20 border border-amber-700/50 rounded px-2 py-1 flex-shrink-0">
          Using fallback data
        </div>
      )}
      {/* Tweets Container - Constrained to container bounds */}
      <div className="flex-1 min-h-0">
        <div className="h-full overflow-y-auto pr-2 custom-scrollbar">
          <div className="space-y-3 pb-4">
            {tweets.map((tweet, index) => (
              <div
                key={tweet.id}
                className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-lg p-3 hover:border-purple-500/50 transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                {/* Tweet Header */}
                <div className="flex items-start space-x-3 mb-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-sm flex-shrink-0">
                    {tweet.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-white text-sm truncate">{tweet.displayName}</h3>
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
            
            {/* Infinite Scroll Sentinel */}
            <div ref={sentinelRef} className="h-4 flex items-center justify-center">
              {isFetchingNextPage && (
                <Loader2 className="w-4 h-4 animate-spin text-primary" />
              )}
            </div>
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
