import React from "react";
import { Brand } from "../atoms/Brand";

export function FullscreenAuthTemplate({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
      <header className="py-6 px-4 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <Brand size="lg" />
          {title && <h1 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h1>}
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-4xl mx-auto flex items-center justify-center">
          {children}
        </div>
      </main>
    </div>
  );
}

export default FullscreenAuthTemplate;

