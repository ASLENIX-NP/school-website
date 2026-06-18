import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "motion/react";
import { Link } from "react-router-dom";

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

const defaultAcademicsContent = {
  heroBadge: "Nurturing Excellence",
  heroTitle: "Academics at Baljagriti",
  heroHighlight: "Baljagriti",
  heroDescription:
    "Comprehensive education from Play Group to Grade 10 under the National NEB Curriculum. We combine academic excellence, practical learning, critical thinking, and character development to prepare students for lifelong success.",

  programs: [
    {
      id: 1,
      level: "Pre-Primary Level",
      span: "Nursery – KG",
      badgeColor: colors.red,
      border: "rgba(215,25,32,0.15)",
      classes: [
        "English Readiness",
        "Nepali Readiness",
        "Numbers & Counting",
        "Creative Activities",
        "Rhymes & Storytelling",
      ],
      highlight:
        "Early childhood development focused on social, emotional, and cognitive learning.",
      visible: true,
    },
    {
      id: 2,
      level: "Primary Level",
      span: "Grade 1 – 5",
      badgeColor: colors.green,
      border: "rgba(22,138,58,0.15)",
      classes: ["English", "Nepali", "Mathematics", "Science", "Social Studies"],
      highlight:
        "Building deep core foundational understanding with regular continuous assessment.",
      visible: true,
    },
    {
      id: 3,
      level: "Lower Secondary Level",
      span: "Grade 6 – 8",
      badgeColor: colors.purple,
      border: "rgba(75,46,131,0.15)",
      classes: [
        "English",
        "Nepali",
        "Mathematics",
        "Science",
        "Computer Science",
        "Social Studies",
      ],
      highlight:
        "Transitioning into systematic academic paradigms, critical logic, and digital assets.",
      visible: true,
    },
    {
      id: 4,
      level: "Secondary Level",
      span: "Grade 9 – 10",
      badgeColor: colors.dark,
      border: "rgba(11,16,32,0.12)",
      classes: [
        "English",
        "Nepali",
        "Mathematics",
        "Science",
        "Computer Science",
        "Optional Mathematics",
      ],
      highlight:
        "Rigorous academic performance pipelines optimizing for exceptional SEE results.",
      visible: true,
    },
  ],

  featuresTitle: "Why Choose Our Academics?",
  featuresDescription:
    "We focus on building balanced learning spaces through precise methodologies, institutional depth, and proven outcomes.",
  features: [
    {
      id: 1,
      emoji: "📚",
      title: "NEB Curriculum",
      desc: "Rigorous alignment with National Education Board standards for universal academic mobility.",
      color: colors.red,
      visible: true,
    },
    {
      id: 2,
      emoji: "💻",
      title: "Smart Classrooms",
      desc: "Equipped with specialized digital projection frameworks and interactive learning resources.",
      color: colors.purple,
      visible: true,
    },
    {
      id: 3,
      emoji: "🔬",
      title: "Science Laboratory",
      desc: "Practical hands-on exploration layouts helping convert theoretical principles into insight.",
      color: colors.green,
      visible: true,
    },
    {
      id: 4,
      emoji: "🖥",
      title: "Computer Lab",
      desc: "Individual system layouts ensuring modern digital literacy and localized computer education.",
      color: colors.purple,
      visible: true,
    },
    {
      id: 5,
      emoji: "👩‍🏫",
      title: "Qualified Teachers",
      desc: "Educators committed to personalized guidance, interactive methods, and high safety standards.",
      color: colors.green,
      visible: true,
    },
    {
      id: 6,
      emoji: "🏆",
      title: "Excellent SEE Results",
      desc: "A definitive history of high-tier performance, distinctions, and absolute GPA 4.0 targets.",
      color: colors.softPurple,
      visible: true,
    },
  ],

  stats: [
    {
      id: 1,
      value: "3800+",
      label: "Active Students",
      icon: "users",
      color: colors.purple,
      visible: true,
    },
    {
      id: 2,
      value: "240+",
      label: "Expert Teachers",
      icon: "graduation",
      color: colors.green,
      visible: true,
    },
    {
      id: 3,
      value: "35+",
      label: "Years Experience",
      icon: "milestone",
      color: colors.red,
      visible: true,
    },
    {
      id: 4,
      value: "98%",
      label: "SEE Pass Rate",
      icon: "award",
      color: colors.softPurple,
      visible: true,
    },
  ],

  examTitle: "Our Examination System",
  examDescription:
    "A comprehensive grading matrix consisting of critical terminal points combined with ongoing continuous assessment frameworks.",
  timelineTerms: [
    {
      id: 1,
      term: "First Terminal",
      timeframe: "Early Academic Session Evaluation",
      visible: true,
    },
    {
      id: 2,
      term: "Second Terminal",
      timeframe: "Mid-Session Progress Verification",
      visible: true,
    },
    {
      id: 3,
      term: "Third Terminal",
      timeframe: "Pre-Final Competency Benchmarking",
      visible: true,
    },
    {
      id: 4,
      term: "Final Examination",
      timeframe: "Comprehensive Session End Grading",
      visible: true,
    },
  ],
  continuousTitle: "Continuous Formative Evaluation",
  continuousDescription:
    "To prevent high-pressure examination variance, parameters are systematically logged week-over-week via the following modules:",
  ongoingAssessments: [
    "Monthly Tests",
    "Unit Tests",
    "Assignments",
    "Practical Assessment",
  ],

  ctaTitle: "Ready to Join Baljagriti?",
  ctaDescription:
    "Secure a placement in our upcoming academic track. Contact our admissions pipeline or drop by the main campus hub directly.",
  primaryButtonText: "Apply Now",
  primaryButtonLink: "/admissions",
  secondaryButtonText: "Contact Administration",
  secondaryButtonLink: "/contact",
};

function mergeAcademicsContent(saved = {}) {
  return {
    ...defaultAcademicsContent,
    ...saved,
    programs: Array.isArray(saved.programs)
      ? saved.programs
      : defaultAcademicsContent.programs,
    features: Array.isArray(saved.features)
      ? saved.features
      : defaultAcademicsContent.features,
    stats: Array.isArray(saved.stats)
      ? saved.stats
      : defaultAcademicsContent.stats,
    timelineTerms: Array.isArray(saved.timelineTerms)
      ? saved.timelineTerms
      : defaultAcademicsContent.timelineTerms,
    ongoingAssessments: Array.isArray(saved.ongoingAssessments)
      ? saved.ongoingAssessments
      : defaultAcademicsContent.ongoingAssessments,
  };
}

function HighlightedTitle({ title, highlight }) {
  if (!highlight || !title.includes(highlight)) return <>{title}</>;

  const [before, after] = title.split(highlight);

  return (
    <>
      {before}
      <span style={{ color: colors.red }}>{highlight}</span>
      {after}
    </>
  );
}

export function Academics() {
  const [content, setContent] = useState(defaultAcademicsContent);

  useEffect(() => {
    const loadAcademicsContent = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/site-content/academics"
        );

        const savedContent = res.data?.data?.content || {};
        setContent(mergeAcademicsContent(savedContent));
      } catch (error) {
        console.error("Academics content load error:", error);
        setContent(defaultAcademicsContent);
      }
    };

    loadAcademicsContent();
  }, []);

  const visiblePrograms = content.programs.filter(
    (item) => item.visible !== false
  );
  const visibleFeatures = content.features.filter(
    (item) => item.visible !== false
  );
  const visibleStats = content.stats.filter((item) => item.visible !== false);
  const visibleTimeline = content.timelineTerms.filter(
    (item) => item.visible !== false
  );

  return (
    <div
      className="min-h-screen relative overflow-hidden"
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
          background:
            "radial-gradient(circle, rgba(75,46,131,0.12), transparent 70%)",
          filter: "blur(8px)",
        }}
      />

      <div
        className="absolute bottom-0 left-0 w-[420px] h-[420px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(22,138,58,0.11), transparent 70%)",
          filter: "blur(8px)",
        }}
      />

      <section className="pt-36 pb-16 relative z-10">
        <div className="max-w-4xl mx-auto text-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="space-y-8"
          >
            <span
              className="inline-block px-5 py-2 rounded-full text-sm font-bold"
              style={{
                background: "rgba(215,25,32,0.08)",
                color: colors.red,
                border: "1px solid rgba(215,25,32,0.16)",
              }}
            >
              {content.heroBadge}
            </span>

            <h1
              className="text-5xl md:text-7xl font-black tracking-tight"
              style={{
                fontFamily: "var(--font-display)",
                color: colors.dark,
                letterSpacing: "-0.06em",
              }}
            >
              <HighlightedTitle
                title={content.heroTitle}
                highlight={content.heroHighlight}
              />
            </h1>

            <p className="text-xl md:text-2xl leading-relaxed text-slate-600 max-w-3xl mx-auto">
              {content.heroDescription}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="pb-20 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {visiblePrograms.map((prog, i) => {
              const cardColor = prog.badgeColor || colors.green;

              return (
                <motion.div
                  key={prog.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="group p-6 rounded-3xl flex flex-col justify-between relative overflow-hidden transition-all duration-300 hover:-translate-y-2 cursor-default"
                  style={{
                    border: `1px solid ${cardColor}24`,
                    background:
                      "linear-gradient(145deg, rgba(255,255,255,0.98), rgba(248,250,252,0.9))",
                    boxShadow: "0 18px 42px rgba(11,16,32,0.08)",
                    backdropFilter: "blur(18px)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = `0 26px 64px rgba(11,16,32,0.14), 0 0 0 1px ${cardColor}22`;
                    e.currentTarget.style.borderColor = `${cardColor}55`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow =
                      "0 18px 42px rgba(11,16,32,0.08)";
                    e.currentTarget.style.borderColor = `${cardColor}24`;
                  }}
                >
                  <div
                    className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-700"
                    style={{
                      background: `${cardColor}12`,
                      filter: "blur(60px)",
                    }}
                  />

                  <div className="relative z-10">
                    <div
                      className="text-sm font-black tracking-widest mb-5"
                      style={{ color: cardColor }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </div>

                    <div
                      className="w-16 h-1 rounded-full mb-6 transition-all duration-300 group-hover:w-28"
                      style={{ background: cardColor }}
                    />

                    <span
                      className="text-xs font-bold uppercase tracking-[0.16em] mb-4 block"
                      style={{ color: "#64748B" }}
                    >
                      {prog.span}
                    </span>

                    <h3
                      className="text-2xl font-black mb-4 text-slate-950 leading-tight"
                      style={{
                        fontFamily: "var(--font-display)",
                        letterSpacing: "-0.035em",
                      }}
                    >
                      {prog.level}
                    </h3>

                    <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                      {prog.highlight}
                    </p>

                    <div className="space-y-2.5 border-t pt-5 border-slate-100">
                      <span className="text-xs font-bold text-slate-400 block uppercase tracking-[0.16em]">
                        Course Structure
                      </span>

                      {(prog.classes || []).map((item) => (
                        <div
                          key={item}
                          className="flex items-center gap-3 text-sm text-slate-700"
                        >
                          <span
                            className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                            style={{ background: cardColor }}
                          />

                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white/60 backdrop-blur-md relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span
              className="inline-block px-4 py-2 rounded-full text-sm font-bold mb-5"
              style={{
                background: "rgba(22,138,58,0.08)",
                color: colors.green,
                border: "1px solid rgba(22,138,58,0.14)",
              }}
            >
              Academic Strengths
            </span>

            <h2
              className="text-3xl md:text-4xl font-black mb-4"
              style={{
                fontFamily: "var(--font-display)",
                color: colors.dark,
                letterSpacing: "-0.04em",
              }}
            >
              {content.featuresTitle}
            </h2>

            <p className="text-slate-600 max-w-2xl mx-auto leading-relaxed">
              {content.featuresDescription}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleFeatures.map((feat, i) => {
              const featureColor = feat.color || colors.green;

              return (
                <motion.div
                  key={feat.id}
                  initial={{ opacity: 0, y: 26 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: i * 0.06 }}
                  className="group relative overflow-hidden p-7 rounded-[28px] transition-all duration-300 hover:-translate-y-2 cursor-default"
                  style={{
                    background:
                      "linear-gradient(145deg, rgba(255,255,255,0.96), rgba(255,255,255,0.82))",
                    border: `1px solid ${featureColor}24`,
                    boxShadow: "0 16px 42px rgba(11,16,32,0.07)",
                    backdropFilter: "blur(16px)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = `0 24px 56px rgba(11,16,32,0.13), 0 0 0 1px ${featureColor}22`;
                    e.currentTarget.style.borderColor = `${featureColor}55`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow =
                      "0 16px 42px rgba(11,16,32,0.07)";
                    e.currentTarget.style.borderColor = `${featureColor}24`;
                  }}
                >
                  <div
                    className="absolute top-0 right-0 w-36 h-36 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-700"
                    style={{
                      background: `${featureColor}12`,
                      filter: "blur(62px)",
                    }}
                  />

                  <div className="relative z-10">
                    <div
                      className="text-sm font-black tracking-widest mb-5 transition-all duration-300 group-hover:scale-105 origin-left"
                      style={{ color: featureColor }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </div>

                    <div
                      className="w-16 h-1 rounded-full mb-7 transition-all duration-300 group-hover:w-28"
                      style={{ background: featureColor }}
                    />

                    <h3
                      className="font-black text-2xl mb-4 text-slate-950"
                      style={{
                        fontFamily: "var(--font-display)",
                        letterSpacing: "-0.035em",
                      }}
                    >
                      {feat.title}
                    </h3>

                    <p className="text-base leading-relaxed text-slate-500">
                      {feat.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section
        className="py-20 relative z-10"
        style={{
          background: "linear-gradient(180deg,#FFF8EE 0%,#F7F3FF 100%)",
        }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {visibleStats.map((stat, i) => {
              const statColor = stat.color || colors.green;

              return (
                <motion.div
                  key={stat.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="group relative overflow-hidden p-8 rounded-[32px] transition-all duration-300 hover:-translate-y-2 cursor-default"
                  style={{
                    background:
                      "linear-gradient(145deg, rgba(255,255,255,0.98), rgba(248,250,252,0.9))",
                    border: `1px solid ${statColor}24`,
                    boxShadow: "0 16px 42px rgba(11,16,32,0.08)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = `0 24px 58px rgba(11,16,32,0.13), 0 0 0 1px ${statColor}22`;
                    e.currentTarget.style.borderColor = `${statColor}55`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow =
                      "0 16px 42px rgba(11,16,32,0.08)";
                    e.currentTarget.style.borderColor = `${statColor}24`;
                  }}
                >
                  <div
                    className="w-16 h-1 rounded-full mx-auto mb-6 transition-all duration-300 group-hover:w-24"
                    style={{ background: statColor }}
                  />

                  <div
                    className="text-4xl md:text-5xl font-black mb-3"
                    style={{
                      color: statColor,
                      fontFamily: "var(--font-display)",
                      letterSpacing: "-0.055em",
                    }}
                  >
                    {stat.value}
                  </div>

                  <div className="text-sm text-slate-600 font-bold tracking-wide uppercase">
                    {stat.label}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="pb-20 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span
              className="inline-block px-4 py-2 rounded-full text-sm font-bold mb-5"
              style={{
                background: "rgba(75,46,131,0.08)",
                color: colors.purple,
                border: "1px solid rgba(75,46,131,0.14)",
              }}
            >
              Evaluation Framework
            </span>

            <h2
              className="text-3xl md:text-4xl font-black mb-4"
              style={{
                fontFamily: "var(--font-display)",
                color: colors.dark,
                letterSpacing: "-0.04em",
              }}
            >
              {content.examTitle}
            </h2>

            <p className="text-slate-600 max-w-2xl mx-auto leading-relaxed">
              {content.examDescription}
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-7 space-y-4 relative before:absolute before:left-6 before:top-4 before:bottom-4 before:w-0.5 before:bg-slate-200">
              {visibleTimeline.map((t, index) => {
                const termColor =
                  index % 4 === 0
                    ? colors.red
                    : index % 4 === 1
                    ? colors.green
                    : index % 4 === 2
                    ? colors.purple
                    : colors.softPurple;

                return (
                  <motion.div
                    key={t.id}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    className="group flex gap-5 relative z-10 p-5 rounded-3xl transition-all duration-300 hover:-translate-x-2 cursor-default"
                    style={{
                      background:
                        "linear-gradient(145deg, rgba(255,255,255,0.96), rgba(255,255,255,0.82))",
                      border: `1px solid ${termColor}24`,
                      boxShadow: "0 12px 32px rgba(11,16,32,0.06)",
                      backdropFilter: "blur(16px)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow =
                        "0 20px 46px rgba(11,16,32,0.12)";
                      e.currentTarget.style.borderColor = `${termColor}55`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow =
                        "0 12px 32px rgba(11,16,32,0.06)";
                      e.currentTarget.style.borderColor = `${termColor}24`;
                    }}
                  >
                    <div
                      className="w-12 h-12 rounded-full shrink-0 flex items-center justify-center text-sm font-black text-white"
                      style={{
                        background: termColor,
                        boxShadow: `0 14px 32px ${termColor}30`,
                      }}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </div>

                    <div>
                      <div
                        className="w-14 h-1 rounded-full mb-3 transition-all duration-300 group-hover:w-24"
                        style={{ background: termColor }}
                      />

                      <h4
                        className="font-black text-slate-950 text-xl"
                        style={{
                          fontFamily: "var(--font-display)",
                          letterSpacing: "-0.025em",
                        }}
                      >
                        {t.term}
                      </h4>

                      <p className="text-sm text-slate-500 mt-1">
                        {t.timeframe}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <motion.div
  className="group lg:col-span-5 p-7 rounded-3xl space-y-6 transition-all duration-300 cursor-default"
  whileHover={{
    y: -8,
    scale: 1.015,
  }}
  style={{
    background:
      "linear-gradient(145deg, rgba(11,16,32,0.96), rgba(75,46,131,0.9))",
    border: "1px solid rgba(255,255,255,0.12)",
    boxShadow:
      "0 24px 64px rgba(11,16,32,0.18), inset 0 1px 0 rgba(255,255,255,0.12)",
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.boxShadow =
      "0 32px 78px rgba(11,16,32,0.28), 0 0 0 1px rgba(255,255,255,0.16), inset 0 1px 0 rgba(255,255,255,0.14)";
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.boxShadow =
      "0 24px 64px rgba(11,16,32,0.18), inset 0 1px 0 rgba(255,255,255,0.12)";
  }}
>
  <div
    className="w-20 h-1 rounded-full transition-all duration-300 group-hover:w-36"
    style={{
      background: "linear-gradient(90deg, #D71920 0%, #168A3A 100%)",
    }}
  />

  <h3
    className="font-black text-2xl text-white"
    style={{
      fontFamily: "var(--font-display)",
      letterSpacing: "-0.035em",
    }}
  >
    {content.continuousTitle}
  </h3>

  <p
    className="text-sm leading-relaxed"
    style={{ color: "rgba(255,255,255,0.68)" }}
  >
    {content.continuousDescription}
  </p>

  <div className="grid grid-cols-2 gap-3">
    {(content.ongoingAssessments || []).map((item) => (
      <div
        key={item}
        className="p-4 rounded-2xl text-center font-bold text-sm transition-all duration-300 hover:-translate-y-1"
        style={{
          background: "rgba(255,255,255,0.1)",
          border: "1px solid rgba(255,255,255,0.12)",
          color: "rgba(255,255,255,0.86)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(255,255,255,0.16)";
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.22)";
          e.currentTarget.style.boxShadow = "0 14px 30px rgba(0,0,0,0.18)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "rgba(255,255,255,0.1)";
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        {item}
      </div>
    ))}
  </div>
</motion.div>
          </div>
        </div>
      </section>

      <section className="pt-10 pb-24 text-center relative z-10">
        <motion.div
  className="group max-w-4xl mx-auto px-6 py-14 rounded-[36px] space-y-6 transition-all duration-300 cursor-default"
  whileHover={{
    y: -8,
    scale: 1.01,
  }}
  style={{
    background:
      "linear-gradient(145deg, rgba(255,255,255,0.96), rgba(255,255,255,0.78))",
    border: "1px solid rgba(15,23,42,0.08)",
    boxShadow: "0 24px 70px rgba(11,16,32,0.09)",
    backdropFilter: "blur(16px)",
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.boxShadow =
      "0 34px 86px rgba(11,16,32,0.15), 0 0 0 1px rgba(22,138,58,0.12)";
    e.currentTarget.style.borderColor = "rgba(22,138,58,0.2)";
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.boxShadow = "0 24px 70px rgba(11,16,32,0.09)";
    e.currentTarget.style.borderColor = "rgba(15,23,42,0.08)";
  }}
>
  <div
    className="w-20 h-1 rounded-full mx-auto transition-all duration-300 group-hover:w-36"
    style={{
      background: "linear-gradient(90deg, #D71920 0%, #168A3A 100%)",
    }}
  />

  <h2
    className="text-4xl md:text-5xl font-black text-slate-900"
    style={{
      fontFamily: "var(--font-display)",
      letterSpacing: "-0.055em",
    }}
  >
    {content.ctaTitle}
  </h2>

  <p className="text-slate-600 max-w-xl mx-auto text-base leading-relaxed">
    {content.ctaDescription}
  </p>

  <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center items-center">
    <Link
      to={content.primaryButtonLink || "/admissions"}
      className="px-8 py-4 rounded-xl text-base font-bold transition-all duration-300 hover:scale-105 hover:-translate-y-1 shadow-lg w-full sm:w-auto"
      style={{
        background: "linear-gradient(135deg, #FACC15 0%, #38BDF8 100%)",
        color: "#111827",
        boxShadow: "0 8px 20px rgba(56,189,248,0.2)",
      }}
    >
      {content.primaryButtonText}
    </Link>

    <Link
      to={content.secondaryButtonLink || "/contact"}
      className="px-8 py-4 rounded-xl text-base font-bold text-slate-800 bg-white border border-slate-200 transition-all duration-300 hover:-translate-y-1 hover:bg-slate-50 w-full sm:w-auto shadow-sm hover:shadow-lg"
    >
      {content.secondaryButtonText}
    </Link>
  </div>
</motion.div>
      </section>
    </div>
  );
}

export default Academics;