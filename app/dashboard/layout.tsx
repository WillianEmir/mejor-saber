"use client"; 

import DashboardHeader from "@/app/dashboard/components/header/DashboardHeader";
import AppSidebar from "@/app/dashboard/components/sidebar/DashboardSidebar";
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
      {/* Sidebar */}
      <AppSidebar />

      {/* Main Content Area */}
      <div className={`flex-1 transition-all  duration-300 ease-in-out ${mainContentMargin}`} >
        {/* Header */}
        <DashboardHeader />

        {/* Page Content */}
        <div className="p-4 mx-auto max-w-[1536px] md:p-6 dark:bg-neutral-dark">{children}</div>
        <ToastContainer hideProgressBar={false} />
      </div>
    </div>
  );
} 