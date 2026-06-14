import { useEffect, useState } from "react";
import axios from "axios";
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
} from "lucide-react";

const palette = {
  cyan: "#38BDF8",
  gold: "#FACC15",
  violet: "#8B5CF6",
  green: "#22C55E",
};

const defaultHeroData = {
  badge: "Admissions Open for New Academic Session",
  titleLine1: "Baljagriti Secondary",
  titleLine2: "English School",
  titleLine3: "Hetauda-2, Makwanpur",
  description:
    "Baljagriti Secondary English School blends academic discipline, digital learning, creativity, sports, and values for students from Play Group to Grade 10.",
  image:
    "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1100&h=900&fit=crop&auto=format",

  primaryButtonText: "Start Admission",
  primaryButtonLink: "/admissions",
  secondaryButtonText: "Explore Facilities",
  secondaryButtonLink: "/facilities",

  stat1Value: "2046 BS",
  stat1Label: "Established",
  stat2Value: "PG-10",
  stat2Label: "Classes",
  stat3Value: "Hetauda",
  stat3Label: "Makwanpur",

  imageLocation: "Hetauda-2, Makwanpur",
  imageBottomTitle: "Basudev Marga, Hetauda-2",
  imageBottomDescription:
    "A learning environment built for academics, values, creativity, and student growth.",

  floating1Title: "Quality Education",
  floating1Subtitle: "Academics + Values",
  floating2Title: "Computer Lab",
  floating2Subtitle: "Digital Facility",
  floating3Title: "Science Lab",
  floating3Subtitle: "Practical Learning",
  floating4Title: "E-Library",
  floating4Subtitle: "Learning Resources",
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

function HeroImageStage({ heroData }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92, y: 24 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.85, delay: 0.18 }}
      className="relative min-h-[430px] lg:min-h-[470px] flex items-center justify-center"
    >
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none hidden lg:block"
        viewBox="0 0 720 520"
        fill="none"
      >
        <motion.path
          d="M90 270 C130 90 560 90 630 270 C700 435 480 500 260 455 C125 428 60 350 90 270Z"
          stroke="rgba(56,189,248,0.22)"
          strokeWidth="2"
          strokeDasharray="8 10"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.4, delay: 0.4 }}
        />
        <motion.path
          d="M125 330 C175 135 555 130 600 305 C625 415 490 470 320 455 C195 442 110 405 125 330Z"
          stroke="rgba(250,204,21,0.18)"
          strokeWidth="2"
          strokeDasharray="5 12"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.4, delay: 0.65 }}
        />
      </svg>

      <div
        className="absolute w-[84%] h-[76%] rounded-[3rem]"
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
          y: [0, -8, 0],
          rotateY: [-2, -1, -2],
          rotateX: [2, 0, 2],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="relative z-10 w-[84%] h-[350px] lg:h-[380px] rounded-[2.5rem] overflow-hidden"
        style={{
          boxShadow:
            "0 42px 110px rgba(0,0,0,0.55), 0 0 70px rgba(56,189,248,0.14)",
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
              "linear-gradient(to top, rgba(2,6,23,0.62) 0%, rgba(2,6,23,0.12) 45%, transparent 100%)",
          }}
        />

        <div
          className="absolute top-4 left-4 px-4 py-3 rounded-2xl flex items-center gap-3"
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
              {heroData.imageLocation}
            </div>
          </div>
        </div>

        <div
          className="absolute bottom-4 left-4 right-4 px-4 py-3 rounded-2xl"
          style={{
            background: "rgba(2,6,23,0.38)",
            border: "1px solid rgba(255,255,255,0.14)",
            backdropFilter: "blur(14px)",
          }}
        >
          <div className="flex items-center gap-2 text-white font-semibold text-sm">
            <MapPin className="w-4 h-4" style={{ color: palette.gold }} />
            {heroData.imageBottomTitle}
          </div>
          <div
            className="text-xs mt-1"
            style={{ color: "rgba(255,255,255,0.64)" }}
          >
            {heroData.imageBottomDescription}
          </div>
        </div>
      </motion.div>

      <FloatingBadge
        className="absolute left-[4%] top-6 z-20 hidden xl:block"
        icon={GraduationCap}
        title={heroData.floating1Title}
        subtitle={heroData.floating1Subtitle}
        color={palette.gold}
        delay={0.3}
        direction="up"
      />

      <FloatingBadge
        className="absolute right-[2%] top-16 z-20 hidden xl:block"
        icon={Monitor}
        title={heroData.floating2Title}
        subtitle={heroData.floating2Subtitle}
        color={palette.cyan}
        delay={0.45}
        direction="down"
      />

      <FloatingBadge
        className="absolute left-[8%] bottom-1 z-20 hidden xl:block"
        icon={FlaskConical}
        title={heroData.floating3Title}
        subtitle={heroData.floating3Subtitle}
        color={palette.violet}
        delay={0.6}
        direction="up"
      />

      <FloatingBadge
        className="absolute right-[7%] bottom-0 z-20 hidden xl:block"
        icon={Library}
        title={heroData.floating4Title}
        subtitle={heroData.floating4Subtitle}
        color={palette.green}
        delay={0.75}
        direction="down"
      />
    </motion.div>
  );
}

function FloatingBadge({
  className,
  icon: Icon,
  title,
  subtitle,
  color,
  delay,
  direction,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: direction === "up" ? [0, -10, 0] : [0, 10, 0] }}
      transition={{
        opacity: { duration: 0.55, delay },
        y: { duration: 5, repeat: Infinity, ease: "easeInOut" },
      }}
      className={`rounded-3xl px-4 py-3 ${className}`}
      style={{
        background:
          "linear-gradient(145deg, rgba(255,255,255,0.18), rgba(255,255,255,0.07))",
        border: `1px solid ${color}4d`,
        boxShadow: "0 24px 60px rgba(0,0,0,0.32)",
        backdropFilter: "blur(20px)",
      }}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-11 h-11 rounded-2xl flex items-center justify-center"
          style={{
            background: `${color}22`,
            border: `1px solid ${color}42`,
          }}
        >
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
        <div>
          <div className="text-white text-sm font-bold">{title}</div>
          <div className="text-xs" style={{ color: "rgba(255,255,255,0.65)" }}>
            {subtitle}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function Hero() {
  const [heroData, setHeroData] = useState(defaultHeroData);

  useEffect(() => {
    const loadHeroContent = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/site-content/home");

        const savedHero = res.data?.data?.content?.hero;

        if (savedHero) {
          setHeroData({
            ...defaultHeroData,
            ...savedHero,
          });
        }
      } catch (error) {
        console.error("Hero content load error:", error);
      }
    };

    loadHeroContent();
  }, []);

  return (
    <section
      id="home"
      className="relative overflow-hidden pt-20 pb-20 lg:pb-14"
      style={{
        background:
          "radial-gradient(circle at 10% 18%, rgba(56,189,248,0.28), transparent 32%), radial-gradient(circle at 85% 12%, rgba(250,204,21,0.22), transparent 30%), radial-gradient(circle at 60% 78%, rgba(139,92,246,0.28), transparent 38%), linear-gradient(135deg, #020617 0%, #07111F 45%, #111827 100%)",
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

      <div className="max-w-[1450px] mx-auto px-8 py-8 lg:py-6 grid lg:grid-cols-[0.95fr_1.05fr] gap-8 items-center relative z-10">
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
            className="text-4xl md:text-5xl xl:text-6xl leading-[1.02] mb-5"
            style={{
              color: "#FFFFFF",
              fontFamily: "var(--font-display)",
              fontWeight: 850,
              letterSpacing: "-0.055em",
              textShadow: "0 22px 60px rgba(0,0,0,0.45)",
            }}
          >
            <span>{heroData.titleLine1}</span>
            <br />
            <span
              style={{
                display: "inline-block",
                background:
                  "linear-gradient(135deg, #6EE7B7 0%, #FACC15 50%, #C4B5FD 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                textShadow: "none",
                filter: "drop-shadow(0 6px 14px rgba(0,0,0,0.18))",
              }}
            >
              {heroData.titleLine2}
            </span>
            <br />
            <span>{heroData.titleLine3}</span>
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
              to={heroData.primaryButtonLink}
              className="relative overflow-hidden px-8 py-4 rounded-2xl font-bold text-slate-950 transition-all duration-300 hover:scale-105"
              style={{
                background:
                  "linear-gradient(135deg, #FACC15 0%, #38BDF8 100%)",
                boxShadow:
                  "0 24px 60px rgba(56,189,248,0.35), inset 0 1px 0 rgba(255,255,255,0.45)",
              }}
            >
              <span className="relative z-10 flex items-center gap-2">
                {heroData.primaryButtonText} <ArrowRight className="w-4 h-4" />
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
              to={heroData.secondaryButtonLink}
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
              {heroData.secondaryButtonText} <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          <div className="grid grid-cols-3 gap-3 max-w-xl">
            <GlassStat
              icon={Trophy}
              value={heroData.stat1Value}
              label={heroData.stat1Label}
              color={palette.gold}
              delay={0.3}
            />
            <GlassStat
              icon={BookOpen}
              value={heroData.stat2Value}
              label={heroData.stat2Label}
              color={palette.cyan}
              delay={0.38}
            />
            <GlassStat
              icon={MapPin}
              value={heroData.stat3Value}
              label={heroData.stat3Label}
              color={palette.green}
              delay={0.46}
            />
          </div>
        </div>

        <HeroImageStage heroData={heroData} />
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