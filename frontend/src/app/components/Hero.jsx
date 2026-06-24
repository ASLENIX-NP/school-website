import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";

const palette = {
  cyan: "#38BDF8",
  gold: "#FACC15",
  green: "#22C55E",
  purple: "#8B5CF6",
  navy: "#0B1020",
  cream: "#FFF8EE",
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

function safeLink(link, fallback) {
  const clean = String(link || "").trim();
  return clean.startsWith("/") ? clean : fallback;
}

function GlassStat({ value, label, color, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.55 }}
      className="group min-w-0 overflow-hidden rounded-2xl sm:rounded-3xl px-3 py-4 sm:p-5 cursor-pointer transition-all duration-300 hover:-translate-y-2"
      style={{
        background:
          "linear-gradient(145deg, rgba(255,255,255,0.82), rgba(255,255,255,0.50))",
        border: "1px solid rgba(15,23,42,0.10)",
        boxShadow:
          "0 20px 46px rgba(15,23,42,0.10), inset 0 1px 0 rgba(255,255,255,0.75)",
        backdropFilter: "blur(18px)",
      }}
    >
      <div
        className="w-8 sm:w-11 h-1 rounded-full mb-3 sm:mb-4 transition-all duration-200 ease-out group-hover:w-14 sm:group-hover:w-20"
        style={{ background: color }}
      />

      <div
        className="max-w-full text-[17px] min-[390px]:text-[18px] sm:text-2xl font-black leading-[1.05] break-words"
        style={{
          color: palette.navy,
          fontFamily: "var(--font-display)",
          letterSpacing: "-0.035em",
          overflowWrap: "anywhere",
        }}
      >
        {value}
      </div>

      <div
        className="text-[9px] sm:text-xs mt-1 font-bold leading-tight break-words"
        style={{ color: "rgba(15,23,42,0.58)" }}
      >
        {label}
      </div>
    </motion.div>
  );
}

function FloatingTextTag({ className, title, subtitle, color, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{
        opacity: 1,
        y: [0, 9, 0],
      }}
      whileHover={{
        y: -8,
        scale: 1.03,
      }}
      transition={{
        opacity: { duration: 0.55, delay },
        y: {
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
          delay,
        },
      }}
      className={`group rounded-3xl px-5 py-4 cursor-pointer transition-all duration-300 ${className}`}
      style={{
        background:
          "linear-gradient(145deg, rgba(255,255,255,0.90), rgba(255,255,255,0.58))",
        border: `1px solid ${color}55`,
        boxShadow: "0 22px 52px rgba(15,23,42,0.12)",
        backdropFilter: "blur(20px)",
      }}
    >
      <div
        className="w-12 h-1 rounded-full mb-3 transition-all duration-150 ease-out group-hover:w-24"
        style={{ background: color }}
      />

      <div className="text-slate-950 text-sm font-black whitespace-nowrap">
        {title}
      </div>

      <div
        className="text-xs mt-1 font-semibold whitespace-nowrap"
        style={{ color: "rgba(15,23,42,0.58)" }}
      >
        {subtitle}
      </div>
    </motion.div>
  );
}

function Premium3DBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-[1] overflow-hidden">
      <motion.div
        animate={{
          x: [0, 42, -16, 0],
          y: [0, -28, 22, 0],
          rotate: [0, 12, -8, 0],
          scale: [1, 1.08, 0.98, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute left-[-8%] top-[18%] hidden lg:block w-[420px] h-[420px] rounded-full"
        style={{
          opacity: 0.18,
          background:
            "radial-gradient(circle at 35% 35%, rgba(56,189,248,0.52), rgba(255,255,255,0.22) 38%, transparent 72%)",
          filter: "blur(6px)",
        }}
      />

      <motion.div
        animate={{
          x: [0, -36, 24, 0],
          y: [0, 30, -20, 0],
          rotate: [0, -14, 10, 0],
          scale: [1, 1.05, 0.96, 1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute right-[-10%] top-[12%] hidden lg:block w-[520px] h-[520px] rounded-full"
        style={{
          opacity: 0.20,
          background:
            "radial-gradient(circle at 45% 35%, rgba(250,204,21,0.48), rgba(255,255,255,0.20) 40%, transparent 72%)",
          filter: "blur(8px)",
        }}
      />

      <motion.div
        animate={{
          rotateX: [52, 64, 52],
          rotateY: [-14, 18, -14],
          rotateZ: [-18, 8, -18],
          x: [0, 34, 0],
          y: [0, -22, 0],
        }}
        transition={{
          duration: 17,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute left-[4%] bottom-[8%] hidden xl:block w-[360px] h-[180px] rounded-[3rem]"
        style={{
          perspective: "1200px",
          transformStyle: "preserve-3d",
          opacity: 0.22,
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.56), rgba(56,189,248,0.18), rgba(255,255,255,0.12))",
          border: "1px solid rgba(255,255,255,0.64)",
          boxShadow:
            "0 34px 90px rgba(15,23,42,0.10), inset 0 1px 0 rgba(255,255,255,0.82)",
          backdropFilter: "blur(16px)",
        }}
      />

      <motion.div
        animate={{
          rotateX: [58, 46, 58],
          rotateY: [16, -18, 16],
          rotateZ: [12, -10, 12],
          x: [0, -26, 0],
          y: [0, 26, 0],
        }}
        transition={{
          duration: 19,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.7,
        }}
        className="absolute right-[5%] bottom-[10%] hidden xl:block w-[300px] h-[150px] rounded-[2.5rem]"
        style={{
          perspective: "1200px",
          transformStyle: "preserve-3d",
          opacity: 0.20,
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.52), rgba(250,204,21,0.20), rgba(255,255,255,0.10))",
          border: "1px solid rgba(255,255,255,0.64)",
          boxShadow:
            "0 34px 90px rgba(15,23,42,0.10), inset 0 1px 0 rgba(255,255,255,0.82)",
          backdropFilter: "blur(16px)",
        }}
      />

      <motion.div
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 55,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute left-[45%] top-[16%] hidden lg:block w-[380px] h-[380px] rounded-full"
        style={{
          opacity: 0.13,
          border: "1px solid rgba(56,189,248,0.70)",
          boxShadow:
            "0 0 80px rgba(56,189,248,0.18), inset 0 0 80px rgba(255,255,255,0.10)",
        }}
      />

      <motion.div
        animate={{
          rotate: -360,
        }}
        transition={{
          duration: 68,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute left-[50%] top-[20%] hidden lg:block w-[260px] h-[260px] rounded-full"
        style={{
          opacity: 0.12,
          border: "1px solid rgba(250,204,21,0.70)",
          boxShadow:
            "0 0 80px rgba(250,204,21,0.18), inset 0 0 80px rgba(255,255,255,0.10)",
        }}
      />

      <motion.div
        animate={{
          backgroundPosition: ["0px 0px", "140px 140px"],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute inset-0 hidden lg:block"
        style={{
          opacity: 0.10,
          backgroundImage:
            "linear-gradient(rgba(75,46,131,0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(75,46,131,0.18) 1px, transparent 1px)",
          backgroundSize: "140px 140px",
          maskImage:
            "radial-gradient(circle at 50% 45%, black 0%, black 38%, transparent 76%)",
          WebkitMaskImage:
            "radial-gradient(circle at 50% 45%, black 0%, black 38%, transparent 76%)",
          transform: "perspective(800px) rotateX(62deg) translateY(240px)",
          transformOrigin: "center bottom",
        }}
      />

      <motion.div
        animate={{
          x: ["-20%", "120%"],
        }}
        transition={{
          duration: 13,
          repeat: Infinity,
          ease: "easeInOut",
          repeatDelay: 2.5,
        }}
        className="absolute top-[18%] hidden lg:block w-[420px] h-[180px]"
        style={{
          opacity: 0.12,
          background:
            "linear-gradient(90deg, transparent, rgba(255,255,255,0.58), rgba(56,189,248,0.28), transparent)",
          filter: "blur(18px)",
          transform: "rotate(-12deg)",
        }}
      />

      <motion.div
        animate={{
          x: ["115%", "-25%"],
        }}
        transition={{
          duration: 16,
          repeat: Infinity,
          ease: "easeInOut",
          repeatDelay: 3,
        }}
        className="absolute bottom-[18%] hidden lg:block w-[460px] h-[190px]"
        style={{
          opacity: 0.10,
          background:
            "linear-gradient(90deg, transparent, rgba(250,204,21,0.42), rgba(255,255,255,0.50), transparent)",
          filter: "blur(20px)",
          transform: "rotate(10deg)",
        }}
      />
    </div>
  );
}

function HeroImageStage({ heroData }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: 24 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.85, delay: 0.18 }}
      className="relative min-h-[430px] lg:min-h-[470px] xl:min-h-[560px] flex items-center justify-center"
    >
      <div
        className="absolute w-[88%] h-[68%] xl:h-[66%] rounded-[3rem]"
        style={{
          background:
            "linear-gradient(145deg, rgba(255,255,255,0.68), rgba(255,255,255,0.34))",
          border: "1px solid rgba(255,255,255,0.76)",
          boxShadow:
            "0 34px 90px rgba(15,23,42,0.14), inset 0 1px 0 rgba(255,255,255,0.65)",
          backdropFilter: "blur(22px)",
          transform: "perspective(1200px) rotateY(-3deg) rotateX(2deg)",
        }}
      />

      <motion.div
        animate={{
          y: [0, -7, 0],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="relative z-10 w-[88%] h-[360px] lg:h-[395px] rounded-[2.5rem] overflow-hidden"
        style={{
          boxShadow:
            "0 38px 92px rgba(15,23,42,0.20), 0 0 60px rgba(56,189,248,0.12)",
          border: "1px solid rgba(255,255,255,0.76)",
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
              "linear-gradient(to top, rgba(15,23,42,0.58) 0%, rgba(15,23,42,0.10) 52%, transparent 100%)",
          }}
        />

        <div
          className="absolute bottom-5 left-5 right-5 px-5 py-4 rounded-2xl"
          style={{
            background: "rgba(255,255,255,0.82)",
            border: "1px solid rgba(255,255,255,0.76)",
            boxShadow: "0 18px 42px rgba(15,23,42,0.18)",
            backdropFilter: "blur(16px)",
          }}
        >
          <div className="font-black text-base" style={{ color: palette.navy }}>
            {heroData.imageBottomTitle}
          </div>

          <div
            className="text-sm mt-1 leading-relaxed font-medium"
            style={{ color: "rgba(15,23,42,0.62)" }}
          >
            {heroData.imageBottomDescription}
          </div>
        </div>
      </motion.div>

      <FloatingTextTag
        className="absolute left-[7%] top-16 z-20 hidden xl:block"
        title={heroData.floating1Title}
        subtitle={heroData.floating1Subtitle}
        color={palette.gold}
        delay={0.3}
      />

      <FloatingTextTag
        className="absolute right-[6%] top-12 z-20 hidden xl:block"
        title={heroData.floating2Title}
        subtitle={heroData.floating2Subtitle}
        color={palette.cyan}
        delay={0.45}
      />

      <FloatingTextTag
        className="absolute left-[12%] bottom-2 z-20 hidden xl:block"
        title={heroData.floating3Title}
        subtitle={heroData.floating3Subtitle}
        color={palette.purple}
        delay={0.6}
      />

      <FloatingTextTag
        className="absolute right-[12%] bottom-7 z-20 hidden xl:block"
        title={heroData.floating4Title}
        subtitle={heroData.floating4Subtitle}
        color={palette.green}
        delay={0.75}
      />
    </motion.div>
  );
}

function Hero() {
  const [heroData, setHeroData] = useState(defaultHeroData);

  useEffect(() => {
    const loadHeroContent = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/site-content/home"
        );

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
          "radial-gradient(circle at 9% 18%, rgba(56,189,248,0.30), transparent 32%), radial-gradient(circle at 86% 14%, rgba(250,204,21,0.28), transparent 31%), radial-gradient(circle at 58% 78%, rgba(139,92,246,0.16), transparent 38%), linear-gradient(135deg, #F8FCFF 0%, #FFF8EE 45%, #F1F7FF 100%)",
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
          50% { opacity: 0.75; transform: scale(1.05); }
        }

        @keyframes miniFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-14px); }
        }
      `}</style>

      <Premium3DBackground />

      <div className="absolute inset-0 pointer-events-none overflow-hidden z-[2]">
        <div
          className="absolute inset-0 opacity-[0.20]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(75,46,131,.13) 1px, transparent 1px), linear-gradient(90deg, rgba(75,46,131,.13) 1px, transparent 1px)",
            backgroundSize: "90px 90px",
            animation: "gridDrift 24s linear infinite",
            transform: "perspective(700px) rotateX(63deg) translateY(160px)",
            transformOrigin: "center bottom",
          }}
        />

        <div
          className="absolute -top-40 -left-32 w-[620px] h-[620px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(56,189,248,0.28), transparent 68%)",
            filter: "blur(18px)",
            animation: "pulseGlow 7s ease-in-out infinite",
          }}
        />

        <div
          className="absolute -top-32 -right-32 w-[560px] h-[560px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(250,204,21,0.30), transparent 68%)",
            filter: "blur(18px)",
            animation: "pulseGlow 8s ease-in-out infinite",
          }}
        />

        <div
          className="absolute left-[8%] bottom-[12%] w-20 h-20 rounded-3xl hidden lg:block"
          style={{
            background:
              "linear-gradient(145deg, rgba(255,255,255,0.78), rgba(255,255,255,0.28))",
            border: "1px solid rgba(255,255,255,0.72)",
            boxShadow: "0 20px 50px rgba(15,23,42,0.08)",
            animation: "miniFloat 6s ease-in-out infinite",
          }}
        />

        <div
          className="absolute right-[12%] top-[24%] w-14 h-14 rounded-full hidden lg:block"
          style={{
            background:
              "linear-gradient(145deg, rgba(250,204,21,0.40), rgba(255,255,255,0.45))",
            border: "1px solid rgba(255,255,255,0.78)",
            boxShadow: "0 20px 50px rgba(15,23,42,0.08)",
            animation: "miniFloat 7s ease-in-out infinite",
          }}
        />
      </div>

      <div className="max-w-[1450px] mx-auto px-8 py-8 lg:py-6 grid lg:grid-cols-[0.95fr_1.05fr] gap-8 items-center relative z-10">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65 }}
            className="inline-flex items-center gap-2 rounded-full px-5 py-2 mb-6"
            style={{
              background:
                "linear-gradient(145deg, rgba(255,255,255,0.86), rgba(255,255,255,0.55))",
              border: "1px solid rgba(15,23,42,0.08)",
              boxShadow:
                "0 18px 42px rgba(15,23,42,0.08), inset 0 1px 0 rgba(255,255,255,0.70)",
              backdropFilter: "blur(18px)",
              color: palette.navy,
            }}
          >
            <Sparkles className="w-4 h-4" color={palette.gold} />
            <span className="text-sm font-black">{heroData.badge}</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.08 }}
            className="text-4xl md:text-5xl xl:text-6xl leading-[1.02] mb-5"
            style={{
              color: palette.navy,
              fontFamily: "var(--font-display)",
              fontWeight: 900,
              letterSpacing: "-0.06em",
              textShadow: "0 14px 38px rgba(255,255,255,0.65)",
            }}
          >
            <span>{heroData.titleLine1}</span>
            <br />
            <span
              style={{
                display: "inline-block",
                background:
                  "linear-gradient(135deg, #168A3A 0%, #FACC15 50%, #4B2E83 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                textShadow: "none",
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
            style={{ color: "rgba(15,23,42,0.68)" }}
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
              to={safeLink(heroData.primaryButtonLink, "/admissions")}
              className="relative overflow-hidden px-8 py-4 rounded-2xl font-black text-slate-950 transition-all duration-300 hover:scale-105"
              style={{
                background:
                  "linear-gradient(135deg, #FACC15 0%, #38BDF8 100%)",
                boxShadow:
                  "0 20px 48px rgba(56,189,248,0.28), inset 0 1px 0 rgba(255,255,255,0.55)",
              }}
            >
              <span className="relative z-10 flex items-center gap-2">
                {heroData.primaryButtonText} <ArrowRight className="w-4 h-4" />
              </span>

              <span
                className="absolute top-0 bottom-0 w-24 opacity-50"
                style={{
                  left: 0,
                  background:
                    "linear-gradient(90deg, transparent, rgba(255,255,255,0.85), transparent)",
                  animation: "beamMove 2.8s ease-in-out infinite",
                }}
              />
            </Link>

            <Link
              to={safeLink(heroData.secondaryButtonLink, "/facilities")}
              className="px-8 py-4 rounded-2xl font-black flex items-center gap-2 transition-all duration-300 hover:scale-105"
              style={{
                color: palette.navy,
                background:
                  "linear-gradient(145deg, rgba(255,255,255,0.86), rgba(255,255,255,0.55))",
                border: "1px solid rgba(15,23,42,0.10)",
                boxShadow: "0 18px 42px rgba(15,23,42,0.08)",
                backdropFilter: "blur(18px)",
              }}
            >
              {heroData.secondaryButtonText} <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          <div className="grid grid-cols-3 gap-3 max-w-xl">
            <GlassStat
              value={heroData.stat1Value}
              label={heroData.stat1Label}
              color={palette.gold}
              delay={0.3}
            />

            <GlassStat
              value={heroData.stat2Value}
              label={heroData.stat2Label}
              color={palette.cyan}
              delay={0.38}
            />

            <GlassStat
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