import { Layout } from "@/components/layout/Layout";
import { HeroSection } from "@/components/sections/HeroSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { CTASection } from "@/components/sections/CTASection";
import { Helmet } from "react-helmet-async";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>Home Setup Solutions | Professional Home Technology Installation in Canada</title>
        <meta
          name="description"
          content="Expert home technology installation services across Canada. TV mounting, smart home setup, network installation, and more. Book your appointment today!"
        />
        <meta name="keywords" content="home setup, TV mounting, smart home installation, network setup, Canada" />
        <link rel="canonical" href="https://homesetupsolutions.ca" />
      </Helmet>
      <Layout>
        <HeroSection />
        <ServicesSection />
        <AboutSection />
        <CTASection />
        <ContactSection />
      </Layout>
    </>
  );
};

export default Index;