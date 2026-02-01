import { useEffect, useState, useCallback } from "react";
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
  "hsl(24, 100%, 50%)",
  "hsl(30, 100%, 55%)",
  "hsl(20, 100%, 45%)",
  "hsl(35, 100%, 60%)",
  // Blue variants
  "hsl(220, 90%, 55%)",
  "hsl(210, 100%, 50%)",
  "hsl(230, 80%, 60%)",
  // Purple variants
  "hsl(270, 80%, 55%)",
  "hsl(280, 90%, 50%)",
  "hsl(260, 70%, 60%)",
  // Green variants
  "hsl(140, 80%, 45%)",
  "hsl(150, 90%, 40%)",
  "hsl(130, 70%, 50%)",
  "hsl(160, 85%, 42%)",
  // White/silver
  "hsl(0, 0%, 90%)",
  "hsl(220, 20%, 85%)",
];

export function ShootingStars() {
  const [stars, setStars] = useState<Star[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);

  // Generate more floating particles on mount
  useEffect(() => {
    const newParticles: Particle[] = [];
    for (let i = 0; i < 60; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 1 + Math.random() * 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        duration: 8 + Math.random() * 15,
        delay: Math.random() * 8,
      });
    }
    setParticles(newParticles);
  }, []);

  const createStar = useCallback(() => {
    const id = Date.now() + Math.random();
    const star: Star = {
      id,
      x: Math.random() * 90,
      y: Math.random() * 60,
      angle: 20 + Math.random() * 40,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: 2 + Math.random() * 4,
      duration: 0.3 + Math.random() * 0.5,
      length: 150 + Math.random() * 120,
    };

    setStars((prev) => [...prev.slice(-15), star]);

    setTimeout(() => {
      setStars((prev) => prev.filter((s) => s.id !== id));
    }, star.duration * 1000 + 500);
  }, []);

  // Generate shooting stars more frequently
  useEffect(() => {
    // Create initial burst
    for (let i = 0; i < 3; i++) {
      setTimeout(() => createStar(), i * 200);
    }

    const interval = setInterval(() => {
      createStar();
      // Sometimes create multiple stars at once
      if (Math.random() > 0.6) {
        setTimeout(() => createStar(), 100 + Math.random() * 300);
      }
    }, 600 + Math.random() * 1000);

    return () => clearInterval(interval);
  }, [createStar]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-[1]">
      {/* Floating particles - more and bigger */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          initial={{
            x: `${particle.x}vw`,
            y: `${particle.y}vh`,
            opacity: 0,
          }}
          animate={{
            y: [`${particle.y}vh`, `${particle.y - 20}vh`, `${particle.y}vh`],
            x: [`${particle.x}vw`, `${particle.x + (Math.random() * 10 - 5)}vw`, `${particle.x}vw`],
            opacity: [0, 0.8, 0],
            scale: [0.3, 1.2, 0.3],
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
            boxShadow: `0 0 ${particle.size * 4}px ${particle.color}, 0 0 ${particle.size * 8}px ${particle.color}`,
          }}
        />
      ))}

      {/* Shooting stars - more visible */}
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
              x: `${star.x + 60}vw`,
              y: `${star.y + 60}vh`,
              opacity: [0, 1, 1, 0.8, 0],
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: star.duration,
              ease: "easeOut",
            }}
            style={{
              position: "absolute",
              width: `${star.length}px`,
              height: `${star.size}px`,
              background: `linear-gradient(90deg, ${star.color}, ${star.color}90, ${star.color}40, transparent)`,
              borderRadius: "50%",
              transform: `rotate(${star.angle}deg)`,
              boxShadow: `0 0 ${star.size * 8}px ${star.color}, 0 0 ${star.size * 16}px ${star.color}, 0 0 ${star.size * 24}px ${star.color}50`,
            }}
          />
        ))}
      </AnimatePresence>

      {/* Cosmic nebula glows */}
      <motion.div
        animate={{
          opacity: [0.2, 0.4, 0.2],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-[10%] right-[20%] w-[400px] h-[400px] rounded-full blur-[100px]"
        style={{ background: "hsl(270, 80%, 50% / 0.25)" }}
      />
      <motion.div
        animate={{
          opacity: [0.15, 0.35, 0.15],
          scale: [1.2, 1, 1.2],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 4,
        }}
        className="absolute bottom-[20%] left-[5%] w-[350px] h-[350px] rounded-full blur-[80px]"
        style={{ background: "hsl(220, 90%, 50% / 0.2)" }}
      />
      <motion.div
        animate={{
          opacity: [0.1, 0.25, 0.1],
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 7,
        }}
        className="absolute top-[50%] left-[40%] w-[300px] h-[300px] rounded-full blur-[70px]"
        style={{ background: "hsl(24, 100%, 50% / 0.18)" }}
      />
      <motion.div
        animate={{
          opacity: [0.08, 0.2, 0.08],
          scale: [1.1, 1, 1.1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
        className="absolute top-[30%] left-[70%] w-[250px] h-[250px] rounded-full blur-[60px]"
        style={{ background: "hsl(280, 80%, 55% / 0.15)" }}
      />
    </div>
  );
}
