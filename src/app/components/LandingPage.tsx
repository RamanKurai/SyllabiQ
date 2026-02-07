import { BookOpen, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface LandingPageProps {
  onGetStarted: () => void;
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  const scrollToHowItWorks = () => {
    document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Left Content */}
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-blue-600" aria-hidden="true" />
              <span className="text-sm text-blue-900">AI-Powered Learning Assistant</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-gray-900 mb-6 leading-tight">
              SyllabiQ
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-700 mb-8">
              Syllabus‑Aware AI for Smarter Exam Preparation
            </p>
            
            <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto lg:mx-0">
              Your intelligent study companion that understands your syllabus, helps you prepare for exams, and provides personalized learning support tailored to your curriculum.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button
                onClick={onGetStarted}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-colors"
                aria-label="Start learning with SyllabiQ"
              >
                <span>Start Learning</span>
                <ArrowRight className="w-5 h-5" aria-hidden="true" />
              </button>
              
              <button
                onClick={scrollToHowItWorks}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-gray-700 border-2 border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-gray-300 transition-colors"
                aria-label="Learn how SyllabiQ works"
              >
                <span>How it Works</span>
              </button>
            </div>
          </div>
          
          {/* Right Image */}
          <div className="flex-1 w-full max-w-lg">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-200 rounded-3xl transform rotate-3"></div>
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1758875630351-b65d256e4dfe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwc3R1ZHlpbmclMjBib29rcyUyMGFpJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NzA0NjU0OTh8MA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Student studying with AI technology and books"
                className="relative rounded-3xl shadow-2xl w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-semibold text-center text-gray-900 mb-4">
            Everything You Need to Succeed
          </h2>
          <p className="text-lg text-gray-600 text-center mb-16 max-w-2xl mx-auto">
            SyllabiQ provides comprehensive support for your academic journey
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<BookOpen className="w-8 h-8 text-blue-600" aria-hidden="true" />}
              title="Syllabus-Based Q&A"
              description="Ask questions aligned with your course syllabus and get accurate, relevant answers"
            />
            <FeatureCard
              icon={<Sparkles className="w-8 h-8 text-purple-600" aria-hidden="true" />}
              title="Exam-Oriented Explanations"
              description="Get explanations formatted for 2-mark, 5-mark, and 10-mark exam questions"
            />
            <FeatureCard
              icon={<BookOpen className="w-8 h-8 text-green-600" aria-hidden="true" />}
              title="Notes Summarization"
              description="Transform lengthy notes into clear, concise bullet points for quick revision"
            />
            <FeatureCard
              icon={<CheckCircle2 className="w-8 h-8 text-orange-600" aria-hidden="true" />}
              title="Practice Questions"
              description="Generate custom practice questions by topic, difficulty, and question type"
            />
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div id="how-it-works" className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-semibold text-center text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-lg text-gray-600 text-center mb-16 max-w-2xl mx-auto">
            Get started in three simple steps
          </p>
          
          <div className="max-w-4xl mx-auto space-y-12">
            <StepCard
              number="1"
              title="Select Your Subject & Topic"
              description="Choose your subject and the specific unit or topic you want to study from your syllabus"
            />
            <StepCard
              number="2"
              title="Choose Your Learning Mode"
              description="Ask questions, summarize notes, or generate practice questions based on your needs"
            />
            <StepCard
              number="3"
              title="Learn and Prepare"
              description="Get AI-powered assistance tailored to your syllabus and exam requirements"
            />
          </div>
          
          <div className="text-center mt-16">
            <button
              onClick={onGetStarted}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-colors"
              aria-label="Get started with SyllabiQ now"
            >
              <span>Get Started Now</span>
              <ArrowRight className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>&copy; 2026 SyllabiQ. Your AI learning companion for smarter exam preparation.</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

function StepCard({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div className="flex gap-6 items-start">
      <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-semibold">
        {number}
      </div>
      <div className="flex-1">
        <h3 className="text-2xl font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-lg text-gray-600">{description}</p>
      </div>
    </div>
  );
}
