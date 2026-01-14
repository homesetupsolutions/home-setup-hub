import { motion } from "framer-motion";
import { CheckCircle2, Users, Star, Clock } from "lucide-react";

const stats = [
  { icon: Users, value: "500+", label: "Happy Customers" },
  { icon: Star, value: "4.9", label: "Average Rating" },
  { icon: Clock, value: "24/7", label: "Support Available" },
];

const benefits = [
  "Certified and experienced technicians",
  "Same-day service available",
  "Satisfaction guaranteed",
  "Transparent pricing with no hidden fees",
  "Post-installation support included",
  "Eco-friendly practices",
];

export function AboutSection() {
  return (
    <section id="about" className="py-28 md:py-40 relative">
      {/* Subtle accent glow */}
      <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[100px]" />
      
      <div className="container mx-auto px-6 md:px-8">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-5 py-2.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
              About Us
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 tracking-tight">
              Why Choose{" "}
              <span className="text-gradient-orange">Home Setup Solutions?</span>
            </h2>
            <p className="text-muted-foreground text-lg md:text-xl mb-10 leading-relaxed">
              We're a team of passionate technology experts dedicated to making 
              your home smarter and more connected. With years of experience and 
              a commitment to excellence, we deliver professional installation 
              services that exceed expectations.
            </p>

            <ul className="space-y-4">
              {benefits.map((benefit, index) => (
                <motion.li
                  key={benefit}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex items-center gap-4"
                >
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-foreground text-lg">{benefit}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Right Content - Stats */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            {/* Decorative background */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-transparent rounded-3xl blur-3xl" />

            <div className="relative bg-card/60 backdrop-blur-sm rounded-3xl border border-border/50 p-10 md:p-14">
              <div className="grid gap-8">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.15 }}
                    className="flex items-center gap-6 p-6 rounded-2xl bg-muted/30 border border-border/30"
                  >
                    <div className="w-16 h-16 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                      <stat.icon className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <div className="text-4xl md:text-5xl font-bold text-gradient-orange">
                        {stat.value}
                      </div>
                      <div className="text-muted-foreground text-lg">{stat.label}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
