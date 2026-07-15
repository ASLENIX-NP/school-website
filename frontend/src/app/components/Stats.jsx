import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowRight, Camera, Pencil, X } from "lucide-react";
import PdfNoticePreview from "./PdfNoticePreview";
import HomeAnnouncementPopup from "./HomeAnnouncementPopup";
import { formatBsNoticeDate } from "./BsNoticeDatePicker";

const palette = {
  cyan: "#38BDF8",
  gold: "#FACC15",
  green: "#22C55E",
  violet: "#8B5CF6",
};

const API_URL = "https://school-website-backend-ixx2.onrender.com";

export const defaultStatsSectionData = {
  eyebrow: "School Highlights",
  title: "Numbers that reflect our journey.",
  description:
    "These highlights can later be updated directly from the admin dashboard without changing frontend code.",

  stats: [
    {
      value: "3800",
      suffix: "+",
      label: "Students Enrolled",
      note: "Across school programs",
      color: palette.cyan,
    },
    {
      value: "240",
      suffix: "+",
      label: "Expert Teachers",
      note: "Academic and support team",
      color: palette.gold,
    },
    {
      value: "35",
      suffix: " yrs",
      label: "Years of Excellence",
      note: "Serving Makwanpur",
      color: palette.green,
    },
    {
      value: "98",
      suffix: "%",
      label: "Success Rate",
      note: "Academic performance",
      color: palette.violet,
    },
  ],

  story: {
    badge: "About Baljagriti",
    title: "Building Tomorrow's Leaders Today",
    paragraphs: [
      "Established with a vision to provide quality education in Makawanpur, Baljagriti Secondary English Boarding School has grown as one of Hetauda's respected academic institutions.",
      "With students from Play Group to Grade 10, the school focuses on academic discipline, values, creativity, digital learning, and holistic student development.",
    ],
    buttonText: "Read Our Story",
    buttonLink: "/about",
    image:
      "https://images.unsplash.com/photo-1588072432836-e10032774350?w=1000&h=800&fit=crop&auto=format",
    imageZoom: 1,
    imageOffsetX: 0,
    imageOffsetY: 0,
    imageTopTitle: "Baljagriti School",
    imageTopSubtitle: "Hetauda-2, Makwanpur",
    imageBottomTitle: "Quality Education Since 2046 BS",
    imageBottomDescription:
      "This image and text can later come from the admin dashboard.",
  },

  excellence: {
    title: "Academic Excellence",
    description:
      "Our students consistently achieve outstanding results in the SEE examinations under NEB.",
    cards: [
      {
        title: "Best SEE Results",
        description:
          "Consistently achieving top results in the Secondary Education Examination under the National Examination Board.",
      },
      {
        title: "GPA 4.00 Achievers",
        description:
          "Our brightest students attain a perfect GPA of 4.00, a testament to our teaching quality and student dedication.",
      },
      {
        title: "Holistic Development",
        description:
          "Beyond academics, we foster creativity, leadership, and sportsmanship through diverse extracurricular programs.",
      },
    ],
  },

  notices: {
    title: "Latest Notices",
    description: "Stay informed with the latest announcements.",
  },
};

export function mergeStatsSectionData(saved = {}) {
  const savedStats = saved || {};

  return {
    ...defaultStatsSectionData,
    ...savedStats,
    stats:
      Array.isArray(savedStats.stats) && savedStats.stats.length > 0
        ? defaultStatsSectionData.stats.map((item, index) => ({
            ...item,
            ...(savedStats.stats[index] || {}),
            color: item.color,
          }))
        : defaultStatsSectionData.stats,
    story: {
      ...defaultStatsSectionData.story,
      ...(savedStats.story || {}),
      paragraphs:
        Array.isArray(savedStats.story?.paragraphs) &&
        savedStats.story.paragraphs.length > 0
          ? [
              savedStats.story.paragraphs[0] || "",
              savedStats.story.paragraphs[1] || "",
            ]
          : defaultStatsSectionData.story.paragraphs,
      imageZoom: clampStoryImageZoom(savedStats.story?.imageZoom),
      imageOffsetX: clampStoryImageOffset(savedStats.story?.imageOffsetX),
      imageOffsetY: clampStoryImageOffset(savedStats.story?.imageOffsetY),
    },
    excellence: {
      ...defaultStatsSectionData.excellence,
      ...(savedStats.excellence || {}),
      cards:
        Array.isArray(savedStats.excellence?.cards) &&
        savedStats.excellence.cards.length > 0
          ? defaultStatsSectionData.excellence.cards.map((item, index) => ({
              ...item,
              ...(savedStats.excellence.cards[index] || {}),
            }))
          : defaultStatsSectionData.excellence.cards,
    },
    notices: {
      ...defaultStatsSectionData.notices,
      ...(savedStats.notices || {}),
    },
  };
}

function clampStoryImageOffset(value) {
  const numberValue = Number(value);

  if (!Number.isFinite(numberValue)) return 0;

  return Math.min(60, Math.max(-60, numberValue));
}

function clampStoryImageZoom(value) {
  const numberValue = Number(value);

  if (!Number.isFinite(numberValue)) return 1;

  return Math.min(3, Math.max(1, numberValue));
}

function getStoryImageCropStyle(story = {}) {
  const zoom = clampStoryImageZoom(story.imageZoom);
  const x = clampStoryImageOffset(story.imageOffsetX);
  const y = clampStoryImageOffset(story.imageOffsetY);

  return {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    objectPosition: "center",
    transform: `translate(${x}%, ${y}%) scale(${zoom})`,
    transformOrigin: "center center",
    opacity: 0.78,
  };
}

function EditIconButton({
  editMode,
  target,
  onEditTarget,
  icon: Icon = Pencil,
  label = "Edit",
}) {
  if (!editMode) return null;

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onEditTarget(target);
      }}
      className="absolute -top-3 -right-3 z-[90] opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 rounded-full w-9 h-9 flex items-center justify-center shadow-xl"
      style={{
        background: "linear-gradient(135deg, #FACC15, #38BDF8)",
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

function Counter({ target, suffix, editMode = false }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);

  const numericTarget = Number.parseInt(String(target || "0"), 10) || 0;

  useEffect(() => {
    if (editMode) {
      setCount(numericTarget);
      return;
    }

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setCount(0);

          const duration = 1500;
          const start = performance.now();

          const animate = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);

            setCount(Math.floor(numericTarget * eased));

            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          };

          requestAnimationFrame(animate);
        }
      },
      {
        threshold: 0.4,
      }
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, [numericTarget, editMode]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

const formatNoticeDate = (dateValue) =>
  formatBsNoticeDate(dateValue);

function getNoticeTime(value) {
  const time = new Date(value || 0).getTime();
  return Number.isNaN(time) ? 0 : time;
}

function sortHomeNoticesNewestFirst(noticeList = []) {
  return [...noticeList].sort((a, b) => {
    const pinnedA = a?.pinned ? 1 : 0;
    const pinnedB = b?.pinned ? 1 : 0;

    if (pinnedA !== pinnedB) return pinnedB - pinnedA;

    const createdA = getNoticeTime(a?.created_at || a?.createdAt);
    const createdB = getNoticeTime(b?.created_at || b?.createdAt);

    if (createdA !== createdB) return createdB - createdA;

    return (
      getNoticeTime(b?.notice_date || b?.date) -
      getNoticeTime(a?.notice_date || a?.date)
    );
  });
}

const getNoticeExcerpt = (notice) => {
  const text =
    notice?.description ||
    notice?.content ||
    "Click to read the full school notice and important update.";

  return text.length > 110 ? `${text.slice(0, 110)}...` : text;
};

function Stats({
  editMode = false,
  contentOverride = null,
  onEditTarget = () => {},
}) {
  const [statsData, setStatsData] = useState(() =>
    mergeStatsSectionData(contentOverride || defaultStatsSectionData)
  );
  const [notices, setNotices] = useState([]);
  const [selectedNotice, setSelectedNotice] = useState(null);
  const storyImageUrl = String(statsData.story?.image || "").trim();

  useEffect(() => {
    if (contentOverride) {
      setStatsData(mergeStatsSectionData(contentOverride));
      return;
    }

    let alive = true;

    const loadStatsContent = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/site-content/home`, {
          timeout: 10000,
        });

        if (!alive) return;

        const savedStats = res.data?.data?.content?.statsSection;
        setStatsData(mergeStatsSectionData(savedStats || defaultStatsSectionData));
      } catch (error) {
        console.error("Stats content load error:", error);

        if (alive) {
          setStatsData(mergeStatsSectionData(defaultStatsSectionData));
        }
      }
    };

    loadStatsContent();

    return () => {
      alive = false;
    };
  }, [contentOverride]);

  useEffect(() => {
    if (editMode) return undefined;

    let alive = true;

    fetch(`${API_URL}/api/notices`, {
      cache: "no-store",
    })
      .then((res) => res.json())
      .then((data) => {
        if (!alive) return;

        const noticeList = Array.isArray(data)
          ? data
          : Array.isArray(data?.data)
          ? data.data
          : [];

        setNotices(sortHomeNoticesNewestFirst(noticeList).slice(0, 3));
      })
      .catch((err) => console.log(err));

    return () => {
      alive = false;
    };
  }, [editMode]);

  return (
    <>
      {!editMode && <HomeAnnouncementPopup />}

      <section
        className="relative overflow-hidden py-10 sm:py-16"
        style={{
          background:
            "linear-gradient(180deg, #FFF8EE 0%, #F8FAFC 45%, #F7F4EF 100%)",
        }}
      >
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute -top-28 left-10 w-80 h-80 rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(56,189,248,0.11), transparent 70%)",
            }}
          />

          <div
            className="absolute top-72 right-10 w-80 h-80 rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(250,204,21,0.1), transparent 70%)",
            }}
          />
        </div>

        <div className="relative z-10 max-w-[1450px] mx-auto px-5 sm:px-6">
          <EditableWrap
            editMode={editMode}
            target={{ type: "statsHeader" }}
            onEditTarget={onEditTarget}
            label="Edit highlight heading"
          >
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.55 }}
              className="mb-9 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 rounded-3xl"
              style={{
                outline: editMode ? "1px dashed rgba(56,189,248,0.45)" : "none",
                outlineOffset: editMode ? "8px" : "0",
              }}
            >
              <div>
                <div
                  className="inline-flex items-center rounded-full px-4 py-2 mb-3"
                  style={{
                    background: "rgba(2,6,23,0.04)",
                    border: "1px solid rgba(2,6,23,0.08)",
                    color: "#0F172A",
                  }}
                >
                  <span className="text-sm font-bold">
                    {statsData.eyebrow}
                  </span>
                </div>

                <h2
                  className="text-3xl md:text-4xl text-slate-950"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 850,
                    letterSpacing: "-0.04em",
                  }}
                >
                  {statsData.title}
                </h2>
              </div>

              <p className="home-long-text max-w-xl text-sm md:text-base leading-[1.8] text-slate-600 text-left md:text-justify">
                {statsData.description}
              </p>
            </motion.div>
          </EditableWrap>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-12 sm:mb-20">
            {statsData.stats.map((stat, i) => (
              <EditableWrap
                key={`${stat.label}-${i}`}
                editMode={editMode}
                target={{ type: "statsCard", index: i }}
                onEditTarget={onEditTarget}
                label="Edit number card"
              >
                <motion.div
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="group rounded-[1.6rem] p-6 transition-all duration-300 hover:-translate-y-2"
                  style={{
                    background:
                      "linear-gradient(145deg, rgba(255,255,255,0.94), rgba(255,255,255,0.74))",
                    border: editMode
                      ? "1px dashed rgba(56,189,248,0.55)"
                      : "1px solid rgba(15,23,42,0.08)",
                    boxShadow:
                      "0 20px 58px rgba(15,23,42,0.08), inset 0 1px 0 rgba(255,255,255,0.9)",
                    backdropFilter: "blur(18px)",
                  }}
                >
                  <div
                    className="w-14 h-1 rounded-full mb-7 transition-all duration-300 group-hover:w-20"
                    style={{ background: stat.color }}
                  />

                  <div
                    className="text-4xl md:text-5xl mb-2 text-slate-950"
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 850,
                      letterSpacing: "-0.055em",
                    }}
                  >
                    <Counter
                      target={stat.value}
                      suffix={stat.suffix}
                      editMode={editMode}
                    />
                  </div>

                  <div className="text-base font-bold text-slate-700">
                    {stat.label}
                  </div>

                  <div className="text-sm mt-1 text-slate-500">
                    {stat.note}
                  </div>
                </motion.div>
              </EditableWrap>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="grid lg:grid-cols-2 gap-7 sm:gap-10 items-center mb-16 sm:mb-24"
          >
            <EditableWrap
              editMode={editMode}
              target={{ type: "storyImage" }}
              onEditTarget={onEditTarget}
              icon={Camera}
              label="Change story image"
            >
              <div
                className="relative rounded-[2rem] overflow-hidden min-h-[260px] sm:min-h-[340px] lg:min-h-[430px] bg-slate-900"
                style={{
                  background:
                    "linear-gradient(145deg, rgba(15,23,42,0.96), rgba(2,6,23,0.92))",
                  border: editMode
                    ? "1px dashed rgba(56,189,248,0.65)"
                    : "1px solid rgba(255,255,255,0.12)",
                  boxShadow:
                    "0 28px 80px rgba(15,23,42,0.22), inset 0 1px 0 rgba(255,255,255,0.1)",
                }}
              >
                {storyImageUrl ? (
                  <img
                    key={storyImageUrl}
                    src={storyImageUrl}
                    alt="Baljagriti school"
                    draggable={false}
                    className="absolute inset-0"
                    style={getStoryImageCropStyle(statsData.story)}
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-100 text-slate-400">
                    <Camera className="w-14 h-14 mb-3" />
                    <div className="text-xs font-black uppercase tracking-[0.16em]">
                      Add Story Image
                    </div>
                  </div>
                )}

                <div
                  className="absolute inset-0"
                  style={{
                    background: storyImageUrl
                      ? "linear-gradient(135deg, rgba(2,6,23,0.72), rgba(2,6,23,0.16) 45%, rgba(15,23,42,0.86))"
                      : "linear-gradient(135deg, rgba(2,6,23,0.18), rgba(2,6,23,0.04) 45%, rgba(15,23,42,0.22))",
                  }}
                />

                <EditableWrap
                  editMode={editMode}
                  target={{ type: "storyImageText" }}
                  onEditTarget={onEditTarget}
                  label="Edit image text"
                  className="absolute inset-0"
                >
                  <div
                    className="absolute top-6 left-6 rounded-2xl px-4 py-3"
                    style={{
                      background: "rgba(255,255,255,0.14)",
                      border: "1px solid rgba(255,255,255,0.18)",
                      backdropFilter: "blur(18px)",
                    }}
                  >
                    <div className="text-white text-sm font-bold">
                      {statsData.story.imageTopTitle}
                    </div>

                    <div
                      className="text-xs"
                      style={{ color: "rgba(255,255,255,0.68)" }}
                    >
                      {statsData.story.imageTopSubtitle}
                    </div>
                  </div>

                  <div
                    className="absolute bottom-6 left-6 right-6 rounded-3xl p-5"
                    style={{
                      background:
                        "linear-gradient(145deg, rgba(255,255,255,0.18), rgba(255,255,255,0.07))",
                      border: "1px solid rgba(255,255,255,0.18)",
                      backdropFilter: "blur(20px)",
                      boxShadow: "0 22px 60px rgba(0,0,0,0.3)",
                    }}
                  >
                    <div className="text-white text-lg font-bold mb-1">
                      {statsData.story.imageBottomTitle}
                    </div>

                    <div
                      className="text-sm"
                      style={{ color: "rgba(255,255,255,0.68)" }}
                    >
                      {statsData.story.imageBottomDescription}
                    </div>
                  </div>
                </EditableWrap>
              </div>
            </EditableWrap>

            <div>
              <EditableWrap
                editMode={editMode}
                target={{ type: "storyText" }}
                onEditTarget={onEditTarget}
                label="Edit story text"
              >
                <div
                  className="rounded-3xl"
                  style={{
                    outline: editMode
                      ? "1px dashed rgba(56,189,248,0.45)"
                      : "none",
                    outlineOffset: editMode ? "8px" : "0",
                  }}
                >
                  <div
                    className="inline-flex items-center rounded-full px-4 py-2 mb-5"
                    style={{
                      background: "rgba(215,25,32,0.06)",
                      border: "1px solid rgba(215,25,32,0.16)",
                      color: "#D71920",
                    }}
                  >
                    <span className="text-sm font-bold">
                      {statsData.story.badge}
                    </span>
                  </div>

                  <h2
                    className="text-3xl md:text-5xl text-slate-950 mb-5"
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 850,
                      letterSpacing: "-0.045em",
                      lineHeight: 1.05,
                    }}
                  >
                    {statsData.story.title}
                  </h2>

                  <div className="space-y-4 mb-7">
                    {statsData.story.paragraphs.map((text, index) => (
                      <p
                        key={index}
                        className="home-long-text text-base md:text-lg leading-[1.85] text-slate-500 text-left md:text-justify"
                      >
                        {text}
                      </p>
                    ))}
                  </div>
                </div>
              </EditableWrap>

              <EditableWrap
                editMode={editMode}
                target={{ type: "storyButton" }}
                onEditTarget={onEditTarget}
                label="Edit story button"
                className="inline-block"
              >
                <Link
                  to={statsData.story.buttonLink || "/about"}
                  onClick={(e) => {
                    if (editMode) {
                      e.preventDefault();
                      return;
                    }

                    window.scrollTo({
                      top: 0,
                      behavior: "smooth",
                    });
                  }}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 hover:gap-3 hover:-translate-y-0.5"
                  style={{
                    color: "#0F172A",
                    background: "#FFFFFF",
                    border: editMode
                      ? "1px dashed rgba(56,189,248,0.65)"
                      : "1px solid rgba(15,23,42,0.12)",
                    boxShadow: "0 10px 28px rgba(15,23,42,0.08)",
                  }}
                >
                  {statsData.story.buttonText}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </EditableWrap>
            </div>
          </motion.div>

          <div className="relative mb-24">
            <EditableWrap
              editMode={editMode}
              target={{ type: "excellenceHeader" }}
              onEditTarget={onEditTarget}
              label="Edit excellence heading"
            >
              <motion.div
                initial={{ opacity: 0, y: 26 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.55 }}
                className="text-center mb-12 rounded-3xl"
                style={{
                  outline: editMode
                    ? "1px dashed rgba(56,189,248,0.45)"
                    : "none",
                  outlineOffset: editMode ? "8px" : "0",
                }}
              >
                <div
                  className="inline-flex items-center rounded-full px-4 py-2 mb-4"
                  style={{
                    background: "rgba(215,25,32,0.06)",
                    border: "1px solid rgba(215,25,32,0.16)",
                    color: "#D71920",
                  }}
                >
                  <span className="text-sm font-bold">Academic Focus</span>
                </div>

                <h2
                  className="text-4xl md:text-5xl text-slate-950 mb-4"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 850,
                    letterSpacing: "-0.045em",
                    lineHeight: 1.05,
                  }}
                >
                  {statsData.excellence.title}
                </h2>

                <div
                  className="w-20 h-1.5 rounded-full mx-auto mb-5"
                  style={{
                    background:
                      "linear-gradient(90deg, #D71920, #FACC15, #168A3A)",
                  }}
                />

                <p className="home-long-text max-w-2xl mx-auto text-base md:text-lg leading-[1.85] text-slate-500 text-left md:text-justify">
                  {statsData.excellence.description}
                </p>
              </motion.div>
            </EditableWrap>

            <div className="grid md:grid-cols-3 gap-7">
              {statsData.excellence.cards.map((card, i) => {
                const accents = [
                  {
                    color: "#4B2E83",
                    bg: "linear-gradient(145deg, rgba(75,46,131,0.075), rgba(255,255,255,0.88))",
                    border: "rgba(75,46,131,0.22)",
                  },
                  {
                    color: "#168A3A",
                    bg: "linear-gradient(145deg, rgba(22,138,58,0.075), rgba(255,255,255,0.88))",
                    border: "rgba(22,138,58,0.22)",
                  },
                  {
                    color: "#D71920",
                    bg: "linear-gradient(145deg, rgba(215,25,32,0.06), rgba(255,255,255,0.88))",
                    border: "rgba(215,25,32,0.20)",
                  },
                ];

                const accent = accents[i % accents.length];

                return (
                  <EditableWrap
                    key={`${card.title}-${i}`}
                    editMode={editMode}
                    target={{ type: "excellenceCard", index: i }}
                    onEditTarget={onEditTarget}
                    label="Edit excellence card"
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 32 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: false, amount: 0.25 }}
                      transition={{ duration: 0.55, delay: i * 0.1 }}
                      className="group relative overflow-hidden rounded-[2rem] p-7 md:p-8 min-h-[260px] transition-all duration-300 hover:-translate-y-2"
                      style={{
                        background: accent.bg,
                        border: editMode
                          ? "1px dashed rgba(56,189,248,0.55)"
                          : `1px solid ${accent.border}`,
                        boxShadow:
                          "0 22px 58px rgba(15,23,42,0.085), inset 0 1px 0 rgba(255,255,255,0.9)",
                        backdropFilter: "blur(16px)",
                      }}
                    >
                      <div
                        className="absolute -right-16 -top-16 w-44 h-44 rounded-full opacity-60 transition-all duration-500 group-hover:scale-125"
                        style={{
                          background: `radial-gradient(circle, ${accent.color}22, transparent 68%)`,
                        }}
                      />

                      <div className="relative z-10">
                        <div
                          className="text-lg font-black tracking-[0.16em] mb-4"
                          style={{ color: accent.color }}
                        >
                          {String(i + 1).padStart(2, "0")}
                        </div>

                        <div
                          className="w-16 h-1.5 rounded-full mb-8 transition-all duration-300 group-hover:w-28"
                          style={{ background: accent.color }}
                        />

                        <h3
                          className="text-2xl md:text-3xl text-slate-950 mb-4"
                          style={{
                            fontFamily: "var(--font-display)",
                            fontWeight: 850,
                            letterSpacing: "-0.035em",
                            lineHeight: 1.08,
                          }}
                        >
                          {card.title}
                        </h3>

                        <p className="home-long-text text-sm md:text-base leading-[1.8] text-slate-600 text-left md:text-justify">
                          {card.description}
                        </p>
                      </div>
                    </motion.div>
                  </EditableWrap>
                );
              })}
            </div>
          </div>

          {!editMode && (
            <div className="mt-24">
              <div className="flex items-end justify-between gap-6 mb-10">
                <div>
                  <div
                    className="inline-flex items-center rounded-full px-4 py-2 mb-4"
                    style={{
                      background: "rgba(22,138,58,0.08)",
                      border: "1px solid rgba(22,138,58,0.16)",
                      color: "#168A3A",
                    }}
                  >
                    <span className="text-sm font-black">
                      School Notice Board
                    </span>
                  </div>

                  <h2
                    className="text-4xl md:text-5xl text-slate-950 mb-3"
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 850,
                      letterSpacing: "-0.045em",
                      lineHeight: 1,
                    }}
                  >
                    {statsData.notices.title}
                  </h2>

                  <p className="home-long-text text-base md:text-lg leading-[1.8] text-slate-500 text-left md:text-justify">
                    {statsData.notices.description}
                  </p>
                </div>

                <Link
                  to="/notices"
                  className="hidden md:inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-black transition-all duration-300 hover:gap-3 hover:-translate-y-0.5"
                  style={{
                    color: "#0F172A",
                    background: "#FFFFFF",
                    border: "1px solid rgba(15,23,42,0.10)",
                    boxShadow: "0 10px 26px rgba(15,23,42,0.07)",
                  }}
                >
                  View All <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {notices.length === 0 ? (
                <div
                  className="rounded-[28px] p-10 text-center"
                  style={{
                    background:
                      "linear-gradient(145deg, rgba(255,255,255,0.96), rgba(248,250,252,0.9))",
                    border: "1px dashed rgba(15,23,42,0.16)",
                    boxShadow: "0 16px 42px rgba(15,23,42,0.06)",
                  }}
                >
                  <div
                    className="mx-auto mb-5 h-1.5 w-24 rounded-full"
                    style={{
                      background:
                        "linear-gradient(90deg, #D71920, #FACC15, #168A3A)",
                    }}
                  />

                  <h3 className="text-2xl font-black text-slate-950 mb-2">
                    No notices available right now
                  </h3>

                  <p className="text-slate-500">
                    New school notices will appear here once added from the
                    admin panel.
                  </p>
                </div>
              ) : (
                <div className="space-y-5">
                  {notices.map((notice, i) => {
                    const noticeId = notice.id || notice._id;
                    const noticeDate = notice.notice_date || notice.date;
                    const hasPdf = Boolean(notice.pdf_url || notice.pdfUrl);

                    const accents = [
                      {
                        color: "#D71920",
                        soft: "rgba(215,25,32,0.075)",
                        border: "rgba(215,25,32,0.18)",
                        glow: "rgba(215,25,32,0.12)",
                      },
                      {
                        color: "#168A3A",
                        soft: "rgba(22,138,58,0.075)",
                        border: "rgba(22,138,58,0.18)",
                        glow: "rgba(22,138,58,0.12)",
                      },
                      {
                        color: "#4B2E83",
                        soft: "rgba(75,46,131,0.075)",
                        border: "rgba(75,46,131,0.18)",
                        glow: "rgba(75,46,131,0.12)",
                      },
                    ];

                    const accent = accents[i % accents.length];

                    return (
                      <motion.div
                        key={noticeId || notice.title || i}
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: false, amount: 0.25 }}
                        transition={{ duration: 0.45, delay: i * 0.08 }}
                      >
                        <button
                          type="button"
                          onClick={() => setSelectedNotice(notice)}
                          className="group relative block w-full overflow-hidden rounded-[32px] text-left transition-all duration-300 hover:-translate-y-1"
                          style={{
                            background:
                              "linear-gradient(135deg, rgba(255,255,255,0.98), rgba(248,250,252,0.92))",
                            border: `1px solid ${accent.border}`,
                            boxShadow:
                              "0 18px 48px rgba(15,23,42,0.075), inset 0 1px 0 rgba(255,255,255,0.92)",
                          }}
                        >
                          <div
                            className="absolute left-0 top-0 h-full w-2 transition-all duration-300 group-hover:w-3"
                            style={{
                              background: `linear-gradient(180deg, ${accent.color}, #FACC15)`,
                            }}
                          />

                          <div className="relative z-10 grid gap-6 p-6 pl-9 md:grid-cols-[180px_1fr_180px] md:items-center md:p-7 md:pl-10">
                            <div
                              className="rounded-3xl p-5"
                              style={{
                                background:
                                  "linear-gradient(145deg, rgba(255,255,255,0.9), rgba(248,250,252,0.72))",
                                border: "1px solid rgba(15,23,42,0.08)",
                                boxShadow:
                                  "0 10px 26px rgba(15,23,42,0.045)",
                              }}
                            >
                              <div
                                className="h-1.5 w-16 rounded-full mb-5 transition-all duration-300 group-hover:w-24"
                                style={{
                                  background: accent.color,
                                }}
                              />

                              <div className="text-xs font-black uppercase tracking-[0.18em] text-slate-400 mb-1">
                                Notice Date
                              </div>

                              <div className="text-base font-black text-slate-950">
                                {formatNoticeDate(noticeDate)}
                              </div>
                            </div>

                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2 mb-3">
                                <span
                                  className="inline-flex items-center rounded-full px-3 py-1 text-xs font-black"
                                  style={{
                                    background: accent.soft,
                                    color: accent.color,
                                    border: `1px solid ${accent.border}`,
                                  }}
                                >
                                  {notice.category || "Notice"}
                                </span>

                                <span className="text-xs font-bold text-slate-400">
                                  School Announcement
                                </span>

                                {hasPdf && (
                                  <span
                                    className="inline-flex items-center rounded-full px-3 py-1 text-xs font-black"
                                    style={{
                                      background: "rgba(15,23,42,0.055)",
                                      color: "#0F172A",
                                      border: "1px solid rgba(15,23,42,0.10)",
                                    }}
                                  >
                                    PDF Attached
                                  </span>
                                )}
                              </div>

                              <h3
                                className="text-2xl md:text-3xl text-slate-950 leading-tight mb-3 transition-colors duration-300 group-hover:text-green-700"
                                style={{
                                  fontFamily: "var(--font-display)",
                                  fontWeight: 850,
                                  letterSpacing: "-0.035em",
                                }}
                              >
                                {notice.title || "School Notice"}
                              </h3>

                              <p className="home-long-text max-w-3xl text-sm md:text-base leading-[1.75] text-slate-500 line-clamp-2 text-left md:text-justify">
                                {getNoticeExcerpt(notice)}
                              </p>
                            </div>

                            <div className="hidden md:block" />
                          </div>
                        </button>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {selectedNotice &&
          (() => {
            const pdfUrl = selectedNotice.pdf_url || selectedNotice.pdfUrl;
            const hasPdf = Boolean(pdfUrl);
            const pdfViewerUrl = pdfUrl;

            return (
              <div
                className="fixed inset-0 z-[200] flex items-center justify-center px-4 py-5"
                style={{
                  background: "rgba(2,6,23,0.78)",
                  backdropFilter: "blur(14px)",
                }}
                onClick={() => setSelectedNotice(null)}
              >
                <motion.div
                  initial={{ opacity: 0, y: 18, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.22 }}
                  className={`relative w-full overflow-hidden rounded-[28px] ${
                    hasPdf ? "max-w-[1180px] h-[92vh]" : "max-w-3xl"
                  }`}
                  style={{
                    background: "#F8FAFC",
                    border: "1px solid rgba(255,255,255,0.24)",
                    boxShadow: "0 34px 90px rgba(0,0,0,0.38)",
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div
                    className="h-1.5 w-full"
                    style={{
                      background:
                        "linear-gradient(90deg, #D71920 0%, #FACC15 48%, #168A3A 100%)",
                    }}
                  />

                  {hasPdf ? (
                    <div className="flex h-[calc(92vh-6px)] flex-col">
                      <div
                        className="flex items-center justify-between gap-4 px-5 py-4"
                        style={{
                          background: "#FFFFFF",
                          borderBottom: "1px solid rgba(15,23,42,0.08)",
                        }}
                      >
                        <div className="min-w-0">
                          <h2 className="truncate text-xl md:text-2xl text-slate-950 font-black">
                            {selectedNotice.title || "School Notice"}
                          </h2>
                        </div>

                        <button
                          type="button"
                          onClick={() => setSelectedNotice(null)}
                          className="flex h-11 w-11 items-center justify-center rounded-2xl transition-all hover:scale-105"
                          style={{
                            background: "rgba(15,23,42,0.06)",
                            border: "1px solid rgba(15,23,42,0.10)",
                            color: "#0F172A",
                          }}
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>

                      <div className="min-h-0 flex-1 p-4">
                        <PdfNoticePreview
                          fileUrl={pdfViewerUrl}
                          title={selectedNotice.title || "Notice PDF"}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="p-7 md:p-9">
                      <button
                        type="button"
                        onClick={() => setSelectedNotice(null)}
                        className="absolute right-5 top-5 z-20 flex h-11 w-11 items-center justify-center rounded-2xl transition-all hover:scale-105"
                        style={{
                          background: "rgba(15,23,42,0.06)",
                          border: "1px solid rgba(15,23,42,0.08)",
                          color: "#0F172A",
                        }}
                      >
                        <X className="h-5 w-5" />
                      </button>

                      <h2 className="text-3xl md:text-5xl text-slate-950 leading-tight mb-5 font-black">
                        {selectedNotice.title || "School Notice"}
                      </h2>

                      <div
                        className="rounded-[24px] p-5 md:p-6"
                        style={{
                          background: "rgba(15,23,42,0.035)",
                          border: "1px solid rgba(15,23,42,0.08)",
                        }}
                      >
                        <p className="home-long-text text-base md:text-lg leading-[1.85] text-slate-600 whitespace-pre-line text-left md:text-justify">
                          {selectedNotice.description ||
                            selectedNotice.content ||
                            "No description added for this notice."}
                        </p>
                      </div>
                    </div>
                  )}
                </motion.div>
              </div>
            );
          })()}
      </section>
    </>
  );
}

export { Stats };
export default Stats;


