
import { useState } from 'react';
import { useKOLRankings } from '../hooks/useMarketData';
import { Users, Award, TrendingUp, CheckCircle } from 'lucide-react';

interface KOL {
  rank: number;
  username: string;
  name: string;
  authorityScore: number;
  followersCount: number;
  engagementRate: number;
  followerQuality: number;
  cryptoExpertise: number;
  isVerified: boolean;
  profileImage: string;
}

const Top20KOLs = () => {
  const { data: kolRankingsData, isLoading, error } = useKOLRankings(20);
  
  // Debug logging
  console.log('🔍 KOL Rankings Debug:', {
    isLoading,
    error,
    data: kolRankingsData,
    hasData: !!kolRankingsData,
    dataKeys: kolRankingsData ? Object.keys(kolRankingsData) : [],
    kolRankings: kolRankingsData?.kol_rankings || 'No kol_rankings property'
  });
  
  const formatFollowers = (count: number | null | undefined) => {
    const safeCount = count || 0;
    if (safeCount >= 1000000) {
      return `${(safeCount / 1000000).toFixed(1)}M`;
    } else if (safeCount >= 1000) {
      return `${(safeCount / 1000).toFixed(0)}K`;
    }
    return safeCount.toString();
  };

  const safeToFixed = (value: number | null | undefined, decimals: number = 1) => {
    return (value || 0).toFixed(decimals);
  };

  // Use API data with correct property names and safe defaults
  const kols: KOL[] = kolRankingsData?.kol_rankings?.length > 0 
    ? kolRankingsData.kol_rankings.map((kol) => ({
        rank: kol.rank || 0,
        username: kol.username || 'Unknown',
        name: kol.name || 'Unknown User',
        authorityScore: kol.authority_score || 0,
        followersCount: kol.followers_count || 0,
        engagementRate: kol.engagement_rate || 0,
        followerQuality: kol.follower_quality || 0,
        cryptoExpertise: kol.crypto_expertise || 0,
        isVerified: kol.is_verified || false,
        profileImage: kol.profile_picture || '/placeholder.svg'
      }))
    : [];

  const getRankStyle = (rank: number, authorityScore: number) => {
    if (rank === 1) return 'border-yellow-400 bg-gradient-to-br from-yellow-500/20 to-amber-600/20';
    if (rank === 2) return 'border-gray-300 bg-gradient-to-br from-gray-300/20 to-gray-500/20';
    if (rank === 3) return 'border-orange-400 bg-gradient-to-br from-orange-500/20 to-amber-700/20';
    if (authorityScore > 3) return 'border-indigo-400/40 bg-gradient-to-br from-indigo-500/10 to-purple-600/10';
    return 'border-gray-600/30 bg-gray-800/60';
  };

  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-slate-800/50 to-indigo-900/30 backdrop-blur-sm border border-indigo-500/20 rounded-2xl p-6 shadow-2xl shadow-indigo-500/10">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 gap-4">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Top 20 KOLs
          </h2>
        </div>
        <div className="min-h-[400px] flex items-center justify-center">
          <div className="text-gray-400 text-lg">Loading KOL rankings...</div>
        </div>
      </div>
    );
  }

  if (error) {
    console.error('👑 KOL rankings API error:', error);
    return (
      <div className="bg-gradient-to-br from-slate-800/50 to-indigo-900/30 backdrop-blur-sm border border-indigo-500/20 rounded-2xl p-6 shadow-2xl shadow-indigo-500/10">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 gap-4">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Top 20 KOLs
          </h2>
        </div>
        <div className="min-h-[400px] flex items-center justify-center">
          <div className="text-red-400 text-lg text-center">
            <p>Failed to load KOL rankings</p>
            <p className="text-sm text-gray-400 mt-2">Check console for details</p>
          </div>
        </div>
      </div>
    );
  }

  if (kols.length === 0) {
    return (
      <div className="bg-gradient-to-br from-slate-800/50 to-indigo-900/30 backdrop-blur-sm border border-indigo-500/20 rounded-2xl p-6 shadow-2xl shadow-indigo-500/10">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 gap-4">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Top 20 KOLs
          </h2>
        </div>
        <div className="min-h-[400px] flex items-center justify-center">
          <div className="text-gray-400 text-lg text-center">
            <p>No KOL rankings available</p>
            <p className="text-sm text-gray-500 mt-2">Data might be loading or unavailable</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-slate-800/50 to-indigo-900/30 backdrop-blur-sm border border-indigo-500/20 rounded-2xl p-6 shadow-2xl shadow-indigo-500/10">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 gap-4">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
          Top 20 KOLs
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {kols.map((kol) => (
          <div
            key={`${kol.username}-${kol.rank}`}
            className={`${getRankStyle(kol.rank, kol.authorityScore)} border rounded-xl p-4 hover:bg-gray-700/60 transition-all duration-300 cursor-pointer group relative`}
          >
            {/* Crown for top 3 */}
            {kol.rank <= 3 && (
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-xs">
                👑
              </div>
            )}
            
            {/* Header */}
            <div className="flex items-center space-x-3 mb-4">
              <img
                src={kol.profileImage}
                alt={kol.username}
                className="w-12 h-12 rounded-full border-2 border-gray-600"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1">
                  <h3 className="text-white font-medium text-sm truncate" title={kol.username}>
                    @{kol.username}
                  </h3>
                  {kol.isVerified && (
                    <CheckCircle className="w-3 h-3 text-blue-400 flex-shrink-0" />
                  )}
                </div>
                <p className="text-gray-300 text-xs truncate" title={kol.name}>
                  {kol.name}
                </p>
              </div>
            </div>
            
            {/* Authority Score - Main Metric */}
            <div className="text-center mb-4">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Award className="w-4 h-4 text-yellow-400" />
                <span className="text-xs text-gray-400">Authority</span>
              </div>
              <div className="text-2xl font-bold text-yellow-400">
                {safeToFixed(kol.authorityScore, 1)}
              </div>
            </div>
            
            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Users className="w-3 h-3 text-gray-400" />
                  <span className="text-gray-400">Followers</span>
                </div>
                <div className="text-white font-semibold">
                  {formatFollowers(kol.followersCount)}
                </div>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <TrendingUp className="w-3 h-3 text-gray-400" />
                  <span className="text-gray-400">Engagement</span>
                </div>
                <div className="text-green-400 font-semibold">
                  {safeToFixed((kol.engagementRate || 0) * 100, 1)}%
                </div>
              </div>
              
              <div className="text-center">
                <span className="text-gray-400">Quality</span>
                <div className="text-blue-400 font-semibold">
                  {safeToFixed(kol.followerQuality, 1)}
                </div>
              </div>
              
              <div className="text-center">
                <span className="text-gray-400">Expertise</span>
                <div className="text-purple-400 font-semibold">
                  {safeToFixed(kol.cryptoExpertise, 1)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Top20KOLs;
