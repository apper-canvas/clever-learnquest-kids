import { createBrowserRouter } from "react-router-dom"
import { lazy, Suspense } from "react"
import Layout from "@/components/organisms/Layout"

// Lazy load all page components
const HomePage = lazy(() => import("@/components/pages/HomePage"))
const WorldPage = lazy(() => import("@/components/pages/WorldPage"))
const GamePage = lazy(() => import("@/components/pages/GamePage"))
const ProfilePage = lazy(() => import("@/components/pages/ProfilePage"))
const CreateProfilePage = lazy(() => import("@/components/pages/CreateProfilePage"))
const ParentDashboard = lazy(() => import("@/components/pages/ParentDashboard"))
const ParentLogin = lazy(() => import("@/components/pages/ParentLogin"))
const NotFound = lazy(() => import("@/components/pages/NotFound"))

// Loading component for Suspense
const SuspenseWrapper = ({ children }) => (
  <Suspense fallback={
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center space-y-4">
        <svg className="animate-spin h-12 w-12 text-blue-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      </div>
    </div>
  }>
    {children}
  </Suspense>
)

// Main routes configuration
const mainRoutes = [
  {
    path: "",
    index: true,
    element: <SuspenseWrapper><HomePage /></SuspenseWrapper>
  },
  {
    path: "world/:worldId",
    element: <SuspenseWrapper><WorldPage /></SuspenseWrapper>
  },
  {
    path: "game/:worldId/:gameId",
    element: <SuspenseWrapper><GamePage /></SuspenseWrapper>
  },
  {
    path: "profile",
    element: <SuspenseWrapper><ProfilePage /></SuspenseWrapper>
  },
  {
    path: "create-profile",
    element: <SuspenseWrapper><CreateProfilePage /></SuspenseWrapper>
  },
  {
    path: "parent",
    element: <SuspenseWrapper><ParentLogin /></SuspenseWrapper>
  },
  {
    path: "parent/dashboard",
    element: <SuspenseWrapper><ParentDashboard /></SuspenseWrapper>
  },
  {
    path: "*",
    element: <SuspenseWrapper><NotFound /></SuspenseWrapper>
  }
]

// Routes configuration
const routes = [
  {
    path: "/",
    element: <Layout />,
    children: [...mainRoutes]
  }
]

export const router = createBrowserRouter(routes)