import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { Calendar, Clock, Shield, Phone } from "lucide-react";
import { Helmet } from "react-helmet-async";

const features = [
  {
    icon: Calendar,
    title: "Easy Scheduling",
    description: "Choose the date and time that works best for you",
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

const Book = () => {
  return (
    <>
      <Helmet>
        <title>Book an Appointment | Home Setup Solutions</title>
        <meta
          name="description"
          content="Book your home technology installation appointment online. Quick and easy scheduling for TV mounting, smart home setup, and more."
        />
      </Helmet>
      <Layout>
        <section className="py-12 md:py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                Book Online
              </span>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                Schedule Your <span className="text-gradient-orange">Appointment</span>
              </h1>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Select your service and preferred time below. We'll confirm your appointment via text message.
              </p>
            </motion.div>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
            >
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="flex items-start gap-4 p-6 rounded-xl bg-card border border-border"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <feature.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Square Booking Embed - Full Width */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="w-full"
            >
              <div className="w-full min-h-[800px] md:min-h-[900px]">
                <iframe
                  src="https://book.squareup.com/appointments/ygqnrdv6a907zu/location/LBJ4C01HMM5JH/services"
                  title="Book an Appointment with Home Setup Solutions"
                  className="w-full h-[800px] md:h-[900px] border-0 rounded-xl"
                  allow="payment"
                />
              </div>
            </motion.div>

            {/* Alternative Contact */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-center mt-12"
            >
              <p className="text-muted-foreground mb-4">
                Prefer to book by phone? Call us directly:
              </p>
              <a
                href="tel:8332302933"
                className="inline-flex items-center gap-2 text-xl font-semibold text-primary hover:underline"
              >
                <Phone className="w-5 h-5" />
                833-230-2933
              </a>
            </motion.div>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default Book;