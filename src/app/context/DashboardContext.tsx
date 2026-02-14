import React from "react";

type DashboardValue = {
  dashboard: any | null;
  setDashboard: (d: any | null) => void;
};

const DashboardContext = React.createContext<DashboardValue | undefined>(undefined);

export function DashboardProvider({ children }: { children?: React.ReactNode }) {
  const [dashboard, setDashboard] = React.useState<any | null>(null);
  const value = React.useMemo(() => ({ dashboard, setDashboard }), [dashboard]);
  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>;
}

export function useDashboard() {
  const ctx = React.useContext(DashboardContext);
  if (!ctx) throw new Error("useDashboard must be used within DashboardProvider");
  return ctx;
}

export default DashboardContext;

