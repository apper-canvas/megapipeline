import React, { useState } from "react";
import { Outlet, useOutletContext } from "react-router-dom";
import Sidebar from "@/components/organisms/Sidebar";
import MobileSidebar from "@/components/organisms/MobileSidebar";
import Header from "@/components/organisms/Header";

const Layout = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  const closeMobileSidebar = () => {
    setIsMobileSidebarOpen(false);
  };

  const outletContext = {
    isMobileSidebarOpen,
    toggleMobileSidebar,
    closeMobileSidebar
  };
return (
    <div className="h-screen flex overflow-hidden bg-gray-50">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <Sidebar />
      </div>

      {/* Mobile Sidebar */}
      <MobileSidebar isOpen={isMobileSidebarOpen} onClose={closeMobileSidebar} />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <Header 
          title="Pipeline Pro"
          subtitle="Customer Relationship Management"
          onMenuToggle={toggleMobileSidebar}
        />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet context={outletContext} />
        </main>
      </div>
    </div>
  );
};

export { useOutletContext };

export default Layout;