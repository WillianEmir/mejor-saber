'use client';

import { usePathname, useRouter } from "next/navigation";
import { Separator } from "@/src/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/src/components/ui/tabs";

const sidebarNavItems = [
  {
    title: "Perfil",
    href: "/dashboard/profile",
  },
  {
    title: "Cambiar Contraseña",
    href: "/dashboard/profile/change-password",
  },
];

interface ProfileLayoutProps {
  children: React.ReactNode;
}

export default function ProfileLayout({ children }: ProfileLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="space-y-6 p-4 md:p-10 pb-16">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight dark:text-neutral-light">Configuración</h2>
        <p className="dark:text-neutral-light">
          Gestiona la configuración de tu cuenta.
        </p>
      </div>
      <Separator className="my-6" />
      <div className="flex flex-col space-y-8">
        <Tabs
          value={pathname}
          onValueChange={(value) => router.push(value)}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
            {sidebarNavItems.map((item) => (
              <TabsTrigger key={item.href} value={item.href} className={`${pathname === item.href ? "bg-primary text-white" : ""} cursor-pointer`}>
                {item.title}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}