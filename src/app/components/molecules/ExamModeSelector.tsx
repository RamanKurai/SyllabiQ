import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { cn } from "../ui/utils";

export type ExamMode = "2-mark" | "5-mark" | "10-mark";

const MODES: { value: ExamMode; label: string; description: string }[] = [
  { value: "2-mark", label: "2-mark", description: "Brief answers" },
  { value: "5-mark", label: "5-mark", description: "Moderate detail" },
  { value: "10-mark", label: "10-mark", description: "Detailed explanations" },
];

interface ExamModeSelectorProps {
  value: ExamMode;
  onValueChange: (value: ExamMode) => void;
  /** Compact layout for narrow sidebars */
  compact?: boolean;
}

export function ExamModeSelector({ value, onValueChange, compact }: ExamModeSelectorProps) {
  return (
    <div className={cn("space-y-2", !compact && "space-y-3")}>
      <Label className={compact ? "text-xs" : undefined}>Exam Mode</Label>
      {!compact && <p className="text-sm text-muted-foreground">Choose answer format length</p>}
      <RadioGroup
        value={value}
        onValueChange={(v) => onValueChange(v as ExamMode)}
        className="grid w-full gap-1.5 sm:gap-2"
        aria-label="Select exam mode"
      >
        {MODES.map((mode) => (
          <label
            key={mode.value}
            className={cn(
              "flex w-full min-w-0 cursor-pointer items-start gap-2 rounded-lg border-2 text-left transition-colors",
              compact ? "px-2.5 py-2 gap-2" : "px-4 py-3 gap-3",
              "hover:bg-accent/50 focus-within:ring-2 focus-within:ring-ring",
              value === mode.value
                ? "border-primary bg-primary/5"
                : "border-input bg-background"
            )}
          >
            <RadioGroupItem value={mode.value} className="mt-0.5 shrink-0" />
            <div className="flex-1 min-w-0">
              <span className={cn("font-medium", compact && "text-sm")}>{mode.label}</span>
              {!compact && <p className="text-sm text-muted-foreground mt-0.5">{mode.description}</p>}
            </div>
          </label>
        ))}
      </RadioGroup>
    </div>
  );
}
