import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { lazy, Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import ErrorPage from './components/ErrorPage';
import ShoppingPage from './components/ShoppingList/ShoppingPage';
import './index.css';

// Recipe pages are not needed for the landing (shopping list) page, so split
// them into their own chunks.
const RecipeList = lazy(() => import('./components/Recipes/RecipeList'));
const RecipeForm = lazy(() => import('./components/Recipes/RecipeForm'));
const RecipeDetails = lazy(() => import('./components/Recipes/RecipeDetails'));
const withSuspense = (el: React.ReactNode) => (
  <Suspense fallback="Loading...">{el}</Suspense>
);

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/',
        element: <ShoppingPage />,
      },
      {
        path: '/recipes',
        element: withSuspense(<RecipeList />),
      },
      {
        path: '/recipes/add',
        element: withSuspense(<RecipeForm />),
      },
      {
        path: '/recipes/:id',
        element: withSuspense(<RecipeDetails />),
      },
    ],
  },
]);

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>
);
