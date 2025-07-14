
import { useState } from 'react';
import MarketOverview from '../components/MarketOverview';
import TrendingTweets from '../components/TrendingTweets';
import TokenHeatMap from '../components/TokenHeatMap';
import HotTrendsExplorer from '../components/HotTrendsExplorer';
import TokenCreator from '../components/TokenCreator';
import Top20KOLs from '../components/Top20KOLs';
import HotTokens from '../components/HotTokens';
import { WalletProvider, useWallet } from '../contexts/WalletContext';

const WalletButton = () => {
  const {
    account,
    isConnected,
    isConnecting,
    connectWallet,
    disconnectWallet
  } = useWallet();
  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };
  if (isConnected && account) {
    return <div className="flex items-center space-x-2">
        <span className="text-green-400 text-sm">{formatAddress(account)}</span>
        <button onClick={disconnectWallet} className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white font-medium transition-all duration-300">
          Disconnect
        </button>
      </div>;
  }
  return <button onClick={connectWallet} disabled={isConnecting} className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-600 rounded-lg text-white font-medium transition-all duration-300 shadow-lg shadow-purple-500/25 disabled:cursor-not-allowed">
      {isConnecting ? 'Connecting...' : 'Connect Wallet'}
    </button>;
};

const IndexContent = () => {
  return <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-purple-500/20 bg-black/40 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/25">
                <span className="text-white font-bold text-lg">AF</span>
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                AgentFlow
              </h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <button className="text-gray-300 hover:text-cyan-400 transition-all duration-300 font-medium">
                Home
              </button>
              <button className="text-gray-300 hover:text-purple-400 transition-all duration-300 font-medium">
                Analytics
              </button>
              <WalletButton />
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Section 1: Market Overview - Full Width */}
        <section className="mb-8">
          <MarketOverview />
        </section>

        {/* Sections 2 & 3: Side by Side - 520px Height */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Section 2: Trending Tweets - 520px Height */}
          <section className="bg-gradient-to-br from-slate-800/50 to-blue-900/30 backdrop-blur-sm border border-blue-500/20 p-6 shadow-2xl shadow-blue-500/10 h-[520px] rounded-md flex flex-col">
            <div className="mb-6 flex-shrink-0">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">Trending Tweets</h2>
              <p className="text-gray-400">Latest insights from top crypto influencers</p>
            </div>
            <div className="flex-1 min-h-0">
              <TrendingTweets />
            </div>
          </section>

          {/* Section 3: Token Heat Map - 520px Height */}
          <section className="bg-gradient-to-br from-slate-800/50 to-purple-900/30 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-6 shadow-2xl shadow-purple-500/10 h-[520px] flex flex-col">
            <div className="mb-6 flex-shrink-0">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-2">Token Heat Map</h2>
              <p className="text-gray-400">Most mentioned tokens by influence and volume</p>
            </div>
            <div className="flex-1 min-h-0">
              <TokenHeatMap />
            </div>
          </section>
        </div>

        {/* Section 4: Hot Trends Explorer - Full Width */}
        <section className="mb-8 bg-gradient-to-r from-slate-800/50 to-emerald-900/30 backdrop-blur-sm border border-emerald-500/20 rounded-2xl p-6 shadow-2xl shadow-emerald-500/10">
          <div className="mb-6">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent mb-2">Hot Trends</h2>
            <p className="text-gray-400">Discover emerging trends across social platforms</p>
          </div>
          <HotTrendsExplorer />
        </section>

        {/* Section 5: Top 20 KOLs - Full Width */}
        <section className="mb-8">
          <Top20KOLs />
        </section>

        {/* Section 6: Hot Tokens - Full Width */}
        <section className="mb-8 bg-gradient-to-r from-slate-800/50 to-red-900/30 backdrop-blur-sm border border-red-500/20 rounded-2xl p-6 shadow-2xl shadow-red-500/10">
          <div className="mb-6">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent mb-2">Hot Tokens</h2>
            <p className="text-gray-400">Most socially trending tokens by mentions and engagement</p>
          </div>
          <HotTokens />
        </section>

        {/* Section 7: Magic Token Idea - Full Width */}
        <section className="bg-gradient-to-r from-slate-800/50 to-pink-900/30 backdrop-blur-sm border border-pink-500/20 rounded-2xl p-6 shadow-2xl shadow-pink-500/10">
          <div className="mb-6">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent mb-2">Magic Token Idea</h2>
            <p className="text-gray-400">AI-powered token concept generation</p>
          </div>
          <TokenCreator />
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-purple-500/20 bg-black/40 backdrop-blur-xl mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-gray-400 mb-2">&copy; 2024 AgentFlow. Professional crypto market intelligence.</p>
            <div className="flex justify-center space-x-6 text-sm text-gray-500">
              <a href="#" className="hover:text-cyan-400 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-purple-400 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-pink-400 transition-colors">Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>;
};

const Index = () => {
  return <WalletProvider>
      <IndexContent />
    </WalletProvider>;
};

export default Index;
