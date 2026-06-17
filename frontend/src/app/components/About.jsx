import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "motion/react";
import {
  CheckCircle2,
  Award,
  Heart,
  Lightbulb,
  Target,
  Eye,
  CalendarDays,
  BookOpen,
  Image as ImageIcon,
} from "lucide-react";

const colors = {
  red: "#D71920",
  green: "#168A3A",
  purple: "#4B2E83",
  softPurple: "#7C5CC4",
  dark: "#0B1020",
  cream: "#FFF8EE",
  lightGreen: "#EAF7EF",
  lightPurple: "#F1ECFF",
};

const defaultAboutContent = {
  pageTitle: "About Us",
  pageSubtitle:
    "Learn about Baljagriti Secondary English School, our values, and our commitment to quality education.",
  heroImageUrl:
    "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=700&h=500&fit=crop&auto=format",
  heroImageAlt: "Students in classroom with teacher",
  floatingCardEmoji: "🏫",
  floatingCardTitle: "Baljagriti Secondary English School",
  floatingCardSubtitle: "Hetauda, Makwanpur",
  topCardTitle: "PG to Grade 10",
  topCardSubtitle: "Co-educational day school",
  pillars: [
    {
      id: 1,
      icon: "award",
      label: "Academic Excellence",
      desc: "Focused classroom learning that helps students build a strong academic foundation from early years to Grade 10.",
      color: "#D71920",
      visible: true,
    },
    {
      id: 2,
      icon: "heart",
      label: "Holistic Development",
      desc: "A nurturing and child-friendly environment where students grow academically, personally, socially, and morally.",
      color: "#168A3A",
      visible: true,
    },
    {
      id: 3,
      icon: "lightbulb",
      label: "Creative & Practical Learning",
      desc: "Extra-curricular activities, competitions, sports, arts, and school programs help students explore their talents.",
      color: "#4B2E83",
      visible: true,
    },
  ],
  highlights: [
    "Play Group to Grade 10",
    "Co-educational day school",
    "Located in Hetauda-2, Makwanpur",
    "Child-friendly learning environment",
    "Focus on academic and moral foundation",
    "ECA, sports, arts, and competitions",
  ],
  storyBadge: "Our Story",
  storyTitle: "Building Tomorrow's Leaders Today",
  storyParagraphs: [
    "Baljagriti Secondary English School, located in the heart of Makwanpur, Nepal, has been a beacon of quality education for many years. What began as a small school with a strong vision has grown into a thriving institution serving students from Play Group to Grade 10.",
    "We take pride in our dedicated team of experienced educators who work tirelessly to ensure every child receives the attention, guidance, and learning environment they need to grow academically and personally.",
  ],
  storyImageUrl:
    "https://images.unsplash.com/photo-1588072432836-e10032774350?w=900&h=700&fit=crop&auto=format",
  storyImageAlt: "School campus",
  storyImageTitle: "School Campus",
  storyImageSubtitle: "Image can later be managed from admin dashboard",
  missionVision: [
    {
      id: 1,
      icon: "target",
      title: "Our Mission",
      desc: "To provide a safe, nurturing, and academically rigorous learning environment that empowers students to become confident, creative, and responsible citizens equipped for the challenges of the modern world.",
      color: "#4B2E83",
      visible: true,
    },
    {
      id: 2,
      icon: "eye",
      title: "Our Vision",
      desc: "To be a leading educational institution in Makwanpur, recognized for academic excellence, holistic development, and producing leaders who contribute positively to society and the nation.",
      color: "#168A3A",
      visible: true,
    },
  ],
  journeyTitle: "Our Journey",
  journey: [
    {
      id: 1,
      year: "2046 BS",
      title: "School Founded",
      desc: "Baljagriti Secondary English School was established in Makwanpur with a vision to provide quality English-medium education.",
      visible: true,
    },
    {
      id: 2,
      year: "Secondary Level",
      title: "Expanded to Grade 10",
      desc: "The school expanded its academic structure to support students from early learning levels up to Grade 10.",
      visible: true,
    },
    {
      id: 3,
      year: "Academic Growth",
      title: "Strong SEE Foundation",
      desc: "Students continued building strong academic results through focused classroom teaching, discipline, and guided learning.",
      visible: true,
    },
    {
      id: 4,
      year: "Today",
      title: "Growing Learning Community",
      desc: "The school community continues to grow with dedicated educators, modern facilities, and a focus on holistic student development.",
      visible: true,
    },
  ],
};

function mergeAboutContent(saved = {}) {
  return {
    ...defaultAboutContent,
    ...saved,
    pillars: Array.isArray(saved.pillars)
      ? saved.pillars
      : defaultAboutContent.pillars,
    highlights: Array.isArray(saved.highlights)
      ? saved.highlights
      : defaultAboutContent.highlights,
    storyParagraphs: Array.isArray(saved.storyParagraphs)
      ? saved.storyParagraphs
      : defaultAboutContent.storyParagraphs,
    missionVision: Array.isArray(saved.missionVision)
      ? saved.missionVision
      : defaultAboutContent.missionVision,
    journey: Array.isArray(saved.journey)
      ? saved.journey
      : defaultAboutContent.journey,
  };
}

function getIcon(icon) {
  if (icon === "heart") return Heart;
  if (icon === "lightbulb") return Lightbulb;
  if (icon === "target") return Target;
  if (icon === "eye") return Eye;
  return Award;
}

function AboutImage({ src, alt }) {
  if (src) {
    return <img src={src} alt={alt} className="w-full h-full object-cover" />;
  }

  return (
    <div className="w-full h-full bg-slate-100 flex items-center justify-center">
      <ImageIcon className="w-20 h-20 text-slate-300" />
    </div>
  );
}

export function About() {
  const [content, setContent] = useState(defaultAboutContent);

  useEffect(() => {
    const loadAboutContent = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/site-content/about");
        const savedContent = res.data?.data?.content || {};
        setContent(mergeAboutContent(savedContent));
      } catch (error) {
        console.error("About content load error:", error);
        setContent(defaultAboutContent);
      }
    };

    loadAboutContent();
  }, []);

  const visiblePillars = content.pillars.filter((item) => item.visible !== false);
  const visibleMissionVision = content.missionVision.filter(
    (item) => item.visible !== false
  );
  const visibleJourney = content.journey.filter((item) => item.visible !== false);

  return (
    <section
      id="about"
      className="pt-28 pb-28 relative overflow-hidden min-h-screen"
      style={{
        background: `
          radial-gradient(circle at top right, rgba(124,92,196,0.18), transparent 34%),
          radial-gradient(circle at bottom left, rgba(22,138,58,0.14), transparent 32%),
          linear-gradient(180deg, #FFF8EE 0%, #F1ECFF 100%)
        `,
      }}
    >
      <div
        className="absolute top-0 right-0 w-[520px] h-[520px] rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(circle, rgba(75,46,131,0.12), transparent 70%)`,
          filter: "blur(8px)",
        }}
      />

      <div
        className="absolute bottom-0 left-0 w-[420px] h-[420px] rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(circle, rgba(22,138,58,0.11), transparent 70%)`,
          filter: "blur(8px)",
        }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65 }}
          className="text-center mb-10"
        >
          <h1
            className="text-4xl md:text-5xl mb-3"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              color: colors.dark,
              letterSpacing: "-0.04em",
            }}
          >
            {content.pageTitle}
          </h1>

          <p
            className="max-w-2xl mx-auto text-base md:text-lg"
            style={{ color: "#64748b" }}
          >
            {content.pageSubtitle}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-14 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div
              className="relative rounded-3xl overflow-hidden h-[390px]"
              style={{
                boxShadow:
                  "0 30px 80px rgba(11,16,32,0.26), 0 0 0 1px rgba(255,255,255,0.55)",
                transform: "perspective(1000px) rotateY(3deg) rotateX(2deg)",
                border: "1px solid rgba(255,255,255,0.5)",
              }}
            >
              <AboutImage src={content.heroImageUrl} alt={content.heroImageAlt} />

              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to top, rgba(11,16,32,0.62) 0%, transparent 56%)",
                }}
              />
            </div>

            <div
              className="absolute -bottom-7 -right-7 p-6 rounded-2xl"
              style={{
                background: `linear-gradient(135deg, ${colors.dark}, ${colors.purple})`,
                boxShadow:
                  "0 22px 58px rgba(11,16,32,0.42), 0 0 38px rgba(75,46,131,0.22)",
                border: "1px solid rgba(255,255,255,0.14)",
                width: "200px",
              }}
            >
              <div className="text-4xl mb-2">{content.floatingCardEmoji}</div>
              <div className="text-white font-semibold text-sm">
                {content.floatingCardTitle}
              </div>
              <div className="text-xs mt-1" style={{ color: colors.green }}>
                {content.floatingCardSubtitle}
              </div>
            </div>

            <div
              className="absolute -top-6 -left-6 px-5 py-4 rounded-2xl"
              style={{
                background:
                  "linear-gradient(145deg, rgba(255,255,255,0.96), rgba(241,236,255,0.86))",
                boxShadow:
                  "0 18px 48px rgba(11,16,32,0.16), 0 0 0 1px rgba(255,255,255,0.6)",
                border: "1px solid rgba(75,46,131,0.16)",
                backdropFilter: "blur(18px)",
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{
                    background: "rgba(22,138,58,0.12)",
                    border: "1px solid rgba(22,138,58,0.22)",
                  }}
                >
                  <Award className="w-5 h-5" style={{ color: colors.green }} />
                </div>
                <div>
                  <div
                    className="text-sm font-semibold"
                    style={{ color: colors.dark }}
                  >
                    {content.topCardTitle}
                  </div>
                  <div className="text-xs" style={{ color: "#64748b" }}>
                    {content.topCardSubtitle}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            <div className="space-y-4 mb-8">
              {visiblePillars.map((p) => {
                const Icon = getIcon(p.icon);
                const cardColor = p.color || colors.green;

                return (
                  <div
                    key={p.id}
                    className="flex gap-4 p-5 rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg group"
                    style={{
                      background:
                        "linear-gradient(145deg, rgba(255,255,255,0.95), rgba(255,255,255,0.72))",
                      border: `1px solid ${cardColor}22`,
                      boxShadow: "0 16px 42px rgba(11,16,32,0.08)",
                      backdropFilter: "blur(14px)",
                    }}
                  >
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{
                        background: `${cardColor}14`,
                        border: `1px solid ${cardColor}24`,
                        boxShadow: `0 10px 24px ${cardColor}18`,
                      }}
                    >
                      <Icon className="w-6 h-6" style={{ color: cardColor }} />
                    </div>

                    <div>
                      <div
                        className="font-semibold mb-1"
                        style={{ color: colors.dark }}
                      >
                        {p.label}
                      </div>
                      <div className="text-sm" style={{ color: "#64748b" }}>
                        {p.desc}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="grid grid-cols-2 gap-3">
              {content.highlights.map((h) => (
                <div key={h} className="flex items-start gap-2">
                  <CheckCircle2
                    className="w-4 h-4 mt-0.5 flex-shrink-0"
                    style={{ color: colors.green }}
                  />
                  <span className="text-sm" style={{ color: "#475569" }}>
                    {h}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center mt-32">
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <span
              className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold mb-5"
              style={{
                background: "rgba(75,46,131,0.09)",
                color: colors.purple,
                border: "1px solid rgba(75,46,131,0.18)",
              }}
            >
              {content.storyBadge}
            </span>

            <h2
              className="text-4xl md:text-5xl mb-6"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 800,
                color: colors.dark,
                lineHeight: 1.1,
                letterSpacing: "-0.04em",
              }}
            >
              {content.storyTitle}
            </h2>

            <div className="space-y-5">
              {content.storyParagraphs.map((text) => (
                <p key={text} className="text-lg leading-relaxed text-slate-500">
                  {text}
                </p>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 35, scale: 0.96 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.12 }}
            className="relative rounded-3xl overflow-hidden h-[460px]"
            style={{
              background:
                "linear-gradient(145deg, rgba(255,255,255,0.92), rgba(241,236,255,0.76))",
              border: "1px solid rgba(75,46,131,0.12)",
              boxShadow:
                "0 28px 80px rgba(11,16,32,0.14), inset 0 1px 0 rgba(255,255,255,0.8)",
              transform: "perspective(1000px) rotateY(-3deg) rotateX(2deg)",
            }}
          >
            <AboutImage src={content.storyImageUrl} alt={content.storyImageAlt} />

            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to top, rgba(11,16,32,0.66), transparent 58%)",
              }}
            />

            <div
              className="absolute bottom-6 left-6 right-6 rounded-2xl p-5"
              style={{
                background: "rgba(255,255,255,0.16)",
                border: "1px solid rgba(255,255,255,0.22)",
                backdropFilter: "blur(18px)",
                boxShadow: "0 18px 46px rgba(11,16,32,0.28)",
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{
                    background: "rgba(255,255,255,0.18)",
                    border: "1px solid rgba(255,255,255,0.24)",
                  }}
                >
                  <BookOpen className="w-6 h-6 text-white" />
                </div>

                <div>
                  <div className="text-white font-semibold">
                    {content.storyImageTitle}
                  </div>
                  <div
                    className="text-sm"
                    style={{ color: "rgba(255,255,255,0.72)" }}
                  >
                    {content.storyImageSubtitle}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mt-28">
          {visibleMissionVision.map((item, index) => {
            const Icon = getIcon(item.icon);

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.65, delay: index * 0.1 }}
                className="rounded-3xl p-8 transition-all duration-300 hover:-translate-y-1"
                style={{
                  background:
                    "linear-gradient(145deg, rgba(255,255,255,0.96), rgba(255,255,255,0.76))",
                  border: `1px solid ${(item.color || colors.green)}22`,
                  boxShadow: "0 18px 48px rgba(11,16,32,0.08)",
                  backdropFilter: "blur(14px)",
                }}
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-7"
                  style={{
                    background: `${item.color || colors.green}12`,
                    border: `1px solid ${item.color || colors.green}22`,
                  }}
                >
                  <Icon
                    className="w-6 h-6"
                    style={{ color: item.color || colors.green }}
                  />
                </div>

                <h3
                  className="text-3xl mb-4"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 800,
                    color: colors.dark,
                    letterSpacing: "-0.03em",
                  }}
                >
                  {item.title}
                </h3>

                <p className="text-lg leading-relaxed text-slate-500">
                  {item.desc}
                </p>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-32">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65 }}
            className="text-center mb-16"
          >
            <h2
              className="text-4xl md:text-5xl"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 800,
                color: colors.dark,
                letterSpacing: "-0.04em",
              }}
            >
              {content.journeyTitle}
            </h2>
          </motion.div>

          <div className="relative max-w-4xl mx-auto">
            <div
              className="hidden md:block absolute left-6 top-4 bottom-4 w-px"
              style={{ background: "rgba(11,16,32,0.14)" }}
            />

            <div className="space-y-8">
              {visibleJourney.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -35 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.08 }}
                  className="relative md:pl-20"
                >
                  <div
                    className="hidden md:flex absolute left-0 top-1 w-12 h-12 rounded-full items-center justify-center"
                    style={{
                      background: colors.dark,
                      boxShadow: "0 14px 34px rgba(11,16,32,0.24)",
                    }}
                  >
                    <CalendarDays className="w-5 h-5 text-white" />
                  </div>

                  <div
                    className="rounded-3xl p-6"
                    style={{
                      background:
                        "linear-gradient(145deg, rgba(255,255,255,0.96), rgba(255,255,255,0.78))",
                      border: "1px solid rgba(11,16,32,0.08)",
                      boxShadow: "0 16px 42px rgba(11,16,32,0.07)",
                    }}
                  >
                    <div
                      className="text-lg font-semibold mb-1"
                      style={{ color: colors.green }}
                    >
                      {item.year}
                    </div>

                    <h3
                      className="text-2xl mb-2"
                      style={{
                        fontFamily: "var(--font-display)",
                        fontWeight: 800,
                        color: colors.dark,
                        letterSpacing: "-0.025em",
                      }}
                    >
                      {item.title}
                    </h3>

                    <p className="text-base leading-relaxed text-slate-500">
                      {item.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;