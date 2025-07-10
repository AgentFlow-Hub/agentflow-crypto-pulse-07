
import { BubbleTrend } from '../types/trends';

interface BubbleViewProps {
  bubbles: BubbleTrend[];
}

const BubbleView = ({ bubbles }: BubbleViewProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {bubbles.length > 0 ? (
        bubbles.map((bubble) => (
          <div
            key={bubble.id}
            className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 rounded-xl p-6 border border-gray-600/40 hover:border-emerald-400/40 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <div className="flex items-start gap-4">
              <div className="text-4xl">{bubble.image}</div>
              <div className="flex-1">
                <h3 className="font-bold text-xl text-white mb-2">{bubble.name}</h3>
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 text-sm rounded-full font-medium">
                    {bubble.type}
                  </span>
                  <span className="px-3 py-1 bg-blue-500/20 text-blue-300 text-sm rounded-full font-medium">
                    {bubble.source}
                  </span>
                </div>
                <p className="text-gray-300 text-sm mb-4 leading-relaxed">{bubble.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400 font-medium">Heat Score</span>
                  <span className="font-bold text-emerald-400 text-xl">{bubble.heatScore}</span>
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="col-span-full text-center text-gray-400 text-lg font-medium">
          No bubble trends found for the selected filters. Try adjusting your selections.
        </div>
      )}
    </div>
  );
};

export default BubbleView;
