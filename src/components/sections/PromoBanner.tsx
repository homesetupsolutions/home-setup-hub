import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Gift, Percent, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface Promo {
  id: string;
  title: string;
  description: string;
  code?: string;
  icon: any;
  expiresAt?: Date;
  bgClass: string;
}

const promos: Promo[] = [
  {
    id: "new-year-2026",
    title: "New Year Special! 🎉",
    description: "15% off all installations in January",
    code: "NEWYEAR15",
    icon: Gift,
    expiresAt: new Date("2026-01-31"),
    bgClass: "from-primary/80 to-orange-600/80",
  },
];

export function PromoBanner() {
  const [isVisible, setIsVisible] = useState(true);
  const [currentPromoIndex, setCurrentPromoIndex] = useState(0);
  const [dismissed, setDismissed] = useState<string[]>([]);

  // Get active promos (not expired and not dismissed)
  const activePromos = promos.filter((promo) => {
    if (dismissed.includes(promo.id)) return false;
    if (promo.expiresAt && new Date() > promo.expiresAt) return false;
    return true;
  });

  const currentPromo = activePromos[currentPromoIndex];

  // Rotate promos every 10 seconds
  useEffect(() => {
    if (activePromos.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentPromoIndex((prev) => (prev + 1) % activePromos.length);
    }, 10000);

    return () => clearInterval(interval);
  }, [activePromos.length]);

  // Check localStorage for dismissed promos
  useEffect(() => {
    const storedDismissed = localStorage.getItem("dismissedPromos");
    if (storedDismissed) {
      setDismissed(JSON.parse(storedDismissed));
    }
  }, []);

  const handleDismiss = () => {
    if (!currentPromo) return;
    
    const newDismissed = [...dismissed, currentPromo.id];
    setDismissed(newDismissed);
    localStorage.setItem("dismissedPromos", JSON.stringify(newDismissed));
    
    if (activePromos.length <= 1) {
      setIsVisible(false);
    } else {
      setCurrentPromoIndex((prev) => prev % (activePromos.length - 1));
    }
  };

  if (!isVisible || !currentPromo) return null;

  const timeRemaining = currentPromo.expiresAt
    ? Math.max(0, Math.ceil((currentPromo.expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "auto", opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        className="relative overflow-hidden"
      >
        <div className={`bg-gradient-to-r ${currentPromo.bgClass} text-white`}>
          <div className="container mx-auto px-4 py-2 sm:py-3">
            <div className="flex items-center justify-center gap-2 sm:gap-4 flex-nowrap">
              <div className="flex items-center gap-2 shrink-0">
                <currentPromo.icon className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                <span className="font-semibold text-xs sm:text-sm whitespace-nowrap">{currentPromo.title}</span>
              </div>
              
              <span className="hidden sm:inline text-sm whitespace-nowrap">{currentPromo.description}</span>
              
              {currentPromo.code && (
                <code className="bg-white/20 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-mono font-bold whitespace-nowrap">
                  {currentPromo.code}
                </code>
              )}
              
              {timeRemaining !== null && timeRemaining <= 7 && (
                <span className="flex items-center gap-1 text-sm bg-white/20 px-2 py-1 rounded-full">
                  <Clock className="w-3 h-3" />
                  {timeRemaining} days left
                </span>
              )}
              
              <a href="https://outlook.office.com/book/HomeSetupSolutions1@homesetupsolutions.ca/?ismsaljsauthenabled" className="shrink-0">
                <Button
                  variant="secondary"
                  size="sm"
                  className="bg-white text-primary hover:bg-white/90 text-xs sm:text-sm h-7 sm:h-9 px-2 sm:px-3"
                >
                  Book Now
                  <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1" />
                </Button>
              </a>
            </div>
          </div>
          
          <button
            onClick={handleDismiss}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-white/20 rounded-full transition-colors"
            aria-label="Dismiss promotion"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
