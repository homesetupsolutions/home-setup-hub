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
      {/* Subtle radial glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] animate-pulse-glow" />

      <div className="container mx-auto px-6 md:px-8 relative z-10">
        <div className="max-w-5xl mx-auto text-center py-20 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-10"
          >
            <Sparkles className="w-4 h-4" />
            <span>Professional Home Setup Services</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-[1.1] mb-8 tracking-tight"
          >
            Simplify Your Space,{" "}
            <span className="text-gradient-orange">Amplify Your Comfort</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-14 leading-relaxed"
          >
            Expert installation and setup services for all your home technology needs. 
            From smart devices to entertainment systems, we make technology work for you.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45, ease: "easeOut" }}
            className="flex flex-col sm:flex-row items-center justify-center gap-5 mb-20"
          >
            <Link to="/book">
              <Button variant="hero" size="xl" className="group animate-glow-pulse">
                Book Your Setup
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <a href="#services">
              <Button variant="heroOutline" size="xl">
                View Services
              </Button>
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
            className="flex flex-wrap items-center justify-center gap-10 md:gap-16"
          >
            {features.map((feature) => (
              <div
                key={feature.label}
                className="flex items-center gap-3 text-muted-foreground"
              >
                <div className="w-12 h-12 rounded-xl bg-muted/50 border border-border/50 flex items-center justify-center">
                  <feature.icon className="w-5 h-5 text-primary" />
                </div>
                <span className="text-sm font-medium">{feature.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
