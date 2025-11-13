"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { useSidebarStore } from "@/src/store/sidebar.store";
import SidebarItem from "./SidebarItem";
import { NavItem } from "./DashboardSidebar";

interface SidebarMenuProps {
  navItems: NavItem[];
  title: string;
} 

const SidebarMenu: React.FC<SidebarMenuProps> = ({ navItems, title }) => {
  const pathname = usePathname();
  const { isExpanded, isHovered, isMobileOpen } = useSidebarStore();

  const isSidebarExpanded = isExpanded || isHovered || isMobileOpen;

  const isActive = (path: string) => pathname === path;

  const titleClasses = `mb-4 text-xs uppercase flex leading-[20px] text-neutral-dark/80 dark:text-neutral-light ${
    !isSidebarExpanded ? "lg:justify-center" : "justify-start"
  }`;

  return (
    <div>
      <h2 className={titleClasses}>
        {isSidebarExpanded ? (
          title
        ) : (
          <span className="w-full text-center">---</span>
        )}
      </h2>
      <ul className="flex flex-col gap-2">
        {navItems.map((item) => (
          <SidebarItem
            key={item.name}
            item={item}
            isActive={isActive(item.path || "")}
            isExpanded={isSidebarExpanded}
          />
        ))}
      </ul>
    </div>
  );
};

export default SidebarMenu;
