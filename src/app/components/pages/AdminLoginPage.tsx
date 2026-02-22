import React from "react";
import { Link } from "react-router-dom";
import FullscreenAuthTemplate from "../templates/FullscreenAuthTemplate";
import Login from "../Auth/Login";

export function AdminLoginPage() {
  return (
    <FullscreenAuthTemplate title="Admin">
      <div className="w-full max-w-sm mx-auto min-w-0 box-border bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6 shadow-sm">
        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
          Admin Sign In
        </h2>
        <Login />
        <p className="mt-4 text-sm text-muted-foreground">
          Student?{" "}
          <Link to="/login" className="text-primary underline hover:no-underline">
            Sign in here
          </Link>
        </p>
      </div>
    </FullscreenAuthTemplate>
  );
}

export default AdminLoginPage;
