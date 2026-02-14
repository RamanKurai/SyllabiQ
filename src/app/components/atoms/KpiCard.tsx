import React from "react";

import BRAND from "../../design/brand";

export function KpiCard({ title, value, icon }: { title: string; value: React.ReactNode; icon?: React.ReactNode }) {
  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm flex items-center gap-4">
      {icon && (
        <div
          className="p-2 rounded-md inline-flex"
          style={{ backgroundColor: BRAND.colors.card, borderRadius: BRAND.radii.md }}
        >
          {icon}
        </div>
      )}
      <div>
        <div className="text-sm text-muted-foreground">{title}</div>
        <div className="text-xl font-semibold">{value}</div>
      </div>
    </div>
  );
}

export default KpiCard;

