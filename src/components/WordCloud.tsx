
import { HotWord } from '../types/trends';

interface WordCloudProps {
  words: HotWord[];
}

const WordCloud = ({ words }: WordCloudProps) => {
  // Function to check if two words overlap
  const isOverlapping = (pos1: {x: number, y: number, width: number, height: number}, pos2: {x: number, y: number, width: number, height: number}) => {
    return !(pos1.x + pos1.width < pos2.x || 
             pos2.x + pos2.width < pos1.x || 
             pos1.y + pos1.height < pos2.y || 
             pos2.y + pos2.height < pos1.y);
  };

  const generateNonOverlappingPositions = (words: HotWord[]) => {
    const positions: Array<{x: number, y: number, width: number, height: number, fontSize: number, word: HotWord}> = [];
    const containerWidth = 900;
    const containerHeight = 400;
    const padding = 10;

    words.slice(0, 40).forEach((word, index) => {
      // Calculate font size based on popularity
      let fontSize;
      if (word.popularity >= 90) {
        fontSize = 48 + Math.random() * 16; // 48-64px
      } else if (word.popularity >= 75) {
        fontSize = 36 + Math.random() * 12; // 36-48px
      } else if (word.popularity >= 60) {
        fontSize = 24 + Math.random() * 12; // 24-36px
      } else if (word.popularity >= 45) {
        fontSize = 18 + Math.random() * 6; // 18-24px
      } else {
        fontSize = 12 + Math.random() * 6; // 12-18px
      }

      // Estimate word dimensions
      const estimatedWidth = word.word.length * fontSize * 0.6;
      const estimatedHeight = fontSize * 1.2;

      let attempts = 0;
      let position;

      do {
        const x = Math.random() * (containerWidth - estimatedWidth - padding * 2) + padding;
        const y = Math.random() * (containerHeight - estimatedHeight - padding * 2) + padding;
        
        position = {
          x,
          y,
          width: estimatedWidth,
          height: estimatedHeight,
          fontSize,
          word
        };

        attempts++;
      } while (
        attempts < 50 && 
        positions.some(existingPos => isOverlapping(position, existingPos))
      );

      if (attempts < 50) {
        positions.push(position);
      }
    });

    return positions;
  };

  const wordPositions = generateNonOverlappingPositions(words);

  const getWordColor = (popularity: number) => {
    // Color variations in blue and purple tones
    const colors = [
      '#60a5fa', // blue-400
      '#3b82f6', // blue-500
      '#2563eb', // blue-600
      '#1d4ed8', // blue-700
      '#1e40af', // blue-800
      '#8b5cf6', // violet-500
      '#7c3aed', // violet-600
      '#6d28d9', // violet-700
    ];
    
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <div className="bg-white rounded-lg p-8 min-h-[400px] relative overflow-hidden border">
      {wordPositions.length > 0 ? (
        wordPositions.map((item, index) => (
          <span
            key={`${item.word.word}-${index}`}
            className="absolute hover:scale-110 transition-transform duration-300 cursor-pointer"
            style={{
              left: `${item.x}px`,
              top: `${item.y}px`,
              fontSize: `${item.fontSize}px`,
              fontWeight: item.word.popularity >= 75 ? '700' : item.word.popularity >= 45 ? '600' : '500',
              color: getWordColor(item.word.popularity),
              userSelect: 'none',
              fontFamily: 'Inter, sans-serif',
              whiteSpace: 'nowrap',
              opacity: 0.7 + (item.word.popularity / 100) * 0.3,
            }}
            title={`🔥 Score: ${item.word.popularity} | ${item.word.mentions.toLocaleString()} mentions | ${item.word.source}`}
          >
            {item.word.word}
          </span>
        ))
      ) : (
        <div className="w-full flex items-center justify-center h-[400px]">
          <div className="text-gray-400 text-lg font-medium">
            No trends found. Loading data...
          </div>
        </div>
      )}
    </div>
  );
};

export default WordCloud;
