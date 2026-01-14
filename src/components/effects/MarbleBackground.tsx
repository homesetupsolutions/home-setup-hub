import { motion } from "framer-motion";

export function MarbleBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Deep space base */}
      <div className="absolute inset-0 bg-black" />
      
      {/* Marble/Nebula swirls */}
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 5, 0],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute -top-1/4 -left-1/4 w-[150%] h-[150%]"
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 20% 20%, hsl(24 100% 50% / 0.08) 0%, transparent 50%),
            radial-gradient(ellipse 60% 40% at 80% 30%, hsl(220 80% 35% / 0.1) 0%, transparent 45%),
            radial-gradient(ellipse 70% 60% at 60% 80%, hsl(280 60% 40% / 0.08) 0%, transparent 50%),
            radial-gradient(ellipse 50% 70% at 10% 70%, hsl(260 70% 50% / 0.06) 0%, transparent 40%)
          `,
        }}
      />

      {/* Secondary swirls */}
      <motion.div
        animate={{
          scale: [1.1, 1, 1.1],
          rotate: [0, -3, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute -top-1/4 -left-1/4 w-[150%] h-[150%]"
        style={{
          background: `
            radial-gradient(ellipse 40% 80% at 90% 60%, hsl(24 100% 50% / 0.05) 0%, transparent 50%),
            radial-gradient(ellipse 90% 40% at 30% 90%, hsl(220 80% 35% / 0.07) 0%, transparent 45%),
            radial-gradient(ellipse 60% 50% at 70% 10%, hsl(280 60% 40% / 0.06) 0%, transparent 40%)
          `,
        }}
      />

      {/* Marble veins */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(125deg, transparent 30%, hsl(24 100% 50%) 30.5%, transparent 31%),
            linear-gradient(235deg, transparent 50%, hsl(220 80% 35%) 50.5%, transparent 51%),
            linear-gradient(345deg, transparent 70%, hsl(280 60% 40%) 70.5%, transparent 71%)
          `,
          backgroundSize: "300px 300px, 400px 400px, 500px 500px",
        }}
      />

      {/* Subtle grain texture */}
      <div 
        className="absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Vignette effect */}
      <div 
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at center, transparent 0%, hsl(0 0% 0% / 0.4) 100%)",
        }}
      />
    </div>
  );
}
