import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, FileText, ListChecks, Loader2, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

interface ChatInterfaceProps {
  selectedSubject: string;
  selectedTopic: string;
  examMode: '2-mark' | '5-mark' | '10-mark';
  onSwitchToNotes: () => void;
  onSwitchToPractice: () => void;
}

export function ChatInterface({
  selectedSubject,
  selectedTopic,
  examMode,
  onSwitchToNotes,
  onSwitchToPractice,
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    if (!selectedSubject) {
      // Show error for missing subject
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: generateMockResponse(input, examMode, selectedTopic),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-gray-50">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {messages.length === 0 ? (
            <EmptyState
              selectedSubject={selectedSubject}
              onSwitchToNotes={onSwitchToNotes}
              onSwitchToPractice={onSwitchToPractice}
            />
          ) : (
            <div className="space-y-6">
              {messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}
              {isLoading && <LoadingIndicator />}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 bg-white px-6 py-6">
        <div className="max-w-4xl mx-auto">
          {!selectedSubject && (
            <div 
              className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-3"
              role="alert"
            >
              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <p className="text-sm text-yellow-900 font-medium">
                  Please select a subject to continue
                </p>
                <p className="text-sm text-yellow-700 mt-1">
                  Choose a subject from the header to start asking questions.
                </p>
              </div>
            </div>
          )}
          
          <div className="relative">
            <label htmlFor="chat-input" className="sr-only">
              Ask a syllabus-related question
            </label>
            <textarea
              id="chat-input"
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={!selectedSubject || isLoading}
              placeholder="Ask a syllabus-related question…"
              rows={3}
              className="w-full px-4 py-3 pr-24 border-2 border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-4 focus:ring-blue-300 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 placeholder-gray-400"
              aria-describedby="input-helper"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || !selectedSubject || isLoading}
              className="absolute bottom-3 right-3 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Send message"
            >
              <Send className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>
          
          <p id="input-helper" className="text-sm text-gray-500 mt-2">
            Press Enter to send, Shift+Enter for new line
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 mt-4">
            <ActionButton
              icon={<Sparkles className="w-4 h-4" aria-hidden="true" />}
              label="Explain Concept"
              onClick={() => {
                setInput('Can you explain ');
                inputRef.current?.focus();
              }}
              disabled={!selectedSubject}
            />
            <ActionButton
              icon={<FileText className="w-4 h-4" aria-hidden="true" />}
              label="Summarize Notes"
              onClick={onSwitchToNotes}
              disabled={!selectedSubject}
            />
            <ActionButton
              icon={<ListChecks className="w-4 h-4" aria-hidden="true" />}
              label="Generate Practice Questions"
              onClick={onSwitchToPractice}
              disabled={!selectedSubject}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function EmptyState({
  selectedSubject,
  onSwitchToNotes,
  onSwitchToPractice,
}: {
  selectedSubject: string;
  onSwitchToNotes: () => void;
  onSwitchToPractice: () => void;
}) {
  return (
    <div className="text-center py-12">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
        <Sparkles className="w-8 h-8 text-blue-600" aria-hidden="true" />
      </div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-3">
        {selectedSubject ? `Ready to learn ${selectedSubject}?` : 'Welcome to SyllabiQ'}
      </h2>
      <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
        {selectedSubject
          ? 'Ask me anything about your syllabus, and I\'ll provide exam-focused answers.'
          : 'Select a subject to start your learning journey with AI-powered assistance.'}
      </p>
      
      {selectedSubject && (
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={onSwitchToNotes}
            className="px-6 py-3 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-colors text-gray-700"
          >
            Summarize Notes
          </button>
          <button
            onClick={onSwitchToPractice}
            className="px-6 py-3 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-colors text-gray-700"
          >
            Generate Practice Questions
          </button>
        </div>
      )}
    </div>
  );
}

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.type === 'user';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`max-w-[80%] rounded-2xl px-5 py-4 ${
          isUser
            ? 'bg-blue-600 text-white'
            : 'bg-white text-gray-900 border border-gray-200'
        }`}
      >
        {!isUser && (
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-blue-600" aria-hidden="true" />
            <span className="text-sm font-medium text-blue-600">SyllabiQ AI</span>
          </div>
        )}
        <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
        <p
          className={`text-xs mt-2 ${
            isUser ? 'text-blue-100' : 'text-gray-500'
          }`}
        >
          {message.timestamp.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
      </div>
    </motion.div>
  );
}

function LoadingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex justify-start"
    >
      <div className="bg-white border border-gray-200 rounded-2xl px-5 py-4">
        <div className="flex items-center gap-3">
          <Loader2 className="w-5 h-5 text-blue-600 animate-spin" aria-hidden="true" />
          <span className="text-gray-600">Generating syllabus‑aligned answer…</span>
        </div>
      </div>
    </motion.div>
  );
}

function ActionButton({
  icon,
  label,
  onClick,
  disabled,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-gray-700"
      aria-label={label}
    >
      {icon}
      <span className="text-sm">{label}</span>
    </button>
  );
}

function generateMockResponse(query: string, examMode: string, topic: string): string {
  const responses = {
    '2-mark': `Here's a concise answer for your ${examMode} question:\n\n${topic ? `Related to ${topic}: ` : ''}This is a brief, focused response that directly addresses your query about "${query}". The answer is structured to be clear and to-the-point, suitable for a 2-mark exam question.\n\nKey points:\n• Main concept explained\n• Direct answer provided`,
    '5-mark': `Here's a detailed explanation for your ${examMode} question:\n\n${topic ? `Topic: ${topic}\n\n` : ''}Regarding "${query}":\n\n1. Introduction: This concept is fundamental to understanding the subject matter.\n\n2. Main Explanation: The core idea involves several interconnected aspects that work together to form a comprehensive understanding.\n\n3. Key Points:\n   • First important aspect\n   • Second critical element\n   • Third essential component\n\n4. Conclusion: This provides a solid foundation for exam preparation.`,
    '10-mark': `Here's a comprehensive answer for your ${examMode} question:\n\n${topic ? `Topic: ${topic}\n\n` : ''}Detailed Analysis of "${query}":\n\n1. INTRODUCTION\nThis topic is crucial for understanding the broader concepts in your syllabus. It connects multiple areas of study and requires thorough comprehension.\n\n2. THEORETICAL BACKGROUND\nThe foundational principles include several key theories and concepts that have been developed over time.\n\n3. DETAILED EXPLANATION\n   a) First Major Point:\n      - Subpoint with detailed explanation\n      - Supporting evidence and examples\n      - Practical applications\n   \n   b) Second Major Point:\n      - Comprehensive breakdown\n      - Interconnections with other concepts\n      - Real-world relevance\n   \n   c) Third Major Point:\n      - Advanced considerations\n      - Critical analysis\n      - Contemporary perspectives\n\n4. PRACTICAL APPLICATIONS\nHow this concept applies in real-world scenarios and its relevance to your field of study.\n\n5. IMPORTANT CONSIDERATIONS\n• Key takeaways for exam preparation\n• Common misconceptions to avoid\n• Tips for remembering this concept\n\n6. CONCLUSION\nSummary of the main points and their significance in the context of your syllabus.`,
  };

  return responses[examMode as keyof typeof responses] || responses['5-mark'];
}