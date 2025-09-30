import { Separator } from "@/src/components/ui/separator";
import { SidebarNav } from "@/src/components/dashboard/profile/sidebar-nav";

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
  return (
    <div className=" space-y-6 p-10 pb-16 md:block">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Configuración</h2>
        <p className="text-muted-foreground">
          Gestiona la configuración de tu cuenta.
        </p>
      </div>
      <Separator className="my-6" />
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside className="-mx-4 lg:w-1/5">
          <SidebarNav items={sidebarNavItems} />
        </aside>
        <div className="flex-1 lg:max-w-2xl">{children}</div>
      </div>
    </div>
  );
}
