
export type SourceType = 'All' | 'X' | 'TikTok' | 'Media';
export type TypeFilter = 'All' | 'Animal' | 'Celebrity' | 'Concept' | 'Pun' | 'Emoji' | 'Other';
export type TimeFilter = '1H' | '4H' | '1D' | '1W';
export type ViewMode = 'Bubble' | 'Hot Words';

export interface HotWord {
  word: string;
  popularity: number;
  mentions: number;
  source: 'X' | 'TikTok' | 'Media';
  type: 'Animal' | 'Celebrity' | 'Concept' | 'Pun' | 'Emoji' | 'Other';
  timeframe: '1H' | '4H' | '1D' | '1W';
}

export interface BubbleTrend {
  id: string;
  name: string;
  type: 'Animal' | 'Celebrity' | 'Concept' | 'Pun' | 'Emoji' | 'Other';
  source: 'X' | 'TikTok' | 'Media';
  description: string;
  heatScore: number;
  image: string;
  timeframe: '1H' | '4H' | '1D' | '1W';
}
