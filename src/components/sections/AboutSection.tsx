import { motion } from "framer-motion";
import { CheckCircle2, Users, Star, Clock } from "lucide-react";

const stats = [
  { icon: Users, value: "1000+", label: "Happy Customers" },
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
    <section id="about" className="py-24 md:py-32 relative">
      {/* Subtle tech grid */}
      <div className="absolute inset-0 tech-grid opacity-20" />
      {/* Ambient glow */}
      <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px]" />
      
      <div className="container mx-auto px-6 md:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass-card text-primary text-sm font-medium mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              About Us
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-10 tracking-tight leading-tight">
              Why Choose{" "}
              <span className="text-gradient-orange">Home Setup Solutions?</span>
            </h2>
            <p className="text-muted-foreground text-lg md:text-xl mb-12 leading-relaxed">
              We're a team of passionate technology experts dedicated to making 
              your home smarter and more connected. With years of experience and 
              a commitment to excellence, we deliver professional installation 
              services that exceed expectations.
            </p>

            <ul className="space-y-5">
              {benefits.map((benefit, index) => (
                <motion.li
                  key={benefit}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="flex items-center gap-4 group"
                >
                  <div className="w-8 h-8 rounded-xl glass flex items-center justify-center shrink-0 group-hover:border-primary/40 transition-all duration-300">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-foreground text-lg">{benefit}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Right Content - Stats */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            {/* Decorative glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent rounded-3xl blur-3xl" />

            <div className="relative glass-card p-10 md:p-14">
              <div className="grid gap-6">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.15 }}
                    className="flex items-center gap-6 p-6 rounded-2xl glass group hover-lift"
                  >
                    <div className="w-18 h-18 rounded-2xl glass flex items-center justify-center shrink-0 group-hover:border-primary/40 transition-all duration-500">
                      <stat.icon className="w-9 h-9 text-primary" />
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
