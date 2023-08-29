import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import ErrorPage from './components/ErrorPage';
import RecipeDetails from './components/Recipes/RecipeDetails';
import RecipeForm from './components/Recipes/RecipeForm';
import RecipeList from './components/Recipes/RecipeList';
import Shopping from './components/ShoppingList/Shopping';
import './index.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/',
        element: <Shopping />,
      },
      {
        path: '/recipes',
        element: <RecipeList />,
      },
      {
        path: '/recipes/add',
        element: <RecipeForm />,
      },
      {
        path: '/recipes/:id',
        element: <RecipeDetails />,
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
