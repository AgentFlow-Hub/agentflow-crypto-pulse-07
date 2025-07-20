import { Heart, MessageCircle, Repeat2, Loader2 } from 'lucide-react';
import { useInfiniteTrendingTweets } from '../hooks/useMarketData';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';

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
  
  // Updated parameters: 50 tweets, 7-day lookback, min 1 engagement, 20 top tokens, 2 max per user, 0.3 diversity
  const { 
    data: infiniteData, 
    isLoading, 
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useInfiniteTrendingTweets(50, 168, 1, 20, 2, 0.3);

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
    isFetchingNextPage,
    totalPages: infiniteData?.pages?.length || 0
  });

  const fallbackTweets: Tweet[] = [
    {
      id: '1',
      username: 'cryptonewbie',
      displayName: 'Crypto Beginner',
      handle: '@cryptonewbie',
      avatar: 'https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?w=32&h=32&fit=crop&crop=face',
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
      avatar: 'https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=32&h=32&fit=crop&crop=face',
      content: 'Finally understand what "HODL" means! It\'s not just holding, it\'s believing in the technology long-term. Also learned about staking rewards today 💎',
      hashtags: ['HODL', 'Learning', 'Staking'],
      keywords: ['education', 'long-term'],
      likes: 1200,
      comments: 89,
      reposts: 456,
      timestamp: '5h ago'
    },
    {
      id: '3',
      username: 'ethmaxi',
      displayName: 'ETH Maximalist',
      handle: '@ethmaxi',
      avatar: 'https://images.unsplash.com/photo-1501286353178-1ec881214838?w=32&h=32&fit=crop&crop=face',
      content: 'Ethereum 2.0 staking rewards are looking solid! Just hit my first milestone. The future is decentralized finance 🔥',
      hashtags: ['Ethereum', 'ETH2', 'Staking', 'DeFi'],
      keywords: ['ethereum', 'staking', 'defi'],
      likes: 2100,
      comments: 145,
      reposts: 678,
      timestamp: '1h ago'
    },
    {
      id: '4',
      username: 'solanadev',
      displayName: 'Solana Builder',
      handle: '@solanadev',
      avatar: '🌐',
      content: 'Built my first dApp on Solana! The speed is incredible - transactions confirm in milliseconds. Web3 is here! 🚀',
      hashtags: ['Solana', 'dApp', 'Web3', 'Building'],
      keywords: ['solana', 'development', 'web3'],
      likes: 1800,
      comments: 234,
      reposts: 567,
      timestamp: '2h ago'
    },
    {
      id: '5',
      username: 'nftcollector',
      displayName: 'NFT Hunter',
      handle: '@nftcollector',
      avatar: '🎨',
      content: 'Just discovered this amazing NFT project with real utility! Not just JPEGs, but actual membership benefits. This is the future of digital ownership 🖼️',
      hashtags: ['NFT', 'DigitalArt', 'Utility', 'Membership'],
      keywords: ['nft', 'utility', 'digital'],
      likes: 956,
      comments: 78,
      reposts: 189,
      timestamp: '4h ago'
    },
    {
      id: '6',
      username: 'degentrader',
      displayName: 'Degen Trader',
      handle: '@degentrader',
      avatar: '📈',
      content: 'That feeling when your small altcoin position 10x in a week... Sometimes being early pays off! Still HODLing for the long term 💪',
      hashtags: ['Altcoins', 'Trading', 'HODL', 'Gains'],
      keywords: ['trading', 'altcoins', 'gains'],
      likes: 3200,
      comments: 456,
      reposts: 892,
      timestamp: '6h ago'
    },
    {
      id: '7',
      username: 'cryptomom',
      displayName: 'Crypto Mom',
      handle: '@cryptomom',
      avatar: '👩‍💼',
      content: 'Teaching my kids about crypto and blockchain technology. They\'re more interested than I expected! Starting with the basics of digital scarcity 📚',
      hashtags: ['Education', 'Kids', 'Blockchain', 'Future'],
      keywords: ['education', 'teaching', 'family'],
      likes: 1450,
      comments: 167,
      reposts: 234,
      timestamp: '8h ago'
    },
    {
      id: '8',
      username: 'l2researcher',
      displayName: 'Layer 2 Researcher',
      handle: '@l2researcher',
      avatar: '🔬',
      content: 'Layer 2 solutions are game changers! Gas fees down 90%, transaction speed up 100x. This is how crypto goes mainstream 🌍',
      hashtags: ['Layer2', 'Scaling', 'GasFees', 'Research'],
      keywords: ['layer2', 'scaling', 'research'],
      likes: 2890,
      comments: 345,
      reposts: 678,
      timestamp: '12h ago'
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

  const isUrl = (string: string) => {
    try {
      new URL(string);
      return true;
    } catch {
      return false;
    }
  };

  const getUserInitials = (displayName: string, username: string) => {
    const name = displayName || username || 'U';
    return name.split(' ').map(word => word[0]?.toUpperCase()).join('').slice(0, 2);
  };

  const mapApiTweet = (tweet: any): Tweet => {
    try {
      console.log('🐦 Mapping individual tweet:', tweet);
      
      const username = tweet.username || 'Anonymous';
      const handle = tweet.username ? `@${tweet.username}` : '@unknown';
      const displayName = (tweet.user_display_name && tweet.user_display_name.trim()) || username;
      
      const mappedTweet = {
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
      
      console.log('🐦 Successfully mapped tweet:', mappedTweet);
      return mappedTweet;
    } catch (err) {
      console.error('🐦 Error mapping tweet:', err, tweet);
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

  let tweets: Tweet[] = [];
  let usingFallback = false;
  
  try {
    const allApiTweets = infiniteData?.pages?.flatMap(page => {
      console.log('🐦 Processing page:', page);
      return page?.trending_tweets || [];
    }) || [];
    
    console.log('🐦 Raw API tweets from all pages:', allApiTweets);
    console.log('🐦 Total API tweets found:', allApiTweets.length);
    
    if (allApiTweets.length > 0) {
      tweets = allApiTweets.map(mapApiTweet);
      console.log('🐦 Successfully mapped', tweets.length, 'tweets from API');
    } else {
      tweets = fallbackTweets;
      usingFallback = true;
      console.log('🐦 Using fallback tweets - API returned no data');
    }
  } catch (err) {
    console.error('🐦 Error processing tweets:', err);
    tweets = fallbackTweets;
    usingFallback = true;
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
      {(error || usingFallback) && (
        <div className="mb-2 text-xs text-amber-400 bg-amber-900/20 border border-amber-700/50 rounded px-2 py-1 flex-shrink-0">
          {error ? `API Error: ${error.message || 'Unknown error'}` : 'Using sample data - API returned no tweets'}
        </div>
      )}
      
      <div className="mb-2 text-xs text-blue-400 bg-blue-900/20 border border-blue-700/50 rounded px-2 py-1 flex-shrink-0">
        Showing {tweets.length} tweets {usingFallback ? '(sample data)' : '(from API)'}
      </div>
      
      <div className="flex-1 min-h-0">
        <div className="h-full overflow-y-auto pr-2 custom-scrollbar">
          <div className="space-y-3 pb-4">
            {tweets.map((tweet, index) => (
              <div
                key={tweet.id}
                className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-lg p-3 hover:border-purple-500/50 transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="flex items-start space-x-3 mb-2">
                  {isUrl(tweet.avatar) ? (
                    <Avatar className="w-8 h-8 flex-shrink-0">
                      <AvatarImage 
                        src={tweet.avatar} 
                        alt={`${tweet.displayName}'s avatar`}
                        className="object-cover"
                      />
                      <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-semibold">
                        {getUserInitials(tweet.displayName, tweet.username)}
                      </AvatarFallback>
                    </Avatar>
                  ) : (
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-sm flex-shrink-0">
                      {tweet.avatar}
                    </div>
                  )}
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-white text-sm truncate">{tweet.displayName}</h3>
                      <span className="text-gray-400 text-sm">{tweet.handle}</span>
                      <span className="text-gray-500 text-sm">•</span>
                      <span className="text-gray-500 text-sm">{tweet.timestamp}</span>
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <p className="text-gray-300 leading-relaxed text-sm">{tweet.content}</p>
                </div>

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
