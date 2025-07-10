
import WordCloud from './WordCloud';
import { HotWord } from '../types/trends';

interface HotWordsViewProps {
  words: HotWord[];
}

const HotWordsView = ({ words }: HotWordsViewProps) => {
  return (
    <div className="p-8">
      <WordCloud words={words} />
    </div>
  );
};

export default HotWordsView;
