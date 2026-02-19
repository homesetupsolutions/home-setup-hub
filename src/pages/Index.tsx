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


const Index = () => {
  return (
    <>
      <Helmet>
        <title>Home Setup Solutions | TV Mounting & Smart Home Installation Calgary</title>
        <meta
          name="description"
          content="Calgary's top-rated TV mounting, smart home setup, WiFi installation, security cameras, handyman & cleaning services. Serving Calgary, Airdrie, Cochrane & Okotoks. Book online 24/7!"
        />
        <meta name="keywords" content="TV mounting Calgary, smart home installation Calgary, WiFi setup Calgary, security camera install Calgary, handyman Calgary, home cleaning Calgary, Airdrie technician, Cochrane home setup, Okotoks TV install, home theater installation Calgary, computer repair Calgary, network setup Alberta, cable management Calgary, in-wall wiring Calgary, smart lighting Calgary, Google Home setup Calgary, Alexa installation Calgary, Ring doorbell install, Sonos setup Calgary, surround sound installation, furniture assembly Calgary, deep cleaning Calgary, move-in cleaning Calgary, move-out cleaning, home automation Calgary, tech support Calgary, same-day handyman Calgary, emergency TV mount, professional installer Calgary, home technology services Alberta, affordable handyman near me, best TV mounting service Calgary NE, TV mounting Calgary NW, TV mounting Calgary SE, TV mounting Calgary SW, Airdrie handyman, Cochrane smart home, Okotoks cleaning service, Chestermere home setup, High River technician, Canmore TV mounting, Banff home services" />
        <link rel="canonical" href="https://homesetupsolutions.ca" />
        <meta property="og:title" content="Home Setup Solutions | Calgary TV Mounting & Smart Home Installation" />
        <meta property="og:description" content="Professional TV mounting, smart home, WiFi, security camera, and handyman services in Calgary. Online booking available 24/7." />
        <meta property="og:url" content="https://homesetupsolutions.ca" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="en_CA" />
        <meta name="twitter:title" content="Home Setup Solutions | Calgary Home Tech Installers" />
        <meta name="twitter:description" content="TV mounting, smart home, WiFi & security camera installation in Calgary. Book online 24/7." />
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
            { "@type": "City", "name": "Okotoks" },
            { "@type": "City", "name": "Chestermere" },
            { "@type": "City", "name": "High River" },
            { "@type": "City", "name": "Canmore" },
            { "@type": "City", "name": "Banff" }
          ],
          "openingHoursSpecification": {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
            "opens": "08:00",
            "closes": "20:00"
          },
          "priceRange": "$$",
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "5.0",
            "reviewCount": "50"
          },
          "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "Home Setup Services",
            "itemListElement": [
              {"@type": "Offer", "itemOffered": {"@type": "Service", "name": "TV Mounting", "description": "Professional wall mount installation for any TV size including cable management"}},
              {"@type": "Offer", "itemOffered": {"@type": "Service", "name": "Smart Home Setup", "description": "Google Home, Alexa, smart lighting and home automation configuration"}},
              {"@type": "Offer", "itemOffered": {"@type": "Service", "name": "Network & WiFi Setup", "description": "Complete WiFi optimization, router setup, and mesh network installation"}},
              {"@type": "Offer", "itemOffered": {"@type": "Service", "name": "Security Camera Install", "description": "Ring, Nest, Arlo indoor/outdoor camera installation with app setup"}},
              {"@type": "Offer", "itemOffered": {"@type": "Service", "name": "Home Theater System", "description": "Full surround sound, projector, and audio/video system installation"}},
              {"@type": "Offer", "itemOffered": {"@type": "Service", "name": "Computer Setup & Repair", "description": "Desktop/laptop setup, data transfer, virus removal, and troubleshooting"}},
              {"@type": "Offer", "itemOffered": {"@type": "Service", "name": "General Handyman", "description": "Furniture assembly, shelf mounting, small repairs, and general home tasks"}},
              {"@type": "Offer", "itemOffered": {"@type": "Service", "name": "Home Cleaning", "description": "Professional deep cleaning, move-in/move-out cleaning service"}}
            ]
          }
        })}</script>
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            {"@type": "Question", "name": "What areas do you service?", "acceptedAnswer": {"@type": "Answer", "text": "We provide services throughout Calgary and all communities within a 150 km radius, including Airdrie, Cochrane, Chestermere, Okotoks, High River, Canmore, Banff, and nearby areas."}},
            {"@type": "Question", "name": "How do I book an appointment?", "acceptedAnswer": {"@type": "Answer", "text": "You can book an appointment through our online booking system by clicking Book Now on our website. You can also call us at 1-833-230-2933 or text 1-587-899-4357."}},
            {"@type": "Question", "name": "What is your cancellation policy?", "acceptedAnswer": {"@type": "Answer", "text": "We require 24 hours notice for cancellations. Cancellations made with less than 24 hours notice may incur a $40 cancellation fee."}},
            {"@type": "Question", "name": "Do you provide warranties on your work?", "acceptedAnswer": {"@type": "Answer", "text": "Yes! We offer a 30-day satisfaction guarantee on all installations. If something isn't right, we'll come back and fix it at no additional charge."}},
            {"@type": "Question", "name": "What payment methods do you accept?", "acceptedAnswer": {"@type": "Answer", "text": "We accept all major credit cards (Visa, Mastercard, American Express), debit cards, e-transfer, and cash."}},
            {"@type": "Question", "name": "How long does a typical TV mounting take?", "acceptedAnswer": {"@type": "Answer", "text": "A simple TV mount takes about 1-2 hours. Network setup is 2-3 hours. Full home theater installations can take 4-8 hours."}},
            {"@type": "Question", "name": "Do you offer same-day service?", "acceptedAnswer": {"@type": "Answer", "text": "Yes! We offer rush service for an additional fee, subject to technician availability. Contact us at 1-833-230-2933 for emergency requests."}},
            {"@type": "Question", "name": "Are your technicians insured?", "acceptedAnswer": {"@type": "Answer", "text": "Absolutely. All our technicians are fully insured, background-checked, and professionally trained with certifications in audio/video installation, network configuration, and smart home systems."}},
            {"@type": "Question", "name": "Can you hide cables in the wall?", "acceptedAnswer": {"@type": "Answer", "text": "Yes, we offer in-wall cable management for a clean, professional look. This involves running cables through the wall to hide them completely."}},
            {"@type": "Question", "name": "Do I need to provide equipment?", "acceptedAnswer": {"@type": "Answer", "text": "Typically, you provide the equipment (TV, speakers, etc.) and we handle the installation. However, we can source equipment for you at competitive prices if needed."}}
          ]
        })}</script>
      </Helmet>
      <Layout>
        <PromoBanner />
        
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