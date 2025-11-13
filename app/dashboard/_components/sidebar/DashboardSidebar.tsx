"use client";

import React, { ReactNode } from "react";
import Link from "next/link";
import { useSidebarStore } from "@/src/store/sidebar.store";
import SidebarMenu from "./SidebarMenu";
import { ChartBarIcon, BookOpenIcon, RocketLaunchIcon, UsersIcon, AcademicCapIcon, ClipboardDocumentListIcon, BuildingLibraryIcon, UserGroupIcon, DocumentChartBarIcon, UserPlusIcon } from "@heroicons/react/24/outline";
import { useCurrentUser } from "@/src/hooks/use-current-user";
import Image from "next/image";

export interface NavItem {
  name: string;
  path?: string;
  icon: ReactNode;
  subItems?: NavItem[];
}

// TODO: This should be dynamic based on the user's role 
const userPath: NavItem[] = [
  {
    icon: <ChartBarIcon className="size-5.5" />,
    name: "Mi Progreso",
    path: "/dashboard/user",
  },
  {
    icon: <RocketLaunchIcon className="size-5.5" />,
    name: "Simulacros",
    path: "/dashboard/user/simulacros",
  },
  {
    icon: <BookOpenIcon className="size-5.5" />,
    name: "Material de Repaso",
    path: "/dashboard/user/material-repaso",
  },
  {
    icon: <UsersIcon className="size-5.5" />,
    name: "Ranking",
    path: "/dashboard/user/ranking",
  },
];

const adminPath: NavItem[] = [
  {
    icon: <ChartBarIcon className="size-5.5" />,
    name: "Dashboard Admin",
    path: "/dashboard/admin",
  },
  {
    icon: <AcademicCapIcon className="size-5.5" />,
    name: "Áreas",
    path: "/dashboard/admin/areas",
  },
  {
    icon: <ClipboardDocumentListIcon className="size-5.5" />,
    name: "Preguntas",
    path: "/dashboard/admin/preguntas",
  },
  {
    icon: <BookOpenIcon className="size-5.5" />,
    name: "Contenidos Curriculares",
    path: "/dashboard/admin/contenidos-curriculares",
  },
  {
    icon: <BookOpenIcon className="size-5.5" />,
    name: "Niveles de Desempeño",
    path: "/dashboard/admin/niveles-desempeno",
  },
  {
    icon: <UserGroupIcon className="size-5.5" />,
    name: "Admin Usuarios",
    path: "/dashboard/admin/users",
  },
  {
    icon: <BuildingLibraryIcon className="size-5.5" />,
    name: "Admin Schools",
    path: "/dashboard/admin/schools",
  },
  {
    icon: <UsersIcon className="size-5.5" />,
    name: "Testimonios",
    path: "/dashboard/admin/testimonios",
  },
];

const schoolPath: NavItem[] = [
  {
    icon: <ChartBarIcon className="size-5.5" />,
    name: "Dashboard",
    path: "/dashboard/school",
  },
  {
    icon: <ChartBarIcon className="size-5.5" />,
    name: "Progreso Institucional",
    path: "/dashboard/school/progreso-institucional",
  },
  {
    icon: <ChartBarIcon className="size-5.5" />,
    name: "Sedes",
    path: "/dashboard/school/sedes",
  },
  {
    icon: <UserPlusIcon className="size-5.5" />,
    name: "School Usuarios",
    path: "/dashboard/school/school-users",
  },
  {
    icon: <DocumentChartBarIcon className="size-5.5" />,
    name: "Reportes",
    path: "/dashboard/school/reports",
  },
];

const DashboardSidebar: React.FC = () => {

  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebarStore();
  const { data } = useCurrentUser()
  const userRole = data?.user.role;

  let navConfig: { title: string; navItems: NavItem[] }[] = [];

  if (userRole === 'ADMIN') {
    navConfig = [
      {
        title: "Admin",
        navItems: adminPath,
      },
      {
        title: "School",
        navItems: schoolPath,
      },
      {
        title: "User",
        navItems: userPath,
      },
    ];
  } else if (userRole === 'ADMINSCHOOL') {
    navConfig = [
      {
        title: "School",
        navItems: schoolPath,
      },
    ];
  } else if (userRole === 'USER') {
    navConfig = [
      {
        title: "User",
        navItems: userPath,
      },
    ];
  }

  const isSidebarExpanded = isExpanded || isHovered || isMobileOpen;

  return (
    <aside
      className={`fixed z-sticky mt-16 flex flex-col max-sm:w-full lg:mt-0 top-0 px-4 left-0 bg-white dark:bg-neutral-dark dark:border-neutral-light h-screen transition-all duration-300 ease-in-out  border-r border-gray-200 ${isSidebarExpanded ? "w-72" : "w-20"
        } ${isMobileOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`flex items-center ${!isMobileOpen ? "py-6" : "py-2"} ${!isSidebarExpanded ? "lg:justify-center" : "justify-start pl-2"} max-lg:hidden`}>
        {isSidebarExpanded ? (
          <div className="flex items-center justify-center lg:flex-1">
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
        ) : "MS!"}
      </div>

      <div className="flex flex-col overflow-y-auto scrollbar-hide duration-300 ease-linear pt-2">
        {navConfig.map((nav) => (
          <nav className="mb-6" key={nav.title}>
            <SidebarMenu navItems={nav.navItems} title={nav.title} />
          </nav>
        ))}
      </div>

      <div className="mt-auto py-1 border-t max-lg:mb-15 border-gray-300 dark:border-neutral-light/30 overflow-clip">
        <Link href="/dashboard/profile">
          <div className="flex items-center gap-4 p-1 rounded-md hover:bg-primary/10 transition-all duration-200 dark:hover:bg-neutral-dark">
            <Image
              src={data?.user.image || "/images/default-avatar.png"} //TODO: Add default user image
              alt="User image"
              width={50}
              height={50}
              className="w-10 h-10 rounded-full"
            />
            <div className={`transition-opacity duration-300 ${isSidebarExpanded ? "opacity-100" : "opacity-0"}`}>
              <p className="font-semibold text-gray-800 dark:text-gray-200 whitespace-nowrap">
                {data?.user.name}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                {data?.user.email}
              </p>
            </div>
          </div>
        </Link>
      </div>
    </aside>
  );
};

export default DashboardSidebar;