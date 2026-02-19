import { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { ShootingStars } from "@/components/effects/ShootingStars";
import { MarbleBackground } from "@/components/effects/MarbleBackground";
import { BottomScrollBar } from "@/components/sections/BottomScrollBar";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col relative">
      <MarbleBackground />
      <ShootingStars />
      <Header />
      <main className="flex-1 pt-16 md:pt-20 pb-10 relative z-10">{children}</main>
      <Footer />
      <BottomScrollBar />
    </div>
  );
}
