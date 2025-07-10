
import { useMemo } from 'react';

interface AboutOriginCardProps {
  trendName: string;
}

const AboutOriginCard = ({ trendName }: AboutOriginCardProps) => {
  const { description, origin } = useMemo(() => {
    // Generate trend-specific content based on trendName
    const trendDescriptions: Record<string, { description: string; origin: string }> = {
      'Bitcoin': {
        description: "Bitcoin continues to dominate crypto conversations with institutional adoption and regulatory developments driving massive social engagement across all platforms.",
        origin: "Bitcoin gained renewed attention following major institutional investments and regulatory clarity in multiple jurisdictions, sparking widespread discussion across social platforms and mainstream media."
      },
      'Meme': {
        description: "Meme culture has exploded across social platforms, driving viral content creation and community engagement. From crypto memes to pop culture references, this trend shapes digital conversations.",
        origin: "The meme trend originated from grassroots social media communities, particularly gaining momentum through platforms like TikTok and Twitter, where users create and share relatable content that resonates globally."
      },
      'AI': {
        description: "Artificial Intelligence discussions surge as breakthrough technologies, ethical debates, and industry applications capture public attention and reshape digital discourse.",
        origin: "AI trend accelerated with the release of advanced language models and tools, triggering widespread discussions about automation, creativity, and the future of work across tech communities."
      },
      'DeFi': {
        description: "Decentralized Finance protocols and innovations continue driving conversations about financial freedom, yield farming, and blockchain-based financial services.",
        origin: "DeFi gained traction through innovative protocols offering lending, borrowing, and trading without traditional intermediaries, creating new financial paradigms in the crypto ecosystem."
      },
      'NFT': {
        description: "Non-Fungible Tokens remain a significant topic in digital art, gaming, and collectibles, with ongoing discussions about utility, value, and market dynamics.",
        origin: "NFTs emerged from digital art communities and gained mainstream attention through high-profile sales and celebrity endorsements, evolving into utility-focused applications."
      }
    };

    // Default content for trends not specifically defined
    const defaultContent = {
      description: `${trendName} has become a significant topic of discussion across social media platforms, driving engagement and conversations among diverse online communities. This trend reflects current interests and cultural movements.`,
      origin: `The ${trendName} trend emerged organically from social media discussions and gained momentum through influencer engagement, community participation, and viral content creation across multiple platforms.`
    };

    return trendDescriptions[trendName] || defaultContent;
  }, [trendName]);

  return (
    <div className="bg-gradient-to-br from-slate-800/50 to-pink-900/30 backdrop-blur-sm border border-pink-500/20 rounded-2xl p-6 shadow-2xl shadow-pink-500/10 space-y-6">
      {/* About Section */}
      <div>
        <h3 className="text-xl font-bold text-white mb-3">About</h3>
        <p className="text-gray-300 text-sm leading-relaxed">
          {description}
        </p>
      </div>

      {/* Origin Section */}
      <div>
        <h3 className="text-xl font-bold text-white mb-3">Origin</h3>
        <div className="relative">
          <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-pink-500 to-purple-500"></div>
          <div className="pl-6">
            <div className="relative">
              <div className="absolute -left-5 top-1 w-2 h-2 bg-pink-500 rounded-full"></div>
              <p className="text-gray-300 text-sm leading-relaxed">
                {origin}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutOriginCard;
