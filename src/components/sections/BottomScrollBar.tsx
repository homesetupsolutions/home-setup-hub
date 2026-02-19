import { motion } from "framer-motion";
import { ShoppingCart, Gift, ExternalLink } from "lucide-react";

const wishlistUrl = "https://www.amazon.ca/hz/wishlist/ls/HIJX38KT6U60?ref_=abls_nvfly_swo";

const amazonItems = [
  { text: "Check Out Our Amazon Wishlist" },
  { text: "Browse Our Recommended Gear" },
  { text: "Shop Notes From Our Installers" },
];

export function BottomScrollBar() {
  const items = [...amazonItems, ...amazonItems];

  return (
    <a
      href={wishlistUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-0 left-0 right-0 z-50 bg-[#FF9900] hover:bg-[#e88b00] transition-colors overflow-hidden py-2 border-t border-[#cc7a00] block cursor-pointer"
    >
      <motion.div
        className="flex items-center gap-10 whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          x: { repeat: Infinity, repeatType: "loop", duration: 18, ease: "linear" },
        }}
      >
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-2 text-sm font-semibold text-primary-foreground">
            {i % 2 === 0 ? <ShoppingCart className="w-4 h-4" /> : <Gift className="w-4 h-4" />}
            <span>{item.text}</span>
            <ExternalLink className="w-3 h-3 opacity-70" />
            <span className="mx-4 opacity-40">★</span>
          </div>
        ))}
      </motion.div>
    </a>
  );
}
