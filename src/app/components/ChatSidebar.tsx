import { History, BookOpen, Target, FileText } from "lucide-react";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Separator } from "./ui/separator";
import { ScrollArea } from "./ui/scroll-area";
import { Badge } from "./ui/badge";

interface ChatSidebarProps {
  selectedSubject: string;
  onSubjectChange: (subject: string) => void;
  selectedTopic: string;
  onTopicChange: (topic: string) => void;
  examMode: string;
  onExamModeChange: (mode: string) => void;
}

const mockSubjects = [
  "Data Structures",
  "Database Management",
  "Operating Systems",
  "Computer Networks",
  "Software Engineering"
];

const mockTopics: Record<string, string[]> = {
  "Data Structures": ["Arrays", "Linked Lists", "Trees", "Graphs", "Hash Tables"],
  "Database Management": ["SQL", "Normalization", "Transactions", "Indexing", "ER Diagrams"],
  "Operating Systems": ["Processes", "Memory Management", "File Systems", "Deadlocks", "Scheduling"],
  "Computer Networks": ["OSI Model", "TCP/IP", "Routing", "Network Security", "Protocols"],
  "Software Engineering": ["SDLC", "Design Patterns", "Testing", "Agile", "UML Diagrams"]
};

const mockHistory = [
  { id: 1, query: "Explain binary search trees", time: "2 hours ago" },
  { id: 2, query: "What is normalization?", time: "Yesterday" },
  { id: 3, query: "Deadlock prevention methods", time: "2 days ago" },
];

export function ChatSidebar({
  selectedSubject,
  onSubjectChange,
  selectedTopic,
  onTopicChange,
  examMode,
  onExamModeChange
}: ChatSidebarProps) {
  const topics = selectedSubject ? mockTopics[selectedSubject] || [] : [];

  return (
    <aside className="flex h-full w-80 flex-col border-r bg-card">
      <div className="border-b p-4">
        <h2 className="flex items-center gap-2 font-semibold">
          <BookOpen className="h-5 w-5" aria-hidden="true" />
          Course Settings
        </h2>
      </div>

      <ScrollArea className="flex-1">
        <div className="space-y-6 p-4">
          {/* Subject Selection */}
          <div className="space-y-2">
            <Label htmlFor="subject-select">
              Subject
            </Label>
            <Select value={selectedSubject} onValueChange={onSubjectChange}>
              <SelectTrigger id="subject-select" aria-label="Select subject">
                <SelectValue placeholder="Select a subject" />
              </SelectTrigger>
              <SelectContent>
                {mockSubjects.map((subject) => (
                  <SelectItem key={subject} value={subject}>
                    {subject}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Choose the subject you're currently studying
            </p>
          </div>

          {/* Topic Selection */}
          <div className="space-y-2">
            <Label htmlFor="topic-select">
              Topic / Unit
            </Label>
            <Select 
              value={selectedTopic} 
              onValueChange={onTopicChange}
              disabled={!selectedSubject}
            >
              <SelectTrigger id="topic-select" aria-label="Select topic">
                <SelectValue placeholder="Select a topic" />
              </SelectTrigger>
              <SelectContent>
                {topics.map((topic) => (
                  <SelectItem key={topic} value={topic}>
                    {topic}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {!selectedSubject && (
              <p className="text-xs text-muted-foreground">
                Please select a subject first
              </p>
            )}
          </div>

          {/* Exam Mode */}
          <div className="space-y-2">
            <Label htmlFor="exam-mode-select" className="flex items-center gap-2">
              <Target className="h-4 w-4" aria-hidden="true" />
              Exam Mode
            </Label>
            <Select value={examMode} onValueChange={onExamModeChange}>
              <SelectTrigger id="exam-mode-select" aria-label="Select exam mode">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2-mark">2-Mark Questions</SelectItem>
                <SelectItem value="5-mark">5-Mark Questions</SelectItem>
                <SelectItem value="10-mark">10-Mark Questions</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              AI will tailor response length accordingly
            </p>
          </div>

          <Separator />

          {/* Query History */}
          <div className="space-y-3">
            <h3 className="flex items-center gap-2 font-semibold">
              <History className="h-4 w-4" aria-hidden="true" />
              Recent Queries
            </h3>
            <div className="space-y-2">
              {mockHistory.map((item) => (
                <button
                  key={item.id}
                  className="w-full rounded-lg border bg-background p-3 text-left text-sm transition-colors hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring"
                  aria-label={`View previous query: ${item.query}`}
                >
                  <p className="line-clamp-2 font-medium">{item.query}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{item.time}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>

      <div className="border-t p-4">
        <div className="rounded-lg bg-muted/50 p-3">
          <div className="flex items-start gap-2">
            <FileText className="mt-0.5 h-4 w-4 text-muted-foreground" aria-hidden="true" />
            <div className="flex-1">
              <p className="text-xs font-medium">Pro Tip</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Be specific about your syllabus topics for better answers
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
