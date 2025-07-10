import { useState } from 'react';
import { RefreshCw, Sparkles } from 'lucide-react';
import { useWallet } from '../contexts/WalletContext';

interface TokenIdea {
  id: string;
  name: string;
  image: string;
  keywords: string[];
  description: string;
}

const TokenCreator = () => {
  const [keyword, setKeyword] = useState('');
  const [ideas, setIdeas] = useState<TokenIdea[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const { isConnected, createToken } = useWallet();

  const generateTokenVariations = (baseKeyword: string) => {
    const variations = [
      {
        prefix: '',
        suffix: 'Coin',
        theme: 'classic',
        image: '/lovable-uploads/a164de22-72a1-4e0c-9052-707ef738d726.png',
        description: `${baseKeyword}Coin is the original meme-inspired cryptocurrency that brings humor and community spirit to the blockchain. Built for everyday transactions with a fun twist.`
      },
      {
        prefix: 'Meta',
        suffix: '',
        theme: 'metaverse',
        image: '/lovable-uploads/88d883c3-eba4-406c-81ac-b896bc32b905.png',
        description: `Meta${baseKeyword} bridges the gap between virtual worlds and real value. Experience ${baseKeyword.toLowerCase()} culture in the metaverse with NFTs and gaming rewards.`
      },
      {
        prefix: '',
        suffix: 'DAO',
        theme: 'governance',
        image: '/lovable-uploads/a164de22-72a1-4e0c-9052-707ef738d726.png',
        description: `${baseKeyword}DAO puts the power in the hands of the community. Vote on proposals, fund projects, and shape the future of ${baseKeyword.toLowerCase()} together.`
      },
      {
        prefix: 'Ultra',
        suffix: '',
        theme: 'premium',
        image: '/lovable-uploads/88d883c3-eba4-406c-81ac-b896bc32b905.png',
        description: `Ultra${baseKeyword} is the premium evolution of ${baseKeyword.toLowerCase()} tokens. Enhanced staking rewards and exclusive ${baseKeyword.toLowerCase()} experiences await holders.`
      }
    ];

    return variations.map((variation, index) => {
      const name = `${variation.prefix}${baseKeyword}${variation.suffix}`;
      const keywordVariations = [
        baseKeyword,
        variation.theme === 'classic' ? 'Meme' : variation.theme === 'metaverse' ? 'VR' : variation.theme === 'governance' ? 'Vote' : 'Premium',
        variation.theme === 'classic' ? 'Community' : variation.theme === 'metaverse' ? 'Gaming' : variation.theme === 'governance' ? 'DAO' : 'Stake',
        'Crypto'
      ];

      return {
        id: (index + 1).toString(),
        name,
        image: variation.image,
        keywords: keywordVariations,
        description: variation.description
      };
    });
  };

  const generateIdeas = async () => {
    if (!keyword.trim()) return;
    
    setIsGenerating(true);
    
    // Simulated AI generation with varied token concepts
    setTimeout(() => {
      const newIdeas = generateTokenVariations(keyword.charAt(0).toUpperCase() + keyword.slice(1));
      setIdeas(newIdeas);
      setIsGenerating(false);
    }, 2000);
  };

  const refreshIdeas = () => {
    if (ideas.length > 0) {
      generateIdeas();
    }
  };

  const handleLaunchToken = async (idea: TokenIdea) => {
    if (!isConnected) {
      alert('Please connect your wallet first to launch a token');
      return;
    }

    const tokenData = {
      name: idea.name,
      symbol: idea.name.slice(0, 4).toUpperCase(),
      description: idea.description
    };

    await createToken(tokenData);
  };

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <label className="text-white text-lg font-medium mb-2 block">
              Create the Next Viral Token on 🚀
            </label>
            <div className="flex space-x-3">
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Cat"
                className="flex-1 bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                onKeyPress={(e) => e.key === 'Enter' && generateIdeas()}
              />
              <button
                onClick={generateIdeas}
                disabled={isGenerating || !keyword.trim()}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-600 rounded-lg transition-all duration-200 text-white disabled:cursor-not-allowed font-medium"
              >
                {isGenerating ? 'Creating...' : 'Create'}
              </button>
            </div>
          </div>
          {ideas.length > 0 && (
            <button
              onClick={refreshIdeas}
              className="p-3 bg-gray-700/50 hover:bg-gray-600/50 rounded-lg transition-all duration-200 text-white"
              title="Refresh ideas"
            >
              <RefreshCw className={`w-5 h-5 ${isGenerating ? 'animate-spin' : ''}`} />
            </button>
          )}
        </div>
      </div>

      {/* Ideas Grid */}
      {ideas.length > 0 && (
        <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {ideas.map((idea, index) => (
              <div
                key={idea.id}
                className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 hover:border-purple-500/50 transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-700">
                    <img 
                      src={idea.image} 
                      alt={idea.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-white font-bold text-lg">Name: {idea.name}</h3>
                      <button
                        onClick={() => handleLaunchToken(idea)}
                        className={`px-3 py-1 rounded text-xs font-medium transition-all duration-200 ${
                          isConnected 
                            ? 'bg-purple-600/20 border border-purple-500/30 text-purple-400 hover:bg-purple-600/30' 
                            : 'bg-gray-600/20 border border-gray-500/30 text-gray-400 cursor-not-allowed'
                        }`}
                        disabled={!isConnected}
                        title={!isConnected ? 'Connect wallet to launch' : 'Launch token'}
                      >
                        {isConnected ? 'Launch it' : 'Connect Wallet'}
                      </button>
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mb-3">
                      {idea.keywords.map((keyword) => (
                        <span
                          key={keyword}
                          className="px-2 py-1 bg-blue-600/20 border border-blue-500/30 rounded text-blue-400 text-xs"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                    
                    <div className="mb-3">
                      <h4 className="text-white font-medium text-sm mb-1">AI Idea:</h4>
                      <p className="text-gray-300 text-sm leading-relaxed">
                        {idea.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
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
  );
};

export default TokenCreator;
