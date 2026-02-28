import React from "react";
import { adminGet } from "../../hooks/useApi";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "../ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Skeleton } from "../ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { AlertCircle } from "lucide-react";

type AiKpiSummary = {
  total_queries: number;
  success_rate: number;
  avg_response_time_ms: number;
  avg_chunks_retrieved: number;
};

type UsageBreakdown = {
  rag_grounded_count: number;
  rag_grounded_pct: number;
  no_context_count: number;
  no_context_pct: number;
  avg_chunks_when_retrieved: number;
};

type AiKpiData = {
  summary: AiKpiSummary;
  usage_breakdown: UsageBreakdown;
  intent_breakdown: Array<{ intent: string; count: number; pct: number }>;
  provider_breakdown: Array<{ provider: string; count: number }>;
  daily_queries: Array<{ date: string; total: number; success: number }>;
  top_subjects: Array<{ subject_id: string; subject_name: string; count: number }>;
};

const INTENT_LABELS: Record<string, string> = {
  qa: "Q&A",
  summarize: "Summarize",
  generate: "Generate",
};

const dailyChartConfig = {
  total: { label: "Total Queries", color: "var(--chart-1)" },
  success: { label: "Successful", color: "var(--chart-2)" },
} satisfies ChartConfig;

const intentChartConfig = {
  count: { label: "Count", color: "var(--chart-3)" },
} satisfies ChartConfig;

const subjectChartConfig = {
  count: { label: "Queries", color: "var(--chart-4)" },
} satisfies ChartConfig;

function PercentBar({
  label,
  sublabel,
  pct,
  colorClass,
}: {
  label: string;
  sublabel: string;
  pct: number;
  colorClass: string;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-medium truncate">{label}</span>
        <span className="text-sm font-semibold tabular-nums shrink-0">{pct.toFixed(1)}%</span>
      </div>
      <div
        className="h-2.5 w-full rounded-full bg-muted overflow-hidden"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${label}: ${pct.toFixed(1)}%`}
      >
        <div
          className={`h-full rounded-full transition-all ${colorClass}`}
          style={{ width: `${Math.min(pct, 100)}%` }}
        />
      </div>
      <p className="text-xs text-muted-foreground">{sublabel}</p>
    </div>
  );
}

export default function AdminAiInsights() {
  const [data, setData] = React.useState<AiKpiData | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [days, setDays] = React.useState<number>(14);

  React.useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    adminGet(`/ai-kpis?days=${days}`)
      .then((res: AiKpiData) => {
        if (!cancelled) setData(res);
      })
      .catch((err: Error) => {
        if (!cancelled) setError(err?.message || "Failed to load AI Insights");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [days]);

  if (error) {
    return (
      <Alert variant="destructive" role="alert">
        <AlertCircle className="size-4" aria-hidden />
        <AlertTitle>Error loading AI Insights</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (loading || !data) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">AI Insights</h2>
          <Skeleton className="h-9 w-24" />
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-4 w-64 mt-1" />
              </CardHeader>
              <CardContent className="space-y-4">
                {Array.from({ length: 3 }).map((__, j) => (
                  <div key={j} className="space-y-1.5">
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-10" />
                    </div>
                    <Skeleton className="h-2.5 w-full rounded-full" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-5 w-48" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-[280px] w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-48" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[200px] w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  const { summary, usage_breakdown, intent_breakdown, daily_queries, top_subjects } = data;

  const intentData = intent_breakdown.map((d) => ({
    name: INTENT_LABELS[d.intent] ?? d.intent,
    count: d.count,
    pct: d.pct,
  }));

  const subjectData = top_subjects.map((s) => ({
    name: s.subject_name,
    count: s.count,
  }));

  const summaryCards = [
    { label: "Total Queries", value: summary.total_queries.toLocaleString() },
    { label: "Avg Response Time", value: `${Math.round(summary.avg_response_time_ms)} ms` },
    { label: "Success Rate", value: `${summary.success_rate.toFixed(1)}%` },
    { label: "Avg Chunks Retrieved", value: summary.avg_chunks_retrieved.toFixed(1) },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-semibold sm:text-xl">AI Insights</h2>
        <div className="flex flex-wrap items-center gap-2">
          <label htmlFor="ai-kpi-days" className="text-sm text-muted-foreground shrink-0">
            Time range
          </label>
          <Select value={String(days)} onValueChange={(v) => setDays(Number(v))}>
            <SelectTrigger id="ai-kpi-days" className="w-full min-w-0 sm:w-28">
              <SelectValue placeholder="Days" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">7 days</SelectItem>
              <SelectItem value="14">14 days</SelectItem>
              <SelectItem value="30">30 days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div
        className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4"
        role="list"
        aria-label="AI KPI metrics"
      >
        {summaryCards.map((m) => (
          <Card key={m.label} role="listitem" className="min-w-0">
            <CardHeader className="pb-1 sm:pb-2">
              <CardDescription className="text-xs sm:text-sm truncate">{m.label}</CardDescription>
            </CardHeader>
            <CardContent>
              <p
                className="text-xl sm:text-2xl font-semibold tabular-nums truncate"
                aria-live="polite"
              >
                {m.value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Usage breakdown: RAG, Agents, LLM context percentages */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2">
        <Card className="min-w-0">
          <CardHeader className="pb-3">
            <CardTitle className="text-base sm:text-lg">RAG Context Usage</CardTitle>
            <CardDescription>
              How often retrieval found real syllabus content to ground the LLM
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <PercentBar
              label="RAG-grounded"
              sublabel={`${usage_breakdown.rag_grounded_count} queries with retrieved context`}
              pct={usage_breakdown.rag_grounded_pct}
              colorClass="bg-[var(--chart-2)]"
            />
            <PercentBar
              label="No context (LLM only)"
              sublabel={`${usage_breakdown.no_context_count} queries without retrieval hits`}
              pct={usage_breakdown.no_context_pct}
              colorClass="bg-[var(--chart-5,var(--muted-foreground))]"
            />
            <p className="text-xs text-muted-foreground pt-1">
              Avg chunks per RAG-grounded query:{" "}
              <span className="font-medium text-foreground">
                {usage_breakdown.avg_chunks_when_retrieved}
              </span>
            </p>
          </CardContent>
        </Card>

        <Card className="min-w-0">
          <CardHeader className="pb-3">
            <CardTitle className="text-base sm:text-lg">Agent Intent Mix</CardTitle>
            <CardDescription>
              Percentage breakdown of what users asked the AI to do
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {intentData.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">No data yet.</p>
            ) : (
              intentData.map((d, i) => (
                <PercentBar
                  key={d.name}
                  label={d.name}
                  sublabel={`${d.count} queries`}
                  pct={d.pct}
                  colorClass={
                    i === 0
                      ? "bg-[var(--chart-1)]"
                      : i === 1
                      ? "bg-[var(--chart-3)]"
                      : "bg-[var(--chart-4)]"
                  }
                />
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2">
        <Card className="min-w-0 overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-base sm:text-lg">Query Volume</CardTitle>
            <CardDescription>Total vs successful over last {days} days</CardDescription>
          </CardHeader>
          <CardContent>
            {daily_queries.length === 0 ? (
              <p className="text-sm text-muted-foreground py-8 text-center">
                No query data yet.
              </p>
            ) : (
              <ChartContainer
                config={dailyChartConfig}
                className="h-[220px] sm:h-[280px] lg:h-[300px] w-full min-w-0"
              >
                <LineChart data={daily_queries} margin={{ left: 12, right: 12 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="date" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="total"
                    stroke="var(--chart-1)"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="success"
                    stroke="var(--chart-2)"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>

        <Card className="min-w-0 overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-base sm:text-lg">Intent Distribution</CardTitle>
            <CardDescription>Queries by workflow type</CardDescription>
          </CardHeader>
          <CardContent>
            {intentData.length === 0 ? (
              <p className="text-sm text-muted-foreground py-8 text-center">
                No intent data yet.
              </p>
            ) : (
              <ChartContainer
                config={intentChartConfig}
                className="h-[220px] sm:h-[280px] lg:h-[300px] w-full min-w-0"
              >
                <BarChart data={intentData} layout="vertical" margin={{ left: 12, right: 12 }}>
                  <XAxis type="number" tickLine={false} axisLine={false} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tickLine={false}
                    axisLine={false}
                    width={80}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="count" fill="var(--chart-3)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="min-w-0 overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-base sm:text-lg">Top Subjects by Query Volume</CardTitle>
          <CardDescription>Most queried subjects in the selected period</CardDescription>
        </CardHeader>
        <CardContent>
          {subjectData.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">
              No subject data yet.
            </p>
          ) : (
            <ChartContainer
              config={subjectChartConfig}
              className="h-[180px] sm:h-[220px] w-full min-w-0"
            >
              <BarChart data={subjectData} layout="vertical" margin={{ left: 12, right: 12 }}>
                <XAxis type="number" tickLine={false} axisLine={false} />
                <YAxis
                  type="category"
                  dataKey="name"
                  tickLine={false}
                  axisLine={false}
                  width={120}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" fill="var(--chart-4)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ChartContainer>
          )}
        </CardContent>
      </Card>

      <div className="sr-only" aria-live="polite">
        AI Insights summary: {summary.total_queries} total queries, {summary.success_rate.toFixed(1)}% success rate, average response time {Math.round(summary.avg_response_time_ms)} ms.
      </div>
    </div>
  );
}
