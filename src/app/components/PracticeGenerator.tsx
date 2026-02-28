import { useState, useRef } from 'react';
import { ListChecks, Sparkles, Loader2, CheckCircle2, ArrowLeft, Clock } from 'lucide-react';
import { TopicSelector } from './molecules/TopicSelector';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { streamQuery } from '../../lib/api';
import type { ContentItem } from './molecules/SubjectSelector';

interface PracticeGeneratorProps {
  selectedSubject: string;
  selectedSubjectName: string;
  selectedTopic: string;
  selectedTopicName: string;
  onBack: () => void;
  topics: ContentItem[];
}

type Difficulty = 'Easy' | 'Medium' | 'Hard';
type QuestionType = 'MCQ' | 'Short Answer' | 'Long Answer';

interface GeneratedQuestion {
  id: string;
  question: string;
  type: QuestionType | string;
  options?: string[] | null;
  answer?: string;
}

interface HistoryEntry {
  id: string;
  label: string;
  questions: GeneratedQuestion[];
  rawAnswer: string;
  timestamp: Date;
}

const QUESTION_TYPE_MAP: Record<QuestionType, string> = {
  'MCQ': 'mcq',
  'Short Answer': 'short',
  'Long Answer': 'long',
};

function parseQuestions(raw: string): GeneratedQuestion[] {
  try {
    const jsonMatch = raw.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      const arr = JSON.parse(jsonMatch[0]);
      if (Array.isArray(arr) && arr.length > 0) {
        return arr.map((q: any, i: number) => ({
          id: `q-${i}`,
          question: q.question || `Question ${i + 1}`,
          type:
            q.type === 'mcq'
              ? 'MCQ'
              : q.type === 'short'
              ? 'Short Answer'
              : q.type === 'long'
              ? 'Long Answer'
              : q.type,
          options: Array.isArray(q.options) ? q.options : undefined,
          answer: q.answer || undefined,
        }));
      }
    }
  } catch {
    /* not valid JSON */
  }
  return [];
}

export function PracticeGenerator({
  selectedSubject,
  selectedSubjectName,
  selectedTopic,
  selectedTopicName,
  onBack,
  topics,
}: PracticeGeneratorProps) {
  const [localTopic, setLocalTopic] = useState(selectedTopic);
  const [difficulty, setDifficulty] = useState<Difficulty>('Medium');
  const [questionType, setQuestionType] = useState<QuestionType>('MCQ');
  const [numQuestions, setNumQuestions] = useState(5);

  const [questions, setQuestions] = useState<GeneratedQuestion[]>([]);
  const [rawStream, setRawStream] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState('');
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [activeHistoryId, setActiveHistoryId] = useState<string | null>(null);

  const abortRef = useRef<AbortController | undefined>(undefined);

  const localTopicName = topics.find((t) => t.id === localTopic)?.name ?? localTopic;
  const activeEntry = history.find((h) => h.id === activeHistoryId);

  const displayQuestions = activeEntry ? activeEntry.questions : questions;
  const displayRaw = activeEntry ? activeEntry.rawAnswer : rawStream;

  const handleGenerate = async () => {
    if (!selectedSubject) {
      setError('Please select a subject first');
      return;
    }
    if (!localTopic) {
      setError('Please select a topic to generate questions');
      return;
    }

    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;

    setError('');
    setIsStreaming(true);
    setQuestions([]);
    setRawStream('');
    setActiveHistoryId(null);

    let accumulated = '';
    try {
      for await (const chunk of streamQuery(
        {
          query: `Generate practice questions on ${localTopicName}`,
          workflow: 'generate',
          subject: selectedSubject || undefined,
          topic: localTopic || undefined,
          difficulty: difficulty.toLowerCase(),
          question_type: QUESTION_TYPE_MAP[questionType] || 'mixed',
          num_questions: numQuestions,
        },
        ctrl.signal,
      )) {
        accumulated += chunk;
        setRawStream(accumulated);
      }

      const parsed = parseQuestions(accumulated);
      if (parsed.length > 0) {
        setQuestions(parsed);
        const entry: HistoryEntry = {
          id: Date.now().toString(),
          label: `${numQuestions} ${questionType} · ${difficulty} · ${localTopicName}`,
          questions: parsed,
          rawAnswer: accumulated,
          timestamp: new Date(),
        };
        setHistory((prev) => [entry, ...prev]);
      } else if (accumulated) {
        // LLM returned prose instead of JSON — show as a single entry
        const fallback: GeneratedQuestion[] = [{ id: 'q-0', question: accumulated, type: 'Long Answer' }];
        setQuestions(fallback);
        const entry: HistoryEntry = {
          id: Date.now().toString(),
          label: `${localTopicName} · ${difficulty}`,
          questions: fallback,
          rawAnswer: accumulated,
          timestamp: new Date(),
        };
        setHistory((prev) => [entry, ...prev]);
      } else {
        setError('No questions generated. Please try again.');
      }
    } catch (err: any) {
      if (!ctrl.signal.aborted) {
        setError(err.message || 'Failed to generate questions. Please try again.');
      }
    } finally {
      setIsStreaming(false);
      abortRef.current = undefined;
    }
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
            <div className="bg-orange-100 p-2 rounded-lg">
              <ListChecks className="w-6 h-6 text-orange-600" aria-hidden="true" />
            </div>
            <h1 className="text-2xl font-semibold text-gray-900">Practice Question Generator</h1>
          </div>
          <p className="text-gray-600">Generate custom practice questions — streamed in real time</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 sm:py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {selectedSubjectName && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-900">
                <span className="font-medium">Subject:</span> {selectedSubjectName}
              </p>
            </div>
          )}

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
                  : 'Select a topic from the dropdown below.'}
              </p>
            </motion.div>
          )}

          {/* Settings */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-6">
            <h2 className="text-lg font-semibold text-gray-900">Question Settings</h2>

            <TopicSelector
              value={localTopic}
              onValueChange={(v) => {
                setLocalTopic(v);
                setError('');
              }}
              topics={topics}
              disabled={!selectedSubject}
              id="practice-topic-selector"
            />

            {/* Difficulty */}
            <div>
              <label className="block mb-2 text-gray-900 font-medium">Difficulty Level</label>
              <div className="grid grid-cols-3 gap-3">
                {(['Easy', 'Medium', 'Hard'] as Difficulty[]).map((level) => (
                  <button
                    key={level}
                    onClick={() => setDifficulty(level)}
                    className={`px-4 py-3 rounded-lg border-2 transition-all focus:outline-none focus:ring-4 focus:ring-blue-300 ${
                      difficulty === level
                        ? 'bg-blue-50 border-blue-600 text-blue-900'
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                    aria-pressed={difficulty === level}
                    aria-label={`Set difficulty to ${level}`}
                  >
                    <span className="font-medium">{level}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Question Type */}
            <div>
              <label className="block mb-2 text-gray-900 font-medium">Question Type</label>
              <div className="space-y-2">
                {(['MCQ', 'Short Answer', 'Long Answer'] as QuestionType[]).map((type) => (
                  <button
                    key={type}
                    onClick={() => setQuestionType(type)}
                    className={`w-full px-4 py-3 rounded-lg border-2 text-left transition-all focus:outline-none focus:ring-4 focus:ring-blue-300 ${
                      questionType === type
                        ? 'bg-blue-50 border-blue-600 text-blue-900'
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                    aria-pressed={questionType === type}
                    aria-label={`Set question type to ${type}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{type}</span>
                      {questionType === type && (
                        <div className="w-2 h-2 rounded-full bg-blue-600" aria-hidden="true" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Number of Questions */}
            <div>
              <label htmlFor="num-questions" className="block mb-2 text-gray-900 font-medium">
                Number of Questions
              </label>
              <input
                type="number"
                id="num-questions"
                min="1"
                max="20"
                value={numQuestions}
                onChange={(e) =>
                  setNumQuestions(Math.max(1, Math.min(20, parseInt(e.target.value) || 1)))
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-300 focus:border-blue-500 text-gray-900"
                aria-describedby="num-questions-helper"
              />
              <p id="num-questions-helper" className="text-sm text-gray-500 mt-1.5">
                Generate between 1 and 20 questions
              </p>
            </div>
          </div>

          {/* Generate button */}
          <button
            onClick={handleGenerate}
            disabled={!localTopic || isStreaming || !selectedSubject}
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Generate practice questions"
          >
            {isStreaming ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
                <span>Generating questions…</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" aria-hidden="true" />
                <span>Generate Questions</span>
              </>
            )}
          </button>

          {/* Streaming progress — show raw tokens while LLM is generating */}
          <AnimatePresence>
            {isStreaming && rawStream && (
              <motion.div
                key="streaming-progress"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-white border border-gray-200 rounded-xl p-5"
                aria-live="polite"
                aria-atomic="false"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Loader2 className="w-4 h-4 text-blue-600 animate-spin" aria-hidden="true" />
                  <span className="text-sm font-medium text-gray-600">
                    Receiving questions from AI…
                  </span>
                </div>
                <pre className="text-xs text-gray-500 font-mono whitespace-pre-wrap break-all max-h-48 overflow-y-auto">
                  {rawStream}
                  <span className="inline-block w-1.5 h-3 ml-0.5 bg-blue-500 animate-pulse rounded-sm align-middle" aria-hidden="true" />
                </pre>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Final questions output */}
          <AnimatePresence>
            {displayQuestions.length > 0 && !isStreaming && (
              <motion.div
                key={activeHistoryId ?? 'current'}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="bg-white border-2 border-green-200 rounded-xl p-6"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <CheckCircle2 className="w-6 h-6 text-green-600" aria-hidden="true" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Generated Questions</h2>
                    <p className="text-sm text-gray-600">
                      {displayQuestions.length} {questionType} questions · {difficulty} difficulty
                    </p>
                  </div>
                </div>

                {/* If questions parsed as JSON, render cards; otherwise render as markdown */}
                {displayQuestions.length === 1 && displayQuestions[0].type === 'Long Answer' && !displayQuestions[0].options ? (
                  <div className="prose prose-sm max-w-none text-gray-900">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{displayQuestions[0].question}</ReactMarkdown>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {displayQuestions.map((q, index) => (
                      <QuestionCard key={q.id} question={q} index={index} />
                    ))}
                  </div>
                )}

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <p className="text-sm text-gray-600">
                    💡 <span className="font-medium">Tip:</span> Practice regularly and check your answers to improve exam performance.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Session history */}
          {history.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-400" aria-hidden="true" />
                Previous sets this session
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
                    <span className="text-sm text-gray-700 truncate max-w-[75%]">{entry.label}</span>
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
                        <div className="px-4 pb-4 space-y-4 border-t border-blue-100 pt-3">
                          {entry.questions.length === 1 && entry.questions[0].type === 'Long Answer' && !entry.questions[0].options ? (
                            <div className="prose prose-sm max-w-none text-gray-900">
                              <ReactMarkdown remarkPlugins={[remarkGfm]}>{entry.questions[0].question}</ReactMarkdown>
                            </div>
                          ) : (
                            entry.questions.map((q, index) => (
                              <QuestionCard key={q.id} question={q} index={index} />
                            ))
                          )}
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

function QuestionCard({ question, index }: { question: GeneratedQuestion; index: number }) {
  const [showAnswer, setShowAnswer] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="border border-gray-200 rounded-lg p-5"
    >
      <div className="flex items-start gap-3 mb-3">
        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-sm font-semibold text-blue-600">{index + 1}</span>
        </div>
        <p className="flex-1 text-gray-900 leading-relaxed">{question.question}</p>
      </div>

      {question.options && (
        <div className="ml-11 space-y-2 mb-4">
          {question.options.map((option, i) => (
            <div key={i} className="flex items-start gap-2 text-gray-700">
              <span className="font-medium">{String.fromCharCode(65 + i)}.</span>
              <span>{option}</span>
            </div>
          ))}
        </div>
      )}

      {question.answer && (
        <div className="ml-11">
          <button
            onClick={() => setShowAnswer(!showAnswer)}
            className="text-sm text-blue-600 hover:text-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 rounded px-2 py-1"
            aria-expanded={showAnswer}
          >
            {showAnswer ? 'Hide Answer' : 'Show Answer'}
          </button>

          <AnimatePresence>
            {showAnswer && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg overflow-hidden"
              >
                <p className="text-sm font-medium text-green-900 mb-1">Answer:</p>
                <p className="text-sm text-green-800">{question.answer}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}
