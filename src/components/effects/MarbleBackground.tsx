import { motion } from "framer-motion";

export function MarbleBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Pure black base */}
      <div className="absolute inset-0 bg-black" />
      
      {/* Marble texture layer 1 - flowing veins */}
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
            radial-gradient(ellipse 100% 80% at 15% 10%, hsl(24 100% 50% / 0.08) 0%, transparent 40%),
            radial-gradient(ellipse 80% 100% at 85% 90%, hsl(30 100% 45% / 0.06) 0%, transparent 45%),
            radial-gradient(ellipse 60% 90% at 50% 50%, hsl(20 100% 40% / 0.04) 0%, transparent 50%)
          `,
        }}
      />

      {/* Marble texture layer 2 - swirling clouds */}
      <motion.div
        animate={{
          scale: [1, 1.05, 1],
          rotate: [0, 3, 0],
        }}
        transition={{
          duration: 50,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -inset-[20%]"
        style={{
          background: `
            radial-gradient(ellipse 50% 70% at 80% 20%, hsl(24 100% 50% / 0.1) 0%, transparent 50%),
            radial-gradient(ellipse 70% 50% at 20% 80%, hsl(28 100% 48% / 0.08) 0%, transparent 45%),
            radial-gradient(ellipse 90% 60% at 60% 40%, hsl(32 100% 52% / 0.05) 0%, transparent 55%)
          `,
        }}
      />

      {/* Marble veins - thin elegant lines */}
      <motion.div
        animate={{
          opacity: [0.03, 0.06, 0.03],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(115deg, transparent 40%, hsl(24 100% 50% / 0.15) 40.2%, transparent 40.4%),
            linear-gradient(245deg, transparent 55%, hsl(30 100% 45% / 0.12) 55.2%, transparent 55.4%),
            linear-gradient(175deg, transparent 30%, hsl(20 100% 55% / 0.1) 30.2%, transparent 30.4%),
            linear-gradient(295deg, transparent 70%, hsl(35 100% 50% / 0.08) 70.2%, transparent 70.4%)
          `,
          backgroundSize: "100% 100%",
        }}
      />

      {/* Secondary marble veins - more subtle */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(135deg, transparent 45%, hsl(24 100% 50% / 0.04) 45.5%, transparent 46%),
            linear-gradient(225deg, transparent 60%, hsl(30 100% 45% / 0.03) 60.5%, transparent 61%),
            linear-gradient(315deg, transparent 35%, hsl(28 100% 48% / 0.04) 35.5%, transparent 36%),
            linear-gradient(45deg, transparent 75%, hsl(32 100% 52% / 0.03) 75.5%, transparent 76%)
          `,
          backgroundSize: "400px 400px, 500px 500px, 600px 600px, 450px 450px",
        }}
      />

      {/* Fine marble grain texture */}
      <div 
        className="absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Deep black overlay for marble depth */}
      <div 
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 120% 80% at 50% 0%, transparent 0%, hsl(0 0% 0% / 0.3) 70%),
            radial-gradient(ellipse 100% 100% at 50% 100%, hsl(0 0% 0% / 0.4) 0%, transparent 60%)
          `,
        }}
      />

      {/* Subtle vignette for depth */}
      <div 
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse 80% 60% at 50% 50%, transparent 0%, hsl(0 0% 0% / 0.6) 100%)",
        }}
      />
    </div>
  );
}
