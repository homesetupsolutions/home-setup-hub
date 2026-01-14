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
    value: "1-587-604-5127",
    href: "sms:15876045127",
  },
  {
    icon: Mail,
    title: "Email Us",
    description: "We'll reply within 24h",
    value: "Send Email",
    href: "mailto:customerservice@homesetupsolutions.ca",
  },
  {
    icon: Clock,
    title: "Business Hours",
    description: "Mon-Sat",
    value: "9AM - 9PM",
    href: null,
  },
];

export function ContactSection() {
  return (
    <section id="contact" className="py-28 md:py-40 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-secondary/5 rounded-full blur-[120px]" />

      <div className="container mx-auto px-6 md:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <span className="inline-block px-5 py-2.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
            Get In Touch
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
            Ready to <span className="text-gradient-orange">Get Started?</span>
          </h2>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Contact us today to schedule your home setup appointment. 
            We're here to help make your technology work for you.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6 mb-16">
          {contactMethods.map((method, index) => (
            <motion.div
              key={method.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              {method.href ? (
                <a
                  href={method.href}
                  className="block h-full bg-card/60 backdrop-blur-sm rounded-2xl border border-border/50 p-7 hover:border-primary/40 transition-all duration-500 hover:bg-card/80 group"
                >
                  <div className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-all duration-500">
                    <method.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="font-semibold text-xl mb-2">{method.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{method.description}</p>
                  <p className="text-primary font-semibold text-lg">{method.value}</p>
                </a>
              ) : (
                <div className="h-full bg-card/60 backdrop-blur-sm rounded-2xl border border-border/50 p-7">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-5">
                    <method.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="font-semibold text-xl mb-2">{method.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{method.description}</p>
                  <p className="text-primary font-semibold text-lg">{method.value}</p>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center"
        >
          <Link to="/book">
            <Button variant="hero" size="xl" className="group">
              Book Your Appointment Now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
