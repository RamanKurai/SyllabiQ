import React from "react";
import { Logo } from "./Logo";
import BRAND from "../../design/brand";

export function Brand({ size = "md", className = "" }: { size?: "sm" | "md" | "lg"; className?: string }) {
  const textClass = size === "sm" ? "text-lg" : size === "lg" ? "text-3xl" : "text-2xl";
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Logo />
      <div className={`${textClass} font-semibold text-gray-900 dark:text-white`}>
        {BRAND.name}
      </div>
    </div>
  );
}

export default Brand;

