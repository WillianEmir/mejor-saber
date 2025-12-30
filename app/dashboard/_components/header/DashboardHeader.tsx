"use client";

import React, { useState, useEffect } from "react";
import { Menu, X, MoreHorizontal } from "lucide-react";
import GamificationHUD from "./GamificationHUD";
import { ThemeToggleButton } from "../../../../src/components/ui/ThemeToggleButton";
import { useSidebarStore } from "@/src/store/sidebar.store";
import Link from "next/link";
import UserDropdown from "./UserDropdown"; 
import Image from "next/image";
import { useCurrentUser } from "@/src/hooks/use-current-user"; 

const DashboardHeader: React.FC = () => {
  const [isApplicationMenuOpen, setApplicationMenuOpen] = useState(false);
  const { isMobileOpen, toggleSidebar, toggleMobileSidebar } = useSidebarStore();
  const  session  = useCurrentUser();
  const user = session?.data?.user;

  const handleSidebarToggle = () => {
    if (window.innerWidth >= 1024) {
      toggleSidebar();
    } else {
      toggleMobileSidebar();
    }
  };

  const toggleApplicationMenu = () => {
    setApplicationMenuOpen(!isApplicationMenuOpen);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        // Future implementation: open a command palette or search bar
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <header className="sticky z-sticky top-0 flex w-full bg-white border-neutral-light dark:bg-neutral-dark lg:border-b">
      <div className="flex flex-col items-center justify-between grow lg:flex-row lg:px-6">
        <div className="flex items-center justify-between w-full gap-2 px-3 py-1 border-b border-gray-200 dark:border-gray-800 sm:gap-4 lg:justify-normal lg:border-b-0 lg:px-0 lg:py-4">
          <button
            className="flex items-center justify-center w-10 h-10 text-neutral-dark border-neutral-light rounded-md dark:border-neutral-light lg:h-11 lg:w-11 lg:border dark:text-neutral-light cursor-pointer"
            onClick={handleSidebarToggle}
            aria-label="Toggle Sidebar"
          >
            {isMobileOpen ? <X size={24} /> : <Menu size={20} />}
          </button>
          {user?.school && (
            <div className="hidden lg:flex items-center gap-2">
              <span className="text-2xl font-semibold text-gray-600 dark:text-gray-300">
                {user.school.name}
              </span>
            </div>
          )}

          <div className="flex items-center justify-center lg:flex-1 lg:hidden">
            <Link href={'/'}>
              <Image
                src={'/logo.png'}
                alt='Logo'
                width={110}
                height={110}
                className='w-auto h-auto'
              />
            </Link>
          </div>

          <button
            onClick={toggleApplicationMenu}
            className="flex items-center justify-center w-10 h-10 text-gray-700 rounded-lg hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 lg:hidden cursor-pointer"
            aria-label="Toggle Application Menu"
          >
            <MoreHorizontal size={24} />
          </button>
        </div>

        <div className={`${isApplicationMenuOpen ? "flex" : "hidden"} items-center justify-between w-full gap-4 px-5 py-4 lg:flex shadow-theme-md lg:justify-end lg:px-0 lg:shadow-none`}>
          <div className="flex items-center gap-2 2xsm:gap-3">
            <GamificationHUD />
            <ThemeToggleButton />
          </div>
          <UserDropdown />
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;