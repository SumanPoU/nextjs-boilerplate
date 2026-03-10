import React from 'react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background dark:bg-gray-900">
      <div className="grid h-screen lg:grid-cols-2">
        <div className="overflow-y-auto scrollbar-hide">{children}</div>
        <div className="hidden lg:flex items-center justify-center bg-primary dark:bg-white/5 p-12 h-screen">
          <div className="max-w-md text-white dark:text-white text-center space-y-4">
            <h2 className="text-3xl font-bold">Welcome Back </h2>
            <p className="text-lg opacity-90">
              Free and Open-Source Tailwind CSS Admin Dashboard Template
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
