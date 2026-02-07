import { useState } from 'react';
import { ListChecks, Sparkles, Loader2, CheckCircle2, ArrowLeft, ChevronDown } from 'lucide-react';
import { motion } from 'motion/react';

interface PracticeGeneratorProps {
  selectedSubject: string;
  selectedTopic: string;
  onBack: () => void;
  topics: string[];
}

type Difficulty = 'Easy' | 'Medium' | 'Hard';
type QuestionType = 'MCQ' | 'Short Answer' | 'Long Answer';

interface GeneratedQuestion {
  id: string;
  question: string;
  type: QuestionType;
  options?: string[];
  answer?: string;
}

export function PracticeGenerator({ selectedSubject, selectedTopic, onBack, topics }: PracticeGeneratorProps) {
  const [localTopic, setLocalTopic] = useState(selectedTopic);
  const [difficulty, setDifficulty] = useState<Difficulty>('Medium');
  const [questionType, setQuestionType] = useState<QuestionType>('MCQ');
  const [numQuestions, setNumQuestions] = useState(5);
  const [questions, setQuestions] = useState<GeneratedQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!selectedSubject) {
      setError('Please select a subject first');
      return;
    }

    if (!localTopic) {
      setError('Please select a topic to generate questions');
      return;
    }

    setError('');
    setIsLoading(true);
    setQuestions([]);

    // Simulate AI processing
    setTimeout(() => {
      const mockQuestions = generateMockQuestions(localTopic, difficulty, questionType, numQuestions);
      setQuestions(mockQuestions);
      setIsLoading(false);
    }, 2500);
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
            <div className="bg-orange-100 p-2 rounded-lg">
              <ListChecks className="w-6 h-6 text-orange-600" aria-hidden="true" />
            </div>
            <h1 className="text-2xl font-semibold text-gray-900">Practice Question Generator</h1>
          </div>
          <p className="text-gray-600">
            Generate custom practice questions tailored to your syllabus
          </p>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto px-6 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Subject Display */}
          {selectedSubject && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-900">
                <span className="font-medium">Subject:</span> {selectedSubject}
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
                  : 'Select a topic from the dropdown below.'}
              </p>
            </motion.div>
          )}

          {/* Configuration Section */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-6">
            <h2 className="text-lg font-semibold text-gray-900">Question Settings</h2>

            {/* Topic Selection */}
            <div>
              <label htmlFor="practice-topic-selector" className="block mb-2 text-gray-900">
                Topic / Unit
              </label>
              <div className="relative">
                <select
                  id="practice-topic-selector"
                  value={localTopic}
                  onChange={(e) => {
                    setLocalTopic(e.target.value);
                    setError('');
                  }}
                  disabled={!selectedSubject}
                  className="appearance-none w-full bg-gray-50 border border-gray-300 rounded-lg pl-4 pr-10 py-3 text-gray-900 focus:outline-none focus:ring-4 focus:ring-blue-300 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Select topic for practice questions"
                >
                  <option value="">Select Topic</option>
                  {topics.map((topic) => (
                    <option key={topic} value={topic}>
                      {topic}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" aria-hidden="true" />
              </div>
            </div>

            {/* Difficulty Selector */}
            <div>
              <label className="block mb-2 text-gray-900">
                Difficulty Level
              </label>
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

            {/* Question Type Selector */}
            <div>
              <label className="block mb-2 text-gray-900">
                Question Type
              </label>
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
                        <div className="w-2 h-2 rounded-full bg-blue-600" aria-hidden="true"></div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Number of Questions */}
            <div>
              <label htmlFor="num-questions" className="block mb-2 text-gray-900">
                Number of Questions
              </label>
              <input
                type="number"
                id="num-questions"
                min="1"
                max="20"
                value={numQuestions}
                onChange={(e) => setNumQuestions(Math.max(1, Math.min(20, parseInt(e.target.value) || 1)))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-300 focus:border-blue-500 text-gray-900"
                aria-describedby="num-questions-helper"
              />
              <p id="num-questions-helper" className="text-sm text-gray-500 mt-1.5">
                Generate between 1 and 20 questions
              </p>
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={!localTopic || isLoading || !selectedSubject}
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Generate practice questions"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
                <span>Generating questions...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" aria-hidden="true" />
                <span>Generate Questions</span>
              </>
            )}
          </button>

          {/* Questions Output */}
          {questions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white border-2 border-green-200 rounded-xl p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-green-100 p-2 rounded-lg">
                  <CheckCircle2 className="w-6 h-6 text-green-600" aria-hidden="true" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Generated Questions</h2>
                  <p className="text-sm text-gray-600">
                    {questions.length} {questionType} questions • {difficulty} difficulty
                  </p>
                </div>
              </div>
              
              <div className="space-y-6">
                {questions.map((q, index) => (
                  <QuestionCard key={q.id} question={q} index={index} />
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  💡 <span className="font-medium">Tip:</span> Practice these questions regularly and check your answers to improve exam performance.
                </p>
              </div>
            </motion.div>
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
      transition={{ duration: 0.3, delay: index * 0.1 }}
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
          
          {showAnswer && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg"
            >
              <p className="text-sm font-medium text-green-900 mb-1">Answer:</p>
              <p className="text-sm text-green-800">{question.answer}</p>
            </motion.div>
          )}
        </div>
      )}
    </motion.div>
  );
}

function generateMockQuestions(
  topic: string,
  difficulty: Difficulty,
  type: QuestionType,
  count: number
): GeneratedQuestion[] {
  const questions: GeneratedQuestion[] = [];

  for (let i = 0; i < count; i++) {
    if (type === 'MCQ') {
      questions.push({
        id: `q-${i}`,
        question: `What is the primary concept related to ${topic} that demonstrates ${difficulty.toLowerCase()} level understanding?`,
        type,
        options: [
          'First possible answer option',
          'Second plausible alternative',
          'Third reasonable choice',
          'Fourth option for consideration',
        ],
        answer: 'A. First possible answer option',
      });
    } else if (type === 'Short Answer') {
      questions.push({
        id: `q-${i}`,
        question: `Briefly explain the key aspects of ${topic} relevant to your syllabus. (2-5 marks)`,
        type,
        answer: `This answer should cover the fundamental concepts of ${topic}, including definitions, key principles, and basic applications. For ${difficulty.toLowerCase()} difficulty, ensure you understand the core theory and can provide clear examples.`,
      });
    } else {
      questions.push({
        id: `q-${i}`,
        question: `Discuss in detail the comprehensive understanding of ${topic}, including theoretical background, practical applications, and significance in the context of your course. (10-15 marks)`,
        type,
        answer: `A comprehensive answer should include: 1) Introduction to ${topic} 2) Theoretical framework 3) Detailed explanation of key concepts 4) Practical applications 5) Real-world examples 6) Critical analysis 7) Conclusion with summary. For ${difficulty.toLowerCase()} level, demonstrate deep understanding and analytical thinking.`,
      });
    }
  }

  return questions;
}
