import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="py-20 md:py-32 bg-card relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5" />
      <div className="absolute top-0 left-1/4 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Ready to Get{" "}
            <span className="text-gradient-orange">Started?</span>
          </h2>

          <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
            Book your home setup service today. 
            Professional installation by certified technicians.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/book">
              <Button variant="hero" size="xl" className="group">
                Book Now
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <a href="tel:8332302933">
              <Button variant="heroOutline" size="xl">
                Call: 833-230-2933
              </Button>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}