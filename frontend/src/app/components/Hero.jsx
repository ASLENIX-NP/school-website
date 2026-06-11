import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { Sparkles, Play } from "lucide-react";

function FloatingCard({ className = "", delay = 0, children, style = {} }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.8 }}
      className={className}
      style={{
        ...style,
        animation:
          style.animation ||
          `float ${3 + delay}s ease-in-out infinite alternate`,
      }}
    >
      {children}
    </motion.div>
  );
}

function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden pt-20"
      style={{
        background:
          "linear-gradient(135deg, #0f1c3f 0%, #1a0a3c 40%, #2d1068 100%)",
      }}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full opacity-25"
          style={{
            background: "radial-gradient(circle, #6b21a8, transparent 70%)",
          }}
        />
        <div
          className="absolute bottom-0 -left-40 w-[500px] h-[500px] rounded-full opacity-20"
          style={{
            background: "radial-gradient(circle, #f97316, transparent 70%)",
          }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-5"
          style={{
            background: "radial-gradient(circle, #a855f7, transparent 70%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <style>{`
        @keyframes float {
          0% { transform: translateY(0px) rotate(0deg); }
          100% { transform: translateY(-16px) rotate(2deg); }
        }

        @keyframes float2 {
          0% { transform: translateY(0px) rotate(0deg); }
          100% { transform: translateY(-12px) rotate(-3deg); }
        }

        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-6 py-20 w-full grid lg:grid-cols-2 gap-16 items-center relative z-10">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6"
            style={{
              background: "rgba(249,115,22,0.15)",
              border: "1px solid rgba(249,115,22,0.3)",
              color: "#fb923c",
            }}
          >
            <Sparkles className="w-4 h-4" />
            Admissions Open
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl md:text-6xl xl:text-7xl text-white mb-6 leading-tight"
            style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}
          >
            Baljagriti English{" "}
            <span
              className="italic"
              style={{
                background:
                  "linear-gradient(135deg, #f97316, #fb923c, #a855f7)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Secondary School
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-lg md:text-xl mb-10 max-w-lg leading-relaxed"
            style={{ color: "rgba(255,255,255,0.72)" }}
          >
            A co-educational day school in Basudev Marga, Hetauda-2,
            Makwanpur, providing quality education from Play Group to Grade 10
            with a focus on academics, values, and all-round development.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap gap-4"
          >
            <Link
              to="/admissions"
              className="px-8 py-4 rounded-2xl font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              style={{
                background: "linear-gradient(135deg, #f97316, #ea580c)",
                boxShadow: "0 8px 32px rgba(249,115,22,0.4)",
              }}
            >
              Admission Details
            </Link>

            <Link
              to="/about"
              className="px-8 py-4 rounded-2xl font-semibold flex items-center gap-2 transition-all duration-300 hover:scale-105 group"
              style={{
                background: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.2)",
                color: "rgba(255,255,255,0.9)",
                backdropFilter: "blur(8px)",
              }}
            >
              <Play className="w-5 h-5 text-orange-400 group-hover:scale-110 transition-transform" />
              Learn About Us
            </Link>
          </motion.div>
        </div>

        <div className="relative flex items-center justify-center min-h-[500px]">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative w-72 h-72 md:w-96 md:h-96 rounded-3xl overflow-hidden"
            style={{
              boxShadow:
                "0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.1)",
              transform: "perspective(1000px) rotateY(-8deg) rotateX(4deg)",
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1760351561007-526f5353cc76?w=600&h=600&fit=crop&auto=format"
              alt="Students studying together"
              className="w-full h-full object-cover"
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to top, rgba(15,28,63,0.6) 0%, transparent 60%)",
              }}
            />
          </motion.div>

          <FloatingCard
            delay={0.5}
            className="absolute -top-4 -left-8 px-4 py-3 rounded-2xl flex items-center gap-3"
            style={{
              background: "rgba(255,255,255,0.12)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255,255,255,0.2)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
            }}
          >
            <span className="text-3xl">🏫</span>
            <div>
              <div className="text-white text-sm font-semibold">
                Since 2046 BS
              </div>
              <div
                className="text-xs"
                style={{ color: "rgba(255,255,255,0.6)" }}
              >
                Established School
              </div>
            </div>
          </FloatingCard>

          <FloatingCard
            delay={0.8}
            className="absolute -bottom-6 -right-6 px-4 py-3 rounded-2xl flex items-center gap-3"
            style={{
              background: "rgba(249,115,22,0.15)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(249,115,22,0.35)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
              animation: "float2 4s ease-in-out infinite alternate",
            }}
          >
            <span className="text-3xl">📚</span>
            <div>
              <div className="text-white text-sm font-semibold">
                PG to Grade 10
              </div>
              <div
                className="text-xs"
                style={{ color: "rgba(255,255,255,0.6)" }}
              >
                School Level
              </div>
            </div>
          </FloatingCard>

          <FloatingCard
            delay={1}
            className="absolute top-1/2 -right-12 px-4 py-3 rounded-2xl"
            style={{
              background: "rgba(107,33,168,0.25)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(168,85,247,0.3)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
              animation: "float 5s ease-in-out infinite alternate",
            }}
          >
            <div className="flex items-center gap-2">
              <span className="text-2xl">📍</span>
              <div>
                <div className="text-white text-sm font-semibold">
                  Hetauda-2
                </div>
                <div
                  className="text-xs"
                  style={{ color: "rgba(255,255,255,0.6)" }}
                >
                  Makwanpur, Nepal
                </div>
              </div>
            </div>
          </FloatingCard>

          <div
            className="absolute top-8 right-8 text-4xl select-none"
            style={{
              animation: "float2 3.5s ease-in-out infinite alternate",
              filter: "drop-shadow(0 4px 16px rgba(249,115,22,0.4))",
            }}
          >
            📚
          </div>

          <div
            className="absolute bottom-16 left-0 text-3xl select-none"
            style={{
              animation: "float 4.5s ease-in-out infinite alternate",
              filter: "drop-shadow(0 4px 16px rgba(168,85,247,0.4))",
            }}
          >
            ✏️
          </div>

          <div
            className="absolute top-1/3 left-4 text-2xl select-none"
            style={{
              animation: "float2 5s ease-in-out infinite alternate",
              filter: "drop-shadow(0 4px 12px rgba(255,255,255,0.2))",
            }}
          >
            💻
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 overflow-hidden">
        <svg
          viewBox="0 0 1440 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full"
        >
          <path
            d="M0 80L1440 80L1440 30C1200 70 960 10 720 30C480 50 240 0 0 30L0 80Z"
            fill="#fdf8f3"
          />
        </svg>
      </div>
    </section>
  );
}

export { Hero };
export default Hero;