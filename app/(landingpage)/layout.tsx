import Footer from "@/app/(landingpage)/components/Footer";
import TopMenu from "@/app/(landingpage)/components/TopMenu";

export default function LandingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <TopMenu />
      <main className="flex-grow">
        {children}
      </main>
      <Footer /> 
    </div>
  );
}