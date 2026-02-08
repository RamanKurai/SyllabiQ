import React from "react";

export function AuthCard({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <div className="w-full max-w-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6 shadow-sm">
      {title && <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">{title}</h2>}
      <div>{children}</div>
    </div>
  );
}

export default AuthCard;

