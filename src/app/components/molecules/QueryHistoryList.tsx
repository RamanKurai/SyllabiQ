import { ChevronDown, Clock, FileText } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import { useState } from "react";
import { cn } from "../ui/utils";

export interface HistoryItem {
  id: string;
  query: string;
  timestamp: Date;
}

interface QueryHistoryListProps {
  history: HistoryItem[];
  onItemClick: (query: string) => void;
  defaultOpen?: boolean;
}

function formatTimestamp(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

export function QueryHistoryList({
  history,
  onItemClick,
  defaultOpen = true,
}: QueryHistoryListProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <Collapsible open={open} onOpenChange={setOpen} className="flex-1 overflow-hidden flex flex-col">
      <CollapsibleTrigger
        className="flex w-full items-center justify-between px-4 py-4 text-left hover:bg-accent/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset rounded-md"
        aria-expanded={open}
        aria-controls="history-list"
      >
        <div className="flex items-center gap-2">
          <Clock className="size-5 text-muted-foreground" aria-hidden />
          <span className="font-medium">Recent Queries</span>
        </div>
        <ChevronDown
          className={cn("size-5 text-muted-foreground transition-transform", open && "rotate-180")}
          aria-hidden
        />
      </CollapsibleTrigger>
      <CollapsibleContent id="history-list" className="flex-1 overflow-y-auto px-4 pb-4">
        {history.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">No recent queries yet</p>
        ) : (
          <div className="space-y-2">
            {history.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onItemClick(item.query)}
                className="w-full p-3 rounded-lg hover:bg-accent/50 text-left border border-border focus:outline-none focus-visible:ring-2 focus-visible:ring-ring group"
                aria-label={`View previous query: ${item.query}`}
              >
                <div className="flex items-start gap-2">
                  <FileText className="size-4 text-muted-foreground mt-0.5 shrink-0" aria-hidden />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm line-clamp-2 group-hover:text-primary">
                      {item.query}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatTimestamp(item.timestamp)}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
}
