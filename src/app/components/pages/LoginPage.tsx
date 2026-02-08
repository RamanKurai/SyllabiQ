import React from "react";
import FullscreenAuthTemplate from "../templates/FullscreenAuthTemplate";
import Login from "../Auth/Login";

export function LoginPage() {
  return (
    <FullscreenAuthTemplate title="Welcome back">
      <div className="w-full max-w-md min-w-0 box-border bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6 shadow-sm">
        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Sign in to SyllabiQ</h2>
        <Login />
      </div>
    </FullscreenAuthTemplate>
  );
}

export default LoginPage;

