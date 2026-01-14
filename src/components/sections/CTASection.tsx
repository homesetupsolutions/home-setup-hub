import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="py-28 md:py-40 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px]" />

      <div className="container mx-auto px-6 md:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-block px-5 py-2.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8"
          >
            Get Started Today
          </motion.div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 tracking-tight">
            Ready to Get{" "}
            <span className="text-gradient-orange">Started?</span>
          </h2>

          <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
            Book your home setup service today. 
            Professional installation by certified technicians.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
            <Link to="/book">
              <Button variant="hero" size="xl" className="group animate-glow-pulse">
                Book Now
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
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
