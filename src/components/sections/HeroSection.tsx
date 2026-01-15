import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Zap, Shield, Clock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  { icon: Zap, label: "Fast Setup" },
  { icon: Shield, label: "Professional Service" },
  { icon: Clock, label: "Flexible Scheduling" },
];

const letterVariants = {
  hidden: { opacity: 0, y: 50, rotateX: -90 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: {
      delay: i * 0.03,
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
};

const wordVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      delay: 0.8 + i * 0.15,
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
};

export function HeroSection() {
  const simplifyText = "Simplify";
  const yourText = "Your";
  const spaceText = "Space";
  const amplifyText = "Amplify";
  const comfortText = "Comfort";

  return (
    <section className="relative min-h-[100vh] flex items-center overflow-hidden">
      {/* High-tech grid overlay */}
      <div className="absolute inset-0 tech-grid opacity-30" />
      
      {/* Smooth radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-primary/8 rounded-full blur-[150px] animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: '1.5s' }} />

      <div className="container mx-auto px-6 md:px-8 relative z-10">
        <div className="max-w-6xl mx-auto text-center py-20 md:py-32">
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

          {/* Epic Tagline */}
          <div className="mb-10 perspective-1000">
            {/* Line 1: Simplify Your Space */}
            <div className="flex flex-wrap items-center justify-center gap-x-4 md:gap-x-6 mb-2 md:mb-4">
              {/* Simplify - with letter animation */}
              <div className="flex overflow-hidden">
                {simplifyText.split("").map((letter, i) => (
                  <motion.span
                    key={`s1-${i}`}
                    custom={i}
                    variants={letterVariants}
                    initial="hidden"
                    animate="visible"
                    className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-foreground inline-block"
                    style={{ 
                      textShadow: "0 0 40px hsl(var(--primary) / 0.3)",
                    }}
                  >
                    {letter}
                  </motion.span>
                ))}
              </div>

              {/* Your */}
              <motion.span
                custom={0}
                variants={wordVariants}
                initial="hidden"
                animate="visible"
                className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-muted-foreground/70"
              >
                {yourText}
              </motion.span>

              {/* Space - Glowing gradient */}
              <motion.span
                custom={1}
                variants={wordVariants}
                initial="hidden"
                animate="visible"
                className="relative text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold"
              >
                <span className="relative z-10 bg-gradient-to-r from-primary via-orange-400 to-primary bg-clip-text text-transparent bg-[length:200%_auto] animate-shimmer">
                  {spaceText}
                </span>
                <motion.span
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-0 bg-gradient-to-r from-primary via-orange-400 to-primary bg-clip-text text-transparent blur-xl opacity-50"
                >
                  {spaceText}
                </motion.span>
              </motion.span>
            </div>

            {/* Divider line */}
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="w-32 md:w-48 h-[2px] mx-auto my-4 md:my-6 bg-gradient-to-r from-transparent via-primary to-transparent"
            />

            {/* Line 2: Amplify Your Comfort */}
            <div className="flex flex-wrap items-center justify-center gap-x-4 md:gap-x-6">
              {/* Amplify - with letter animation */}
              <div className="flex overflow-hidden">
                {amplifyText.split("").map((letter, i) => (
                  <motion.span
                    key={`a1-${i}`}
                    custom={i + 15}
                    variants={letterVariants}
                    initial="hidden"
                    animate="visible"
                    className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold inline-block"
                    style={{
                      background: "linear-gradient(135deg, hsl(var(--primary)), hsl(30 100% 55%), hsl(var(--primary)))",
                      backgroundSize: "200% 200%",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                      textShadow: "0 0 60px hsl(var(--primary) / 0.5)",
                    }}
                  >
                    {letter}
                  </motion.span>
                ))}
              </div>

              {/* Your */}
              <motion.span
                custom={2}
                variants={wordVariants}
                initial="hidden"
                animate="visible"
                className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-muted-foreground/70"
              >
                {yourText}
              </motion.span>

              {/* Comfort - Epic glow effect */}
              <motion.span
                custom={3}
                variants={wordVariants}
                initial="hidden"
                animate="visible"
                className="relative text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold"
              >
                <motion.span
                  animate={{
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  className="relative z-10 bg-[length:300%_auto]"
                  style={{
                    background: "linear-gradient(90deg, hsl(var(--primary)), hsl(35 100% 60%), hsl(280 80% 60%), hsl(220 90% 60%), hsl(var(--primary)))",
                    backgroundSize: "300% auto",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  {comfortText}
                </motion.span>
                <motion.span
                  animate={{ 
                    opacity: [0.3, 0.7, 0.3],
                    scale: [1, 1.05, 1],
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-0 blur-2xl opacity-50"
                  style={{
                    background: "linear-gradient(90deg, hsl(var(--primary)), hsl(280 80% 60%), hsl(var(--primary)))",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  {comfortText}
                </motion.span>
              </motion.span>
            </div>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-16 leading-relaxed"
          >
            Expert installation and setup services for all your home technology needs. 
            From smart devices to entertainment systems, we make technology work for you.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.7, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row items-center justify-center gap-5 mb-24"
          >
            <a href="https://outlook.office.com/book/allbookings@homesetupsolutions.ca/?ismsaljsauthenabled" target="_blank" rel="noopener noreferrer">
              <Button variant="hero" size="xl" className="group relative overflow-hidden">
                <span className="relative z-10 flex items-center gap-2">
                  Book Your Setup
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </span>
              </Button>
            </a>
            <a href="#services">
              <Button variant="heroOutline" size="xl" className="group">
                View Services
              </Button>
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.9, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap items-center justify-center gap-8 md:gap-14"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 2 + index * 0.1 }}
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
