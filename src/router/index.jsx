import { createBrowserRouter, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";

const Layout = lazy(() => import("@/components/organisms/Layout"));
const ContactsPage = lazy(() => import("@/components/pages/ContactsPage"));
const DealsPage = lazy(() => import("@/components/pages/DealsPage"));
const CompaniesPage = lazy(() => import("@/components/pages/CompaniesPage"));
const TasksPage = lazy(() => import("@/components/pages/TasksPage"));
const ReportsPage = lazy(() => import("@/components/pages/ReportsPage"));
const NotFound = lazy(() => import("@/components/pages/NotFound"));

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
    <div className="text-center space-y-4">
      <svg className="animate-spin h-12 w-12 text-blue-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
      </svg>
    </div>
  </div>
);

const mainRoutes = [
  {
    path: "",
    index: true,
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <Navigate to="/contacts" replace />
      </Suspense>
    )
  },
  {
    path: "contacts",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <ContactsPage />
      </Suspense>
    )
  },
  {
    path: "deals",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <DealsPage />
      </Suspense>
    )
  },
  {
    path: "companies",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <CompaniesPage />
      </Suspense>
    )
  },
  {
    path: "tasks",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <TasksPage />
      </Suspense>
    )
  },
  {
    path: "reports",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <ReportsPage />
      </Suspense>
    )
  },
  {
    path: "*",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <NotFound />
      </Suspense>
    )
  }
];

const routes = [
  {
    path: "/",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <Layout />
      </Suspense>
    ),
    children: mainRoutes
  }
];

export const router = createBrowserRouter(routes);