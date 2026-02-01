import { motion } from "framer-motion";
import { Sparkles, Star, Zap, Gift, Phone, Clock } from "lucide-react";

const bannerItems = [
  { icon: Sparkles, text: "Professional Installation" },
  { icon: Star, text: "5-Star Rated Service" },
  { icon: Zap, text: "Same Day Availability" },
  { icon: Gift, text: "Referral Rewards Available" },
  { icon: Phone, text: "Call 1-833-230-2933" },
  { icon: Clock, text: "Open Sun-Sat 9AM-9PM" },
];

export function RunningBanner() {
  // Double the items to create seamless loop
  const items = [...bannerItems, ...bannerItems];

  return (
    <div className="bg-gradient-to-r from-primary/90 via-orange-500/90 to-primary/90 text-white overflow-hidden py-2.5">
      <motion.div
        className="flex items-center gap-8 whitespace-nowrap"
        animate={{
          x: ["0%", "-50%"],
        }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: 25,
            ease: "linear",
          },
        }}
      >
        {items.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-2 text-sm font-medium"
          >
            <item.icon className="w-4 h-4" />
            <span>{item.text}</span>
            <span className="mx-4 text-white/50">•</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
