import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Zap, Shield, Clock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  { icon: Zap, label: "Fast Setup" },
  { icon: Shield, label: "Professional Service" },
  { icon: Clock, label: "Flexible Scheduling" },
];

export function HeroSection() {
  return (
    <section className="relative min-h-[100vh] flex items-center overflow-hidden">
      {/* High-tech grid overlay */}
      <div className="absolute inset-0 tech-grid opacity-30" />
      
      {/* Smooth radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-primary/8 rounded-full blur-[150px] animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: '1.5s' }} />

      <div className="container mx-auto px-6 md:px-8 relative z-10">
        <div className="max-w-5xl mx-auto text-center py-20 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full glass-card text-primary text-sm font-medium mb-12"
          >
            <Sparkles className="w-4 h-4" />
            <span>Professional Home Setup Services</span>
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-[1.05] mb-10 tracking-tight"
          >
            <span className="block">Simplify Your Space,</span>
            <span className="text-gradient-orange">Amplify Your Comfort</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-16 leading-relaxed"
          >
            Expert installation and setup services for all your home technology needs. 
            From smart devices to entertainment systems, we make technology work for you.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row items-center justify-center gap-5 mb-24"
          >
            <Link to="/book">
              <Button variant="hero" size="xl" className="group relative overflow-hidden">
                <span className="relative z-10 flex items-center gap-2">
                  Book Your Setup
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </span>
              </Button>
            </Link>
            <a href="#services">
              <Button variant="heroOutline" size="xl" className="group">
                View Services
              </Button>
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap items-center justify-center gap-8 md:gap-14"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.7 + index * 0.1 }}
                className="flex items-center gap-4 group"
              >
                <div className="w-14 h-14 rounded-2xl glass-card flex items-center justify-center group-hover:border-primary/30 transition-all duration-500">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors duration-300">{feature.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

    </section>
  );
}
