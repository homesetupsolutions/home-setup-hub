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
    <section id="services" className="py-24 md:py-32 relative">
      {/* Subtle tech grid */}
      <div className="absolute inset-0 tech-grid opacity-20" />
      
      <div className="container mx-auto px-6 md:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-20"
        >
          <span className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass-card text-primary text-sm font-medium mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            Our Services
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 tracking-tight">
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
              className="group relative glass-card p-8 hover-lift cursor-pointer"
            >
              {/* Hover glow effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl glass flex items-center justify-center mb-6 group-hover:border-primary/40 transition-all duration-500">
                  <service.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors duration-300">{service.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {service.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mt-20"
        >
          <a href="https://outlook.office.com/book/allbookings@homesetupsolutions.ca/" target="_blank" rel="noopener noreferrer">
            <Button variant="hero" size="lg" className="group">
              View All Services & Book
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
