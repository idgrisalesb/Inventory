import React from 'react';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { useAuth } from './context/AuthContext';
// No generator yet
import { rootRoute } from './routes/__root';
import { indexRoute } from './routes/index';

const routeTree = rootRoute.addChildren([indexRoute]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  const { token } = useAuth();

  // Pass token to router context or useAuth inside components
  return (
    <div id="mf-inventory-app" className="isolate">
      <RouterProvider router={router} context={{ auth: { token } }} />
    </div>
  );
}
