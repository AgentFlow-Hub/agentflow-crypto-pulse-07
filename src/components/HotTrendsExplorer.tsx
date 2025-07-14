import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, TrendingUp, Zap, Target } from 'lucide-react';
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
  hovered: boolean;
  magneticOffset: { x: number; y: number };
}

const HotTrendsExplorer = () => {
  const [trendWords, setTrendWords] = useState<TrendWord[]>([]);
  const [hoveredWord, setHoveredWord] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<{ word: TrendWord; x: number; y: number } | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
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
      gradient: 'from-emerald-400/80 via-emerald-300/70 to-green-400/80',
      glow: 'shadow-emerald-400/60',
      border: 'border-emerald-300/70',
      glowColor: 'rgba(52, 211, 153, 0.4)',
      icon: TrendingUp
    },
    tech: {
      gradient: 'from-cyan-400/80 via-blue-300/70 to-indigo-400/80',
      glow: 'shadow-cyan-400/60',
      border: 'border-cyan-300/70',
      glowColor: 'rgba(34, 211, 238, 0.4)',
      icon: Zap
    },
    meme: {
      gradient: 'from-purple-400/80 via-pink-300/70 to-fuchsia-400/80',
      glow: 'shadow-purple-400/60',
      border: 'border-purple-300/70',
      glowColor: 'rgba(168, 85, 247, 0.4)',
      icon: Sparkles
    },
    media: {
      gradient: 'from-amber-400/80 via-orange-300/70 to-yellow-400/80',
      glow: 'shadow-amber-400/60',
      border: 'border-amber-300/70',
      glowColor: 'rgba(251, 191, 36, 0.4)',
      icon: Target
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
            height: diameter,
            hovered: false,
            magneticOffset: { x: 0, y: 0 }
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

  const handleWordHover = useCallback((word: TrendWord, event: React.MouseEvent) => {
    setHoveredWord(word.word);
    
    // Smart tooltip positioning to keep it on screen
    const rect = event.currentTarget.getBoundingClientRect();
    const tooltipWidth = 280;
    const tooltipHeight = 160;
    const margin = 16;
    
    let x = event.clientX;
    let y = event.clientY;
    
    // Adjust horizontal position if tooltip would go off-screen
    if (x + tooltipWidth + margin > window.innerWidth) {
      x = event.clientX - tooltipWidth - margin;
    }
    
    // Adjust vertical position if tooltip would go off-screen
    if (y + tooltipHeight + margin > window.innerHeight) {
      y = event.clientY - tooltipHeight - margin;
    }
    
    // Ensure tooltip doesn't go off left edge
    if (x < margin) {
      x = margin;
    }
    
    // Ensure tooltip doesn't go off top edge
    if (y < margin) {
      y = event.clientY + margin;
    }
    
    setTooltip({
      word,
      x,
      y
    });
    
    // Apply magnetic effect to nearby words
    setTrendWords(prev => prev.map(w => {
      if (w.word === word.word) return { ...w, hovered: true };
      
      const distance = Math.sqrt(
        Math.pow(w.x - word.x, 2) + Math.pow(w.y - word.y, 2)
      );
      
      if (distance < 20) {
        const magnetStrength = Math.max(0, (20 - distance) / 20) * 2;
        const dx = (word.x - w.x) * magnetStrength * 0.1;
        const dy = (word.y - w.y) * magnetStrength * 0.1;
        return { ...w, magneticOffset: { x: dx, y: dy } };
      }
      
      return w;
    }));
  }, []);

  const handleWordLeave = useCallback(() => {
    setHoveredWord(null);
    setTooltip(null);
    setTrendWords(prev => prev.map(w => ({
      ...w,
      hovered: false,
      magneticOffset: { x: 0, y: 0 }
    })));
  }, []);

  const handleCategoryFilter = useCallback((category: string) => {
    setSelectedCategory(prev => prev === category ? null : category);
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
      {/* Interactive Legend */}
      <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
        {Object.entries(categoryColors).map(([category, colors]) => {
          const IconComponent = colors.icon;
          const isSelected = selectedCategory === category;
          const isFiltered = selectedCategory && selectedCategory !== category;
          
          return (
            <button
              key={category}
              onClick={() => handleCategoryFilter(category)}
              className={`
                flex items-center space-x-2 px-4 py-2 rounded-full border transition-all duration-300
                ${isSelected 
                  ? `bg-gradient-to-r ${colors.gradient} ${colors.border} ${colors.glow} shadow-lg scale-105` 
                  : isFiltered
                    ? 'bg-gray-800/50 border-gray-600/50 opacity-50'
                    : `bg-gray-800/80 ${colors.border} hover:bg-gradient-to-r hover:${colors.gradient} hover:scale-105 hover:${colors.glow}`
                }
              `}
            >
              <IconComponent className={`w-4 h-4 ${isSelected || !selectedCategory ? 'text-white' : 'text-gray-400'}`} />
              <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${colors.gradient} ${colors.glow} shadow-md`}></div>
              <span className={`capitalize font-medium ${isSelected || !selectedCategory ? 'text-white' : 'text-gray-400'}`}>
                {category}
              </span>
            </button>
          );
        })}
        {selectedCategory && (
          <button
            onClick={() => setSelectedCategory(null)}
            className="px-3 py-2 text-sm text-gray-400 hover:text-white transition-colors"
          >
            Clear Filter
          </button>
        )}
      </div>

      {/* Enhanced Bubble Container with Glassmorphism */}
      <div className="bg-gradient-to-br from-slate-900/95 via-gray-900/90 to-slate-900/95 rounded-3xl min-h-[500px] overflow-hidden relative border border-white/10 shadow-2xl backdrop-blur-xl">
        {/* Dynamic background layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-cyan-500/5"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(236,72,153,0.1),transparent_50%)]"></div>
        

        <div className="absolute inset-0 p-8" style={{ width: '100%', height: '500px' }}>
          {trendWords
            .filter(word => !selectedCategory || word.category === selectedCategory)
            .map((word, index) => {
              const categoryStyle = categoryColors[word.category];
              const dynamicFontSize = Math.max(8, Math.min(word.fontSize, word.width * 0.12));
              const isHovered = hoveredWord === word.word;
              const isHighlighted = word.strength > 70;
              const pulseIntensity = Math.min(word.strength / 100, 1);
              
              return (
                <div
                  key={`${word.word}-${index}`}
                  className="absolute cursor-pointer select-none group"
                  style={{
                    left: `${word.x + word.magneticOffset.x}%`,
                    top: `${word.y + word.magneticOffset.y}%`,
                    width: `${(word.width / 1200) * 100}%`,
                    height: `${(word.height / 500) * 100}%`,
                    transform: isHovered ? 'scale(1.2) translateZ(0)' : 'scale(1) translateZ(0)',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    zIndex: isHovered ? 50 : 10,
                    animation: `modernFadeIn 0.8s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.03}s forwards`,
                  }}
                  onMouseEnter={(e) => handleWordHover(word, e)}
                  onMouseLeave={handleWordLeave}
                  onClick={() => handleTrendClick(word.word)}
                >
                  {/* Ripple effect on hover */}
                  {isHovered && (
                    <div className="absolute inset-0 rounded-full animate-ping opacity-30"
                      style={{
                        background: `radial-gradient(circle, ${categoryStyle.glowColor} 0%, transparent 70%)`,
                        transform: 'scale(1.5)',
                      }}
                    />
                  )}
                  
                  {/* High strength indicator */}
                  {isHighlighted && (
                    <div 
                      className="absolute -inset-2 rounded-full animate-pulse"
                      style={{
                        background: `conic-gradient(from 0deg, ${categoryStyle.glowColor}, transparent, ${categoryStyle.glowColor})`,
                        opacity: 0.3,
                        animation: `rotate 3s linear infinite, pulse 2s ease-in-out infinite alternate`
                      }}
                    />
                  )}

                  <div
                    className={`
                      w-full h-full rounded-full flex items-center justify-center relative overflow-hidden
                      bg-gradient-to-br ${word.color} backdrop-blur-md border-2
                      ${categoryStyle.border} shadow-xl transition-all duration-500
                      ${isHovered 
                        ? `${categoryStyle.glow} shadow-2xl brightness-125 border-white/40` 
                        : `${categoryStyle.glow} hover:brightness-110`
                      }
                    `}
                    style={{
                      boxShadow: isHovered 
                        ? `0 0 40px ${categoryStyle.glowColor}, 0 20px 40px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.2)`
                        : `0 8px 32px ${categoryStyle.glowColor}, 0 4px 16px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.1)`,
                      background: isHovered 
                        ? `linear-gradient(135deg, ${categoryStyle.glowColor}60, ${categoryStyle.glowColor}40)`
                        : undefined
                    }}
                  >
                    {/* Glassmorphism overlay */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/10 via-transparent to-transparent" />
                    
                    {/* Strength-based pulsing effect */}
                    {word.strength > 60 && (
                      <div 
                        className="absolute inset-0 rounded-full"
                        style={{
                          background: `radial-gradient(circle, ${categoryStyle.glowColor}20, transparent 70%)`,
                          animation: `strengthPulse ${3 - pulseIntensity}s ease-in-out infinite`
                        }}
                      />
                    )}

                    <span
                      className="text-center font-bold text-white drop-shadow-xl px-2 relative z-10"
                      style={{
                        fontSize: `${dynamicFontSize}px`,
                        fontFamily: 'Inter, sans-serif',
                        fontWeight: word.strength > 70 ? '900' : word.strength > 50 ? '700' : '600',
                        whiteSpace: 'nowrap',
                        lineHeight: '1.1',
                        textShadow: isHovered 
                          ? '0 4px 16px rgba(0,0,0,0.8), 0 0 20px rgba(255,255,255,0.3)'
                          : '0 2px 8px rgba(0,0,0,0.8), 0 0 16px rgba(255,255,255,0.1)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        maxWidth: '100%',
                        filter: isHovered ? 'brightness(1.2)' : 'brightness(1)'
                      }}
                    >
                      {word.word}
                    </span>
                  </div>
                </div>
              );
            })}
        </div>

        {/* Enhanced tooltip */}
        {tooltip && (
          <div
            className="fixed z-[100] pointer-events-none"
            style={{
              left: tooltip.x + 16,
              top: tooltip.y - 80,
            }}
          >
            <div className="bg-gray-900/95 backdrop-blur-md border border-white/20 rounded-xl p-4 shadow-2xl">
              <div className="text-white font-bold text-lg mb-2">{tooltip.word.word}</div>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Strength:</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className={`h-full bg-gradient-to-r ${categoryColors[tooltip.word.category].gradient} transition-all duration-300`}
                        style={{ width: `${tooltip.word.strength}%` }}
                      />
                    </div>
                    <span className="text-white font-medium">{Math.round(tooltip.word.strength)}</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Category:</span>
                  <span className="text-white capitalize font-medium">{tooltip.word.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Status:</span>
                  <span className={`font-medium ${
                    tooltip.word.strength > 70 ? 'text-red-400' : 
                    tooltip.word.strength > 50 ? 'text-yellow-400' : 
                    'text-green-400'
                  }`}>
                    {tooltip.word.strength > 70 ? 'Viral' : 
                     tooltip.word.strength > 50 ? 'Trending' : 
                     'Rising'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes modernFadeIn {
          0% {
            opacity: 0;
            transform: translateY(30px) scale(0.8) rotateX(20deg);
            filter: blur(10px);
          }
          50% {
            opacity: 0.7;
            transform: translateY(10px) scale(0.95) rotateX(10deg);
            filter: blur(5px);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1) rotateX(0deg);
            filter: blur(0px);
          }
        }

        @keyframes strengthPulse {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 0.7;
            transform: scale(1.05);
          }
        }

        @keyframes rotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default HotTrendsExplorer;
