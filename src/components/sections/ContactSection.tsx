import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Phone, MessageSquare, Mail, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const contactMethods = [
  {
    icon: Phone,
    title: "Call Us",
    description: "Toll Free",
    value: "1-833-230-2933",
    href: "tel:18332302933",
  },
  {
    icon: MessageSquare,
    title: "Text Us",
    description: "Quick Response",
    value: "1-672-965-8555",
    href: "sms:16729658555",
  },
  {
    icon: Mail,
    title: "Email Us",
    description: "We'll reply within 24h",
    value: "Send Email",
    href: "mailto:admin@homesetupsolutions.ca",
  },
  {
    icon: Clock,
    title: "Business Hours",
    description: "Sun-Sat (except Wed)",
    value: "9AM - 9PM",
    href: null,
  },
];

export function ContactSection() {
  return (
    <section id="contact" className="py-24 md:py-32 relative overflow-hidden">
      {/* Tech grid overlay */}
      <div className="absolute inset-0 tech-grid opacity-20" />
      
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] bg-primary/5 rounded-full blur-[150px]" />

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
            Get In Touch
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 tracking-tight">
            Ready to <span className="text-gradient-orange">Get Started?</span>
          </h2>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Contact us today to schedule your home setup appointment. 
            We're here to help make your technology work for you.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6 mb-20">
          {contactMethods.map((method, index) => (
            <motion.div
              key={method.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              {method.href ? (
                <a
                  href={method.href}
                  className="block h-full glass-card p-8 hover-lift group"
                >
                  <div className="w-16 h-16 rounded-2xl glass flex items-center justify-center mb-6 group-hover:border-primary/40 transition-all duration-500">
                    <method.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-xl mb-2 group-hover:text-primary transition-colors duration-300">{method.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{method.description}</p>
                  <p className="text-primary font-semibold text-lg">{method.value}</p>
                </a>
              ) : (
                <div className="h-full glass-card p-8">
                  <div className="w-16 h-16 rounded-2xl glass flex items-center justify-center mb-6">
                    <method.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-xl mb-2">{method.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{method.description}</p>
                  <p className="text-primary font-semibold text-lg">{method.value}</p>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="text-center"
        >
          <a href="https://outlook.office.com/book/HomeSetupSolutions1@homesetupsolutions.ca/?ismsaljsauthenabled">
            <Button variant="hero" size="xl" className="group">
              Book Your Appointment Now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
