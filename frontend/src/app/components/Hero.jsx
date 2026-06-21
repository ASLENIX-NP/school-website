import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const palette = {
  cyan: "#38BDF8",
  gold: "#FACC15",
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

function GlassStat({ value, label, color, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.55 }}
      className="group rounded-3xl p-5 cursor-pointer transition-all duration-300 hover:-translate-y-2"
      style={{
        background:
          "linear-gradient(145deg, rgba(255,255,255,0.13), rgba(255,255,255,0.055))",
        border: "1px solid rgba(255,255,255,0.16)",
        boxShadow:
          "0 20px 46px rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.13)",
        backdropFilter: "blur(18px)",
      }}
    >
      <div
        className="w-11 h-1 rounded-full mb-4 transition-all duration-200 ease-out group-hover:w-20"
        style={{ background: color }}
      />

      <div
        className="text-2xl font-black"
        style={{
          color: "#FFFFFF",
          fontFamily: "var(--font-display)",
          letterSpacing: "-0.035em",
        }}
      >
        {value}
      </div>

      <div
        className="text-xs mt-1 font-medium"
        style={{ color: "rgba(255,255,255,0.62)" }}
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
          "linear-gradient(145deg, rgba(15,23,42,0.64), rgba(15,23,42,0.36))",
        border: `1px solid ${color}55`,
        boxShadow: "0 24px 60px rgba(0,0,0,0.28)",
        backdropFilter: "blur(20px)",
      }}
    >
      <div
        className="w-12 h-1 rounded-full mb-3 transition-all duration-150 ease-out group-hover:w-24"
        style={{ background: color }}
      />

      <div className="text-white text-sm font-bold whitespace-nowrap">
        {title}
      </div>

      <div
        className="text-xs mt-1 whitespace-nowrap"
        style={{ color: "rgba(255,255,255,0.66)" }}
      >
        {subtitle}
      </div>
    </motion.div>
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
            "linear-gradient(145deg, rgba(255,255,255,0.12), rgba(255,255,255,0.035))",
          border: "1px solid rgba(255,255,255,0.14)",
          boxShadow:
            "0 38px 100px rgba(0,0,0,0.42), inset 0 1px 0 rgba(255,255,255,0.1)",
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
            "0 42px 110px rgba(0,0,0,0.52), 0 0 70px rgba(56,189,248,0.1)",
          border: "1px solid rgba(255,255,255,0.16)",
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
              "linear-gradient(to top, rgba(2,6,23,0.68) 0%, rgba(2,6,23,0.18) 48%, transparent 100%)",
          }}
        />

        <div
          className="absolute bottom-5 left-5 right-5 px-5 py-4 rounded-2xl"
          style={{
            background: "rgba(2,6,23,0.42)",
            border: "1px solid rgba(255,255,255,0.14)",
            backdropFilter: "blur(14px)",
          }}
        >
          <div className="text-white font-bold text-base">
            {heroData.imageBottomTitle}
          </div>

          <div
            className="text-sm mt-1 leading-relaxed"
            style={{ color: "rgba(255,255,255,0.66)" }}
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
        color="#8B5CF6"
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
          "radial-gradient(circle at 10% 18%, rgba(56,189,248,0.24), transparent 32%), radial-gradient(circle at 85% 12%, rgba(250,204,21,0.18), transparent 30%), radial-gradient(circle at 60% 78%, rgba(139,92,246,0.2), transparent 38%), linear-gradient(135deg, #020617 0%, #07111F 45%, #111827 100%)",
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
          0%, 100% { opacity: 0.35; transform: scale(1); }
          50% { opacity: 0.65; transform: scale(1.05); }
        }
      `}</style>

      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.16) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.16) 1px, transparent 1px)",
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
              "radial-gradient(circle, rgba(56,189,248,0.35), transparent 68%)",
            filter: "blur(18px)",
            animation: "pulseGlow 7s ease-in-out infinite",
          }}
        />

        <div
          className="absolute -top-32 -right-32 w-[560px] h-[560px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(250,204,21,0.24), transparent 68%)",
            filter: "blur(18px)",
            animation: "pulseGlow 8s ease-in-out infinite",
          }}
        />
      </div>

      <div className="max-w-[1450px] mx-auto px-8 py-8 lg:py-6 grid lg:grid-cols-[0.95fr_1.05fr] gap-8 items-center relative z-10">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65 }}
            className="inline-flex items-center rounded-full px-5 py-2 mb-6"
            style={{
              background:
                "linear-gradient(145deg, rgba(255,255,255,0.13), rgba(255,255,255,0.055))",
              border: "1px solid rgba(255,255,255,0.16)",
              boxShadow:
                "0 25px 60px rgba(0,0,0,0.28), 0 0 30px rgba(56,189,248,0.08), inset 0 1px 0 rgba(255,255,255,0.13)",
              backdropFilter: "blur(18px)",
              color: "rgba(255,255,255,0.88)",
            }}
          >
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