import { Helmet } from "react-helmet-async";
import { Link, useParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, MapPin, Phone, Calendar } from "lucide-react";
import { serviceCities } from "@/data/serviceCities";
import NotFound from "./NotFound";

const SITE = "https://homesetupsolutions.ca";

const ServiceArea = () => {
  const { slug } = useParams<{ slug: string }>();
  const city = serviceCities.find((c) => c.slug === slug);

  if (!city) return <NotFound />;

  const url = `${SITE}/service-areas/${city.slug}`;
  const title = `TV Mounting & Smart Home Installation in ${city.name}, BC | Home Setup Solutions`;
  const description = `${city.intro} Book online 24/7 or call 1-833-230-2933.`;

  const ldJson = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: `Home Setup Solutions — ${city.name}`,
    description,
    url,
    telephone: "+16729658555",
    email: "admin@homesetupsolutions.ca",
    address: {
      "@type": "PostalAddress",
      addressLocality: city.name,
      addressRegion: "BC",
      addressCountry: "CA",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: city.latitude,
      longitude: city.longitude,
    },
    areaServed: { "@type": "City", name: city.name },
    priceRange: "$$",
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "09:00",
      closes: "21:00",
    },
  };

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={url} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={url} />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">{JSON.stringify(ldJson)}</script>
      </Helmet>
      <Layout>
        <section className="pt-32 pb-16 md:pt-40 md:pb-24 relative">
          <div className="container mx-auto px-6 md:px-8 max-w-5xl">
            <Link to="/" className="text-sm text-muted-foreground hover:text-primary inline-flex items-center gap-1 mb-6">
              ← Home
            </Link>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-primary text-sm font-medium mb-6">
              <MapPin className="w-4 h-4" />
              {city.region} · {city.distanceKm} km from Vancouver
            </span>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
              Home Tech Installer in{" "}
              <span className="text-gradient-orange">{city.name}, BC</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl mb-10">
              {city.intro}
            </p>

            <div className="flex flex-wrap gap-4 mb-16">
              <Button asChild size="lg" className="gap-2">
                <a href="https://outlook.office.com/book/HomeSetupSolutions1@homesetupsolutions.ca/?ismsaljsauthenabled" target="_blank" rel="noopener noreferrer">
                  <Calendar className="w-5 h-5" />
                  Book {city.name} Service
                </a>
              </Button>
              <Button asChild size="lg" variant="outline" className="gap-2">
                <a href="tel:18332302933">
                  <Phone className="w-5 h-5" />
                  Call 1-833-230-2933
                </a>
              </Button>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-16">
              <Card className="glass-card">
                <CardContent className="pt-6">
                  <h2 className="text-2xl font-semibold mb-4">Neighbourhoods we serve in {city.name}</h2>
                  <ul className="grid grid-cols-2 gap-2">
                    {city.neighborhoods.map((n) => (
                      <li key={n} className="flex items-center gap-2 text-sm">
                        <Check className="w-4 h-4 text-primary" />
                        {n}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              <Card className="glass-card">
                <CardContent className="pt-6">
                  <h2 className="text-2xl font-semibold mb-4">Why {city.name} homes choose us</h2>
                  <ul className="space-y-3">
                    {city.highlights.map((h) => (
                      <li key={h} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                        {h}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            <Card className="glass-card">
              <CardContent className="pt-6">
                <h2 className="text-2xl font-semibold mb-4">Services available in {city.name}</h2>
                <div className="grid sm:grid-cols-2 gap-3 text-sm">
                  {[
                    "TV Mounting (any size)",
                    "Home Theatre & Soundbar",
                    "Smart Home (Google, Alexa, Apple HomeKit)",
                    "WiFi Mesh & Networking",
                    "Security Cameras (Ring, Nest, Arlo)",
                    "Video Doorbell Install",
                    "Computer & Printer Setup",
                    "Furniture Assembly",
                    "Picture & Shelf Mounting",
                    "Deep / Move-in / Move-out Cleaning",
                  ].map((s) => (
                    <div key={s} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-primary" />
                      {s}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="mt-16 pt-10 border-t border-border">
              <h3 className="text-lg font-semibold mb-4">Nearby service areas</h3>
              <div className="flex flex-wrap gap-2">
                {serviceCities
                  .filter((c) => c.slug !== city.slug)
                  .map((c) => (
                    <Link
                      key={c.slug}
                      to={`/service-areas/${c.slug}`}
                      className="px-4 py-2 rounded-full glass-card text-sm hover:text-primary transition-colors"
                    >
                      {c.name}
                    </Link>
                  ))}
              </div>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default ServiceArea;
