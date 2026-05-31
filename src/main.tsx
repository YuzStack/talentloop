import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Toaster } from 'react-hot-toast';
import { createBrowserRouter, RouterProvider } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import './styles/index.css';
import routes from './routes';

// Create a persistent, global Query Client instance
const queryClient: QueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // Cache query data for 5 minutes before refetching
      retry: 1, // Retry failed network/API requests once before alerting
    },
  },
});

const router = createBrowserRouter(routes);

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error(
    'Fatal: Failed to identify a valid HTML root container element inside index.html',
  );
}

createRoot(rootElement).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />

      {/* Global toast notifications config updated for Midnight Indigo alignment */}
      <Toaster
        position='top-center'
        toastOptions={{
          success: {
            duration: 3000,
          },
          error: {
            duration: 5000,
          },
          style: {
            background: '#111827', // Dark theme slate panel matching --color-canvas-panel
            color: '#F9FAFB', // Off-white main text matching --color-brand-dark
            fontFamily: 'Inter, sans-serif',
            border: '1px solid #374151', // Subtle divider matching --color-border-subtle
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          },
        }}
      />
    </QueryClientProvider>
  </StrictMode>,
);
