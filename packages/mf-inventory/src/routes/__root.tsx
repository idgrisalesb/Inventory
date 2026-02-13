import { createRootRoute, Outlet, Link } from '@tanstack/react-router';
import { Badge } from 'siesa-ui-kit';
import { useAuth } from '../context/AuthContext';
import React from 'react';
import { useTranslation } from 'react-i18next';

export const rootRoute = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  // We can use the useAuth hook here because AuthProvider is higher up in the tree (in main.tsx)
  const { token } = useAuth();
  const { t } = useTranslation();

  return (
    <div className="p-8 space-y-6 bg-gray-50 min-h-screen font-sans">
      <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 px-8 py-4 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-gray-900">{t('app.title')}</h1>
            <Badge color="blue" count={1} label="Beta" />
            <nav className="ml-8 flex gap-4">
              <Link to="/" className="text-gray-600 hover:text-gray-900 font-medium [&.active]:text-blue-600">
                {t('app.nav.dashboard')}
              </Link>
              <Link to="/products" className="text-gray-600 hover:text-gray-900 font-medium [&.active]:text-blue-600">
                {t('app.nav.products')}
              </Link>
              <Link to="/warehouses" className="text-gray-600 hover:text-gray-900 font-medium [&.active]:text-blue-600">
                {t('app.nav.warehouses')}
              </Link>
            </nav>
          </div>
          <div>
            {token ? (
              <span className="text-sm text-green-600 bg-green-50 px-2 py-1 rounded">{t('app.auth.authenticated')}</span>
            ) : (
              <span className="text-sm text-red-600 bg-red-50 px-2 py-1 rounded">{t('app.auth.noToken')}</span>
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
