import React, { Suspense, lazy } from 'react';
import { useTranslation } from 'react-i18next';
import { createBrowserRouter, RouterProvider, Outlet, useNavigate, useRouteError } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import SkeletonLoader from '../components/ui/SkeletonLoader';

function RouteErrorFallback() {
  useRouteError(); // consume error for error boundary
  const navigate = useNavigate();
  const { t } = useTranslation();
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 bg-heritage-cream-50 dark:bg-gray-900">
      <p className="text-gray-700 dark:text-gray-300 mb-4">{t('common.errorOccurred') || 'Đã xảy ra lỗi.'}</p>
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="px-4 py-2 rounded-lg bg-heritage-red-600 text-white hover:bg-heritage-red-700"
      >
        {t('common.back')}
      </button>
    </div>
  );
}

function SettingsPageWrapper() {
  const navigate = useNavigate();
  return <SettingsPage onBack={() => navigate('/')} />;
}

// Lazy load pages for code splitting (MapPage loaded directly to avoid duplicate React in chunk with mapbox-gl)
import MapPage from '../pages/MapPage';
const HomePage = lazy(() => import('../pages/HomePage'));
const HeritageList = lazy(() => import('../pages/HeritageList'));
const HeritageDetailPage = lazy(() => import('../pages/HeritageDetailPage'));
const TimelinePage = lazy(() => import('../pages/TimelinePage'));
const AboutPage = lazy(() => import('../pages/AboutPage'));
const Chat = lazy(() => import('../pages/Chat'));
const QuizPage = lazy(() => import('../pages/QuizPage'));
const TTSPage = lazy(() => import('../pages/TTSPage'));
const ContributePage = lazy(() => import('../pages/ContributePage'));
const FavoritesPage = lazy(() => import('../pages/FavoritesPage'));
const AdminPage = lazy(() => import('../pages/admin/AdminPage'));
const SettingsPage = lazy(() => import('../pages/admin/SettingsPage'));

function PageLoader() {
  const { t } = useTranslation();
  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center bg-heritage-cream-50 dark:bg-gray-900"
      style={{ padding: 'clamp(1rem, 5vw, 2rem)' }}
    >
      <div className="flex flex-col items-center justify-center w-full max-w-[280px]">
        {/* Logo: vùng cố định để pulse không làm lệch bố cục */}
        <div className="flex items-center justify-center h-[7rem] w-full shrink-0">
          <img
            src="/logo-camau.svg"
            alt=""
            className="h-24 w-auto max-h-[7rem] object-contain object-center animate-pulse"
          />
        </div>
        {/* Khoảng cách cố định giữa logo và spinner */}
        <div className="h-8 shrink-0" aria-hidden />
        {/* Spinner + chữ: nhóm thống nhất, căn giữa */}
        <div className="flex flex-col items-center justify-center gap-2 w-full">
          <div
            className="w-10 h-10 sm:w-12 sm:h-12 border-2 border-heritage-red-600 border-t-transparent rounded-full animate-spin shrink-0"
            aria-hidden
          />
          <p className="text-gray-600 dark:text-gray-400 text-sm text-center w-full max-w-[12rem] leading-snug">
            {t('common.loading')}
          </p>
        </div>
      </div>
    </div>
  );
}

// Route configuration
const routes = [
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <RouteErrorFallback />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<PageLoader />}>
            <HomePage />
          </Suspense>
        ),
      },
      {
        path: 'heritage',
        element: (
          <Suspense fallback={<PageLoader />}>
            <HeritageList />
          </Suspense>
        ),
      },
      {
        path: 'heritage/:id',
        element: (
          <Suspense fallback={<PageLoader />}>
            <HeritageDetailPage />
          </Suspense>
        ),
      },
      {
        path: 'map',
        element: (
          <Suspense fallback={<PageLoader />}>
            <MapPage />
          </Suspense>
        ),
      },
      {
        path: 'timeline',
        element: (
          <Suspense fallback={<PageLoader />}>
            <TimelinePage />
          </Suspense>
        ),
      },
      {
        path: 'about',
        element: (
          <Suspense fallback={<PageLoader />}>
            <AboutPage />
          </Suspense>
        ),
      },
      {
        path: 'chat',
        element: (
          <Suspense fallback={<PageLoader />}>
            <Chat />
          </Suspense>
        ),
      },
      {
        path: 'quiz',
        element: (
          <Suspense fallback={<PageLoader />}>
            <QuizPage />
          </Suspense>
        ),
      },
      {
        path: 'tts',
        element: (
          <Suspense fallback={<PageLoader />}>
            <TTSPage />
          </Suspense>
        ),
      },
      {
        path: 'contribute',
        element: (
          <Suspense fallback={<PageLoader />}>
            <ContributePage />
          </Suspense>
        ),
      },
      {
        path: 'favorites',
        element: (
          <Suspense fallback={<PageLoader />}>
            <FavoritesPage />
          </Suspense>
        ),
      },
      {
        path: 'settings',
        element: (
          <Suspense fallback={<PageLoader />}>
            <SettingsPageWrapper />
          </Suspense>
        ),
      },
      {
        path: 'admin/*',
        element: (
          <Suspense fallback={<PageLoader />}>
            <AdminPage />
          </Suspense>
        ),
      },
    ],
  },
];

const router = createBrowserRouter(routes, {
  future: { v7_startTransition: true },
});

export default function AppRouter() {
  return <RouterProvider router={router} />;
}

export { routes };

