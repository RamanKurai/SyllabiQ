import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
} from "../ui/sidebar";
import { TopicSelector } from "../molecules/TopicSelector";
import { SubjectSelector, type ContentItem } from "../molecules/SubjectSelector";
import { ExamModeSelector, type ExamMode } from "../molecules/ExamModeSelector";
import { QueryHistoryList, type HistoryItem } from "../molecules/QueryHistoryList";

interface StudentSidebarProps {
  selectedSubject: string;
  selectedTopic: string;
  examMode: ExamMode;
  subjects: ContentItem[];
  onSubjectChange: (subjectId: string) => void;
  onTopicChange: (topicId: string) => void;
  onExamModeChange: (mode: ExamMode) => void;
  topics: ContentItem[];
  history: HistoryItem[];
  onHistoryItemClick: (query: string) => void;
}

export function StudentSidebar({
  selectedSubject,
  selectedTopic,
  examMode,
  subjects,
  onSubjectChange,
  onTopicChange,
  onExamModeChange,
  topics,
  history,
  onHistoryItemClick,
}: StudentSidebarProps) {
  return (
    <SidebarContent className="flex flex-col">
      <SidebarGroup className="shrink-0 w-full min-w-0">
        <SidebarGroupContent className="space-y-4 px-3 py-3 w-full min-w-0">
          {/* Subject selector: visible on mobile only (header shows it on desktop) */}
          <div className="md:hidden space-y-2">
            <label htmlFor="subject-selector" className="text-xs font-medium text-sidebar-foreground/70">
              Subject
            </label>
            <SubjectSelector
              value={selectedSubject}
              onValueChange={onSubjectChange}
              options={subjects}
              placeholder="Select Subject"
              useDrawer
            />
          </div>
          <TopicSelector
            value={selectedTopic}
            onValueChange={onTopicChange}
            topics={topics}
            disabled={!selectedSubject}
            compact
          />
          <ExamModeSelector value={examMode} onValueChange={onExamModeChange} compact />
        </SidebarGroupContent>
      </SidebarGroup>
      {/* History: only on desktop; mobile drawer shows compact controls only */}
      <div className="hidden md:flex flex-1 flex-col min-h-0 border-t border-sidebar-border">
        <QueryHistoryList
          history={history}
          onItemClick={onHistoryItemClick}
          defaultOpen
        />
      </div>
    </SidebarContent>
  );
}
