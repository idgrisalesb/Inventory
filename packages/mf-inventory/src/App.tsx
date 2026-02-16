import React, { useEffect, useState } from 'react';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { useAuth } from './context/AuthContext';
import { rootRoute } from './routes/__root';
import { indexRoute } from './routes/index';
import { warehousesRoute } from './routes/warehouses';
import { productsRoute, productDetailRoute } from './routes/products';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';


import i18n from './i18n/config';

const routeTree = rootRoute.addChildren([indexRoute, warehousesRoute, productsRoute, productDetailRoute]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

interface AppProps {
  initialLanguage?: string;
}

export default function App({ initialLanguage }: AppProps) {
  const { token } = useAuth();

  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 1000,
        retry: 1,
      },
    },
  }));

  useEffect(() => {
    if (initialLanguage) {
      i18n.changeLanguage(initialLanguage);
    }

    const handleLanguageChange = (event: Event) => {
      const customEvent = event as CustomEvent<{ language: string }>;
      if (customEvent.detail?.language) {
        i18n.changeLanguage(customEvent.detail.language);
      }
    };

    window.addEventListener('siesa:language:change', handleLanguageChange);

    return () => {
      window.removeEventListener('siesa:language:change', handleLanguageChange);
    };
  }, [initialLanguage]);

  // Pass token to router context or useAuth inside components
  return (
    <div id="mf-inventory-app" className="isolate">
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} context={{ auth: { token } }} />
      </QueryClientProvider>
    </div>
  );
}
