import React from "react";
import { BookOpen } from "lucide-react";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={className}>
      <div className="bg-blue-600 p-2 rounded-lg inline-flex items-center">
        <BookOpen className="w-6 h-6 text-white" aria-hidden="true" />
      </div>
    </div>
  );
}

export default Logo;

