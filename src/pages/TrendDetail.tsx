
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useMemo } from 'react';
import HeatScoreCard from '../components/trend-detail/HeatScoreCard';
import BubbleGraphCard from '../components/trend-detail/BubbleGraphCard';
import SmartSocialChart from '../components/trend-detail/SmartSocialChart';
import HeatmapCard from '../components/trend-detail/HeatmapCard';
import GlobalTrendCard from '../components/trend-detail/GlobalTrendCard';
import AboutOriginCard from '../components/trend-detail/AboutOriginCard';
import SourceLinksCard from '../components/trend-detail/SourceLinksCard';

const TrendDetail = () => {
  const { trendName } = useParams<{ trendName: string }>();
  
  // Generate dynamic data based on trend name and bubble size
  const trendData = useMemo(() => {
    if (!trendName) return null;
    
    const hash = trendName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const random = (seed: number) => {
      const x = Math.sin(seed) * 10000;
      return x - Math.floor(x);
    };

    // Calculate heat score based on trend name (simulating bubble size relationship)
    const baseHeatScore = Math.floor(random(hash) * 50000 + 30000);
    const heatScoreChange = Math.floor(random(hash + 50) * 20 - 10); // -10 to +10
    
    // Generate mentions based on heat score
    const totalMentions = Math.floor(baseHeatScore / 50);
    const xMentions = Math.floor(totalMentions * (0.3 + random(hash + 100) * 0.3));
    const tiktokMentions = Math.floor(totalMentions * (0.25 + random(hash + 200) * 0.3));
    const mediaMentions = Math.floor(totalMentions * (0.2 + random(hash + 300) * 0.25));

    return {
      name: trendName,
      heatScore: baseHeatScore,
      heatScoreChange,
      mentions: {
        x: xMentions,
        tiktok: tiktokMentions,
        media: mediaMentions
      }
    };
  }, [trendName]);

  if (!trendData) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-purple-500/20 bg-black/40 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link 
                to="/" 
                className="flex items-center space-x-2 text-gray-300 hover:text-cyan-400 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Dashboard</span>
              </Link>
              <div className="w-px h-6 bg-gray-600"></div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                {trendData.name} Trend Analysis
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Top Row: Heat Score & Bubble Graph */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <HeatScoreCard 
            heatScore={trendData.heatScore}
            heatScoreChange={trendData.heatScoreChange}
            mentions={trendData.mentions}
          />
          <BubbleGraphCard trendName={trendData.name} />
        </div>

        {/* Smart Social Chart */}
        <div className="mb-8">
          <SmartSocialChart trendName={trendData.name} />
        </div>

        {/* Bottom Grid: 3 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <HeatmapCard trendName={trendData.name} />
          <GlobalTrendCard />
          <AboutOriginCard trendName={trendData.name} />
        </div>

        {/* Source Links */}
        <SourceLinksCard trendName={trendData.name} />
      </main>
    </div>
  );
};

export default TrendDetail;
