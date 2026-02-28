import { useState, useRef } from 'react';
import { FileText, Sparkles, Loader2, CheckCircle2, ArrowLeft, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { streamQuery } from '../../lib/api';

interface NotesSummarizerProps {
  selectedSubject: string;
  selectedSubjectName: string;
  selectedTopic: string;
  selectedTopicName: string;
  onBack: () => void;
}

interface SummaryEntry {
  id: string;
  notesExcerpt: string;
  answer: string;
  timestamp: Date;
}

export function NotesSummarizer({
  selectedSubject,
  selectedSubjectName,
  selectedTopic,
  selectedTopicName,
  onBack,
}: NotesSummarizerProps) {
  const [notes, setNotes] = useState('');
  const [streamedAnswer, setStreamedAnswer] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState('');
  const [history, setHistory] = useState<SummaryEntry[]>([]);
  const [activeHistoryId, setActiveHistoryId] = useState<string | null>(null);
  const abortRef = useRef<AbortController | undefined>(undefined);

  const activeHistoryEntry = history.find((h) => h.id === activeHistoryId);
  const displayAnswer = activeHistoryEntry ? activeHistoryEntry.answer : streamedAnswer;

  const handleSummarize = async () => {
    if (!notes.trim()) {
      setError('Please paste your notes before summarizing');
      return;
    }
    if (!selectedSubject) {
      setError('Please select a subject first');
      return;
    }

    // Abort any in-flight request
    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;

    setError('');
    setStreamedAnswer('');
    setActiveHistoryId(null);
    setIsStreaming(true);

    let accumulated = '';
    try {
      for await (const chunk of streamQuery(
        {
          query: `Summarize these notes on ${selectedTopicName || selectedSubjectName || 'the selected topic'}`,
          workflow: 'summarize',
          notes: notes.trim(),
          subject: selectedSubject || undefined,
          topic: selectedTopic || undefined,
        },
        ctrl.signal,
      )) {
        accumulated += chunk;
        setStreamedAnswer(accumulated);
      }

      if (accumulated) {
        const entry: SummaryEntry = {
          id: Date.now().toString(),
          notesExcerpt: notes.slice(0, 80).trim() + (notes.length > 80 ? '…' : ''),
          answer: accumulated,
          timestamp: new Date(),
        };
        setHistory((prev) => [entry, ...prev]);
      } else {
        setError('No summary returned. Please try again.');
      }
    } catch (err: any) {
      if (!ctrl.signal.aborted) {
        setError(err.message || 'Failed to summarize notes. Please try again.');
      }
    } finally {
      setIsStreaming(false);
      abortRef.current = undefined;
    }
  };

  const handleClear = () => {
    abortRef.current?.abort();
    setNotes('');
    setStreamedAnswer('');
    setError('');
    setActiveHistoryId(null);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-4 focus:ring-blue-300 rounded-lg px-3 py-2 -ml-3 mb-3"
            aria-label="Go back to chat"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            <span className="text-sm">Back to Chat</span>
          </button>

          <div className="flex items-center gap-3 mb-2">
            <div className="bg-purple-100 p-2 rounded-lg">
              <FileText className="w-6 h-6 text-purple-600" aria-hidden="true" />
            </div>
            <h1 className="text-2xl font-semibold text-gray-900">Notes Summarization</h1>
          </div>
          <p className="text-gray-600">
            Paste your notes below and get a concise, structured summary streamed in real time
          </p>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 sm:py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Subject & Topic */}
          {selectedSubjectName && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-900">
                <span className="font-medium">Subject:</span> {selectedSubjectName}
                {selectedTopicName && (
                  <>
                    {' • '}
                    <span className="font-medium">Topic:</span> {selectedTopicName}
                  </>
                )}
              </p>
            </div>
          )}

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 rounded-lg p-4"
              role="alert"
            >
              <p className="text-sm text-red-900 font-medium">{error}</p>
              <p className="text-sm text-red-700 mt-1">
                {error.includes('subject')
                  ? 'Select a subject from the header to continue.'
                  : 'Add some content to your notes and try again.'}
              </p>
            </motion.div>
          )}

          {/* Notes input */}
          <div>
            <label htmlFor="notes-input" className="block mb-2 text-gray-900 font-medium">
              Your Notes
            </label>
            <p className="text-sm text-gray-600 mb-3" id="notes-helper">
              Paste your lecture notes, textbook excerpts, or study material here.
            </p>
            <textarea
              id="notes-input"
              value={notes}
              onChange={(e) => {
                setNotes(e.target.value);
                setError('');
              }}
              placeholder="Paste your notes here… (minimum 50 characters recommended)"
              rows={10}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-4 focus:ring-blue-300 focus:border-blue-500 text-gray-900 placeholder-gray-400"
              aria-describedby="notes-helper"
              disabled={isStreaming}
            />
            <div className="flex items-center justify-between mt-2">
              <p className="text-sm text-gray-500">{notes.length} characters</p>
              {notes.length > 0 && (
                <button
                  onClick={handleClear}
                  disabled={isStreaming}
                  className="text-sm text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-4 focus:ring-blue-300 rounded px-2 py-1"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Action button */}
          <button
            onClick={handleSummarize}
            disabled={!notes.trim() || isStreaming || !selectedSubject}
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Summarize notes"
          >
            {isStreaming ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
                <span>Summarizing…</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" aria-hidden="true" />
                <span>Summarize Notes</span>
              </>
            )}
          </button>

          {/* Streaming / current summary output */}
          <AnimatePresence>
            {(streamedAnswer || isStreaming) && !activeHistoryId && (
              <motion.div
                key="current-summary"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="bg-white border-2 border-green-200 rounded-xl p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-green-100 p-2 rounded-lg">
                    {isStreaming ? (
                      <Loader2 className="w-6 h-6 text-green-600 animate-spin" aria-hidden="true" />
                    ) : (
                      <CheckCircle2 className="w-6 h-6 text-green-600" aria-hidden="true" />
                    )}
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {isStreaming ? 'Generating summary…' : 'Summary'}
                  </h2>
                </div>

                <div
                  className="prose prose-sm max-w-none text-gray-900 leading-relaxed"
                  aria-live="polite"
                  aria-atomic="false"
                >
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{streamedAnswer}</ReactMarkdown>
                  {isStreaming && (
                    <span className="inline-block w-1.5 h-4 ml-0.5 bg-blue-500 animate-pulse rounded-sm align-middle" aria-hidden="true" />
                  )}
                </div>

                {!isStreaming && streamedAnswer && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <p className="text-sm text-gray-600">
                      💡 <span className="font-medium">Tip:</span> Review these key points regularly for effective retention.
                    </p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Previous summaries (session history) */}
          {history.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-400" aria-hidden="true" />
                Previous summaries this session
              </h3>
              {history.map((entry) => (
                <div
                  key={entry.id}
                  className={`border rounded-xl overflow-hidden transition-colors ${
                    activeHistoryId === entry.id
                      ? 'border-blue-400 bg-blue-50'
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  <button
                    onClick={() =>
                      setActiveHistoryId((prev) => (prev === entry.id ? null : entry.id))
                    }
                    className="w-full flex items-center justify-between px-4 py-3 text-left focus:outline-none focus:ring-4 focus:ring-blue-300 rounded-xl"
                    aria-expanded={activeHistoryId === entry.id}
                  >
                    <span className="text-sm text-gray-700 truncate max-w-[75%]">
                      {entry.notesExcerpt}
                    </span>
                    <span className="text-xs text-gray-400 shrink-0 ml-2">
                      {entry.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </button>

                  <AnimatePresence>
                    {activeHistoryId === entry.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-4 prose prose-sm max-w-none text-gray-900 leading-relaxed border-t border-blue-100 pt-3">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>{entry.answer}</ReactMarkdown>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
