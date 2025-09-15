"use client";

import AppHeader from "@/src/components/dashboard/ui/layout/AppHeader";
import AppSidebar from "@/src/components/dashboard/ui/layout/AppSidebar";
import Backdrop from "@/src/components/dashboard/ui/layout/Backdrop";
import { useSidebarStore } from "@/src/store/sidebar.store";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isExpanded, isHovered, isMobileOpen } = useSidebarStore();

  // Dynamic class for main content margin based on sidebar state
  const mainContentMargin = isMobileOpen
    ? "ml-0"
    : isExpanded || isHovered
      ? "lg:ml-[290px]"
      : "lg:ml-[90px]";

  return (
    <div className="min-h-screen xl:flex">
      {/* Sidebar and Backdrop */}
      <AppSidebar />
      <Backdrop />

      {/* Main Content Area */}
      <div className={`flex-1 transition-all  duration-300 ease-in-out ${mainContentMargin}`} >
        {/* Header */}
        <AppHeader />

        {/* Page Content */}
        <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">{children}</div>
        <ToastContainer hideProgressBar={false} />
      </div>
    </div>
  );
} 