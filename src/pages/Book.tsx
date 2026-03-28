import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { Calendar, Clock, Shield, Star, Phone, Mail, LogIn, UserPlus } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const M365_BOOKING_URL = "https://outlook.office.com/book/HomeSetupSolutions1@homesetupsolutions.ca/?ismsaljsauthenabled";

const features = [
  {
    icon: Calendar,
    title: "Easy Online Scheduling",
    description: "Book your appointment 24/7 with our easy online system",
  },
  {
    icon: Clock,
    title: "Quick Service",
    description: "Most installations completed in under 2 hours",
  },
  {
    icon: Shield,
    title: "Guaranteed Quality",
    description: "100% satisfaction guaranteed on all services",
  },
];

const testimonials = [
  { name: "Sarah M.", text: "Amazing service! Evan was professional and thorough. Highly recommend!", rating: 5 },
  { name: "Mike T.", text: "Best cleaning service in Calgary. My house has never looked better.", rating: 5 },
  { name: "Jennifer L.", text: "Quick, reliable, and affordable. Will definitely book again!", rating: 5 },
];

const Book = () => {
  const { user, loading } = useAuth();

  return (
    <>
      <Helmet>
        <title>Book Online | TV Mounting & Smart Home Calgary | Home Setup Solutions</title>
        <meta
          name="description"
          content="Book your TV mounting, smart home, WiFi, security camera, handyman, or cleaning appointment online. Serving Calgary, Airdrie, Cochrane & Okotoks. Easy scheduling, satisfaction guaranteed."
        />
        <meta name="keywords" content="book TV mounting Calgary, schedule smart home install, online booking handyman Calgary, home setup appointment, book cleaning Calgary, schedule security camera install, same-day booking Calgary, weekend appointments available" />
        <link rel="canonical" href="https://homesetupsolutions.ca/book" />
        <meta property="og:title" content="Book Online | Home Setup Solutions Calgary" />
        <meta property="og:description" content="Schedule TV mounting, smart home, WiFi, or handyman services in Calgary. Book 24/7 online." />
        <meta property="og:url" content="https://homesetupsolutions.ca/book" />
      </Helmet>
      <Layout>
        {/* Hero Section */}
        <section className="relative py-12 md:py-20 bg-gradient-to-br from-primary/10 via-background to-accent/10">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Book Your <span className="text-primary">Appointment</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                {user
                  ? "Schedule your home setup service in just a few clicks. Choose your service, pick a time that works for you, and we'll handle the rest."
                  : "Create a free account or sign in to view our services, pricing, and book your appointment."}
              </p>

              {!loading && user ? (
                <Button asChild size="lg" className="text-lg px-8 py-6">
                  <a href={M365_BOOKING_URL} target="_self">
                    <Calendar className="w-5 h-5 mr-2" />
                    Book Now
                  </a>
                </Button>
              ) : !loading ? (
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Button asChild size="lg" className="text-lg px-8 py-6">
                    <Link to="/auth">
                      <UserPlus className="w-5 h-5 mr-2" />
                      Create Account
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6">
                    <Link to="/auth">
                      <LogIn className="w-5 h-5 mr-2" />
                      Sign In
                    </Link>
                  </Button>
                </div>
              ) : null}
            </motion.div>
          </div>
        </section>

        {/* Features */}
        <section className="py-8 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full border-0 bg-transparent shadow-none">
                    <CardContent className="p-4 text-center">
                      <feature.icon className="w-8 h-8 mx-auto mb-2 text-primary" />
                      <h3 className="font-semibold text-sm mb-1">{feature.title}</h3>
                      <p className="text-xs text-muted-foreground">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
              What Our Customers Say
            </h2>
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <Card className="h-full">
                    <CardContent className="p-6">
                      <div className="flex gap-1 mb-3">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">"{testimonial.text}"</p>
                      <p className="font-medium text-sm">— {testimonial.name}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="py-12 md:py-16 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Prefer to Talk to Someone?
            </h2>
            <p className="text-primary-foreground/80 mb-6 max-w-xl mx-auto">
              Our friendly team is here to help. Give us a call or send us a message.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="tel:+15878994357"
                className="inline-flex items-center gap-2 bg-background text-foreground px-6 py-3 rounded-lg font-medium hover:bg-background/90 transition-colors"
              >
                <Phone className="w-5 h-5" />
                (587) 899-4357
              </a>
              <a
                href="mailto:admin@homesetupsolutions.ca"
                className="inline-flex items-center gap-2 bg-primary-foreground/10 border border-primary-foreground/20 px-6 py-3 rounded-lg font-medium hover:bg-primary-foreground/20 transition-colors"
              >
                <Mail className="w-5 h-5" />
                admin@homesetupsolutions.ca
              </a>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default Book;
