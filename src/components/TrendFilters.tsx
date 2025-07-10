
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { SourceType, TypeFilter, TimeFilter, ViewMode } from '../types/trends';

interface TrendFiltersProps {
  sourceFilter: SourceType;
  setSourceFilter: (value: SourceType) => void;
  typeFilter: TypeFilter;
  setTypeFilter: (value: TypeFilter) => void;
  timeFilter: TimeFilter;
  setTimeFilter: (value: TimeFilter) => void;
  viewMode: ViewMode;
  setViewMode: (value: ViewMode) => void;
}

const TrendFilters = ({
  sourceFilter,
  setSourceFilter,
  typeFilter,
  setTypeFilter,
  timeFilter,
  setTimeFilter,
  viewMode,
  setViewMode
}: TrendFiltersProps) => {
  return (
    <div className="flex flex-wrap gap-4 items-center">
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold text-gray-300">Source:</span>
        <Select value={sourceFilter} onValueChange={(value: SourceType) => setSourceFilter(value)}>
          <SelectTrigger className="w-32 bg-gray-800/70 border-gray-600 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-600">
            <SelectItem value="All" className="text-white hover:bg-gray-700">All</SelectItem>
            <SelectItem value="X" className="text-white hover:bg-gray-700">X</SelectItem>
            <SelectItem value="TikTok" className="text-white hover:bg-gray-700">TikTok</SelectItem>
            <SelectItem value="Media" className="text-white hover:bg-gray-700">Media</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold text-gray-300">Type:</span>
        <Select value={typeFilter} onValueChange={(value: TypeFilter) => setTypeFilter(value)}>
          <SelectTrigger className="w-32 bg-gray-800/70 border-gray-600 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-600">
            <SelectItem value="All" className="text-white hover:bg-gray-700">All</SelectItem>
            <SelectItem value="Animal" className="text-white hover:bg-gray-700">Animal</SelectItem>
            <SelectItem value="Celebrity" className="text-white hover:bg-gray-700">Celebrity</SelectItem>
            <SelectItem value="Concept" className="text-white hover:bg-gray-700">Concept</SelectItem>
            <SelectItem value="Pun" className="text-white hover:bg-gray-700">Pun</SelectItem>
            <SelectItem value="Emoji" className="text-white hover:bg-gray-700">Emoji</SelectItem>
            <SelectItem value="Other" className="text-white hover:bg-gray-700">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold text-gray-300">Time:</span>
        <Select value={timeFilter} onValueChange={(value: TimeFilter) => setTimeFilter(value)}>
          <SelectTrigger className="w-32 bg-gray-800/70 border-gray-600 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-600">
            <SelectItem value="1H" className="text-white hover:bg-gray-700">1H</SelectItem>
            <SelectItem value="4H" className="text-white hover:bg-gray-700">4H</SelectItem>
            <SelectItem value="1D" className="text-white hover:bg-gray-700">1D</SelectItem>
            <SelectItem value="1W" className="text-white hover:bg-gray-700">1W</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold text-gray-300">View:</span>
        <Select value={viewMode} onValueChange={(value: ViewMode) => setViewMode(value)}>
          <SelectTrigger className="w-32 bg-gray-800/70 border-gray-600 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-600">
            <SelectItem value="Bubble" className="text-white hover:bg-gray-700">Bubble</SelectItem>
            <SelectItem value="Hot Words" className="text-white hover:bg-gray-700">Hot Words</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default TrendFilters;
