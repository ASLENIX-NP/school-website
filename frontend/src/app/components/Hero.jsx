import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Camera,
  Image as ImageIcon,
  Pencil,
  Sparkles,
} from "lucide-react";

const palette = {
  cyan: "#38BDF8",
  gold: "#FACC15",
  green: "#22C55E",
  purple: "#8B5CF6",
  navy: "#0B1020",
  cream: "#FFF8EE",
};

const API_URL = "https://school-website-backend-ixx2.onrender.com";

const HARDCODED_HERO_IMAGE_URLS = [
  "https://images.unsplash.com/photo-1509062522246-3755977927d7",
];

function isHardcodedHeroImageUrl(value = "") {
  const clean = String(value || "").trim();

  return HARDCODED_HERO_IMAGE_URLS.some((url) => clean.startsWith(url));
}

export const defaultHeroData = {
  badge: "Admissions Open for New Academic Session",
  titleLine1: "Baljagriti Secondary",
  titleLine2: "English School",
  titleLine3: "Basudev Marga,Hetauda-2",
  description:
    "Baljagriti English Secondary School blends academic discipline, digital learning, creativity, sports, and values for students from Play Group to Grade 10.",
  image: "",
  images: [],
  imageAdjustments: {},

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

  motto: "Our motto is to provide quality education.",

  floating1Title: "Quality Education",
  floating1Subtitle: "Academics + Values",
  floating2Title: "Computer Lab",
  floating2Subtitle: "Digital Facility",
  floating3Title: "Science Lab",
  floating3Subtitle: "Practical Learning",
  floating4Title: "E-Library",
  floating4Subtitle: "Learning Resources",
};

export function mergeHeroData(saved = {}) {
  const merged = {
    ...defaultHeroData,
    ...(saved || {}),
  };

  const savedImages = Array.isArray(saved?.images)
    ? saved.images
    : Array.isArray(merged.images)
      ? merged.images
      : [];

  const cleanImages = Array.from(
    new Set(
      savedImages
        .map((item) => String(item || "").trim())
        .filter((item) => item && !isHardcodedHeroImageUrl(item))
    )
  );

  const fallbackImage = String(
    saved?.image || merged.image || defaultHeroData.image || ""
  ).trim();

  const cleanFallbackImage =
    fallbackImage && !isHardcodedHeroImageUrl(fallbackImage)
      ? fallbackImage
      : "";

  const images =
    cleanImages.length > 0
      ? cleanImages
      : cleanFallbackImage
        ? [cleanFallbackImage]
        : [];

  const rawAdjustments =
    saved?.imageAdjustments && typeof saved.imageAdjustments === "object"
      ? saved.imageAdjustments
      : {};

  const imageAdjustments = images.reduce((acc, imageUrl) => {
    const adjustment = rawAdjustments?.[imageUrl] || {};

    acc[imageUrl] = {
      imageZoom: clampHeroImageZoom(adjustment.imageZoom),
      imageOffsetX: clampHeroImageOffset(adjustment.imageOffsetX),
      imageOffsetY: clampHeroImageOffset(adjustment.imageOffsetY),
    };

    return acc;
  }, {});

  const requiredText = (value, fallback) =>
    String(value ?? "").trim() ? value : fallback;

  return {
    ...merged,
    badge: requiredText(merged.badge, defaultHeroData.badge),
    titleLine1: requiredText(merged.titleLine1, defaultHeroData.titleLine1),
    titleLine2: requiredText(merged.titleLine2, defaultHeroData.titleLine2),
    titleLine3: requiredText(merged.titleLine3, defaultHeroData.titleLine3),
    description: requiredText(
      merged.description,
      defaultHeroData.description
    ),
    primaryButtonText: requiredText(
      merged.primaryButtonText,
      defaultHeroData.primaryButtonText
    ),
    primaryButtonLink: requiredText(
      merged.primaryButtonLink,
      defaultHeroData.primaryButtonLink
    ),
    secondaryButtonText: requiredText(
      merged.secondaryButtonText,
      defaultHeroData.secondaryButtonText
    ),
    secondaryButtonLink: requiredText(
      merged.secondaryButtonLink,
      defaultHeroData.secondaryButtonLink
    ),
    stat1Value: requiredText(merged.stat1Value, defaultHeroData.stat1Value),
    stat1Label: requiredText(merged.stat1Label, defaultHeroData.stat1Label),
    stat2Value: requiredText(merged.stat2Value, defaultHeroData.stat2Value),
    stat2Label: requiredText(merged.stat2Label, defaultHeroData.stat2Label),
    stat3Value: requiredText(merged.stat3Value, defaultHeroData.stat3Value),
    stat3Label: requiredText(merged.stat3Label, defaultHeroData.stat3Label),
    imageBottomTitle: requiredText(
      merged.imageBottomTitle,
      defaultHeroData.imageBottomTitle
    ),
    imageBottomDescription: requiredText(
      merged.imageBottomDescription,
      defaultHeroData.imageBottomDescription
    ),
    motto: requiredText(merged.motto, defaultHeroData.motto),
    floating1Title: requiredText(
      merged.floating1Title,
      defaultHeroData.floating1Title
    ),
    floating1Subtitle: requiredText(
      merged.floating1Subtitle,
      defaultHeroData.floating1Subtitle
    ),
    floating2Title: requiredText(
      merged.floating2Title,
      defaultHeroData.floating2Title
    ),
    floating2Subtitle: requiredText(
      merged.floating2Subtitle,
      defaultHeroData.floating2Subtitle
    ),
    floating3Title: requiredText(
      merged.floating3Title,
      defaultHeroData.floating3Title
    ),
    floating3Subtitle: requiredText(
      merged.floating3Subtitle,
      defaultHeroData.floating3Subtitle
    ),
    floating4Title: requiredText(
      merged.floating4Title,
      defaultHeroData.floating4Title
    ),
    floating4Subtitle: requiredText(
      merged.floating4Subtitle,
      defaultHeroData.floating4Subtitle
    ),
    image: images[0] || "",
    images,
    imageAdjustments,
  };
}

function clampHeroImageOffset(value) {
  const numberValue = Number(value);

  if (!Number.isFinite(numberValue)) return 0;

  return Math.min(60, Math.max(-60, numberValue));
}

function clampHeroImageZoom(value) {
  const numberValue = Number(value);

  if (!Number.isFinite(numberValue)) return 1;

  return Math.min(3, Math.max(1, numberValue));
}

function getHeroImageCropStyle(heroData = {}, imageUrl = "") {
  const adjustment = heroData.imageAdjustments?.[imageUrl] || {};
  const zoom = clampHeroImageZoom(adjustment.imageZoom);
  const x = clampHeroImageOffset(adjustment.imageOffsetX);
  const y = clampHeroImageOffset(adjustment.imageOffsetY);

  const objectX = Math.min(100, Math.max(0, 50 - x));
  const objectY = Math.min(100, Math.max(0, 50 - y));

  return {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    objectPosition: `${objectX}% ${objectY}%`,
    transform: `scale(${zoom})`,
    transformOrigin: "center center",
    transition:
      "transform 240ms ease-out, object-position 240ms ease-out, opacity 320ms ease-out",
  };
}

function safeLink(link, fallback) {
  const clean = String(link || "").trim();

  return clean.startsWith("/") ? clean : fallback;
}

function EditIconButton({
  editMode,
  target,
  onEditTarget,
  icon: Icon = Pencil,
  label = "Edit",
  className = "",
}) {
  if (!editMode) return null;

  return (
    <button
      type="button"
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        onEditTarget(target);
      }}
      className={`absolute -top-3 -right-3 z-[80] opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 rounded-full w-9 h-9 flex items-center justify-center shadow-xl ${className}`}
      style={{
        background: `linear-gradient(135deg, ${palette.gold}, ${palette.cyan})`,
        color: "#020617",
        border: "1px solid rgba(255,255,255,0.84)",
      }}
      title={label}
    >
      <Icon className="w-4 h-4" />
    </button>
  );
}

function EditableWrap({
  editMode,
  target,
  onEditTarget,
  icon = Pencil,
  label = "Edit",
  className = "",
  children,
}) {
  if (!editMode) return children;

  return (
    <div className={`relative group ${className}`}>
      {children}

      <EditIconButton
        editMode={editMode}
        target={target}
        onEditTarget={onEditTarget}
        icon={icon}
        label={label}
      />
    </div>
  );
}

function GlassStat({
  value,
  label,
  color,
  delay,
  editMode,
  onEditTarget,
  index,
}) {
  return (
    <EditableWrap
      editMode={editMode}
      target={{ type: "heroStat", index }}
      onEditTarget={onEditTarget}
      label="Edit stat"
    >
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.55 }}
        className="group min-w-0 overflow-hidden rounded-2xl sm:rounded-3xl px-4 py-4 sm:p-5 cursor-pointer transition-all duration-300 hover:-translate-y-2"
        style={{
          background:
            "linear-gradient(145deg, rgba(255,255,255,0.82), rgba(255,255,255,0.50))",
          border: editMode
            ? "1px dashed rgba(56,189,248,0.55)"
            : "1px solid rgba(15,23,42,0.10)",
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
    </EditableWrap>
  );
}

function FloatingTextTag({
  className,
  title,
  subtitle,
  color,
  delay,
  editMode,
  onEditTarget,
  index,
}) {
  const adminPositions = [
    "absolute left-[9%] top-20 z-20 hidden xl:block",
    "absolute right-[9%] top-24 z-20 hidden xl:block",
    "absolute left-[13%] bottom-28 z-20 hidden xl:block",
    "absolute right-[13%] bottom-24 z-20 hidden xl:block",
  ];

  const positionClass = editMode
    ? adminPositions[index] || className
    : className;

  return (
    <div className={`${positionClass} group`}>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{
          opacity: 1,
          y: editMode ? 0 : [0, 9, 0],
        }}
        whileHover={{
          y: -8,
          scale: 1.03,
        }}
        transition={{
          opacity: { duration: 0.55, delay },
          y: {
            duration: 7,
            repeat: editMode ? 0 : Infinity,
            ease: "easeInOut",
            delay,
          },
        }}
        className="rounded-3xl px-4 py-3 xl:px-5 xl:py-4 cursor-pointer transition-all duration-300"
        style={{
          background:
            "linear-gradient(145deg, rgba(255,255,255,0.92), rgba(255,255,255,0.62))",
          border: editMode
            ? "1px dashed rgba(56,189,248,0.75)"
            : `1px solid ${color}55`,
          boxShadow: "0 22px 52px rgba(15,23,42,0.12)",
          backdropFilter: "blur(20px)",
          maxWidth: editMode ? "190px" : "none",
        }}
      >
        <div
          className="w-12 h-1 rounded-full mb-3 transition-all duration-150 ease-out group-hover:w-20"
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

      <EditIconButton
        editMode={editMode}
        target={{ type: "heroFloating", index }}
        onEditTarget={onEditTarget}
        label="Edit floating label"
      />
    </div>
  );
}

function Premium3DBackground({ editMode = false }) {
  return (
    <div
      className={`${
        editMode ? "absolute" : "fixed"
      } inset-0 pointer-events-none z-[1] overflow-hidden`}
    >
      <motion.div
        animate={
          editMode
            ? false
            : {
                x: [0, 42, -16, 0],
                y: [0, -28, 22, 0],
                scale: [1, 1.08, 0.98, 1],
              }
        }
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
        animate={
          editMode
            ? false
            : {
                x: [0, -36, 24, 0],
                y: [0, 30, -20, 0],
                scale: [1, 1.05, 0.96, 1],
              }
        }
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute right-[-10%] top-[12%] hidden lg:block w-[520px] h-[520px] rounded-full"
        style={{
          opacity: 0.2,
          background:
            "radial-gradient(circle at 45% 35%, rgba(250,204,21,0.48), rgba(255,255,255,0.20) 40%, transparent 72%)",
          filter: "blur(8px)",
        }}
      />

      <div
        className="absolute inset-0 hidden lg:block"
        style={{
          opacity: 0.09,
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
    </div>
  );
}

function HeroImageStage({ heroData, editMode, onEditTarget }) {
  const heroImages =
    Array.isArray(heroData.images) &&
    heroData.images.filter(Boolean).length > 0
      ? heroData.images
          .filter(Boolean)
          .filter((image) => !isHardcodedHeroImageUrl(image))
      : heroData.image && !isHardcodedHeroImageUrl(heroData.image)
        ? [heroData.image]
        : [];

  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    setActiveImageIndex(0);
  }, [heroImages.join("|")]);

  useEffect(() => {
    if (editMode || heroImages.length <= 1) return undefined;

    const timer = window.setInterval(() => {
      setActiveImageIndex(
        (current) => (current + 1) % heroImages.length
      );
    }, 4500);

    return () => window.clearInterval(timer);
  }, [editMode, heroImages.length]);

  const activeImage =
    heroImages[activeImageIndex] || heroImages[0] || "";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: 24 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.85, delay: 0.18 }}
      className="relative mt-8 min-h-[350px] sm:min-h-[430px] lg:mt-0 lg:min-h-[535px] xl:min-h-[585px] flex flex-col items-center justify-center lg:translate-y-3 xl:translate-y-5"
    >
      <EditableWrap
        editMode={editMode}
        target={{ type: "heroImage" }}
        onEditTarget={onEditTarget}
        icon={Camera}
        label="Change hero images"
        className="relative z-10 w-full flex justify-center"
      >
        <motion.div
          animate={{
            y: editMode ? 0 : [0, -7, 0],
          }}
          transition={{
            duration: 7,
            repeat: editMode ? 0 : Infinity,
            ease: "easeInOut",
          }}
          className="relative w-full sm:w-[94%] h-[255px] sm:h-[330px] lg:h-[395px] rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden bg-slate-900"
          style={{
            boxShadow:
              "0 38px 92px rgba(15,23,42,0.20), 0 0 60px rgba(56,189,248,0.12)",
            border: editMode
              ? "1px dashed rgba(56,189,248,0.65)"
              : "1px solid rgba(255,255,255,0.76)",
          }}
        >
          {activeImage ? (
            <img
              key={activeImage}
              src={activeImage}
              alt="Baljagriti school students"
              draggable={false}
              className="absolute inset-0"
              style={getHeroImageCropStyle(heroData, activeImage)}
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-100 text-slate-400">
              <ImageIcon className="w-16 h-16 mb-3" />

              <div className="text-sm font-black uppercase tracking-[0.16em]">
                Add Hero Image
              </div>
            </div>
          )}

          <div
            className="absolute inset-0"
            style={{
              background: activeImage
                ? "linear-gradient(to top, rgba(15,23,42,0.58) 0%, rgba(15,23,42,0.10) 52%, transparent 100%)"
                : "linear-gradient(to top, rgba(15,23,42,0.18) 0%, rgba(15,23,42,0.04) 52%, transparent 100%)",
            }}
          />

          {heroImages.length > 1 && (
            <div className="absolute left-5 top-5 z-30 flex items-center gap-2 rounded-full bg-white/86 px-3 py-2 shadow-xl backdrop-blur-md">
              <span className="text-xs font-black text-slate-800">
                {activeImageIndex + 1}/{heroImages.length}
              </span>

              <div className="flex items-center gap-1.5">
                {heroImages.map((image, index) => (
                  <button
                    key={`${image}-${index}`}
                    type="button"
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      setActiveImageIndex(index);
                    }}
                    className="h-2.5 rounded-full transition-all"
                    style={{
                      width:
                        activeImageIndex === index ? "18px" : "10px",
                      background:
                        activeImageIndex === index
                          ? palette.cyan
                          : "rgba(15,23,42,0.28)",
                    }}
                    aria-label={`Show hero image ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </EditableWrap>

      <EditableWrap
        editMode={editMode}
        target={{ type: "heroMotto" }}
        onEditTarget={onEditTarget}
        label="Edit school motto"
        className="relative z-30 mt-5 w-full sm:w-[88%]"
      >
        <motion.div
          initial={{ opacity: 0, y: 56 }}
animate={{ opacity: 1, y: 56 }}
          transition={{ duration: 0.65, delay: 0.34 }}
          className="flex items-center justify-center gap-3 rounded-2xl px-5 py-4 text-center"
          style={{
            background:
              "linear-gradient(135deg, rgba(250,204,21,0.16), rgba(56,189,248,0.16), rgba(34,197,94,0.12))",
            border: editMode
              ? "1px dashed rgba(56,189,248,0.72)"
              : "1px solid rgba(15,23,42,0.09)",
            boxShadow:
              "0 18px 46px rgba(15,23,42,0.08), inset 0 1px 0 rgba(255,255,255,0.80)",
            backdropFilter: "blur(18px)",
          }}
        >
          <p
  className="text-sm sm:text-base font-black leading-relaxed"
  style={{
    color: palette.navy,
    fontFamily: "var(--font-display)",
    letterSpacing: "-0.015em",
  }}
>
  “{heroData.motto}”
</p>
        </motion.div>
      </EditableWrap>

      <FloatingTextTag
        className="absolute left-[7%] top-16 z-20 hidden xl:block"
        title={heroData.floating1Title}
        subtitle={heroData.floating1Subtitle}
        color={palette.gold}
        delay={0.3}
        editMode={editMode}
        onEditTarget={onEditTarget}
        index={0}
      />

      <FloatingTextTag
        className="absolute right-[6%] top-12 z-20 hidden xl:block"
        title={heroData.floating2Title}
        subtitle={heroData.floating2Subtitle}
        color={palette.cyan}
        delay={0.45}
        editMode={editMode}
        onEditTarget={onEditTarget}
        index={1}
      />

      <FloatingTextTag
        className="absolute left-[12%] bottom-28 z-20 hidden xl:block"
        title={heroData.floating3Title}
        subtitle={heroData.floating3Subtitle}
        color={palette.purple}
        delay={0.6}
        editMode={editMode}
        onEditTarget={onEditTarget}
        index={2}
      />

      <FloatingTextTag
        className="absolute right-[12%] bottom-24 z-20 hidden xl:block"
        title={heroData.floating4Title}
        subtitle={heroData.floating4Subtitle}
        color={palette.green}
        delay={0.75}
        editMode={editMode}
        onEditTarget={onEditTarget}
        index={3}
      />
    </motion.div>
  );
}

function Hero({
  editMode = false,
  contentOverride = null,
  onEditTarget = () => {},
}) {
  const [heroData, setHeroData] = useState(() =>
    mergeHeroData(contentOverride || defaultHeroData)
  );

  useEffect(() => {
    if (editMode) return;

    fetch(`${API_URL}/api/health`).catch(() => {});
  }, [editMode]);

  useEffect(() => {
    if (contentOverride) {
      setHeroData(mergeHeroData(contentOverride));
      return;
    }

    let alive = true;

    const loadHeroContent = async () => {
      try {
        const res = await axios.get(
          `${API_URL}/api/site-content/home`,
          {
            timeout: 10000,
          }
        );

        if (!alive) return;

        const savedHero = res.data?.data?.content?.hero;
        setHeroData(mergeHeroData(savedHero || defaultHeroData));
      } catch (error) {
        console.error("Hero content load error:", error);

        if (alive) {
          setHeroData(mergeHeroData(defaultHeroData));
        }
      }
    };

    loadHeroContent();

    return () => {
      alive = false;
    };
  }, [contentOverride]);

  return (
    <section
      id="home"
      className="relative overflow-hidden pt-20 pb-8 sm:pb-14 lg:pb-14"
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

        .home-long-text {
          text-align: justify;
          text-justify: inter-word;
          overflow-wrap: break-word;
          word-break: normal;
          hyphens: auto;
        }

        @media (max-width: 640px) {
          .home-long-text {
            text-align: left;
            hyphens: none;
          }
        }
      `}</style>

      <Premium3DBackground editMode={editMode} />

      <div className="absolute inset-0 pointer-events-none overflow-hidden z-[2]">
        <div
          className="absolute -top-40 -left-32 w-[620px] h-[620px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(56,189,248,0.28), transparent 68%)",
            filter: "blur(18px)",
          }}
        />

        <div
          className="absolute -top-32 -right-32 w-[560px] h-[560px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(250,204,21,0.30), transparent 68%)",
            filter: "blur(18px)",
          }}
        />
      </div>

      <div className="max-w-[1450px] mx-auto px-5 sm:px-8 py-6 sm:py-8 lg:py-6 grid lg:grid-cols-[0.95fr_1.05fr] gap-6 lg:gap-8 items-center relative z-10">
        <div>
          <EditableWrap
            editMode={editMode}
            target={{ type: "heroBadge" }}
            onEditTarget={onEditTarget}
            label="Edit badge"
            className="inline-block"
          >
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65 }}
              className="inline-flex items-center gap-2 rounded-full px-5 py-2 mb-6"
              style={{
                background:
                  "linear-gradient(145deg, rgba(255,255,255,0.86), rgba(255,255,255,0.55))",
                border: editMode
                  ? "1px dashed rgba(56,189,248,0.65)"
                  : "1px solid rgba(15,23,42,0.08)",
                boxShadow:
                  "0 18px 42px rgba(15,23,42,0.08), inset 0 1px 0 rgba(255,255,255,0.70)",
                backdropFilter: "blur(18px)",
                color: palette.navy,
              }}
            >
              <Sparkles className="w-4 h-4" color={palette.gold} />

              <span className="text-sm font-black">
                {heroData.badge}
              </span>
            </motion.div>
          </EditableWrap>

          <EditableWrap
            editMode={editMode}
            target={{ type: "heroTitle" }}
            onEditTarget={onEditTarget}
            label="Edit title"
          >
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
                outline: editMode
                  ? "1px dashed rgba(56,189,248,0.45)"
                  : "none",
                outlineOffset: editMode ? "8px" : "0",
                borderRadius: editMode ? "18px" : "0",
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

              <span
                style={{
                  display: "inline-block",
                  fontSize: "0.72em",
                  lineHeight: 1.04,
                  letterSpacing: "-0.055em",
                  marginTop: "0.08em",
                }}
              >
                {String(heroData.titleLine3 || "")
                  .split(",")
                  .map((part, index) => (
                    <span
                      key={`${part}-${index}`}
                      style={{ display: "block" }}
                    >
                      {part.trim()}
                    </span>
                  ))}
              </span>
            </motion.h1>
          </EditableWrap>

          <EditableWrap
            editMode={editMode}
            target={{ type: "heroDescription" }}
            onEditTarget={onEditTarget}
            label="Edit description"
          >
            <motion.p
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.16 }}
              className="home-long-text text-lg md:text-xl max-w-xl leading-[1.85] mb-7 rounded-2xl"
              style={{
                color: "rgba(15,23,42,0.68)",
                outline: editMode
                  ? "1px dashed rgba(56,189,248,0.45)"
                  : "none",
                outlineOffset: editMode ? "6px" : "0",
              }}
            >
              {heroData.description}
            </motion.p>
          </EditableWrap>

          <EditableWrap
            editMode={editMode}
            target={{ type: "heroButtons" }}
            onEditTarget={onEditTarget}
            label="Edit buttons"
          >
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.24 }}
              className="flex flex-wrap gap-4 mb-8 rounded-2xl"
              style={{
                outline: editMode
                  ? "1px dashed rgba(56,189,248,0.45)"
                  : "none",
                outlineOffset: editMode ? "8px" : "0",
              }}
            >
              <Link
                to={safeLink(
                  heroData.primaryButtonLink,
                  "/admissions"
                )}
                onClick={(event) => {
                  if (editMode) event.preventDefault();
                }}
                className="relative overflow-hidden px-8 py-4 rounded-2xl font-black text-slate-950 transition-all duration-300 hover:scale-105"
                style={{
                  background:
                    "linear-gradient(135deg, #FACC15 0%, #38BDF8 100%)",
                  boxShadow:
                    "0 20px 48px rgba(56,189,248,0.28), inset 0 1px 0 rgba(255,255,255,0.55)",
                }}
              >
                <span className="relative z-10 flex items-center gap-2">
                  {heroData.primaryButtonText}
                  <ArrowRight className="w-4 h-4" />
                </span>

                <span
                  className="absolute top-0 bottom-0 w-24 opacity-50"
                  style={{
                    left: 0,
                    background:
                      "linear-gradient(90deg, transparent, rgba(255,255,255,0.85), transparent)",
                    animation: editMode
                      ? "none"
                      : "beamMove 2.8s ease-in-out infinite",
                  }}
                />
              </Link>

              <Link
                to={safeLink(
                  heroData.secondaryButtonLink,
                  "/facilities"
                )}
                onClick={(event) => {
                  if (editMode) event.preventDefault();
                }}
                className="px-8 py-4 rounded-2xl font-black flex items-center gap-2 transition-all duration-300 hover:scale-105"
                style={{
                  color: palette.navy,
                  background:
                    "linear-gradient(145deg, rgba(255,255,255,0.86), rgba(255,255,255,0.55))",
                  border: "1px solid rgba(15,23,42,0.10)",
                  boxShadow:
                    "0 18px 42px rgba(15,23,42,0.08)",
                  backdropFilter: "blur(18px)",
                }}
              >
                {heroData.secondaryButtonText}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </EditableWrap>

          <div className="grid grid-cols-1 min-[360px]:grid-cols-3 gap-3 max-w-xl">
            <GlassStat
              value={heroData.stat1Value}
              label={heroData.stat1Label}
              color={palette.gold}
              delay={0.3}
              editMode={editMode}
              onEditTarget={onEditTarget}
              index={0}
            />

            <GlassStat
              value={heroData.stat2Value}
              label={heroData.stat2Label}
              color={palette.cyan}
              delay={0.38}
              editMode={editMode}
              onEditTarget={onEditTarget}
              index={1}
            />

            <GlassStat
              value={heroData.stat3Value}
              label={heroData.stat3Label}
              color={palette.green}
              delay={0.46}
              editMode={editMode}
              onEditTarget={onEditTarget}
              index={2}
            />
          </div>
        </div>

        <HeroImageStage
          heroData={heroData}
          editMode={editMode}
          onEditTarget={onEditTarget}
        />
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