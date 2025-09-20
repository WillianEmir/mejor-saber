"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChartBarIcon,
  BookOpenIcon,
  RocketLaunchIcon,
  HandRaisedIcon,
  UserIcon, // Assuming you have a user icon
} from "@heroicons/react/24/outline";
import { useSidebarStore } from "@/src/store/sidebar.store";
import { type NavItem } from "@/src/types/dashboard";
import SidebarMenu from "./SidebarMenu";

// TODO: This should be dynamic based on the user's role
const userPath: NavItem[] = [
  {
    icon: <ChartBarIcon className="size-5.5" />,
    name: "Dashboard User",
    path: "/dashboard/user",
  },
  {
    icon: <ChartBarIcon className="size-5.5" />,
    name: "Simulacros",
    path: "/dashboard/user/simulacros",
  },
  {
    icon: <BookOpenIcon className="size-5.5" />,
    name: "Material de Estudio",
    path: "/dashboard/user/material-estudio",
  },
  {
    icon: <RocketLaunchIcon className="size-5.5" />,
    name: "Mi Progreso",
    path: "/dashboard/user/mi-progreso",
  },
  {
    icon: <RocketLaunchIcon className="size-5.5" />,
    name: "Ranking",
    path: "/dashboard/user/ranking",
  },
  {
    icon: <HandRaisedIcon className="size-5.5" />,
    name: "Ejercicios de Práctica",
    path: "/dashboard/user/ejercicios-practica",
  },
];

const adminPath: NavItem[] = [
  {
    icon: <ChartBarIcon className="size-5.5" />,
    name: "Dashboard Admin",
    path: '/dashboard/admin'
  }, {
    icon: <ChartBarIcon className="size-5.5" />,
    name: "Áreas",
    path: '/dashboard/admin/areas'
  }, {
    icon: <ChartBarIcon className="size-5.5" />,
    name: "Preguntas",
    path: '/dashboard/admin/preguntas'
  }, {
    icon: <ChartBarIcon className="size-5.5" />,
    name: "Contenidos Curriculares",
    path: '/dashboard/admin/contenidos-curriculares'
  }, {
    icon: <ChartBarIcon className="size-5.5" />,
    name: "Admin Usuarios",
    path: '/dashboard/admin/users'
  },
]; 

const adminSchoolPath: NavItem[] = [
  {
    icon: <ChartBarIcon className="size-5.5" />,
    name: "Dashboard Admin School",
    path: '/dashboard/school'
  }, {
    icon: <ChartBarIcon className="size-5.5" />,
    name: "Admin School Usuarios",
    path: '/dashboard/school/adminschool-users'
  }, {
    icon: <ChartBarIcon className="size-5.5" />,
    name: "Reportes",
    path: '/dashboard/school/reports'
  }, {
    icon: <ChartBarIcon className="size-5.5" />,
    name: "Estudiantes",
    path: '/dashboard/school/students'
  },
];

const AppSidebar: React.FC = () => {

  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebarStore();
  const pathname = usePathname();

  // TODO: Replace with actual user data
  const user = {
    name: "John Doe",
    email: "john.doe@example.com",
    avatar: "/images/user/user-01.png", // Replace with actual avatar
  };

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${
          isExpanded || isMobileOpen
            ? "w-[290px]"
            : isHovered
            ? "w-[290px]"
            : "w-[90px]"
        }
        ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`${!isMobileOpen ? "py-8" : "pt-3"} flex ${
          !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
        }`}
      >
        <Link href="/">
          {isExpanded || isHovered || isMobileOpen ? (
            <h1 className="font-bold text-2xl max-md:hidden">SABER YA!</h1>
          ) : (
            <h1 className="font-bold text-xl max-md:hidden">SY!</h1>
          )}
        </Link>
      </div>

      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <SidebarMenu navItems={userPath} title="User" />
        </nav>
        <nav className="mb-6">
          <SidebarMenu navItems={adminPath} title="Admin" />
        </nav>
        <nav className="mb-6">
          <SidebarMenu navItems={adminSchoolPath} title="Admin School" />
        </nav>
      </div>

      {/* <div className="mt-auto mb-6">
        <Link href="/dashboard/user/profile">
          <div className="flex items-center gap-4 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
            <img
              src={user.avatar}
              alt="User avatar"
              className="w-10 h-10 rounded-full"
            />
            {(isExpanded || isHovered) && (
              <div>
                <p className="font-semibold text-gray-800 dark:text-gray-200">{
                  user.name
                }</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{
                  user.email
                }</p>
              </div>
            )}
          </div>
        </Link>
      </div> */}
    </aside>
  );
};

export default AppSidebar;