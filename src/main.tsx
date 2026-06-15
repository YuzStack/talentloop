import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Toaster } from 'react-hot-toast';
import { createBrowserRouter, RouterProvider } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import './styles/index.css';
import routes from './routes';
import ThemeProvider from './context/ThemeContext';

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
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />

        <Toaster
          position='top-center'
          toastOptions={{
            success: {
              duration: 3000,
            },
            error: {
              duration: 5000,
            },
            /* 💡 Using our Tailwind CSS variables makes the background and text color theme-reactive! */
            style: {
              background: 'var(--color-canvas-panel)', // Swaps dynamically between deep blue and pure white
              color: 'var(--color-brand-dark)', // Swaps dynamically between off-white and charcoal gray
              border: '1px solid var(--color-border-subtle)', // Swaps seamlessly between light and dark borders
              fontFamily: 'Inter, sans-serif',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            },
          }}
        />
      </QueryClientProvider>
    </ThemeProvider>
  </StrictMode>,
);
