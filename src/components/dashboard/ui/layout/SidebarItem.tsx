"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { type NavItem } from "@/src/types/dashboard";

interface SidebarItemProps {
  item: NavItem;
  isActive: boolean;
  isExpanded: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ item, isActive, isExpanded }) => {
  const pathname = usePathname();
  const { name, icon, path, subItems } = item;
  const [isOpen, setIsOpen] = useState(false);
  const [subMenuHeight, setSubMenuHeight] = useState<number>(0);
  const subMenuRef = useRef<HTMLUListElement>(null);

  const isSubMenuActive = subItems?.some((sub) => sub.path === pathname);

  useEffect(() => {
    if (isSubMenuActive) {
      setIsOpen(true);
    }
  }, [isSubMenuActive]);

  useEffect(() => {
    if (subMenuRef.current) {
      setSubMenuHeight(isOpen ? subMenuRef.current.scrollHeight : 0);
    }
  }, [isOpen, isExpanded]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  if (subItems) {
    return (
      <li>
        <button
          onClick={handleToggle}
          className={`menu-item group w-full ${
            isSubMenuActive ? "menu-item-active" : "menu-item-inactive"
          } ${
            !isExpanded ? "lg:justify-center" : "lg:justify-start"
          }`}
        >
          <span className={`${isSubMenuActive ? "menu-item-icon-active" : "menu-item-icon-inactive"}`}>
            {icon}
          </span>
          {isExpanded && <span className="menu-item-text">{name}</span>}
          {isExpanded && (
            <ChevronDownIcon
              className={`ml-auto w-5 h-5 transition-transform duration-200 ${isOpen ? "rotate-180 text-brand-500" : ""}`}
            />
          )}
        </button>
        {isExpanded && (
          <div
            className="overflow-hidden transition-all duration-300"
            style={{ height: subMenuHeight }}
          >
            <ul ref={subMenuRef} className="mt-2 space-y-1 ml-9">
              {subItems.map((subItem) => (
                <li key={subItem.name}>
                  <Link
                    href={subItem.path}
                    className={`menu-dropdown-item ${
                      pathname === subItem.path
                        ? "menu-dropdown-item-active"
                        : "menu-dropdown-item-inactive"
                    }`}
                  >
                    {subItem.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </li>
    );
  }

  return (
    <li>
      <Link
        href={path || "#"}
        className={`menu-item group ${
          isActive ? "menu-item-active" : "menu-item-inactive"
        } ${
          !isExpanded ? "lg:justify-center" : "lg:justify-start"
        }`}
      >
        <span className={`${isActive ? "menu-item-icon-active" : "menu-item-icon-inactive"}`}>
          {icon}
        </span>
        {isExpanded && <span className="menu-item-text">{name}</span>}
      </Link>
    </li>
  );
};

export default SidebarItem;
