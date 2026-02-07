import { ChevronDown, Clock, FileText } from 'lucide-react';
import { useState } from 'react';

interface SidebarProps {
  selectedSubject: string;
  selectedTopic: string;
  examMode: '2-mark' | '5-mark' | '10-mark';
  onTopicChange: (topic: string) => void;
  onExamModeChange: (mode: '2-mark' | '5-mark' | '10-mark') => void;
  topics: string[];
  history: Array<{ id: string; query: string; timestamp: Date }>;
  onHistoryItemClick: (query: string) => void;
}

export function Sidebar({
  selectedSubject,
  selectedTopic,
  examMode,
  onTopicChange,
  onExamModeChange,
  topics,
  history,
  onHistoryItemClick,
}: SidebarProps) {
  const [showHistory, setShowHistory] = useState(true);

  return (
    <aside className="w-80 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col h-full overflow-y-auto">
      <div className="p-6 space-y-6">
        {/* Topic Selection */}
        <div>
          <label htmlFor="topic-selector" className="block mb-2 text-gray-900 dark:text-white">
            Topic / Unit
          </label>
          <div className="relative">
            <select
              id="topic-selector"
              value={selectedTopic}
              onChange={(e) => onTopicChange(e.target.value)}
              disabled={!selectedSubject}
              className="appearance-none w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg pl-4 pr-10 py-2.5 text-gray-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-blue-300 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Select topic or unit"
              aria-describedby="topic-helper"
            >
              <option value="">Select Topic</option>
              {topics.map((topic) => (
                <option key={topic} value={topic}>
                  {topic}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 dark:text-gray-400 pointer-events-none" aria-hidden="true" />
          </div>
          {!selectedSubject && (
            <p id="topic-helper" className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">
              Please select a subject first
            </p>
          )}
        </div>

        {/* Exam Mode Toggle */}
        <div>
          <label className="block mb-2 text-gray-900 dark:text-white">
            Exam Mode
          </label>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            Choose answer format length
          </p>
          <div 
            role="radiogroup" 
            aria-label="Select exam mode"
            className="space-y-2"
          >
            {(['2-mark', '5-mark', '10-mark'] as const).map((mode) => (
              <button
                key={mode}
                role="radio"
                aria-checked={examMode === mode}
                onClick={() => onExamModeChange(mode)}
                className={`w-full px-4 py-3 rounded-lg border-2 text-left transition-all focus:outline-none focus:ring-4 focus:ring-blue-300 ${
                  examMode === mode
                    ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-600 text-blue-900 dark:text-blue-300'
                    : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{mode}</span>
                  {examMode === mode && (
                    <div className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400" aria-hidden="true"></div>
                  )}
                </div>
                <p className="text-sm mt-1 opacity-80">
                  {mode === '2-mark' && 'Brief answers'}
                  {mode === '5-mark' && 'Moderate detail'}
                  {mode === '10-mark' && 'Detailed explanations'}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* History Section */}
      <div className="flex-1 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-inset"
          aria-expanded={showHistory}
          aria-controls="history-list"
        >
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-gray-600 dark:text-gray-400" aria-hidden="true" />
            <span className="font-medium text-gray-900 dark:text-white">Recent Queries</span>
          </div>
          <ChevronDown
            className={`w-5 h-5 text-gray-500 dark:text-gray-400 transition-transform ${
              showHistory ? 'transform rotate-180' : ''
            }`}
            aria-hidden="true"
          />
        </button>
        
        {showHistory && (
          <div id="history-list" className="px-4 pb-4">
            {history.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">
                No recent queries yet
              </p>
            ) : (
              <div className="space-y-2">
                {history.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => onHistoryItemClick(item.query)}
                    className="w-full p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 text-left border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-4 focus:ring-blue-300 group"
                    aria-label={`View previous query: ${item.query}`}
                  >
                    <div className="flex items-start gap-2">
                      <FileText className="w-4 h-4 text-gray-400 dark:text-gray-500 mt-0.5 flex-shrink-0" aria-hidden="true" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900 dark:text-gray-200 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                          {item.query}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {formatTimestamp(item.timestamp)}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}

function formatTimestamp(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}