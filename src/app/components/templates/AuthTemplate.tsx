import React from "react";
import { Logo } from "../atoms/Logo";

export function AuthTemplate({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="space-y-6 w-full max-w-lg">
        <div className="flex items-center gap-3 justify-center">
          <Logo />
          {title && <h1 className="text-xl font-semibold">{title}</h1>}
        </div>
        <div className="flex justify-center">{children}</div>
      </div>
    </div>
  );
}

export default AuthTemplate;

