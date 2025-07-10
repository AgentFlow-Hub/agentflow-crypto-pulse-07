import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHotTrends } from '../hooks/useMarketData';

interface TrendWord {
  word: string;
  strength: number;
  category: 'finance' | 'tech' | 'meme' | 'media';
  x: number;
  y: number;
  fontSize: number;
  color: string;
  velocityX: number;
  velocityY: number;
  width: number;
  height: number;
}

const HotTrendsExplorer = () => {
  const [trendWords, setTrendWords] = useState<TrendWord[]>([]);
  const navigate = useNavigate();
  const { data: hotTrendsData, isLoading, error } = useHotTrends(24, 30);

  const handleTrendClick = (trendWord: string) => {
    window.scrollTo(0, 0);
    navigate(`/trend/${encodeURIComponent(trendWord)}`);
  };

  const keywords = [
    // Finance trending
    { word: 'Bitcoin', category: 'finance' as const },
    { word: 'Ethereum', category: 'finance' as const },
    { word: 'Solana', category: 'finance' as const },
    { word: 'DeFi', category: 'finance' as const },
    { word: 'Staking', category: 'finance' as const },
    { word: 'HODL', category: 'meme' as const },
    { word: 'Diamond Hands', category: 'meme' as const },
    { word: 'To The Moon', category: 'meme' as const },
    { word: 'Bullish', category: 'finance' as const },
    { word: 'Altcoin', category: 'finance' as const },
    { word: 'Memecoin', category: 'meme' as const },
    
    // Tech trending
    { word: 'AI', category: 'tech' as const },
    { word: 'ChatGPT', category: 'tech' as const },
    { word: 'Machine Learning', category: 'tech' as const },
    { word: 'Blockchain', category: 'tech' as const },
    { word: 'Web3', category: 'tech' as const },
    { word: 'NFT', category: 'tech' as const },
    { word: 'React', category: 'tech' as const },
    { word: 'TypeScript', category: 'tech' as const },
    
    // Media trending
    { word: 'Viral', category: 'media' as const },
    { word: 'TikTok', category: 'media' as const },
    { word: 'Instagram', category: 'media' as const },
    { word: 'Influencer', category: 'media' as const },
    { word: 'Content', category: 'media' as const },
    { word: 'Streaming', category: 'media' as const },
    
    // Meme/Slang
    { word: 'FOMO', category: 'meme' as const },
    { word: 'FUD', category: 'meme' as const },
    { word: 'Ape', category: 'meme' as const },
    { word: 'Degen', category: 'meme' as const },
    { word: 'Moon', category: 'meme' as const },
    { word: 'Lambo', category: 'meme' as const }
  ];

  const categoryColors = {
    finance: {
      gradient: 'from-emerald-500/70 via-emerald-400/60 to-green-500/70',
      glow: 'shadow-emerald-400/40',
      border: 'border-emerald-300/50'
    },
    tech: {
      gradient: 'from-cyan-500/70 via-blue-400/60 to-indigo-500/70',
      glow: 'shadow-cyan-400/40',
      border: 'border-cyan-300/50'
    },
    meme: {
      gradient: 'from-purple-500/70 via-pink-400/60 to-fuchsia-500/70',
      glow: 'shadow-purple-400/40',
      border: 'border-purple-300/50'
    },
    media: {
      gradient: 'from-amber-500/70 via-orange-400/60 to-yellow-500/70',
      glow: 'shadow-amber-400/40',
      border: 'border-amber-300/50'
    }
  };

  const checkCollision = (word1: TrendWord, word2: TrendWord) => {
    const dx = word1.x - word2.x;
    const dy = word1.y - word2.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const minDistance = (word1.width + word2.width) / 1200;
    return distance < minDistance;
  };

  const resolveCollision = (word1: TrendWord, word2: TrendWord) => {
    const dx = word1.x - word2.x;
    const dy = word1.y - word2.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const minDistance = (word1.width + word2.width) / 1200;
    
    if (distance < minDistance && distance > 0) {
      const overlap = minDistance - distance;
      const separationX = (dx / distance) * overlap * 0.5;
      const separationY = (dy / distance) * overlap * 0.5;
      
      return {
        word1: {
          ...word1,
          x: Math.max(word1.width / 1200, Math.min(100 - word1.width / 1200, word1.x + separationX)),
          y: Math.max(word1.height / 500, Math.min(100 - word1.height / 500, word1.y + separationY))
        },
        word2: {
          ...word2,
          x: Math.max(word2.width / 1200, Math.min(100 - word2.width / 1200, word2.x - separationX)),
          y: Math.max(word2.height / 500, Math.min(100 - word2.height / 500, word2.y - separationY))
        }
      };
    }
    return { word1, word2 };
  };

  useEffect(() => {
    const generateWordCloud = () => {
      const words: TrendWord[] = [];
      const containerWidth = 1200;
      const containerHeight = 500;
      const positions: Array<{x: number, y: number, width: number, height: number}> = [];

      // Use API data or fallback to static keywords
      let trendsToUse = keywords;
      if (hotTrendsData?.trends && hotTrendsData.trends.length > 0) {
        console.log('🔥 Using API trends data:', hotTrendsData.trends);
        trendsToUse = hotTrendsData.trends.map(trend => ({
          word: trend.trend,
          category: mapApiCategoryToLocal(trend.category) || 'tech'
        }));
      } else {
        console.log('🔥 Using fallback keywords');
      }

      const shuffledKeywords = [...trendsToUse].sort(() => Math.random() - 0.5).slice(0, 30);

      shuffledKeywords.forEach((keywordObj, index) => {
        // Use API strength if available, otherwise random
        let strength = Math.random() * 80 + 40;
        if (hotTrendsData?.trends) {
          const apiTrend = hotTrendsData.trends.find(t => t.trend === keywordObj.word);
          if (apiTrend) {
            // Normalize strength from API (assuming it could be 0-100 or mentions count)
            strength = Math.min(100, Math.max(40, apiTrend.strength > 100 ? apiTrend.strength / 10 : apiTrend.strength));
          }
        }
        const fontSize = Math.max(10, Math.min(24, strength / 3.5));
        
        const baseSize = Math.max(fontSize * 4, keywordObj.word.length * fontSize * 0.9);
        const diameter = Math.min(baseSize, 120);
        
        let attempts = 0;
        let position;
        
        do {
          const padding = 8;
          const x = Math.random() * (100 - (diameter / containerWidth) * 100 - padding) + padding/2;
          const y = Math.random() * (100 - (diameter / containerHeight) * 100 - padding) + padding/2;
          
          position = { 
            x, 
            y, 
            width: (diameter / containerWidth) * 100, 
            height: (diameter / containerHeight) * 100 
          };
          attempts++;
        } while (
          attempts < 150 && 
          positions.some(existingPos => isOverlapping(position, existingPos))
        );

        if (attempts < 150) {
          positions.push(position);
          words.push({
            word: keywordObj.word,
            category: keywordObj.category,
            strength,
            x: position.x,
            y: position.y,
            fontSize,
            color: categoryColors[keywordObj.category].gradient,
            velocityX: (Math.random() - 0.5) * 0.06,
            velocityY: (Math.random() - 0.5) * 0.06,
            width: diameter,
            height: diameter
          });
        }
      });

      setTrendWords(words);
    };

    const isOverlapping = (pos1: {x: number, y: number, width: number, height: number}, pos2: {x: number, y: number, width: number, height: number}) => {
      const padding = 4;
      return !(pos1.x + pos1.width + padding < pos2.x || 
               pos2.x + pos2.width + padding < pos1.x || 
               pos1.y + pos1.height + padding < pos2.y || 
               pos2.y + pos2.height + padding < pos1.y);
    };

    generateWordCloud();
  }, [hotTrendsData]);

  // Helper function to map API categories to local categories
  const mapApiCategoryToLocal = (apiCategory: string): 'finance' | 'tech' | 'meme' | 'media' => {
    const lower = apiCategory.toLowerCase();
    if (lower.includes('finance') || lower.includes('crypto') || lower.includes('defi') || lower.includes('token')) {
      return 'finance';
    }
    if (lower.includes('tech') || lower.includes('ai') || lower.includes('blockchain') || lower.includes('web3')) {
      return 'tech';
    }
    if (lower.includes('meme') || lower.includes('social') || lower.includes('viral')) {
      return 'meme';
    }
    if (lower.includes('media') || lower.includes('news') || lower.includes('content')) {
      return 'media';
    }
    return 'tech'; // default
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setTrendWords(prevWords => {
        let updatedWords = prevWords.map(word => {
          let newX = word.x + word.velocityX;
          let newY = word.y + word.velocityY;
          let newVelocityX = word.velocityX;
          let newVelocityY = word.velocityY;

          const paddingX = (word.width / 1200) * 100;
          const paddingY = (word.height / 500) * 100;
          
          if (newX <= 0 || newX >= (100 - paddingX)) {
            newVelocityX = -newVelocityX;
            newX = Math.max(0, Math.min(100 - paddingX, newX));
          }
          
          if (newY <= 0 || newY >= (100 - paddingY)) {
            newVelocityY = -newVelocityY;
            newY = Math.max(0, Math.min(100 - paddingY, newY));
          }

          return {
            ...word,
            x: newX,
            y: newY,
            velocityX: newVelocityX,
            velocityY: newVelocityY
          };
        });

        for (let i = 0; i < updatedWords.length; i++) {
          for (let j = i + 1; j < updatedWords.length; j++) {
            if (checkCollision(updatedWords[i], updatedWords[j])) {
              const resolved = resolveCollision(updatedWords[i], updatedWords[j]);
              updatedWords[i] = resolved.word1;
              updatedWords[j] = resolved.word2;
            }
          }
        }

        return updatedWords;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 rounded-2xl min-h-[500px] overflow-hidden relative border border-gray-700/50 shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-transparent to-blue-900/10"></div>
          <div className="flex items-center justify-center h-full">
            <div className="text-gray-400 text-lg">Loading hot trends...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    console.error('🔥 Hot trends API error:', error);
  }

  return (
    <div className="space-y-6">
      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
        {Object.entries(categoryColors).map(([category, colors]) => (
          <div key={category} className="flex items-center space-x-2">
            <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${colors.gradient} ${colors.glow} shadow-lg`}></div>
            <span className="text-gray-300 capitalize font-medium">{category}</span>
          </div>
        ))}
      </div>

      {/* Enhanced Bubble Container */}
      <div className="bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 rounded-2xl min-h-[500px] overflow-hidden relative border border-gray-700/50 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-transparent to-blue-900/10"></div>
        <div className="absolute inset-0 p-8" style={{ width: '100%', height: '500px' }}>
          {trendWords.map((word, index) => {
            const categoryStyle = categoryColors[word.category];
            const dynamicFontSize = Math.max(8, Math.min(word.fontSize, word.width * 0.12));
            
            return (
              <div
                key={`${word.word}-${index}`}
                className="absolute cursor-pointer transition-all duration-500 hover:scale-110 select-none group"
                style={{
                  left: `${word.x}%`,
                  top: `${word.y}%`,
                  width: `${(word.width / 1200) * 100}%`,
                  height: `${(word.height / 500) * 100}%`,
                  animation: `fadeIn 0.8s ease-out ${index * 0.05}s forwards`,
                }}
                title={`${word.word} | Strength: ${Math.round(word.strength)} | Category: ${word.category}`}
                onClick={() => handleTrendClick(word.word)}
              >
                <div
                  className={`
                    w-full h-full rounded-full flex items-center justify-center
                    bg-gradient-to-br ${word.color} backdrop-blur-sm
                    border-2 ${categoryStyle.border} ${categoryStyle.glow} shadow-xl
                    hover:shadow-2xl hover:brightness-110 transition-all duration-500
                    group-hover:animate-pulse
                  `}
                  style={{
                    boxShadow: `0 8px 32px ${categoryStyle.glow.replace('shadow-', '').replace('/40', 'rgba(')}, 0.2)`,
                  }}
                >
                  <span
                    className="text-center font-bold text-white drop-shadow-lg px-2"
                    style={{
                      fontSize: `${dynamicFontSize}px`,
                      fontFamily: 'Inter, sans-serif',
                      fontWeight: word.strength > 70 ? '800' : word.strength > 50 ? '700' : '600',
                      whiteSpace: 'nowrap',
                      lineHeight: '1.1',
                      textShadow: '0 2px 8px rgba(0,0,0,0.8), 0 0 16px rgba(255,255,255,0.1)',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      maxWidth: '100%'
                    }}
                  >
                    {word.word}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.8);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  );
};

export default HotTrendsExplorer;
