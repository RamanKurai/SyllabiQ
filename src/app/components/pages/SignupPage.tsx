import React from "react";
import FullscreenAuthTemplate from "../templates/FullscreenAuthTemplate";
import Signup from "../Auth/Signup";

export function SignupPage() {
  return (
    <FullscreenAuthTemplate title="Create account">
      <div className="w-full max-w-md min-w-0 box-border bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6 shadow-sm">
        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Create student account</h2>
        <Signup />
      </div>
    </FullscreenAuthTemplate>
  );
}

export default SignupPage;

