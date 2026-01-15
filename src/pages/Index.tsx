import { Layout } from "@/components/layout/Layout";
import { HeroSection } from "@/components/sections/HeroSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { CTASection } from "@/components/sections/CTASection";
import { LiveChat } from "@/components/chat/LiveChat";
import { Helmet } from "react-helmet-async";
import { QuoteCalculator } from "@/components/sections/QuoteCalculator";
import { BeforeAfterGallery } from "@/components/sections/BeforeAfterGallery";
import { FAQSection } from "@/components/sections/FAQSection";
import { ReferralProgram } from "@/components/sections/ReferralProgram";
import { NewsletterSignup } from "@/components/sections/NewsletterSignup";
import { ServiceAreaMap } from "@/components/sections/ServiceAreaMap";
import { GoogleReviews } from "@/components/sections/GoogleReviews";
import { PromoBanner } from "@/components/sections/PromoBanner";

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
      <PromoBanner />
      <Layout>
        <HeroSection />
        <ServicesSection />
        <QuoteCalculator />
        <BeforeAfterGallery />
        <GoogleReviews />
        <AboutSection />
        <ServiceAreaMap />
        <FAQSection />
        <ReferralProgram />
        <CTASection />
        <NewsletterSignup />
        <ContactSection />
        <LiveChat />
      </Layout>
    </>
  );
};

export default Index;