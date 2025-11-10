import React from "react"
import { Outlet } from "react-router-dom"
import Navigation from "@/components/organisms/Navigation"

const Layout = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Layout */}
      <div className="lg:hidden">
        <main className="pb-20">
          <Outlet />
        </main>
        <Navigation className="fixed bottom-0 left-0 right-0 z-50" />
      </div>
      
      {/* Desktop Layout */}
      <div className="hidden lg:flex h-screen">
        <Navigation className="w-80 flex-shrink-0 flex flex-col" />
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Layout