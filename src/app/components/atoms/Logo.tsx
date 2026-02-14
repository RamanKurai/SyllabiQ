import React from "react";
import { BookOpen } from "lucide-react";
import { BRAND } from "../../design/brand";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={className}>
      <div
        className="p-2 rounded-lg inline-flex items-center"
        style={{ backgroundColor: BRAND.colors.primary, borderRadius: BRAND.radii.md }}
        aria-hidden="true"
      >
        <BookOpen className="w-6 h-6" style={{ color: BRAND.colors.primaryForeground }} />
      </div>
    </div>
  );
}

export default Logo;

