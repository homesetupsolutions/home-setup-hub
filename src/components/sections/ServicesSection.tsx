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
    description: "Professional wall mounting for any TV size with cable management.",
  },
  {
    icon: Wifi,
    title: "Network Setup",
    description: "Complete home network installation and WiFi optimization.",
  },
  {
    icon: Speaker,
    title: "Audio Systems",
    description: "Surround sound and speaker placement for perfect audio.",
  },
  {
    icon: Monitor,
    title: "Computer Setup",
    description: "Desktop, laptop setup, and software installation.",
  },
  {
    icon: Smartphone,
    title: "Smart Home",
    description: "Smart device installation and voice assistant integration.",
  },
  {
    icon: Home,
    title: "Home Theater",
    description: "Complete entertainment system with projector and audio.",
  },
  {
    icon: Camera,
    title: "Security Systems",
    description: "Camera installation, DVR setup, and remote viewing.",
  },
  {
    icon: Lightbulb,
    title: "Smart Lighting",
    description: "Smart bulbs, dimmer switches, and automated scenes.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export function ServicesSection() {
  return (
    <section id="services" className="py-28 md:py-40 relative">
      <div className="container mx-auto px-6 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <span className="inline-block px-5 py-2.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
            Our Services
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
            What We <span className="text-gradient-orange">Offer</span>
          </h2>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Comprehensive home technology services tailored to your needs.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6"
        >
          {services.map((service) => (
            <motion.div
              key={service.title}
              variants={itemVariants}
              className="group relative bg-card/60 backdrop-blur-sm rounded-2xl border border-border/50 p-7 hover:border-primary/40 transition-all duration-500 hover:bg-card/80"
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative">
                <div className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-5 group-hover:bg-primary/20 group-hover:border-primary/30 transition-all duration-500">
                  <service.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-3">{service.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {service.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center mt-16"
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
