
import { useState } from 'react';
import { ArrowLeft, RefreshCw, Sparkles } from 'lucide-react';

interface TokenIdea {
  id: string;
  name: string;
  symbol: string;
  image: string;
  keywords: string[];
  shortDescription: string;
  detailedDescription: string;
  originStory: string;
}

interface TokenIdeaGeneratorProps {
  onBack: () => void;
}

const TokenIdeaGenerator = ({ onBack }: TokenIdeaGeneratorProps) => {
  const [keyword, setKeyword] = useState('');
  const [ideas, setIdeas] = useState<TokenIdea[]>([]);
  const [selectedIdea, setSelectedIdea] = useState<TokenIdea | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateIdeas = async () => {
    if (!keyword.trim()) return;
    
    setIsGenerating(true);
    
    // Simulated AI generation - in real app this would call an AI API
    setTimeout(() => {
      const newIdeas: TokenIdea[] = [
        {
          id: '1',
          name: `${keyword}Coin`,
          symbol: `${keyword.slice(0, 3).toUpperCase()}`,
          image: '🚀',
          keywords: [keyword, 'crypto', 'blockchain'],
          shortDescription: `Revolutionary ${keyword}-based cryptocurrency with unique utility`,
          detailedDescription: `${keyword}Coin represents the next generation of cryptocurrency innovation, combining cutting-edge blockchain technology with real-world ${keyword} applications. Our advanced consensus mechanism ensures fast, secure, and environmentally friendly transactions while maintaining complete decentralization.`,
          originStory: `Born from the vision of creating a truly ${keyword}-centric digital economy, ${keyword}Coin was conceptualized by a team of blockchain enthusiasts who recognized the untapped potential in the ${keyword} sector. The project began as an experimental protocol and evolved into a comprehensive ecosystem.`
        },
        {
          id: '2',
          name: `Meta${keyword}`,
          symbol: `M${keyword.slice(0, 2).toUpperCase()}`,
          image: '🌟',
          keywords: [keyword, 'metaverse', 'NFT'],
          shortDescription: `Metaverse token powering ${keyword} experiences in virtual worlds`,
          detailedDescription: `Meta${keyword} bridges the gap between traditional ${keyword} concepts and the emerging metaverse economy. Users can stake tokens to access premium ${keyword} experiences, create NFTs, and participate in virtual ${keyword} communities with real economic value.`,
          originStory: `Meta${keyword} emerged from the convergence of two powerful trends: the rise of virtual worlds and the growing importance of ${keyword} in digital culture. The founding team saw an opportunity to create meaningful connections between these spaces.`
        },
        {
          id: '3',
          name: `${keyword}DAO`,
          symbol: `${keyword.slice(0, 4).toUpperCase()}`,
          image: '🏛️',
          keywords: [keyword, 'DAO', 'governance'],
          shortDescription: `Decentralized autonomous organization token for ${keyword} governance`,
          detailedDescription: `${keyword}DAO puts the power of ${keyword}-related decisions directly into the hands of the community. Token holders vote on proposals, fund projects, and shape the future direction of ${keyword} initiatives through transparent, blockchain-based governance.`,
          originStory: `${keyword}DAO was created to solve the centralization problem in ${keyword} decision-making. The founders believed that the best ${keyword} innovations come from collective intelligence and democratic participation.`
        },
        {
          id: '4',
          name: `Yield${keyword}`,
          symbol: `Y${keyword.slice(0, 3).toUpperCase()}`,
          image: '💎',
          keywords: [keyword, 'yield', 'DeFi'],
          shortDescription: `High-yield DeFi token with ${keyword}-backed rewards`,
          detailedDescription: `Yield${keyword} introduces a revolutionary yield farming mechanism backed by real ${keyword} assets. Users can stake tokens in liquidity pools to earn rewards while supporting the ${keyword} ecosystem through automated market-making protocols.`,
          originStory: `Yield${keyword} was born from the DeFi summer of innovation, when the founding team discovered how to create sustainable yield generation through ${keyword} asset backing, creating a new model for decentralized finance.`
        }
      ];
      
      setIdeas(newIdeas);
      setIsGenerating(false);
    }, 2000);
  };

  const refreshIdeas = () => {
    if (ideas.length > 0) {
      generateIdeas();
    }
  };

  if (selectedIdea) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center space-x-4 mb-8">
            <button
              onClick={() => setSelectedIdea(null)}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors duration-200 text-white"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Ideas</span>
            </button>
          </div>

          {/* Token Detail */}
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-8">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">{selectedIdea.image}</div>
              <h1 className="text-4xl font-bold text-white mb-2">{selectedIdea.name}</h1>
              <p className="text-xl text-gray-400">${selectedIdea.symbol}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Description */}
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-white mb-3">Description</h2>
                  <p className="text-gray-300 leading-relaxed">{selectedIdea.detailedDescription}</p>
                </div>

                <div>
                  <h2 className="text-xl font-bold text-white mb-3">Keywords</h2>
                  <div className="flex flex-wrap gap-2">
                    {selectedIdea.keywords.map((keyword) => (
                      <span
                        key={keyword}
                        className="px-3 py-1 bg-blue-600/20 border border-blue-500/30 rounded-full text-blue-400 text-sm"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Origin Story */}
              <div>
                <h2 className="text-xl font-bold text-white mb-3">Origin Story</h2>
                <p className="text-gray-300 leading-relaxed">{selectedIdea.originStory}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors duration-200 text-white"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <div>
              <h1 className="text-3xl font-bold text-white">Token Idea Generator</h1>
              <p className="text-gray-400">Generate unique token concepts with AI</p>
            </div>
          </div>
          
          {ideas.length > 0 && (
            <button
              onClick={refreshIdeas}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg transition-all duration-200 text-white"
            >
              <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          )}
        </div>

        {/* Input Section */}
        <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-8 mb-8">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Enter a Keyword</h2>
            <p className="text-gray-400 mb-6">Our AI will generate 4 unique token ideas based on your keyword</p>
            
            <div className="flex space-x-4">
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="e.g., gaming, music, art, space..."
                className="flex-1 bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                onKeyPress={(e) => e.key === 'Enter' && generateIdeas()}
              />
              <button
                onClick={generateIdeas}
                disabled={isGenerating || !keyword.trim()}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-600 rounded-lg transition-all duration-200 text-white disabled:cursor-not-allowed"
              >
                <Sparkles className={`w-4 h-4 ${isGenerating ? 'animate-pulse' : ''}`} />
                <span>{isGenerating ? 'Generating...' : 'Generate'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Ideas Grid */}
        {ideas.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {ideas.map((idea, index) => (
              <div
                key={idea.id}
                onClick={() => setSelectedIdea(idea)}
                className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 hover:border-purple-500/50 transition-all duration-300 hover:transform hover:scale-105 cursor-pointer animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="text-center space-y-4">
                  <div className="text-4xl">{idea.image}</div>
                  <div>
                    <h3 className="text-white font-bold text-lg">{idea.name}</h3>
                    <p className="text-gray-400 text-sm">${idea.symbol}</p>
                  </div>
                  <div className="flex flex-wrap gap-1 justify-center">
                    {idea.keywords.slice(0, 2).map((keyword) => (
                      <span
                        key={keyword}
                        className="px-2 py-1 bg-blue-600/20 border border-blue-500/30 rounded text-blue-400 text-xs"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {idea.shortDescription}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {isGenerating && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-purple-600/30 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-400">Generating token ideas...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TokenIdeaGenerator;
