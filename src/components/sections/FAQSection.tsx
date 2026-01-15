import { motion } from "framer-motion";
import { HelpCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What areas do you service?",
    answer: "We provide services throughout Calgary and all communities within a 150 km radius, including Airdrie, Cochrane, Chestermere, Okotoks, High River, Canmore, Banff, and nearby areas. For locations outside our service area, please contact us to discuss options.",
  },
  {
    question: "How do I book an appointment?",
    answer: "You can book an appointment through our online booking system by clicking 'Book Now' on our website. You can also call us at 1-833-230-2933 or text 1-587-604-5127. We offer flexible scheduling including evenings and weekends.",
  },
  {
    question: "What is your cancellation policy?",
    answer: "We require 24 hours notice for cancellations. Cancellations made with less than 24 hours notice may incur a cancellation fee. Emergency situations are handled on a case-by-case basis. Please see our full policy page for details.",
  },
  {
    question: "Do you provide warranties on your work?",
    answer: "Yes! We offer a 30-day satisfaction guarantee on all installations. If something isn't right, we'll come back and fix it at no additional charge. Hardware warranties are handled through the manufacturers.",
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards (Visa, Mastercard, American Express), debit cards, e-transfer, and cash. Payment is due upon completion of the service unless otherwise arranged.",
  },
  {
    question: "Do I need to provide any equipment?",
    answer: "Typically, you provide the equipment (TV, speakers, etc.) and we handle the installation. However, we can source equipment for you at competitive prices if needed. Just let us know during booking.",
  },
  {
    question: "How long does a typical installation take?",
    answer: "Installation times vary by service. A simple TV mount takes about 1-2 hours. Network setup is 2-3 hours. Full home theater installations can take 4-8 hours. We'll provide a time estimate when you book.",
  },
  {
    question: "Do you offer emergency or same-day service?",
    answer: "Yes! We offer rush service for an additional fee, subject to technician availability. Contact us directly at 1-833-230-2933 for emergency requests and we'll do our best to accommodate you.",
  },
  {
    question: "Are your technicians insured and certified?",
    answer: "Absolutely. All our technicians are fully insured, background-checked, and professionally trained. Many hold certifications in audio/video installation, network configuration, and smart home systems.",
  },
  {
    question: "Can you hide cables in the wall?",
    answer: "Yes, we offer in-wall cable management for a clean, professional look. This involves running cables through the wall to hide them completely. Additional fees may apply depending on wall type and complexity.",
  },
];

export function FAQSection() {
  return (
    <section id="faq" className="py-24 md:py-32 relative">
      <div className="absolute inset-0 tech-grid opacity-20" />
      
      <div className="container mx-auto px-6 md:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass-card text-primary text-sm font-medium mb-8">
            <HelpCircle className="w-4 h-4" />
            FAQ
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 tracking-tight">
            Frequently Asked <span className="text-gradient-orange">Questions</span>
          </h2>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Got questions? We've got answers!
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-3xl mx-auto"
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="glass-card rounded-xl px-6 border-0"
              >
                <AccordionTrigger className="text-left hover:no-underline py-6">
                  <span className="font-semibold text-lg">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-6 text-base leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
