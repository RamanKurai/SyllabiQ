import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Label } from "../ui/label";
import { cn } from "../ui/utils";
import type { ContentItem } from "./SubjectSelector";

interface TopicSelectorProps {
  value: string;
  onValueChange: (value: string) => void;
  topics: ContentItem[];
  disabled?: boolean;
  id?: string;
  /** Compact layout for narrow sidebars */
  compact?: boolean;
}

export function TopicSelector({
  value,
  onValueChange,
  topics,
  disabled = false,
  id = "topic-selector",
  compact,
}: TopicSelectorProps) {
  return (
    <div className={cn("space-y-2 w-full min-w-0", compact && "space-y-1.5")}>
      <Label htmlFor={id} className={compact ? "text-xs" : undefined}>Topic / Unit</Label>
      <Select
        value={value || "__none__"}
        onValueChange={(v) => onValueChange(v === "__none__" ? "" : v)}
        disabled={disabled}
      >
        <SelectTrigger id={id} aria-label="Select topic or unit">
          <SelectValue placeholder="Select Topic" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="__none__">Select Topic</SelectItem>
          {topics.map((topic) => (
            <SelectItem key={topic.id} value={topic.id}>
              {topic.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {disabled && (
        <p id={`${id}-helper`} className="text-sm text-muted-foreground">
          Please select a subject first
        </p>
      )}
    </div>
  );
}
