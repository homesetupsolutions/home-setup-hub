import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { Calendar, Clock, Shield, Star, Phone, Mail, MapPin } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { Card, CardContent } from "@/components/ui/card";

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
  return (
    <>
      <Helmet>
        <title>Book an Appointment | Home Setup Solutions</title>
        <meta
          name="description"
          content="Schedule your home technology installation service today. Easy online booking for TV mounting, smart home setup, and more."
        />
      </Helmet>
      <Layout>
        {/* Hero Section */}
        <section className="relative py-16 md:py-24 bg-gradient-to-br from-primary/10 via-background to-accent/10">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Book Your <span className="text-primary">Appointment</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Schedule your home setup service in just a few clicks. Choose your service, 
                pick a time that works for you, and we'll handle the rest.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Features */}
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full">
                    <CardContent className="p-6 text-center">
                      <feature.icon className="w-10 h-10 mx-auto mb-4 text-primary" />
                      <h3 className="font-semibold mb-2">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* M365 Bookings Embed */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="max-w-5xl mx-auto"
            >
              <div className="bg-card rounded-xl shadow-lg overflow-hidden border">
                <div className="p-4 md:p-6 bg-muted/50 border-b">
                  <h2 className="text-xl font-semibold text-center">Select Your Service & Time</h2>
                  <p className="text-sm text-muted-foreground text-center mt-1">
                    Choose from our available services and book your preferred time slot
                  </p>
                </div>
                <div className="relative w-full" style={{ paddingBottom: "150%", minHeight: "600px" }}>
                  <iframe
                    src="https://outlook.office.com/book/allbookings@homesetupsolutions.ca/"
                    title="Book an Appointment - Home Setup Solutions"
                    className="absolute inset-0 w-full h-full border-0"
                    allow="payment"
                    loading="lazy"
                  />
                </div>
              </div>
            </motion.div>
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
                href="mailto:info@homesetupsolutions.ca"
                className="inline-flex items-center gap-2 bg-primary-foreground/10 border border-primary-foreground/20 px-6 py-3 rounded-lg font-medium hover:bg-primary-foreground/20 transition-colors"
              >
                <Mail className="w-5 h-5" />
                info@homesetupsolutions.ca
              </a>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default Book;
