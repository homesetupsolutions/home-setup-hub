import { motion } from "framer-motion";
import { ShoppingCart, Gift, ExternalLink, Users, DollarSign } from "lucide-react";

const wishlistUrl = "https://www.amazon.ca/hz/wishlist/ls/HIJX38KT6U60?ref_=abls_nvfly_swo";

const scrollItems = [
  { text: "Check Out Our Amazon Wishlist", icon: ShoppingCart, link: wishlistUrl },
  { text: "Refer a Friend & Earn Rewards!", icon: Users, link: null },
  { text: "Browse Our Recommended Gear", icon: Gift, link: wishlistUrl },
  { text: "Get $25 Off Your Next Service – Refer Now", icon: DollarSign, link: null },
  { text: "Shop Notes From Our Installers", icon: ShoppingCart, link: wishlistUrl },
  { text: "Share the Love – Referral Program Available", icon: Users, link: null },
];

export function BottomScrollBar() {
  const items = [...scrollItems, ...scrollItems];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-primary/95 backdrop-blur-sm overflow-hidden py-2 border-t border-primary/50">
      <motion.div
        className="flex items-center gap-10 whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          x: { repeat: Infinity, repeatType: "loop", duration: 22, ease: "linear" },
        }}
      >
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-2 text-sm font-semibold text-primary-foreground">
            <item.icon className="w-4 h-4" />
            {item.link ? (
              <a href={item.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:underline">
                <span>{item.text}</span>
                <ExternalLink className="w-3 h-3 opacity-70" />
              </a>
            ) : (
              <span>{item.text}</span>
            )}
            <span className="mx-4 opacity-40">★</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}