import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  Tv, 
  Wifi, 
  Speaker, 
  Monitor, 
  Smartphone, 
  Home, 
  Camera, 
  Lightbulb,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";

const services = [
  {
    icon: Tv,
    title: "TV Mounting",
    description: "Professional wall mounting for any TV size. Includes cable management and optimal positioning.",
    price: "From $99",
  },
  {
    icon: Wifi,
    title: "Network Setup",
    description: "Complete home network installation, router configuration, and WiFi optimization.",
    price: "From $79",
  },
  {
    icon: Speaker,
    title: "Audio Systems",
    description: "Surround sound, speaker placement, and audio system configuration for the perfect sound.",
    price: "From $149",
  },
  {
    icon: Monitor,
    title: "Computer Setup",
    description: "Desktop and laptop setup, software installation, and peripheral configuration.",
    price: "From $69",
  },
  {
    icon: Smartphone,
    title: "Smart Home",
    description: "Smart device installation, app setup, and voice assistant integration.",
    price: "From $89",
  },
  {
    icon: Home,
    title: "Home Theater",
    description: "Complete entertainment system setup with projector, screen, and audio integration.",
    price: "From $299",
  },
  {
    icon: Camera,
    title: "Security Systems",
    description: "Camera installation, DVR setup, and remote viewing configuration.",
    price: "From $149",
  },
  {
    icon: Lightbulb,
    title: "Smart Lighting",
    description: "Smart bulb installation, dimmer switches, and automated lighting scenes.",
    price: "From $79",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function ServicesSection() {
  return (
    <section id="services" className="py-20 md:py-32 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Our Services
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            What We <span className="text-gradient-orange">Offer</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Comprehensive home technology services tailored to your needs. 
            From simple setups to complex installations, we've got you covered.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {services.map((service) => (
            <motion.div
              key={service.title}
              variants={itemVariants}
              className="group relative bg-card rounded-2xl border border-border p-6 hover:border-primary/50 transition-all duration-300 hover:shadow-[0_0_30px_hsl(24_100%_50%/0.1)]"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <service.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{service.title}</h3>
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                {service.description}
              </p>
              <span className="text-primary font-semibold">{service.price}</span>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <Link to="/book">
            <Button variant="hero" size="lg" className="group">
              View All Services & Book
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}