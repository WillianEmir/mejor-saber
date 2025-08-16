import Footer from "@/src/components/landing/ui/Footer";
import TopMenu from "@/src/components/landing/ui/TopMenu";

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen">
      <TopMenu />
      {children}
      <Footer />
    </main>
  );
}