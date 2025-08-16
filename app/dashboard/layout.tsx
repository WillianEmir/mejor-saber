import { SidebarProvider } from '@/src/components/dashboard/context/SidebarContext';
import { ThemeProvider } from '@/src/components/dashboard/context/ThemeContext';

export default function AdminLayout({ children }: { children: React.ReactNode }) {

  return (
    <div className='dark:bg-gray-900'>
      <ThemeProvider>
        <SidebarProvider>{children}</SidebarProvider>
      </ThemeProvider>
    </div>
  );
}