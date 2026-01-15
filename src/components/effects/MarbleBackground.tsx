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

      {/* Galaxy spiral arms suggestion */}
      <motion.div
        animate={{
          rotate: [0, 360],
        }}
        transition={{
          duration: 300,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%]"
        style={{
          background: `
            conic-gradient(from 0deg at 50% 50%, 
              transparent 0deg, 
              hsl(24 100% 50% / 0.08) 30deg, 
              transparent 60deg,
              hsl(270 80% 50% / 0.05) 120deg,
              transparent 150deg,
              hsl(220 90% 50% / 0.04) 210deg,
              transparent 240deg,
              hsl(30 100% 50% / 0.06) 300deg,
              transparent 330deg,
              transparent 360deg
            )
          `,
        }}
      />

      {/* Cosmic dust clouds */}
      <motion.div
        animate={{
          opacity: [0.3, 0.5, 0.3],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -inset-[10%]"
        style={{
          background: `
            radial-gradient(ellipse 40% 60% at 75% 25%, hsl(24 100% 55% / 0.18) 0%, transparent 50%),
            radial-gradient(ellipse 60% 40% at 25% 75%, hsl(280 80% 50% / 0.1) 0%, transparent 45%),
            radial-gradient(ellipse 50% 50% at 85% 60%, hsl(210 100% 50% / 0.08) 0%, transparent 40%)
          `,
        }}
      />

      {/* Orange marble veins */}
      <motion.div
        animate={{
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(125deg, transparent 35%, hsl(24 100% 50% / 0.5) 35.2%, transparent 35.4%),
            linear-gradient(235deg, transparent 50%, hsl(30 100% 45% / 0.4) 50.2%, transparent 50.4%),
            linear-gradient(175deg, transparent 25%, hsl(20 100% 55% / 0.35) 25.2%, transparent 25.4%),
            linear-gradient(305deg, transparent 65%, hsl(35 100% 50% / 0.3) 65.2%, transparent 65.4%)
          `,
          backgroundSize: "100% 100%",
        }}
      />

      {/* Secondary veins */}
      <div 
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage: `
            linear-gradient(145deg, transparent 42%, hsl(24 100% 50%) 42.15%, transparent 42.3%),
            linear-gradient(215deg, transparent 58%, hsl(30 100% 45%) 58.15%, transparent 58.3%),
            linear-gradient(335deg, transparent 32%, hsl(28 100% 48%) 32.15%, transparent 32.3%)
          `,
          backgroundSize: "600px 600px, 700px 700px, 500px 500px",
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

      {/* Cosmic noise/dust texture */}
      <div 
        className="absolute inset-0 opacity-[0.2]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

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
