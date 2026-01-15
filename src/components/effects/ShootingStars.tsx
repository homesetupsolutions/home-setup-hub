import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Star {
  id: number;
  x: number;
  y: number;
  angle: number;
  color: string;
  size: number;
  duration: number;
}

const colors = [
  // Orange variants
  "hsl(24, 100%, 50%)",    // Bright Orange
  "hsl(30, 100%, 55%)",    // Light Orange
  "hsl(20, 100%, 45%)",    // Deep Orange
  // Blue variants
  "hsl(220, 90%, 55%)",    // Vivid Blue
  "hsl(210, 100%, 50%)",   // Electric Blue
  "hsl(230, 80%, 60%)",    // Soft Blue
  // Purple variants
  "hsl(270, 80%, 55%)",    // Vivid Purple
  "hsl(280, 90%, 50%)",    // Electric Purple
  "hsl(260, 70%, 60%)",    // Soft Purple
];

export function ShootingStars() {
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    const createStar = () => {
      const id = Date.now() + Math.random();
      const star: Star = {
        id,
        x: Math.random() * 100,
        y: Math.random() * 50,
        angle: 30 + Math.random() * 30,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 1 + Math.random() * 2,
        duration: 1 + Math.random() * 1.5,
      };

      setStars((prev) => [...prev.slice(-8), star]);

      setTimeout(() => {
        setStars((prev) => prev.filter((s) => s.id !== id));
      }, star.duration * 1000 + 500);
    };

    const interval = setInterval(createStar, 2000 + Math.random() * 3000);
    createStar();

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      <AnimatePresence>
        {stars.map((star) => (
          <motion.div
            key={star.id}
            initial={{
              x: `${star.x}vw`,
              y: `${star.y}vh`,
              opacity: 1,
            }}
            animate={{
              x: `${star.x + 40}vw`,
              y: `${star.y + 40}vh`,
              opacity: [0, 1, 1, 0],
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: star.duration,
              ease: "linear",
            }}
            style={{
              position: "absolute",
              width: `${80 + star.size * 20}px`,
              height: `${star.size}px`,
              background: `linear-gradient(90deg, ${star.color}, transparent)`,
              borderRadius: "50%",
              transform: `rotate(${star.angle}deg)`,
              boxShadow: `0 0 ${star.size * 4}px ${star.color}, 0 0 ${star.size * 8}px ${star.color}`,
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
