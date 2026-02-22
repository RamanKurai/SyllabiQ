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

const chartConfig = {
  signups: {
    label: "Signups",
    color: "var(--chart-1)",
  },
  approvals: {
    label: "Approvals",
    color: "var(--chart-2)",
  },
  date: {
    label: "Date",
  },
} satisfies ChartConfig;

const contentChartConfig = {
  value: {
    label: "Count",
    color: "var(--chart-1)",
  },
  courses: {
    label: "Courses",
    color: "var(--chart-1)",
  },
  subjects: {
    label: "Subjects",
    color: "var(--chart-2)",
  },
  syllabi: {
    label: "Syllabi",
    color: "var(--chart-3)",
  },
  topics: {
    label: "Topics",
    color: "var(--chart-4)",
  },
} satisfies ChartConfig;

export default function AdminKpis() {
  const [kpis, setKpis] = React.useState<Record<string, number> | null>(null);
  const [series, setSeries] = React.useState<Array<{ date: string; signups: number; approvals: number }>>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [days, setDays] = React.useState<number>(14);

  React.useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    adminGet(`/kpis?days=${days}`)
      .then((res: { counts?: Record<string, number>; series?: Array<{ date: string; signups: number; approvals: number }> }) => {
        if (cancelled) return;
        setKpis(res.counts || null);
        setSeries(res.series || []);
      })
      .catch((err) => {
        if (!cancelled) setError(err?.message || "Failed to load KPIs");
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
        <AlertTitle>Error loading KPIs</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (loading || !kpis) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Key Performance Indicators</h2>
          <Skeleton className="h-9 w-24" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {Array.from({ length: 9 }).map((_, i) => (
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
        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-48" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[300px] w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  const contentData = [
    { name: "Courses", value: kpis.courses_count ?? 0, fill: "var(--chart-1)" },
    { name: "Subjects", value: kpis.subjects_count ?? 0, fill: "var(--chart-2)" },
    { name: "Syllabi", value: kpis.syllabi_count ?? 0, fill: "var(--chart-3)" },
    { name: "Topics", value: kpis.topics_count ?? 0, fill: "var(--chart-4)" },
  ];

  const metrics = [
    { label: "Total users", value: kpis.total_users, key: "total_users" },
    { label: "Pending users", value: kpis.pending_users, key: "pending_users" },
    { label: "Active users", value: kpis.active_users, key: "active_users" },
    { label: "Institutions", value: kpis.institutions_count, key: "institutions_count" },
    { label: "Roles", value: kpis.roles_count, key: "roles_count" },
    { label: "Courses", value: kpis.courses_count, key: "courses_count" },
    { label: "Subjects", value: kpis.subjects_count, key: "subjects_count" },
    { label: "Topics", value: kpis.topics_count, key: "topics_count" },
    { label: "Syllabi", value: kpis.syllabi_count, key: "syllabi_count" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-semibold">Key Performance Indicators</h2>
        <div className="flex items-center gap-2">
          <label htmlFor="kpi-days" className="text-sm text-muted-foreground">
            Time range
          </label>
          <Select value={String(days)} onValueChange={(v) => setDays(Number(v))}>
            <SelectTrigger id="kpi-days" className="w-28">
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
        className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
        role="list"
        aria-label="KPI metrics"
      >
        {metrics.map((m) => (
          <Card key={m.key} role="listitem">
            <CardHeader className="pb-2">
              <CardDescription>{m.label}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold tabular-nums" aria-live="polite">
                {m.value ?? "-"}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Signups & Approvals</CardTitle>
            <CardDescription>Last {days} days</CardDescription>
          </CardHeader>
          <CardContent>
            {series.length === 0 ? (
              <p className="text-sm text-muted-foreground py-8 text-center">
                No historical data available.
              </p>
            ) : (
              <ChartContainer config={chartConfig} className="h-[300px] w-full">
                <LineChart data={series} margin={{ left: 12, right: 12 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="date" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="signups"
                    stroke="var(--chart-1)"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="approvals"
                    stroke="var(--chart-2)"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Content Distribution</CardTitle>
            <CardDescription>By type</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={contentChartConfig} className="h-[300px] w-full">
              <BarChart data={contentData} layout="vertical" margin={{ left: 12, right: 12 }}>
                <XAxis type="number" tickLine={false} axisLine={false} />
                <YAxis type="category" dataKey="name" tickLine={false} axisLine={false} width={80} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <div className="sr-only" aria-live="polite">
        Summary: total users {kpis.total_users}, pending {kpis.pending_users}, active {kpis.active_users}.
      </div>
    </div>
  );
}
