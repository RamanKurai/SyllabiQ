import { useState } from 'react';
import { FileText, Sparkles, Loader2, CheckCircle2, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';

interface NotesSummarizerProps {
  selectedSubject: string;
  selectedTopic: string;
  onBack: () => void;
}

export function NotesSummarizer({ selectedSubject, selectedTopic, onBack }: NotesSummarizerProps) {
  const [notes, setNotes] = useState('');
  const [summary, setSummary] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSummarize = async () => {
    if (!notes.trim()) {
      setError('Please paste your notes before summarizing');
      return;
    }

    if (!selectedSubject) {
      setError('Please select a subject first');
      return;
    }

    setError('');
    setIsLoading(true);
    setSummary([]);

    // Simulate AI processing
    setTimeout(() => {
      const mockSummary = [
        'Core concept: ' + (selectedTopic || 'Key topic') + ' encompasses fundamental principles essential for understanding',
        'Main definition: The primary theory explains the relationship between various components',
        'Key characteristics: Multiple interconnected elements work together systematically',
        'Important formula/rule: Mathematical or logical framework that governs the concept',
        'Practical application: Real-world usage in solving problems and understanding scenarios',
        'Common examples: Typical instances that illustrate the concept clearly',
        'Related concepts: Connected topics that expand understanding',
        'Exam tip: Focus on understanding the underlying principles rather than memorization',
      ];
      setSummary(mockSummary);
      setIsLoading(false);
    }, 2000);
  };

  const handleClear = () => {
    setNotes('');
    setSummary([]);
    setError('');
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
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
            Paste your notes below and get a concise, bullet-point summary for quick revision
          </p>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto px-6 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Subject & Topic Display */}
          {selectedSubject && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-900">
                <span className="font-medium">Subject:</span> {selectedSubject}
                {selectedTopic && (
                  <>
                    {' • '}
                    <span className="font-medium">Topic:</span> {selectedTopic}
                  </>
                )}
              </p>
            </div>
          )}

          {/* Error Message */}
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

          {/* Input Section */}
          <div>
            <label htmlFor="notes-input" className="block mb-2 text-gray-900">
              Your Notes
            </label>
            <p className="text-sm text-gray-600 mb-3" id="notes-helper">
              Paste your lecture notes, textbook excerpts, or study material here. 
              The AI will extract key points and create a structured summary.
            </p>
            <textarea
              id="notes-input"
              value={notes}
              onChange={(e) => {
                setNotes(e.target.value);
                setError('');
              }}
              placeholder="Paste your notes here... (minimum 50 characters recommended)"
              rows={12}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-4 focus:ring-blue-300 focus:border-blue-500 text-gray-900 placeholder-gray-400"
              aria-describedby="notes-helper"
              disabled={isLoading}
            />
            <div className="flex items-center justify-between mt-2">
              <p className="text-sm text-gray-500">
                {notes.length} characters
              </p>
              {notes.length > 0 && (
                <button
                  onClick={handleClear}
                  disabled={isLoading}
                  className="text-sm text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-4 focus:ring-blue-300 rounded px-2 py-1"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={handleSummarize}
            disabled={!notes.trim() || isLoading || !selectedSubject}
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Summarize notes"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
                <span>Analyzing and summarizing...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" aria-hidden="true" />
                <span>Summarize Notes</span>
              </>
            )}
          </button>

          {/* Summary Output */}
          {summary.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white border-2 border-green-200 rounded-xl p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-green-100 p-2 rounded-lg">
                  <CheckCircle2 className="w-6 h-6 text-green-600" aria-hidden="true" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Summary</h2>
              </div>
              
              <p className="text-sm text-gray-600 mb-4">
                Key points extracted from your notes:
              </p>
              
              <ul className="space-y-3" role="list">
                {summary.map((point, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-start gap-3 text-gray-900"
                  >
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-medium text-blue-600">
                        {index + 1}
                      </span>
                    </div>
                    <span className="flex-1 leading-relaxed">{point}</span>
                  </motion.li>
                ))}
              </ul>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  💡 <span className="font-medium">Tip:</span> Review these key points regularly for effective retention and exam preparation.
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
