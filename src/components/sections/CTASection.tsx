import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="py-32 md:py-44 relative overflow-hidden">
      {/* Tech grid overlay */}
      <div className="absolute inset-0 tech-grid opacity-20" />
      
      {/* Smooth ambient glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-primary/10 rounded-full blur-[150px] animate-pulse-slow" />

      <div className="container mx-auto px-6 md:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl mx-auto text-center"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass-card text-primary text-sm font-medium mb-10"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            Get Started Today
          </motion.div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-10 tracking-tight">
            Ready to Get{" "}
            <span className="text-gradient-orange">Started?</span>
          </h2>

          <p className="text-lg md:text-xl text-muted-foreground mb-14 max-w-2xl mx-auto leading-relaxed">
            Book your home setup service today. 
            Professional installation by certified technicians.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
            <Link to="/book">
              <Button variant="hero" size="xl" className="group">
                Book Now
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
            </Link>
            <a href="tel:18332302933">
              <Button variant="heroOutline" size="xl">
                Call: 1-833-230-2933
              </Button>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
