import { createBrowserRouter, Navigate } from 'react-router-dom';
import { Login } from '../pages/Login';
import { Signup } from '../pages/Signup';
import { Dashboard } from '../pages/Dashboard';
import { Wizard } from '../pages/Wizard';
import { CardEditor } from '../pages/CardEditor';
import { PublicCard } from '../pages/PublicCard';
import { Checkout } from '../pages/Checkout';
import { AdminPanel } from '../pages/AdminPanel';
import { Privacy } from '../pages/Privacy';
import { Terms } from '../pages/Terms';
import { DataRequest } from '../pages/DataRequest';
import { LandingPage } from '../pages/LandingPage';
import { CreateAdmin } from '../pages/CreateAdmin';
import { Contact } from '../pages/Contact';
import { VerifyEmail } from '../pages/VerifyEmail';
import { Pricing } from '../pages/Pricing';
import { BusinessPlans } from '../pages/BusinessPlans';
import { AuthCallback } from '../pages/AuthCallback';
import { NotFound } from '../pages/NotFound';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/signup',
    element: <Signup />,
  },
  {
    path: '/dashboard',
    element: <Dashboard />,
  },
  {
    path: '/wizard',
    element: <Wizard />,
  },
  {
    path: '/card/:id/edit',
    element: <CardEditor />,
  },
  {
    path: '/checkout',
    element: <Checkout />,
  },
  {
    path: '/admin',
    element: <AdminPanel />,
  },
  {
    path: '/create-admin',
    element: <CreateAdmin />,
  },
  {
    path: '/u/:slug',
    element: <PublicCard />,
  },
  {
    path: '/privacy',
    element: <Privacy />,
  },
  {
    path: '/terms',
    element: <Terms />,
  },
  {
    path: '/data-request',
    element: <DataRequest />,
  },
  {
    path: '/contact',
    element: <Contact />,
  },
  {
    path: '/verify-email',
    element: <VerifyEmail />,
  },
  {
    path: '/pricing',
    element: <Pricing />,
  },
  {
    path: '/business-plans',
    element: <BusinessPlans />,
  },
  {
    path: '/auth/callback',
    element: <AuthCallback />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);
