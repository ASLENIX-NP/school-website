import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  Award,
  GraduationCap,
  Users,
  Milestone,
  Calendar,
  BookOpen,
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

function getStatIcon(icon) {
  if (icon === "graduation") return GraduationCap;
  if (icon === "milestone") return Milestone;
  if (icon === "award") return Award;
  return Users;
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
              className="inline-block px-5 py-2 rounded-full text-sm font-semibold"
              style={{
                background: "rgba(215,25,32,0.08)",
                color: colors.red,
                border: "1px solid rgba(215,25,32,0.16)",
              }}
            >
              {content.heroBadge}
            </span>

            <h1
              className="text-5xl md:text-7xl font-extrabold tracking-tight"
              style={{
                fontFamily: "var(--font-display)",
                color: colors.dark,
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
            {visiblePrograms.map((prog, i) => (
              <motion.div
                key={prog.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="p-6 rounded-3xl border flex flex-col justify-between group relative overflow-hidden transition-all duration-500 hover:-translate-y-4 hover:scale-[1.03] hover:shadow-[0_35px_80px_rgba(0,0,0,0.15)]"
                style={{
                  borderColor: prog.border || `${prog.badgeColor}25`,
                  background: `
                    linear-gradient(
                      145deg,
                      rgba(255,255,255,0.98),
                      rgba(248,250,252,0.88)
                    )
                  `,
                  boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
                  backdropFilter: "blur(18px)",
                }}
              >
                <div
                  className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-700"
                  style={{
                    background: `${prog.badgeColor || colors.green}15`,
                    filter: "blur(60px)",
                  }}
                />

                <div>
                  <span
                    className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-md text-white mb-4 inline-block"
                    style={{ backgroundColor: prog.badgeColor || colors.green }}
                  >
                    {prog.span}
                  </span>

                  <h3
                    className="text-xl font-bold mb-3 text-slate-900 group-hover:text-green-700 transition-colors"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {prog.level}
                  </h3>

                  <p className="text-xs text-slate-500 mb-5 leading-relaxed">
                    {prog.highlight}
                  </p>

                  <div className="space-y-2.5 border-t pt-4 border-slate-100">
                    <span className="text-xs font-semibold text-slate-400 block uppercase tracking-wide">
                      Course Structure:
                    </span>

                    {(prog.classes || []).map((item) => (
                      <div
                        key={item}
                        className="flex items-center gap-2 text-sm text-slate-700"
                      >
                        <CheckCircle2
                          className="w-4 h-4 shrink-0"
                          style={{ color: prog.badgeColor || colors.green }}
                        />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white/60 backdrop-blur-md relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2
              className="text-3xl md:text-4xl font-bold mb-4"
              style={{
                fontFamily: "var(--font-display)",
                color: colors.dark,
              }}
            >
              {content.featuresTitle}
            </h2>

            <p className="text-slate-600 max-w-2xl mx-auto">
              {content.featuresDescription}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleFeatures.map((feat, i) => (
              <motion.div
                key={feat.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                whileHover={{ y: -10 }}
                className="relative overflow-hidden p-7 rounded-[28px] backdrop-blur-xl border transition-all duration-500 shadow-lg"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(255,255,255,0.95), rgba(255,255,255,0.82))",
                  borderColor: `${feat.color || colors.green}30`,
                }}
              >
                <div
                  className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-20"
                  style={{
                    background: feat.color || colors.green,
                    filter: "blur(60px)",
                  }}
                />

                <motion.div
                  whileHover={{
                    rotate: 10,
                    scale: 1.15,
                  }}
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-5 shadow-md"
                  style={{
                    background: `${feat.color || colors.green}12`,
                    color: feat.color || colors.green,
                  }}
                >
                  {feat.emoji}
                </motion.div>

                <h3
                  className="font-bold text-xl mb-3 transition-all duration-300"
                  style={{
                    color: feat.color || colors.green,
                  }}
                >
                  {feat.title}
                </h3>

                <p className="text-sm leading-7 text-slate-600">{feat.desc}</p>
              </motion.div>
            ))}
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
              const IconComponent = getStatIcon(stat.icon);

              return (
                <motion.div
                  key={stat.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="group relative overflow-hidden p-8 rounded-[32px] backdrop-blur-xl transition-all duration-500 hover:-translate-y-3 hover:scale-[1.03]"
                  style={{
                    background: "linear-gradient(135deg,#FFFFFF,#F8FAFC)",
                    border: `1px solid ${stat.color || colors.green}25`,
                    boxShadow: "0 15px 40px rgba(0,0,0,0.08)",
                  }}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-white mb-2"
                    style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
                  >
                    <IconComponent
                      className="w-6 h-6"
                      style={{ color: stat.color || colors.green }}
                    />
                  </div>

                  <div
                    className="text-4xl md:text-5xl font-black"
                    style={{
                      color: stat.color || colors.green,
                      fontFamily: "var(--font-display)",
                    }}
                  >
                    {stat.value}
                  </div>

                  <div className="text-sm text-slate-600 font-semibold tracking-wide uppercase">
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
            <h2
              className="text-3xl md:text-4xl font-bold mb-4"
              style={{
                fontFamily: "var(--font-display)",
                color: colors.dark,
              }}
            >
              {content.examTitle}
            </h2>

            <p className="text-slate-600 max-w-2xl mx-auto">
              {content.examDescription}
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-7 space-y-4 relative before:absolute before:left-6 before:top-4 before:bottom-4 before:w-0.5 before:bg-slate-200">
              {visibleTimeline.map((t, index) => (
                <motion.div
                  key={t.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="group flex gap-4 relative z-10 bg-white/80 backdrop-blur-xl p-5 rounded-3xl border transition-all duration-500 hover:-translate-x-2 hover:shadow-xl"
                >
                  <div className="w-4 h-4 rounded-full bg-white border-4 border-indigo-600 shrink-0 mt-1.5" />
                  <div>
                    <h4 className="font-bold text-slate-900 text-base">
                      {t.term}
                    </h4>
                    <p className="text-xs text-slate-500">{t.timeframe}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-100 shadow-xl space-y-6">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-red-500" />
                <h3
                  className="font-bold text-lg text-slate-900"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {content.continuousTitle}
                </h3>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed">
                {content.continuousDescription}
              </p>

              <div className="grid grid-cols-2 gap-3">
                {(content.ongoingAssessments || []).map((item) => (
                  <div
                    key={item}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-center font-medium text-slate-700 text-sm"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pt-10 pb-24 text-center relative z-10">
        <div className="max-w-4xl mx-auto px-6 space-y-6">
          <h2
            className="text-4xl md:text-5xl font-black text-slate-900"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {content.ctaTitle}
          </h2>

          <p className="text-slate-600 max-w-xl mx-auto text-base">
            {content.ctaDescription}
          </p>

          <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to={content.primaryButtonLink || "/admissions"}
              className="px-8 py-4 rounded-xl text-base font-bold transition-all duration-300 hover:scale-105 shadow-lg w-full sm:w-auto"
              style={{
                background: "linear-gradient(135deg, #FACC15 0%, #A7F3D0 100%)",
                color: "#111827",
                boxShadow: "0 8px 20px rgba(250,204,21,0.18)",
              }}
            >
              {content.primaryButtonText}
            </Link>

            <Link
              to={content.secondaryButtonLink || "/contact"}
              className="px-8 py-4 rounded-xl text-base font-bold text-slate-800 bg-white border border-slate-200 transition-all duration-300 hover:bg-slate-50 w-full sm:w-auto shadow-sm"
            >
              {content.secondaryButtonText}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Academics;