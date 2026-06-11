import schoolLogo from "../../assets/school-logo.jpeg";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  GraduationCap,
  MapPin,
  Sparkles,
  Trophy,
  Monitor,
  FlaskConical,
  Library,
  Music,
} from "lucide-react";

const palette = {
  cyan: "#38BDF8",
  gold: "#FACC15",
  violet: "#8B5CF6",
  green: "#22C55E",
  rose: "#FB7185",
};

const heroData = {
  badge: "Admissions Open for New Academic Session",
  titleTop: "A Future-Ready",
  titleHighlight: "School Experience",
  titleBottom: "in Hetauda",
  description:
    "Baljagriti Secondary English Boarding School blends academic discipline, digital learning, creativity, sports, and values for students from Play Group to Grade 10.",
  image:
    "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1100&h=900&fit=crop&auto=format",
};

function GlassStat({ icon: Icon, value, label, color, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.55 }}
      className="rounded-3xl p-4"
      style={{
        background:
          "linear-gradient(145deg, rgba(255,255,255,0.14), rgba(255,255,255,0.055))",
        border: "1px solid rgba(255,255,255,0.18)",
        boxShadow:
          "0 20px 46px rgba(0,0,0,0.24), inset 0 1px 0 rgba(255,255,255,0.16)",
        backdropFilter: "blur(18px)",
      }}
    >
      <div
        className="w-10 h-10 rounded-2xl flex items-center justify-center mb-3"
        style={{
          background: `${color}24`,
          border: `1px solid ${color}40`,
        }}
      >
        <Icon className="w-5 h-5" style={{ color }} />
      </div>

      <div
        className="text-xl font-bold"
        style={{
          color: "#FFFFFF",
          fontFamily: "var(--font-display)",
        }}
      >
        {value}
      </div>

      <div className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.62)" }}>
        {label}
      </div>
    </motion.div>
  );
}

function FloatingBadge({
  icon: Icon,
  title,
  subtitle,
  color,
  className = "",
  delay = 0,
  reverse = false,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.92 }}
      animate={{
        opacity: 1,
        y: reverse ? [0, 14, 0] : [0, -14, 0],
        rotate: reverse ? [0, -1.5, 0] : [0, 1.5, 0],
        scale: 1,
      }}
      transition={{
        opacity: { duration: 0.55, delay },
        scale: { duration: 0.55, delay },
        y: { duration: 4.8, repeat: Infinity, ease: "easeInOut", delay },
        rotate: { duration: 4.8, repeat: Infinity, ease: "easeInOut", delay },
      }}
      className={`absolute z-20 rounded-3xl px-4 py-3 ${className}`}
      style={{
        background:
          "linear-gradient(145deg, rgba(255,255,255,0.20), rgba(255,255,255,0.07))",
        border: "1px solid rgba(255,255,255,0.22)",
        boxShadow:
          "0 28px 70px rgba(0,0,0,0.36), inset 0 1px 0 rgba(255,255,255,0.16)",
        backdropFilter: "blur(22px)",
      }}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-11 h-11 rounded-2xl flex items-center justify-center"
          style={{
            background: `${color}22`,
            border: `1px solid ${color}42`,
            boxShadow: `0 0 28px ${color}22`,
          }}
        >
          <Icon className="w-5 h-5" style={{ color }} />
        </div>

        <div>
          <div className="text-white text-sm font-bold whitespace-nowrap">
            {title}
          </div>
          <div
            className="text-xs whitespace-nowrap"
            style={{ color: "rgba(255,255,255,0.65)" }}
          >
            {subtitle}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function HeroImageStage() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 26 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.85, delay: 0.18 }}
      className="relative min-h-[560px] flex items-center justify-center"
    >
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none hidden lg:block"
        viewBox="0 0 720 560"
        fill="none"
      >
        <motion.path
          d="M90 290 C130 90 560 90 630 285 C700 465 460 540 250 475 C120 435 60 365 90 290Z"
          stroke="rgba(56,189,248,0.26)"
          strokeWidth="2"
          strokeDasharray="8 10"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.4, delay: 0.4 }}
        />
        <motion.path
          d="M125 360 C175 145 555 135 600 330 C625 455 475 515 310 490 C190 470 105 440 125 360Z"
          stroke="rgba(250,204,21,0.22)"
          strokeWidth="2"
          strokeDasharray="5 12"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.4, delay: 0.65 }}
        />
      </svg>

      <div
        className="absolute w-[82%] h-[72%] rounded-[3rem]"
        style={{
          background:
            "linear-gradient(145deg, rgba(255,255,255,0.16), rgba(255,255,255,0.045))",
          border: "1px solid rgba(255,255,255,0.18)",
          boxShadow:
            "0 38px 100px rgba(0,0,0,0.46), inset 0 1px 0 rgba(255,255,255,0.14)",
          backdropFilter: "blur(22px)",
          transform: "perspective(1200px) rotateY(-5deg) rotateX(3deg)",
        }}
      />

      <motion.div
        animate={{
          y: [0, -10, 0],
          rotateY: [-3, -1, -3],
          rotateX: [2, 0, 2],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="relative z-10 w-[82%] h-[410px] rounded-[2.5rem] overflow-hidden"
        style={{
          boxShadow:
            "0 42px 110px rgba(0,0,0,0.55), 0 0 70px rgba(56,189,248,0.18)",
          border: "1px solid rgba(255,255,255,0.18)",
          transformStyle: "preserve-3d",
        }}
      >
        <img
          src={heroData.image}
          alt="Baljagriti school students"
          className="w-full h-full object-cover"
        />

        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(2,6,23,0.62) 0%, rgba(2,6,23,0.1) 45%, transparent 100%)",
          }}
        />

        <div
          className="absolute top-5 left-5 px-4 py-3 rounded-2xl flex items-center gap-3"
          style={{
            background: "rgba(2,6,23,0.42)",
            border: "1px solid rgba(255,255,255,0.16)",
            backdropFilter: "blur(16px)",
            boxShadow: "0 16px 40px rgba(0,0,0,0.26)",
          }}
        >
          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center overflow-hidden">
            <img
              src={schoolLogo}
              alt="Baljagriti School Logo"
              className="w-full h-full object-contain p-1"
            />
          </div>

          <div>
            <div className="text-white text-sm font-bold">Baljagriti</div>
            <div
              className="text-xs"
              style={{ color: "rgba(255,255,255,0.64)" }}
            >
              Hetauda-2, Makwanpur
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: [0, -10, 0] }}
        transition={{
          opacity: { duration: 0.55, delay: 0.3 },
          y: { duration: 4.8, repeat: Infinity, ease: "easeInOut" },
        }}
        className="absolute left-[6%] top-8 z-20 rounded-3xl px-4 py-3 hidden xl:block"
        style={{
          background:
            "linear-gradient(145deg, rgba(255,255,255,0.18), rgba(255,255,255,0.07))",
          border: "1px solid rgba(255,255,255,0.22)",
          boxShadow: "0 24px 60px rgba(0,0,0,0.32)",
          backdropFilter: "blur(20px)",
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-11 h-11 rounded-2xl flex items-center justify-center"
            style={{
              background: `${palette.gold}22`,
              border: `1px solid ${palette.gold}42`,
            }}
          >
            <GraduationCap className="w-5 h-5" style={{ color: palette.gold }} />
          </div>
          <div>
            <div className="text-white text-sm font-bold">Quality Education</div>
            <div
              className="text-xs"
              style={{ color: "rgba(255,255,255,0.65)" }}
            >
              Academics + Values
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: [0, 10, 0] }}
        transition={{
          opacity: { duration: 0.55, delay: 0.45 },
          y: { duration: 5, repeat: Infinity, ease: "easeInOut" },
        }}
        className="absolute right-[4%] top-16 z-20 rounded-3xl px-4 py-3 hidden xl:block"
        style={{
          background:
            "linear-gradient(145deg, rgba(56,189,248,0.2), rgba(255,255,255,0.07))",
          border: "1px solid rgba(56,189,248,0.3)",
          boxShadow: "0 24px 60px rgba(0,0,0,0.32)",
          backdropFilter: "blur(20px)",
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-11 h-11 rounded-2xl flex items-center justify-center"
            style={{
              background: `${palette.cyan}22`,
              border: `1px solid ${palette.cyan}42`,
            }}
          >
            <Monitor className="w-5 h-5" style={{ color: palette.cyan }} />
          </div>
          <div>
            <div className="text-white text-sm font-bold">Computer Lab</div>
            <div
              className="text-xs"
              style={{ color: "rgba(255,255,255,0.65)" }}
            >
              Digital Facility
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: [0, -10, 0] }}
        transition={{
          opacity: { duration: 0.55, delay: 0.6 },
          y: { duration: 5.2, repeat: Infinity, ease: "easeInOut" },
        }}
        className="absolute left-[9%] bottom-10 z-20 rounded-3xl px-4 py-3 hidden xl:block"
        style={{
          background:
            "linear-gradient(145deg, rgba(139,92,246,0.2), rgba(255,255,255,0.07))",
          border: "1px solid rgba(139,92,246,0.3)",
          boxShadow: "0 24px 60px rgba(0,0,0,0.32)",
          backdropFilter: "blur(20px)",
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-11 h-11 rounded-2xl flex items-center justify-center"
            style={{
              background: `${palette.violet}22`,
              border: `1px solid ${palette.violet}42`,
            }}
          >
            <FlaskConical className="w-5 h-5" style={{ color: palette.violet }} />
          </div>
          <div>
            <div className="text-white text-sm font-bold">Science Lab</div>
            <div
              className="text-xs"
              style={{ color: "rgba(255,255,255,0.65)" }}
            >
              Practical Learning
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: [0, 10, 0] }}
        transition={{
          opacity: { duration: 0.55, delay: 0.75 },
          y: { duration: 5.4, repeat: Infinity, ease: "easeInOut" },
        }}
        className="absolute right-[7%] bottom-8 z-20 rounded-3xl px-4 py-3 hidden xl:block"
        style={{
          background:
            "linear-gradient(145deg, rgba(34,197,94,0.2), rgba(255,255,255,0.07))",
          border: "1px solid rgba(34,197,94,0.3)",
          boxShadow: "0 24px 60px rgba(0,0,0,0.32)",
          backdropFilter: "blur(20px)",
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-11 h-11 rounded-2xl flex items-center justify-center"
            style={{
              background: `${palette.green}22`,
              border: `1px solid ${palette.green}42`,
            }}
          >
            <Library className="w-5 h-5" style={{ color: palette.green }} />
          </div>
          <div>
            <div className="text-white text-sm font-bold">E-Library</div>
            <div
              className="text-xs"
              style={{ color: "rgba(255,255,255,0.65)" }}
            >
              Learning Resources
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen overflow-hidden pt-20"
      style={{
        background:
          "radial-gradient(circle at 10% 18%, rgba(56,189,248,0.28), transparent 32%), radial-gradient(circle at 85% 12%, rgba(250,204,21,0.22), transparent 30%), radial-gradient(circle at 60% 78%, rgba(139,92,246,0.32), transparent 38%), linear-gradient(135deg, #020617 0%, #07111F 45%, #111827 100%)",
      }}
    >
      <style>{`
        @keyframes beamMove {
          0% { transform: translateX(-120%) rotate(18deg); }
          100% { transform: translateX(140%) rotate(18deg); }
        }

        @keyframes gridDrift {
          from { background-position: 0 0; }
          to { background-position: 90px 90px; }
        }

        @keyframes pulseGlow {
          0%, 100% { opacity: 0.45; transform: scale(1); }
          50% { opacity: 0.95; transform: scale(1.08); }
        }
      `}</style>

      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.18) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.18) 1px, transparent 1px)",
            backgroundSize: "90px 90px",
            animation: "gridDrift 22s linear infinite",
            transform: "perspective(700px) rotateX(63deg) translateY(160px)",
            transformOrigin: "center bottom",
          }}
        />

        <div
          className="absolute -top-40 -left-32 w-[620px] h-[620px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(56,189,248,0.45), transparent 68%)",
            filter: "blur(18px)",
            animation: "pulseGlow 6s ease-in-out infinite",
          }}
        />

        <div
          className="absolute -top-32 -right-32 w-[560px] h-[560px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(250,204,21,0.32), transparent 68%)",
            filter: "blur(18px)",
            animation: "pulseGlow 7s ease-in-out infinite",
          }}
        />
      </div>

      <div className="max-w-[1450px] mx-auto px-8 py-10 lg:py-8 grid lg:grid-cols-[0.95fr_1.05fr] gap-10 items-center relative z-10">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65 }}
            className="inline-flex items-center gap-3 rounded-full px-4 py-2 mb-6"
            style={{
              background:
                "linear-gradient(145deg, rgba(255,255,255,0.16), rgba(255,255,255,0.06))",
              border: "1px solid rgba(255,255,255,0.18)",
              boxShadow: "0 18px 46px rgba(0,0,0,0.26)",
              backdropFilter: "blur(18px)",
              color: "rgba(255,255,255,0.9)",
            }}
          >
            <span
              className="w-8 h-8 rounded-full bg-white flex items-center justify-center overflow-hidden"
              style={{ boxShadow: "0 0 22px rgba(56,189,248,0.35)" }}
            >
              <img
                src={schoolLogo}
                alt="Baljagriti School Logo"
                className="w-full h-full object-contain p-1"
              />
            </span>
            <Sparkles className="w-4 h-4" style={{ color: palette.gold }} />
            <span className="text-sm font-semibold">{heroData.badge}</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.08 }}
            className="text-5xl md:text-6xl xl:text-7xl leading-[1.03] mb-5"
            style={{
              color: "#FFFFFF",
              fontFamily: "var(--font-display)",
              fontWeight: 850,
              letterSpacing: "-0.055em",
              textShadow: "0 30px 80px rgba(0,0,0,0.55)",
            }}
          >
            {heroData.titleTop}{" "}
            <span
              style={{
                background:
                  "linear-gradient(135deg, #38BDF8 0%, #FACC15 48%, #A78BFA 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {heroData.titleHighlight}
            </span>{" "}
            {heroData.titleBottom}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.16 }}
            className="text-lg md:text-xl max-w-xl leading-relaxed mb-7"
            style={{ color: "rgba(226,232,240,0.78)" }}
          >
            {heroData.description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.24 }}
            className="flex flex-wrap gap-4 mb-8"
          >
            <Link
              to="/admissions"
              className="relative overflow-hidden px-8 py-4 rounded-2xl font-bold text-slate-950 transition-all duration-300 hover:scale-105"
              style={{
                background:
                  "linear-gradient(135deg, #FACC15 0%, #38BDF8 100%)",
                boxShadow:
                  "0 24px 60px rgba(56,189,248,0.35), inset 0 1px 0 rgba(255,255,255,0.45)",
              }}
            >
              <span className="relative z-10 flex items-center gap-2">
                Start Admission <ArrowRight className="w-4 h-4" />
              </span>
              <span
                className="absolute top-0 bottom-0 w-24 opacity-40"
                style={{
                  left: 0,
                  background:
                    "linear-gradient(90deg, transparent, rgba(255,255,255,0.85), transparent)",
                  animation: "beamMove 2.8s ease-in-out infinite",
                }}
              />
            </Link>

            <Link
              to="/facilities"
              className="px-8 py-4 rounded-2xl font-bold flex items-center gap-2 transition-all duration-300 hover:scale-105"
              style={{
                color: "#FFFFFF",
                background:
                  "linear-gradient(145deg, rgba(255,255,255,0.13), rgba(255,255,255,0.055))",
                border: "1px solid rgba(255,255,255,0.18)",
                boxShadow: "0 20px 52px rgba(0,0,0,0.26)",
                backdropFilter: "blur(18px)",
              }}
            >
              Explore Facilities <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          <div className="grid grid-cols-3 gap-3 max-w-xl">
            <GlassStat
              icon={Trophy}
              value="2046 BS"
              label="Established"
              color={palette.gold}
              delay={0.3}
            />
            <GlassStat
              icon={BookOpen}
              value="PG-10"
              label="Classes"
              color={palette.cyan}
              delay={0.38}
            />
            <GlassStat
              icon={MapPin}
              value="Hetauda"
              label="Makwanpur"
              color={palette.green}
              delay={0.46}
            />
          </div>
        </div>

        <HeroImageStage />
      </div>

      <div
        className="absolute bottom-0 left-0 right-0 h-16"
        style={{
          background:
            "linear-gradient(180deg, transparent 0%, rgba(255,248,238,1) 100%)",
        }}
      />
    </section>
  );
}

export { Hero };
export default Hero;