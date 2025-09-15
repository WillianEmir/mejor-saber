"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { useSidebarStore } from "@/src/store/sidebar.store";
import { type NavItem } from "@/src/types/dashboard";
import SidebarItem from "./SidebarItem";

interface SidebarMenuProps {
  navItems: NavItem[];
  title: string;
}

const SidebarMenu: React.FC<SidebarMenuProps> = ({ navItems, title }) => {
  const pathname = usePathname();
  const { isExpanded, isHovered, isMobileOpen } = useSidebarStore();

  const isActive = (path: string) => pathname === path;

  return (
    <div>
      <h2
        className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
          !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
        }`}
      >
        {isExpanded || isHovered || isMobileOpen ? (
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
            isExpanded={isExpanded || isHovered || isMobileOpen}
          />
        ))}
      </ul>
    </div>
  );
};

export default SidebarMenu;
