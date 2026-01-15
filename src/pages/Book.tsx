import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { Calendar, Clock, Shield, Phone, Star, ExternalLink, MessageSquare, MapPin } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const M365_BOOKING_URL = 'https://outlook.office.com/book/allbookings@homesetupsolutions.ca/';

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
        <title>Book an Appointment | Home Setup Solutions Calgary</title>
        <meta
          name="description"
          content="Book your home cleaning, handyman, or smart home installation appointment online. Serving Calgary and surrounding areas. Quick and easy scheduling!"
        />
      </Helmet>
      <Layout>
        {/* Hero Section */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-8"
            >
              <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                Book Online 24/7
              </span>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                Schedule Your <span className="text-gradient-orange">Appointment</span>
              </h1>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Choose your service and book online instantly. We'll confirm your appointment via text message.
              </p>
            </motion.div>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
            >
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="flex items-start gap-4 p-6 rounded-xl bg-card border border-border"
                >
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Embedded M365 Booking */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-12"
            >
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="bg-muted/50 p-4 flex items-center justify-between border-b">
                    <div>
                      <h2 className="font-semibold text-lg">Select a Service & Book</h2>
                      <p className="text-sm text-muted-foreground">Choose from our available services below</p>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <a href={M365_BOOKING_URL} target="_blank" rel="noopener noreferrer" className="gap-2">
                        <ExternalLink className="h-4 w-4" />
                        Open Full Screen
                      </a>
                    </Button>
                  </div>
                  <div className="w-full" style={{ height: '800px' }}>
                    <iframe
                      src={M365_BOOKING_URL}
                      title="Book an Appointment with Home Setup Solutions"
                      className="w-full h-full border-0"
                      allow="payment"
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Testimonials */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mb-12"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">What Our Customers Say</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {testimonials.map((testimonial, index) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex gap-1 mb-3">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <p className="text-muted-foreground mb-4">"{testimonial.text}"</p>
                      <p className="font-medium">— {testimonial.name}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>

            {/* CTA Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-2xl p-8 md:p-12 text-center"
            >
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Need Help Booking?</h2>
              <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                Give us a call or send a text if you have any questions about our services!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild>
                  <a href="tel:18332302933" className="gap-2">
                    <Phone className="h-5 w-5" />
                    Call 1-833-230-2933
                  </a>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <a href="sms:15876045127" className="gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Text 587-604-5127
                  </a>
                </Button>
              </div>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-12 text-center"
            >
              <div className="flex flex-wrap justify-center gap-6 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-primary" />
                  <span>1-833-230-2933</span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-primary" />
                  <span>Text: 587-604-5127</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span>Serving Calgary & Area</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default Book;
