import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface StaticStar {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  twinkleDuration: number;
}

export function MarbleBackground() {
  const [stars, setStars] = useState<StaticStar[]>([]);

  // Generate static stars on mount
  useEffect(() => {
    const newStars: StaticStar[] = [];
    for (let i = 0; i < 150; i++) {
      newStars.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 0.5 + Math.random() * 2,
        opacity: 0.3 + Math.random() * 0.7,
        twinkleDuration: 2 + Math.random() * 4,
      });
    }
    setStars(newStars);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Deep space black base */}
      <div className="absolute inset-0 bg-black" />

      {/* Galaxy nebula layer 1 - large cosmic clouds */}
      <motion.div
        animate={{
          scale: [1, 1.05, 1],
          rotate: [0, 2, 0],
        }}
        transition={{
          duration: 60,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -inset-[20%]"
        style={{
          background: `
            radial-gradient(ellipse 80% 60% at 20% 30%, hsl(24 100% 50% / 0.2) 0%, transparent 50%),
            radial-gradient(ellipse 60% 80% at 80% 70%, hsl(270 80% 50% / 0.12) 0%, transparent 50%),
            radial-gradient(ellipse 70% 50% at 60% 20%, hsl(220 90% 50% / 0.1) 0%, transparent 45%)
          `,
        }}
      />

      {/* Galaxy nebula layer 2 - swirling orange */}
      <motion.div
        animate={{
          x: [0, 30, 0],
          y: [0, -20, 0],
        }}
        transition={{
          duration: 40,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 100% 80% at 10% 15%, hsl(24 100% 50% / 0.25) 0%, transparent 45%),
            radial-gradient(ellipse 70% 100% at 90% 85%, hsl(30 100% 45% / 0.2) 0%, transparent 50%),
            radial-gradient(ellipse 50% 70% at 50% 50%, hsl(20 100% 40% / 0.15) 0%, transparent 55%)
          `,
        }}
      />


      {/* Twinkling stars */}
      {stars.map((star) => (
        <motion.div
          key={star.id}
          animate={{
            opacity: [star.opacity * 0.3, star.opacity, star.opacity * 0.3],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: star.twinkleDuration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 3,
          }}
          style={{
            position: "absolute",
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            background: "white",
            borderRadius: "50%",
            boxShadow: `0 0 ${star.size * 2}px white, 0 0 ${star.size * 4}px hsl(24 100% 70% / 0.5)`,
          }}
        />
      ))}

      {/* Large ambient glows */}
      <motion.div
        animate={{
          opacity: [0.2, 0.4, 0.2],
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-[15%] left-[20%] w-[700px] h-[500px] rounded-full blur-[150px]"
        style={{ background: "hsl(24 100% 50% / 0.2)" }}
      />
      
      <motion.div
        animate={{
          opacity: [0.15, 0.3, 0.15],
          scale: [1.1, 1, 1.1],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 3,
        }}
        className="absolute bottom-[20%] right-[15%] w-[600px] h-[600px] rounded-full blur-[120px]"
        style={{ background: "hsl(270 80% 50% / 0.15)" }}
      />

      <motion.div
        animate={{
          opacity: [0.1, 0.2, 0.1],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 6,
        }}
        className="absolute top-[60%] left-[60%] w-[400px] h-[400px] rounded-full blur-[100px]"
        style={{ background: "hsl(220 90% 50% / 0.12)" }}
      />

      {/* Subtle vignette */}
      <div 
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse 100% 80% at 50% 50%, transparent 0%, hsl(0 0% 0% / 0.5) 100%)",
        }}
      />
    </div>
  );
}
