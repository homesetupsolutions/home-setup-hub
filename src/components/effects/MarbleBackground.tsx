import { motion } from "framer-motion";

export function MarbleBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Pure black base */}
      <div className="absolute inset-0 bg-black" />
      
      {/* Primary orange marble swirls - very visible */}
      <motion.div
        animate={{
          x: [0, 50, 0],
          y: [0, -30, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 70% 50% at 10% 20%, hsl(24 100% 50% / 0.25) 0%, transparent 50%),
            radial-gradient(ellipse 60% 70% at 90% 80%, hsl(30 100% 45% / 0.2) 0%, transparent 55%),
            radial-gradient(ellipse 80% 60% at 50% 50%, hsl(20 100% 40% / 0.15) 0%, transparent 60%)
          `,
        }}
      />

      {/* Secondary orange clouds - drifting */}
      <motion.div
        animate={{
          x: [0, -40, 0],
          y: [0, 20, 0],
          rotate: [0, 5, 0],
        }}
        transition={{
          duration: 35,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -inset-[10%]"
        style={{
          background: `
            radial-gradient(ellipse 50% 80% at 85% 15%, hsl(24 100% 50% / 0.2) 0%, transparent 45%),
            radial-gradient(ellipse 70% 50% at 15% 85%, hsl(28 100% 48% / 0.18) 0%, transparent 50%),
            radial-gradient(ellipse 60% 60% at 70% 40%, hsl(32 100% 52% / 0.12) 0%, transparent 55%)
          `,
        }}
      />

      {/* Tertiary swirling layer */}
      <motion.div
        animate={{
          scale: [1.05, 1, 1.05],
          rotate: [0, -3, 0],
        }}
        transition={{
          duration: 40,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -inset-[15%]"
        style={{
          background: `
            radial-gradient(ellipse 40% 90% at 30% 60%, hsl(24 100% 55% / 0.15) 0%, transparent 50%),
            radial-gradient(ellipse 90% 40% at 75% 25%, hsl(30 100% 50% / 0.12) 0%, transparent 45%)
          `,
        }}
      />

      {/* Prominent marble veins */}
      <motion.div
        animate={{
          opacity: [0.08, 0.15, 0.08],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(125deg, transparent 35%, hsl(24 100% 50% / 0.4) 35.3%, transparent 35.6%),
            linear-gradient(235deg, transparent 50%, hsl(30 100% 45% / 0.35) 50.3%, transparent 50.6%),
            linear-gradient(175deg, transparent 25%, hsl(20 100% 55% / 0.3) 25.3%, transparent 25.6%),
            linear-gradient(305deg, transparent 65%, hsl(35 100% 50% / 0.25) 65.3%, transparent 65.6%)
          `,
          backgroundSize: "100% 100%",
        }}
      />

      {/* Secondary thin veins */}
      <div 
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: `
            linear-gradient(145deg, transparent 42%, hsl(24 100% 50%) 42.2%, transparent 42.4%),
            linear-gradient(215deg, transparent 58%, hsl(30 100% 45%) 58.2%, transparent 58.4%),
            linear-gradient(335deg, transparent 32%, hsl(28 100% 48%) 32.2%, transparent 32.4%),
            linear-gradient(75deg, transparent 72%, hsl(32 100% 52%) 72.2%, transparent 72.4%)
          `,
          backgroundSize: "500px 500px, 600px 600px, 450px 450px, 550px 550px",
        }}
      />

      {/* Marble speckles */}
      <div 
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 30%, hsl(24 100% 50%) 1px, transparent 1px),
            radial-gradient(circle at 80% 70%, hsl(30 100% 55%) 1px, transparent 1px),
            radial-gradient(circle at 40% 80%, hsl(28 100% 50%) 1px, transparent 1px),
            radial-gradient(circle at 70% 20%, hsl(32 100% 55%) 1px, transparent 1px)
          `,
          backgroundSize: "100px 100px, 80px 80px, 120px 120px, 90px 90px",
        }}
      />

      {/* Fine grain texture */}
      <div 
        className="absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Ambient glow spots */}
      <motion.div
        animate={{
          opacity: [0.3, 0.5, 0.3],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-1/4 left-1/4 w-[600px] h-[400px] rounded-full blur-[120px]"
        style={{ background: "hsl(24 100% 50% / 0.15)" }}
      />
      
      <motion.div
        animate={{
          opacity: [0.25, 0.4, 0.25],
          scale: [1.1, 1, 1.1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
        className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full blur-[100px]"
        style={{ background: "hsl(30 100% 50% / 0.12)" }}
      />

      {/* Subtle vignette */}
      <div 
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse 90% 70% at 50% 50%, transparent 0%, hsl(0 0% 0% / 0.4) 100%)",
        }}
      />
    </div>
  );
}
