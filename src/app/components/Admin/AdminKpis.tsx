import React from "react";
import { adminGet } from "../../hooks/useApi";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function AdminKpis() {
  const [kpis, setKpis] = React.useState<any | null>(null);
  const [series, setSeries] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    let cancelled = false;
    setLoading(true);
    adminGet(`/kpis?days=14`)
      .then((res) => {
        if (cancelled) return;
        setKpis(res.counts || null);
        setSeries(res.series || []);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading || !kpis) {
    return <div className="p-4">Loading KPIs...</div>;
  }

  return (
    <div>
      <h2 className="text-xl font-medium mb-4">Key Performance Indicators</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <MetricCard label="Total users" value={kpis.total_users} />
        <MetricCard label="Pending users" value={kpis.pending_users} />
        <MetricCard label="Active users" value={kpis.active_users} />
      </div>

      <div className="bg-white p-4 rounded">
        <h3 className="font-medium mb-2">Signups & Approvals (last 14 days)</h3>
        {series.length === 0 ? (
          <div className="text-sm text-gray-600 p-4">No historical data available.</div>
        ) : (
          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer>
              <LineChart data={series}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="signups" stroke="#3182ce" dot={false} />
                <Line type="monotone" dataKey="approvals" stroke="#38a169" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
        <div className="sr-only" aria-live="polite">
          Summary: total users {kpis.total_users}, pending {kpis.pending_users}, active {kpis.active_users}.
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: any }) {
  return (
    <div className="bg-white p-4 rounded shadow-sm">
      <div className="text-sm text-gray-500">{label}</div>
      <div className="text-2xl font-semibold mt-1">{value ?? "-"}</div>
    </div>
  );
}

