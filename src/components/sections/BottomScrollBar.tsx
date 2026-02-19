import { motion } from "framer-motion";
import { Sparkles, Star, Zap, Gift, Phone, Clock } from "lucide-react";

const tickerItems = [
  { icon: Phone, text: "Call 1-833-230-2933" },
  { icon: Clock, text: "Open Sun–Sat 9AM–9PM" },
  { icon: Star, text: "5-Star Rated Service" },
  { icon: Zap, text: "Same Day Availability" },
  { icon: Gift, text: "Referral Rewards" },
  { icon: Sparkles, text: "Professional Installation" },
];

export function BottomScrollBar() {
  const items = [...tickerItems, ...tickerItems];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-primary/95 backdrop-blur-sm text-primary-foreground overflow-hidden py-2 border-t border-primary/50">
      <motion.div
        className="flex items-center gap-8 whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          x: { repeat: Infinity, repeatType: "loop", duration: 20, ease: "linear" },
        }}
      >
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-2 text-sm font-medium">
            <item.icon className="w-4 h-4" />
            <span>{item.text}</span>
            <span className="mx-4 opacity-50">•</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
