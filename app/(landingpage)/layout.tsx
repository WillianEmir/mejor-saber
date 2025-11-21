import Footer from "@/app/(landingpage)/_components/Footer";
import ScrollToTopButton from "./_components/ScrollToTopButton";
import TopMenu from "@/app/(landingpage)/_components/TopMenu";

export default function LandingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <TopMenu />
      <main className="flex-grow">
        {children}
      </main>
      <Footer /> 
      <ScrollToTopButton />
    </div>
  );
}