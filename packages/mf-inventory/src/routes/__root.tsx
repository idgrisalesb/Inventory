import { createRootRoute, Outlet } from '@tanstack/react-router';
import { Badge } from 'siesa-ui-kit';
import { useAuth } from '../context/AuthContext';
import React from 'react';

export const rootRoute = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  // We can use the useAuth hook here because AuthProvider is higher up in the tree (in main.tsx)
  const { token } = useAuth();

  return (
    <div className="p-8 space-y-6 bg-gray-50 min-h-screen font-sans">
      <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 px-8 py-4 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-gray-900">Inventory Module</h1>
            <Badge color="blue" count={1} label="Beta" />
          </div>
          <div>
            {token ? (
              <span className="text-sm text-green-600 bg-green-50 px-2 py-1 rounded">Authenticated</span>
            ) : (
              <span className="text-sm text-red-600 bg-red-50 px-2 py-1 rounded">No Token</span>
            )}
          </div>
        </div>
      </header>
      <main className="pt-20">
        <Outlet />
      </main>
    </div>
  );
}
