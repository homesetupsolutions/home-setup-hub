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
  length: number;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  duration: number;
  delay: number;
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
  const [particles, setParticles] = useState<Particle[]>([]);

  // Generate floating particles on mount
  useEffect(() => {
    const newParticles: Particle[] = [];
    for (let i = 0; i < 30; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 1 + Math.random() * 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        duration: 10 + Math.random() * 20,
        delay: Math.random() * 10,
      });
    }
    setParticles(newParticles);
  }, []);

  // Generate shooting stars
  useEffect(() => {
    const createStar = () => {
      const id = Date.now() + Math.random();
      const star: Star = {
        id,
        x: Math.random() * 80,
        y: Math.random() * 40,
        angle: 25 + Math.random() * 35,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 2 + Math.random() * 3,
        duration: 0.8 + Math.random() * 1.2,
        length: 100 + Math.random() * 80,
      };

      setStars((prev) => [...prev.slice(-10), star]);

      setTimeout(() => {
        setStars((prev) => prev.filter((s) => s.id !== id));
      }, star.duration * 1000 + 500);
    };

    const interval = setInterval(createStar, 1200 + Math.random() * 2000);
    createStar();

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Floating particles */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          initial={{
            x: `${particle.x}vw`,
            y: `${particle.y}vh`,
            opacity: 0,
          }}
          animate={{
            y: [`${particle.y}vh`, `${particle.y - 15}vh`, `${particle.y}vh`],
            opacity: [0, 0.6, 0],
            scale: [0.5, 1, 0.5],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut",
          }}
          style={{
            position: "absolute",
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            background: particle.color,
            borderRadius: "50%",
            boxShadow: `0 0 ${particle.size * 3}px ${particle.color}, 0 0 ${particle.size * 6}px ${particle.color}`,
          }}
        />
      ))}

      {/* Shooting stars */}
      <AnimatePresence>
        {stars.map((star) => (
          <motion.div
            key={star.id}
            initial={{
              x: `${star.x}vw`,
              y: `${star.y}vh`,
              opacity: 0,
            }}
            animate={{
              x: `${star.x + 50}vw`,
              y: `${star.y + 50}vh`,
              opacity: [0, 1, 1, 0],
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: star.duration,
              ease: "linear",
            }}
            style={{
              position: "absolute",
              width: `${star.length}px`,
              height: `${star.size}px`,
              background: `linear-gradient(90deg, ${star.color}, ${star.color}80, transparent)`,
              borderRadius: "50%",
              transform: `rotate(${star.angle}deg)`,
              boxShadow: `0 0 ${star.size * 6}px ${star.color}, 0 0 ${star.size * 12}px ${star.color}`,
            }}
          />
        ))}
      </AnimatePresence>

      {/* Ambient glowing orbs */}
      <motion.div
        animate={{
          opacity: [0.15, 0.3, 0.15],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-[20%] right-[15%] w-[300px] h-[300px] rounded-full blur-[80px]"
        style={{ background: "hsl(270, 80%, 50% / 0.2)" }}
      />
      <motion.div
        animate={{
          opacity: [0.1, 0.25, 0.1],
          scale: [1.1, 1, 1.1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 3,
        }}
        className="absolute bottom-[30%] left-[10%] w-[250px] h-[250px] rounded-full blur-[60px]"
        style={{ background: "hsl(220, 90%, 50% / 0.15)" }}
      />
    </div>
  );
}
