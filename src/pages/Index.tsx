import { Layout } from "@/components/layout/Layout";
import { HeroSection } from "@/components/sections/HeroSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { CTASection } from "@/components/sections/CTASection";
import { LiveChat } from "@/components/chat/LiveChat";
import { Helmet } from "react-helmet-async";

import { BeforeAfterGallery } from "@/components/sections/BeforeAfterGallery";
import { FAQSection } from "@/components/sections/FAQSection";
import { ReferralProgram } from "@/components/sections/ReferralProgram";
import { NewsletterSignup } from "@/components/sections/NewsletterSignup";
import { ServiceAreaMap } from "@/components/sections/ServiceAreaMap";
import { GoogleReviews } from "@/components/sections/GoogleReviews";
import { PromoBanner } from "@/components/sections/PromoBanner";
import { RunningBanner } from "@/components/sections/RunningBanner";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>Home Setup Solutions | TV Mounting & Smart Home Installation Calgary</title>
        <meta
          name="description"
          content="Calgary's top-rated TV mounting, smart home setup, WiFi installation, security cameras, handyman & cleaning services. Serving Calgary, Airdrie, Cochrane & Okotoks. Book online 24/7!"
        />
        <meta name="keywords" content="TV mounting Calgary, smart home installation Calgary, WiFi setup, security camera install Calgary, handyman Calgary, home cleaning Calgary, Airdrie, Cochrane, Okotoks, home theater installation, computer repair Calgary" />
        <link rel="canonical" href="https://homesetupsolutions.ca" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          "name": "Home Setup Solutions",
          "description": "Professional home technology installation services in Calgary. TV mounting, smart home setup, WiFi, security cameras, handyman and cleaning.",
          "url": "https://homesetupsolutions.ca",
          "telephone": "+15878994357",
          "email": "info@homesetupsolutions.ca",
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "Calgary",
            "addressRegion": "AB",
            "addressCountry": "CA"
          },
          "geo": {
            "@type": "GeoCoordinates",
            "latitude": "51.0447",
            "longitude": "-114.0719"
          },
          "areaServed": [
            { "@type": "City", "name": "Calgary" },
            { "@type": "City", "name": "Airdrie" },
            { "@type": "City", "name": "Cochrane" },
            { "@type": "City", "name": "Okotoks" }
          ],
          "openingHoursSpecification": {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
            "opens": "08:00",
            "closes": "20:00"
          },
          "priceRange": "$$",
          "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "Home Setup Services",
            "itemListElement": [
              {"@type": "Offer", "itemOffered": {"@type": "Service", "name": "TV Mounting", "description": "Professional wall mount installation for any TV size"}},
              {"@type": "Offer", "itemOffered": {"@type": "Service", "name": "Smart Home Setup", "description": "Voice assistant, smart lighting, and home automation"}},
              {"@type": "Offer", "itemOffered": {"@type": "Service", "name": "Network & WiFi Setup", "description": "Complete WiFi optimization and router setup"}},
              {"@type": "Offer", "itemOffered": {"@type": "Service", "name": "Security Camera Install", "description": "Indoor/outdoor camera installation with app setup"}},
              {"@type": "Offer", "itemOffered": {"@type": "Service", "name": "Home Theater System", "description": "Full audio/video system with surround sound"}},
              {"@type": "Offer", "itemOffered": {"@type": "Service", "name": "General Handyman", "description": "Furniture assembly, repairs, and general tasks"}},
              {"@type": "Offer", "itemOffered": {"@type": "Service", "name": "Home Cleaning", "description": "Professional deep cleaning service"}}
            ]
          }
        })}</script>
      </Helmet>
      <Layout>
        <PromoBanner />
        <RunningBanner />
        <HeroSection />
        <ServicesSection />
        
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