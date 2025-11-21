"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { NavItem } from "./DashboardSidebar";
import { useSidebarStore } from "@/src/store/sidebar.store";

interface SidebarItemProps {
  item: NavItem;
  isActive: boolean;
  isExpanded: boolean; 
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  item,
  isActive,
  isExpanded,
}) => {
  const pathname = usePathname();
  const { name, icon, path, subItems } = item;
  const [isOpen, setIsOpen] = useState(false);
  const [subMenuHeight, setSubMenuHeight] = useState<number>(0);
  const subMenuRef = useRef<HTMLUListElement>(null);

  const { toggleMobileSidebar } = useSidebarStore();

  const handleSidebarToggle = () => {
    if (window.innerWidth <= 1024) {
      toggleMobileSidebar();
    }
  };

  const isSubMenuActive = subItems?.some((sub) => sub.path === pathname);

  useEffect(() => {
    if (isSubMenuActive) {
      setIsOpen(true);
    }
  }, [isSubMenuActive]);

  useEffect(() => {
    if (subMenuRef.current) {
      setSubMenuHeight(isOpen && isExpanded ? subMenuRef.current.scrollHeight : 0);
    }
  }, [isOpen, isExpanded]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const menuItemClasses = `flex items-center gap-2 w-full py-2 px-1 rounded-md hover:bg-primary/10 group transition-colors duration-200 ${
    isSubMenuActive ? "text-primary" : "dark:text-neutral-light"
  } ${!isExpanded ? "lg:justify-center" : "lg:justify-start"}`;

  const linkClasses = `flex gap-2 py-2 px-1 hover:bg-primary/10 rounded-md items-center w-full transition-colors duration-200 ${
    isActive ? "text-primary" : ""
  } ${!isExpanded ? "lg:justify-center" : "lg:justify-start"}`;

  if (subItems) {
    return (
      <li>
        <button onClick={handleToggle} className={menuItemClasses}>
          <span>{icon}</span>
          {isExpanded && <span>{name}</span>}
          {isExpanded && (
            <ChevronDownIcon
              className={`ml-auto w-5 h-5 transition-transform duration-200 ${
                isOpen ? "rotate-180 text-primary" : ""
              }`}
            ></ChevronDownIcon>
          )}
        </button>
        <div
          className="overflow-hidden transition-all duration-300"
          style={{ height: subMenuHeight }}
        >
          {isExpanded && (
            <ul ref={subMenuRef} className="space-y-1 ml-9">
              {subItems.map((subItem) => (
                <li key={subItem.name}>
                  <Link
                    href={subItem.path || "#"}
                    onClick={handleSidebarToggle}
                    className={`block w-full px-3 py-1.5 text-sm rounded-md transition-colors duration-200 ${
                      pathname === subItem.path
                        ? "bg-primary/10 text-primary font-semibold"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-neutral-dark"
                    }`}
                  >
                    {subItem.name}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </li>
    );
  }

  return (
    <li>
      <Link href={path || "#"} className={linkClasses} onClick={handleSidebarToggle}>
        <span className={`${isActive ? "text-primary" : ""} dark:text-neutral-light`}>
          {icon}
        </span>
        {isExpanded && <span className="dark:text-neutral-light">{name}</span>}
      </Link>
    </li>
  );
};

export default SidebarItem;