import React from "react";
import { useEffect, useState } from "react";
import { getDashboard } from "../../../lib/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { BookOpen, Clock, Layers, Zap, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Header } from "../Header";
import { useDashboard } from "../../context/DashboardContext";
import KpiCard from "../atoms/KpiCard";
import SectionHeader from "../atoms/SectionHeader";

export function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const { setDashboard } = useDashboard();

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getDashboard()
      .then((d) => {
        if (!cancelled) setData(d);
        try {
          setDashboard(d);
        } catch {}
      })
      .catch((e) => {
        if (!cancelled) setError(String(e));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) return <div className="p-6">Loading dashboard…</div>;
  if (error) return <div className="p-6 text-destructive">Error: {error}</div>;
  if (!data) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto">
      <Header showSubjectSelector={false} selectedSubject="" onSubjectChange={() => {}} subjects={[]} />
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-6">
            <div className="hidden sm:block">
              <h1 className="text-2xl font-semibold">Student Dashboard</h1>
              <p className="text-sm text-muted-foreground">Your personalized learning snapshot</p>
            </div>
          </div>
          <div>
            <button onClick={() => navigate('/prepare')} className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-md shadow hover:bg-primary/90">
              <Zap className="w-4 h-4" />
              Start Preparing
            </button>
          </div>
        </div>

        {data.account.status !== "approved" && (
          <div className="mb-4 p-4 rounded-md bg-yellow-50 border border-yellow-200 text-yellow-800">
            <div className="font-medium">Account pending approval</div>
            <div className="text-sm">Your account is currently "{data.account.status}". An institution admin must approve your account before you gain full access.</div>
          </div>
        )}

        {data.soon_expiring_roles && data.soon_expiring_roles.length > 0 && (
          <div className="mb-4 p-4 rounded-md bg-red-50 border border-red-200 text-red-800">
            <div className="font-medium">Role expiry warning</div>
            <div className="text-sm">
              The following roles are expiring soon:
              <ul className="mt-2 ml-4 list-disc">
                {data.soon_expiring_roles.map((r: any) => (
                  <li key={r.name}>
                    {r.name} — expires in {r.days_left} day{r.days_left !== 1 ? "s" : ""}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

      <section className="mb-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <KpiCard title="Subjects Studied" value={data.kpis.subjects_studied} icon={<BookOpen className="w-6 h-6 text-blue-600" />} />
            <KpiCard title="Topics Explored" value={data.kpis.topics_explored} icon={<Layers className="w-6 h-6 text-green-600" />} />
            <KpiCard title="Last Active" value={data.kpis.last_active || "—"} icon={<Clock className="w-6 h-6 text-yellow-600" />} />
          </div>

          <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-sm text-muted-foreground">Account</div>
                <div className="text-lg font-semibold">{data.account.full_name || data.account.email}</div>
                <div className="text-sm text-muted-foreground">{data.account.email}</div>
              </div>
            </div>

            <div className="mt-3">
              <div className="text-xs text-muted-foreground">Member since</div>
              <div className="text-sm">{new Date(data.account.created_at).toLocaleDateString()}</div>
            </div>

            <div className="mt-3">
              <div className="text-xs text-muted-foreground">Roles</div>
              <div className="flex flex-wrap gap-2 mt-2">
                {(data.roles || []).map((r: any) => (
                  <span key={r.name} className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center gap-2">
                    <span>{r.name}</span>
                    {r.expires_at && <span className="text-xs text-muted-foreground">exp {new Date(r.expires_at).toLocaleDateString()}</span>}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-3">
              <div className="text-xs text-muted-foreground">Activity</div>
              <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                <div>
                  <div className="text-muted-foreground text-xs">Queries</div>
                  <div className="font-medium">{data.activity.total_contexts}</div>
                </div>
                <div>
                  <div className="text-muted-foreground text-xs">Last Intent</div>
                  <div className="font-medium">{data.activity.last_intent || "—"}</div>
                </div>
                <div>
                  <div className="text-muted-foreground text-xs">Last Topic</div>
                  <div className="font-medium">{data.activity.last_topic || "—"}</div>
                </div>
                <div>
                  <div className="text-muted-foreground text-xs">Current Subject</div>
                  <div className="font-medium">{data.activity.current_subject_name || data.activity.current_subject_id || "—"}</div>
                </div>
              </div>
            </div>
            {data.recent_activity && data.recent_activity.length > 0 && (
              <div className="mt-4">
                <div className="text-xs text-muted-foreground">Recent activity</div>
                <ul className="mt-2 space-y-2">
                  {data.recent_activity.map((ra: any, idx: number) => (
                    <li key={idx} className="text-sm">
                      <div className="font-medium">{ra.last_topic || "—"}</div>
                      <div className="text-muted-foreground text-xs">
                        {ra.subject_name || "Unknown subject"} • {ra.last_intent || "—"} • {ra.updated_at ? new Date(ra.updated_at).toLocaleString() : "—"}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </section>

        <section className="mb-6">
          <h2 className="text-lg font-medium mb-2">KPIs</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-white dark:bg-gray-800 rounded-md shadow">
              <div className="text-sm text-muted-foreground">Subjects Studied</div>
              <div className="text-xl font-semibold">{data.kpis.subjects_studied}</div>
            </div>
            <div className="p-4 bg-white dark:bg-gray-800 rounded-md shadow">
              <div className="text-sm text-muted-foreground">Topics Explored</div>
              <div className="text-xl font-semibold">{data.kpis.topics_explored}</div>
            </div>
            <div className="p-4 bg-white dark:bg-gray-800 rounded-md shadow">
              <div className="text-sm text-muted-foreground">Last Active</div>
              <div className="text-xl font-semibold">{data.kpis.last_active || "—"}</div>
            </div>
            <div className="p-4 bg-white dark:bg-gray-800 rounded-md shadow">
              <div className="text-sm text-muted-foreground">Most Used</div>
              <div className="text-xl font-semibold">{Object.keys(data.intent_analytics || {})[0] || "—"}</div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-medium mb-2">Subjects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.syllabus_progress.map((sp: any) => {
              const pct = sp.topics_total ? Math.round((sp.topics_touched / sp.topics_total) * 100) : 0;
              const unitsPct = sp.units_total ? Math.round((sp.units_covered / sp.units_total) * 100) : 0;
              return (
                <div key={sp.subject_id} className="p-4 bg-white dark:bg-gray-800 rounded-md shadow">
                  <div className="font-semibold">{sp.subject_name}</div>
                  <div className="text-sm text-muted-foreground">Topics: {sp.topics_touched}/{sp.topics_total}</div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2 overflow-hidden">
                    <div className="bg-blue-600 h-2" style={{ width: `${pct}%` }} />
                  </div>
                  <div className="text-sm mt-3">Units: {sp.units_covered}/{sp.units_total}</div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2 overflow-hidden">
                    <div className="bg-green-600 h-2" style={{ width: `${unitsPct}%` }} />
                  </div>
                  <div className="text-sm mt-2">Last studied: {sp.last_studied || "—"}</div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="mt-6">
          <h2 className="text-lg font-medium mb-2">Intent usage</h2>
          <div className="p-4 bg-white dark:bg-gray-800 rounded-md shadow" style={{ height: 240 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={Object.entries(data.intent_analytics || {}).map(([key, val]) => ({ intent: key, count: val }))}>
                <XAxis dataKey="intent" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#2563EB">
                  {(Object.entries(data.intent_analytics || {})).map(([k], idx) => (
                    <Cell key={`cell-${idx}`} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>
    </div>
  );
}

export default DashboardPage;



