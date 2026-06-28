import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  CheckCircle2,
  ExternalLink,
  Eye,
  EyeOff,
  BookOpen,
  Type,
  Award,
  Users,
  Calendar,
  Target,
  Library,
  ArrowUp,
  ArrowDown,
  ChevronDown,
  ChevronRight,
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
  cyan: "#38BDF8",
  gold: "#FACC15",
};

const ACCENT_SEQUENCE = [
  colors.red,
  colors.green,
  colors.purple,
  colors.softPurple,
];

const gradeAccent = (index) => ACCENT_SEQUENCE[index % ACCENT_SEQUENCE.length];

const defaultAcademicsContent = {
  heroBadge: "Nurturing Excellence",
  heroTitle: "Academics at Baljagriti",
  heroHighlight: "Baljagriti",
  heroDescription:
    "Comprehensive education from Play Group to Grade 12 under the National NEB Curriculum. We combine academic excellence, practical learning, critical thinking, and character development to prepare students for lifelong success.",

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
      span: "Grade 9 – 12",
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
        "Rigorous academic preparation for SEE and NEB Grade 11–12 learning pathways.",
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

  curriculum: {
    "Pre-Primary Level": [
      {
        grade: "Nursery",
        books: [
          { subject: "English Readiness", publication: "Ekta Publication" },
          { subject: "Nepali Readiness", publication: "Janak Publication" },
          { subject: "Numbers & Counting", publication: "Buddha Publication" },
          { subject: "Creative Activities", publication: "Creative Publication" },
          { subject: "Rhymes & Storytelling", publication: "Story Publication" },
        ],
      },
      {
        grade: "LKG",
        books: [
          { subject: "English Readiness", publication: "Ekta Publication" },
          { subject: "Nepali Readiness", publication: "Janak Publication" },
          { subject: "Numbers & Counting", publication: "Buddha Publication" },
        ],
      },
      {
        grade: "UKG",
        books: [
          { subject: "English Readiness", publication: "Ekta Publication" },
          { subject: "Nepali Readiness", publication: "Janak Publication" },
          { subject: "Numbers & Counting", publication: "Buddha Publication" },
        ],
      },
    ],
    "Primary Level": [
      {
        grade: "Grade 1",
        books: [
          { subject: "English", publication: "Ekta Publication" },
          { subject: "Nepali", publication: "Janak Publication" },
          { subject: "Mathematics", publication: "CDC" },
          { subject: "Science", publication: "CDC" },
          { subject: "Social Studies", publication: "CDC" },
        ],
      },
      {
        grade: "Grade 2",
        books: [
          { subject: "English", publication: "Ekta Publication" },
          { subject: "Nepali", publication: "Janak Publication" },
          { subject: "Mathematics", publication: "CDC" },
          { subject: "Science", publication: "CDC" },
          { subject: "Social Studies", publication: "CDC" },
        ],
      },
      {
        grade: "Grade 3",
        books: [
          { subject: "English", publication: "Ekta Publication" },
          { subject: "Nepali", publication: "Janak Publication" },
          { subject: "Mathematics", publication: "CDC" },
          { subject: "Science", publication: "CDC" },
          { subject: "Social Studies", publication: "CDC" },
        ],
      },
      {
        grade: "Grade 4",
        books: [
          { subject: "English", publication: "Ekta Publication" },
          { subject: "Nepali", publication: "Janak Publication" },
          { subject: "Mathematics", publication: "CDC" },
          { subject: "Science", publication: "CDC" },
          { subject: "Social Studies", publication: "CDC" },
        ],
      },
      {
        grade: "Grade 5",
        books: [
          { subject: "English", publication: "Ekta Publication" },
          { subject: "Nepali", publication: "Janak Publication" },
          { subject: "Mathematics", publication: "CDC" },
          { subject: "Science", publication: "CDC" },
          { subject: "Social Studies", publication: "CDC" },
        ],
      },
    ],
    "Lower Secondary Level": [
      {
        grade: "Grade 6",
        books: [
          { subject: "English", publication: "Ekta Publication" },
          { subject: "Nepali", publication: "Janak Publication" },
          { subject: "Mathematics", publication: "CDC" },
          { subject: "Science", publication: "CDC" },
          { subject: "Computer Science", publication: "CDC" },
          { subject: "Social Studies", publication: "CDC" },
        ],
      },
      {
        grade: "Grade 7",
        books: [
          { subject: "English", publication: "Ekta Publication" },
          { subject: "Nepali", publication: "Janak Publication" },
          { subject: "Mathematics", publication: "CDC" },
          { subject: "Science", publication: "CDC" },
          { subject: "Computer Science", publication: "CDC" },
          { subject: "Social Studies", publication: "CDC" },
        ],
      },
      {
        grade: "Grade 8",
        books: [
          { subject: "English", publication: "Ekta Publication" },
          { subject: "Nepali", publication: "Janak Publication" },
          { subject: "Mathematics", publication: "CDC" },
          { subject: "Science", publication: "CDC" },
          { subject: "Computer Science", publication: "CDC" },
          { subject: "Social Studies", publication: "CDC" },
        ],
      },
    ],
    "Secondary Level": [
      {
        grade: "Grade 9",
        books: [
          { subject: "English", publication: "Ekta Publication" },
          { subject: "Nepali", publication: "Janak Publication" },
          { subject: "Mathematics", publication: "CDC" },
          { subject: "Science", publication: "CDC" },
          { subject: "Computer Science", publication: "CDC" },
          { subject: "Optional Mathematics", publication: "CDC" },
        ],
      },
      {
        grade: "Grade 10",
        books: [
          { subject: "English", publication: "Ekta Publication" },
          { subject: "Nepali", publication: "Janak Publication" },
          { subject: "Mathematics", publication: "CDC" },
          { subject: "Science", publication: "CDC" },
          { subject: "Computer Science", publication: "CDC" },
          { subject: "Optional Mathematics", publication: "CDC" },
        ],
      },
      {
        grade: "Grade 11",
        books: [
          { subject: "English", publication: "NEB / CDC" },
          { subject: "Nepali", publication: "NEB / CDC" },
          { subject: "Accountancy / Science Stream Subject", publication: "NEB / CDC" },
          { subject: "Economics / Biology / Physics", publication: "NEB / CDC" },
          { subject: "Computer Science / Mathematics", publication: "NEB / CDC" },
        ],
      },
      {
        grade: "Grade 12",
        books: [
          { subject: "English", publication: "NEB / CDC" },
          { subject: "Nepali", publication: "NEB / CDC" },
          { subject: "Accountancy / Science Stream Subject", publication: "NEB / CDC" },
          { subject: "Economics / Biology / Physics", publication: "NEB / CDC" },
          { subject: "Computer Science / Mathematics", publication: "NEB / CDC" },
        ],
      },
    ],
  },
};

function isLegacyAcademicsContent(saved = {}) {
  return Number(saved._contentVersion || 0) < 2;
}

function normalizeLegacyHeroDescription(description, shouldMigrate) {
  const text = description || defaultAcademicsContent.heroDescription;

  if (!shouldMigrate) return text;

  return text
    .replace("Play Group to Grade 10", "Play Group to Grade 12")
    .replace("Play Group to Class 10", "Play Group to Class 12")
    .replace("up to Grade 10", "up to Grade 12")
    .replace("up to Class 10", "up to Class 12");
}

function normalizePrograms(programs = [], shouldMigrate = false) {
  return programs.map((program) => {
    const level = String(program.level || "").toLowerCase();

    if (!level.includes("secondary") || !shouldMigrate) {
      return {
        ...program,
        classes: Array.isArray(program.classes) ? program.classes : [],
      };
    }

    const currentSpan = String(program.span || "").trim();

    const isOldSecondarySpan =
      currentSpan === "" ||
      currentSpan === "Grade 9 – 10" ||
      currentSpan === "Grade 9 - 10" ||
      currentSpan === "9 – 10" ||
      currentSpan === "9 - 10";

    const oldHighlight =
      "Rigorous academic performance pipelines optimizing for exceptional SEE results.";

    return {
      ...program,

      span: isOldSecondarySpan ? "Grade 9 – 12" : program.span,

      highlight:
        !program.highlight || program.highlight === oldHighlight
          ? "Rigorous academic preparation for SEE and NEB Grade 11–12 learning pathways."
          : program.highlight,

      classes: Array.isArray(program.classes)
        ? program.classes
        : defaultAcademicsContent.programs[3].classes,
    };
  });
}

function normalizeCurriculum(curriculum = {}, shouldMigrate = false) {
  const hasSavedCurriculum =
    curriculum &&
    typeof curriculum === "object" &&
    Object.keys(curriculum).length > 0;

  const merged = hasSavedCurriculum
    ? curriculum
    : defaultAcademicsContent.curriculum;

  if (!shouldMigrate) return merged;

  const oldSecondary = Array.isArray(merged["Secondary Level"])
    ? merged["Secondary Level"]
    : [];

  const secondaryGrades = [...oldSecondary];

  const ensureGrade = (gradeName, books) => {
    const exists = secondaryGrades.some((item) => item.grade === gradeName);

    if (!exists) {
      secondaryGrades.push({
        grade: gradeName,
        books,
      });
    }
  };

  ensureGrade("Grade 11", [
    { subject: "English", publication: "NEB / CDC" },
    { subject: "Nepali", publication: "NEB / CDC" },
    {
      subject: "Accountancy / Science Stream Subject",
      publication: "NEB / CDC",
    },
    { subject: "Economics / Biology / Physics", publication: "NEB / CDC" },
    {
      subject: "Computer Science / Mathematics",
      publication: "NEB / CDC",
    },
  ]);

  ensureGrade("Grade 12", [
    { subject: "English", publication: "NEB / CDC" },
    { subject: "Nepali", publication: "NEB / CDC" },
    {
      subject: "Accountancy / Science Stream Subject",
      publication: "NEB / CDC",
    },
    { subject: "Economics / Biology / Physics", publication: "NEB / CDC" },
    {
      subject: "Computer Science / Mathematics",
      publication: "NEB / CDC",
    },
  ]);

  return {
    ...merged,
    "Secondary Level": secondaryGrades,
  };
}

function mergeAcademicsContent(saved = {}) {
  const shouldMigrate = isLegacyAcademicsContent(saved);

  return {
    ...defaultAcademicsContent,
    ...saved,

    _contentVersion: 2,

    heroDescription: normalizeLegacyHeroDescription(
      saved.heroDescription,
      shouldMigrate
    ),

    programs: normalizePrograms(
      Array.isArray(saved.programs)
        ? saved.programs
        : defaultAcademicsContent.programs,
      shouldMigrate
    ),

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

    curriculum: normalizeCurriculum(saved.curriculum, shouldMigrate),
  };
}

function Field({ label, value, onChange, placeholder = "", type = "text" }) {
  return (
    <div>
      <label className="block text-xs font-bold mb-1.5 text-slate-500 uppercase tracking-wider">
        {label}
      </label>
      <input
        type={type}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-xl outline-none text-sm transition-all duration-150"
        style={{
          background: "#F8FAFC",
          border: "1.5px solid rgba(75,46,131,0.12)",
          color: colors.dark,
        }}
        onFocus={(e) => {
          e.target.style.border = "1.5px solid rgba(75,46,131,0.4)";
          e.target.style.background = "#fff";
          e.target.style.boxShadow = "0 0 0 3px rgba(75,46,131,0.06)";
        }}
        onBlur={(e) => {
          e.target.style.border = "1.5px solid rgba(75,46,131,0.12)";
          e.target.style.background = "#F8FAFC";
          e.target.style.boxShadow = "none";
        }}
      />
    </div>
  );
}

function TextArea({ label, value, onChange, placeholder = "", rows = 4 }) {
  return (
    <div>
      <label className="block text-xs font-bold mb-1.5 text-slate-500 uppercase tracking-wider">
        {label}
      </label>
      <textarea
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full px-4 py-3 rounded-xl outline-none text-sm resize-none transition-all duration-150"
        style={{
          background: "#F8FAFC",
          border: "1.5px solid rgba(75,46,131,0.12)",
          color: colors.dark,
        }}
        onFocus={(e) => {
          e.target.style.border = "1.5px solid rgba(75,46,131,0.4)";
          e.target.style.background = "#fff";
          e.target.style.boxShadow = "0 0 0 3px rgba(75,46,131,0.06)";
        }}
        onBlur={(e) => {
          e.target.style.border = "1.5px solid rgba(75,46,131,0.12)";
          e.target.style.background = "#F8FAFC";
          e.target.style.boxShadow = "none";
        }}
      />
    </div>
  );
}

// Accordion Section Component - Matching Home page design
function AccordionSection({
  icon: Icon,
  title,
  color,
  children,
  isExpanded,
  onToggle,
  sectionId,
  index,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="rounded-2xl overflow-hidden transition-all duration-300"
      style={{
        background: "#FFFFFF",
        border: isExpanded
          ? `1.5px solid ${color}30`
          : "1.5px solid rgba(15,23,42,0.07)",
        boxShadow: isExpanded
          ? `0 8px 32px ${color}12, 0 2px 8px rgba(0,0,0,0.04)`
          : "0 2px 8px rgba(0,0,0,0.04)",
      }}
    >
      <button
        onClick={() => onToggle(sectionId)}
        className="w-full flex items-center justify-between px-5 py-4 transition-all duration-200"
        style={{
          background: isExpanded ? `${color}06` : "transparent",
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: `${color}12` }}
          >
            <Icon className="w-4 h-4" style={{ color }} />
          </div>
          <div className="text-left">
            <div className="font-bold text-slate-900 text-sm">{title}</div>
            {!isExpanded && (
              <div className="text-xs text-slate-400 mt-0.5">Click to expand and edit</div>
            )}
          </div>
        </div>
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-200"
          style={{
            background: isExpanded ? `${color}15` : "rgba(15,23,42,0.05)",
          }}
        >
          {isExpanded ? (
            <ChevronDown className="w-4 h-4" style={{ color }} />
          ) : (
            <ChevronRight className="w-4 h-4 text-slate-400" />
          )}
        </div>
      </button>

      {isExpanded && (
        <div style={{ height: "1px", background: `${color}18`, margin: "0 20px" }} />
      )}

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isExpanded ? "max-h-[5000px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-5 pt-5 pb-6 space-y-4">{children}</div>
      </div>
    </motion.div>
  );
}

function VisibilityDeleteControls({ visible, onToggle, onDelete }) {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={onToggle}
        className="p-3 rounded-xl"
        style={{
          background:
            visible !== false
              ? "rgba(22,138,58,0.1)"
              : "rgba(100,116,139,0.12)",
          color: visible !== false ? colors.green : "#64748B",
          border:
            visible !== false
              ? "1px solid rgba(22,138,58,0.2)"
              : "1px solid rgba(100,116,139,0.16)",
        }}
        title={visible !== false ? "Visible" : "Hidden"}
      >
        {visible !== false ? (
          <Eye className="w-4 h-4" />
        ) : (
          <EyeOff className="w-4 h-4" />
        )}
      </button>

      <button
        type="button"
        onClick={onDelete}
        className="p-3 rounded-xl"
        style={{
          background: "rgba(215,25,32,0.09)",
          color: colors.red,
          border: "1px solid rgba(215,25,32,0.18)",
        }}
        title="Delete"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}

function AcademicsPreview({ form }) {
  const visiblePrograms = (form.programs || []).filter(
    (item) => item.visible !== false
  );
  const visibleFeatures = (form.features || []).filter(
    (item) => item.visible !== false
  );
  const visibleStats = (form.stats || []).filter(
    (item) => item.visible !== false
  );
  const visibleTimeline = (form.timelineTerms || []).filter(
    (item) => item.visible !== false
  );

  return (
    <div
      className="min-h-full p-6"
      style={{
        background:
          "radial-gradient(circle at top right, rgba(124,92,196,0.18), transparent 34%), linear-gradient(180deg, #FFF8EE 0%, #F1ECFF 100%)",
      }}
    >
      <div className="text-center mb-10">
        <span
          className="inline-block px-4 py-1.5 rounded-full text-sm font-bold mb-4"
          style={{
            background: "rgba(215,25,32,0.08)",
            color: colors.red,
            border: "1px solid rgba(215,25,32,0.14)",
          }}
        >
          {form.heroBadge}
        </span>

        <h2
          className="text-4xl font-black text-slate-950"
          style={{
            fontFamily: "var(--font-display)",
            letterSpacing: "-0.04em",
          }}
        >
          {form.heroTitle}
        </h2>

        <p className="text-sm text-slate-500 mt-4 leading-relaxed">
          {form.heroDescription}
        </p>
      </div>

      <div className="mb-10">
        <div className="text-xl font-black text-slate-950 mb-4">
          Academic Programs
        </div>

        <div className="grid gap-4">
          {visiblePrograms.map((program, index) => {
            const programColor = program.badgeColor || colors.green;

            return (
              <div
                key={program.id}
                className="bg-white rounded-3xl p-5"
                style={{
                  border: `1px solid ${programColor}22`,
                  boxShadow: "0 12px 32px rgba(15,23,42,0.08)",
                }}
              >
                <div
                  className="text-sm font-black tracking-widest mb-3"
                  style={{ color: programColor }}
                >
                  {String(index + 1).padStart(2, "0")}
                </div>

                <div
                  className="w-16 h-1 rounded-full mb-4"
                  style={{ background: programColor }}
                />

                <span className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                  {program.span}
                </span>

                <h3 className="text-xl font-black mt-3 text-slate-950">
                  {program.level}
                </h3>

                <p className="text-sm text-slate-500 mt-2">
                  {program.highlight}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mb-10">
        <div className="text-xl font-black text-slate-950 mb-2">
          {form.featuresTitle}
        </div>

        <p className="text-sm text-slate-500 mb-4">
          {form.featuresDescription}
        </p>

        <div className="grid gap-4">
          {visibleFeatures.map((feature, index) => {
            const featureColor = feature.color || colors.green;

            return (
              <div
                key={feature.id}
                className="bg-white rounded-3xl p-5"
                style={{
                  border: `1px solid ${featureColor}22`,
                  boxShadow: "0 12px 32px rgba(15,23,42,0.08)",
                }}
              >
                <div
                  className="text-sm font-black tracking-widest mb-3"
                  style={{ color: featureColor }}
                >
                  {String(index + 1).padStart(2, "0")}
                </div>

                <div
                  className="w-16 h-1 rounded-full mb-4"
                  style={{ background: featureColor }}
                />

                <h3 className="font-black text-xl text-slate-950">
                  {feature.title}
                </h3>

                <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mb-10">
        <div className="text-xl font-black text-slate-950 mb-4">
          Statistics
        </div>

        <div className="grid grid-cols-2 gap-4">
          {visibleStats.map((stat) => {
            const statColor = stat.color || colors.green;

            return (
              <div
                key={stat.id}
                className="bg-white rounded-3xl p-5 text-center"
                style={{
                  border: `1px solid ${statColor}22`,
                  boxShadow: "0 12px 32px rgba(15,23,42,0.06)",
                }}
              >
                <div
                  className="w-12 h-1 rounded-full mx-auto mb-4"
                  style={{ background: statColor }}
                />

                <div
                  className="text-3xl font-black"
                  style={{ color: statColor }}
                >
                  {stat.value}
                </div>

                <div className="text-xs uppercase font-bold text-slate-500 mt-1">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mb-10">
        <div className="text-xl font-black text-slate-950 mb-2">
          {form.examTitle}
        </div>

        <p className="text-sm text-slate-500 mb-4">{form.examDescription}</p>

        <div className="space-y-4">
          {visibleTimeline.map((item, index) => {
            const termColor =
              index % 4 === 0
                ? colors.red
                : index % 4 === 1
                ? colors.green
                : index % 4 === 2
                ? colors.purple
                : colors.softPurple;

            return (
              <div
                key={item.id}
                className="bg-white rounded-3xl p-5"
                style={{
                  border: `1px solid ${termColor}22`,
                  boxShadow: "0 12px 32px rgba(15,23,42,0.06)",
                }}
              >
                <div
                  className="w-14 h-1 rounded-full mb-3"
                  style={{ background: termColor }}
                />

                <div className="font-black text-slate-950">{item.term}</div>
                <div className="text-sm text-slate-500">{item.timeframe}</div>
              </div>
            );
          })}
        </div>

        <div
          className="rounded-3xl p-5 mt-4"
          style={{
            background: `linear-gradient(135deg, ${colors.dark}, ${colors.purple})`,
          }}
        >
          <div
            className="w-16 h-1 rounded-full mb-4"
            style={{
              background: `linear-gradient(90deg, ${colors.red}, ${colors.green})`,
            }}
          />

          <div className="font-black text-white">{form.continuousTitle}</div>

          <p
            className="text-sm mt-2"
            style={{ color: "rgba(255,255,255,0.68)" }}
          >
            {form.continuousDescription}
          </p>

          <div className="grid grid-cols-2 gap-3 mt-4">
            {(form.ongoingAssessments || []).map((item) => (
              <div
                key={item}
                className="rounded-xl p-3 text-center text-sm font-bold"
                style={{
                  background: "rgba(255,255,255,0.1)",
                  color: "rgba(255,255,255,0.86)",
                  border: "1px solid rgba(255,255,255,0.12)",
                }}
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 text-center border">
        <div
          className="w-20 h-1 rounded-full mx-auto mb-5"
          style={{
            background: `linear-gradient(90deg, ${colors.red}, ${colors.green})`,
          }}
        />

        <h2 className="text-3xl font-black text-slate-950">
          {form.ctaTitle}
        </h2>

        <p className="text-sm text-slate-500 mt-3">{form.ctaDescription}</p>

        <div className="flex gap-3 mt-5 justify-center">
          <span className="px-5 py-3 rounded-xl font-bold bg-yellow-200">
            {form.primaryButtonText}
          </span>

          <span className="px-5 py-3 rounded-xl font-bold bg-slate-100">
            {form.secondaryButtonText}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function AdminAcademics() {
  const navigate = useNavigate();

  const [form, setForm] = useState(defaultAcademicsContent);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [expandedCurriculumLevel, setExpandedCurriculumLevel] = useState(null);

  // Define sections for accordion
  const sectionKeys = ['hero', 'programs', 'curriculum', 'features', 'stats', 'exam', 'cta'];
  const sectionTitles = {
    hero: 'Hero Section',
    programs: 'Academic Programs',
    curriculum: 'Curriculum & Books',
    features: 'Features Section',
    stats: 'Statistics',
    exam: 'Examination System',
    cta: 'Bottom CTA'
  };
  const sectionIcons = {
    hero: Type,
    programs: BookOpen,
    curriculum: Library,
    features: Award,
    stats: Users,
    exam: Calendar,
    cta: Target
  };
  const sectionColors = {
    hero: colors.purple,
    programs: colors.green,
    curriculum: colors.purple,
    features: colors.red,
    stats: colors.purple,
    exam: colors.green,
    cta: colors.red
  };

  const [expandedSections, setExpandedSections] = useState(
    Object.fromEntries(sectionKeys.map(key => [key, false]))
  );

  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    const loadAcademicsContent = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/site-content/academics"
        );

        const savedContent = res.data?.data?.content || {};
        setForm(mergeAcademicsContent(savedContent));
      } catch (err) {
        console.error("Load academics content error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadAcademicsContent();
  }, []);

  const toggleSection = (sectionId) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const expandAll = () => {
    setExpandedSections(
      Object.fromEntries(sectionKeys.map(key => [key, true]))
    );
  };

  const collapseAll = () => {
    setExpandedSections(
      Object.fromEntries(sectionKeys.map(key => [key, false]))
    );
  };

  const updateField = (name, value) => {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const updateProgram = (id, field, value) => {
    setForm((prev) => {
      const oldProgram = prev.programs.find((item) => item.id === id);
      const updatedPrograms = prev.programs.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      );

      if (field === "level" && oldProgram?.level && oldProgram.level !== value) {
        const newCurriculum = { ...prev.curriculum };

        if (newCurriculum[oldProgram.level]) {
          newCurriculum[value] = newCurriculum[oldProgram.level];
          delete newCurriculum[oldProgram.level];
        }

        return {
          ...prev,
          programs: updatedPrograms,
          curriculum: newCurriculum,
        };
      }

      return {
        ...prev,
        programs: updatedPrograms,
      };
    });
  };

  const addProgram = () => {
    const newProgram = {
      id: Date.now(),
      level: "New Academic Level",
      span: "Grade",
      badgeColor: colors.green,
      border: "rgba(22,138,58,0.15)",
      classes: ["Subject 1", "Subject 2"],
      highlight: "Short academic level description.",
      visible: true,
    };

    setForm((prev) => ({
      ...prev,
      programs: [...prev.programs, newProgram],
      curriculum: {
        ...prev.curriculum,
        [newProgram.level]: [
          {
            grade: "New Grade",
            books: [
              { subject: "New Subject", publication: "New Publication" },
            ],
          },
        ],
      },
    }));
  };

  const deleteProgram = (id) => {
    const programToDelete = form.programs.find((p) => p.id === id);

    setForm((prev) => {
      const newCurriculum = { ...prev.curriculum };

      if (programToDelete) {
        delete newCurriculum[programToDelete.level];
      }

      return {
        ...prev,
        programs: prev.programs.filter((item) => item.id !== id),
        curriculum: newCurriculum,
      };
    });
  };

  const updateFeature = (id, field, value) => {
    setForm((prev) => ({
      ...prev,
      features: prev.features.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
  };

  const addFeature = () => {
    setForm((prev) => ({
      ...prev,
      features: [
        ...prev.features,
        {
          id: Date.now(),
          emoji: "📘",
          title: "New Feature",
          desc: "Feature description.",
          color: colors.green,
          visible: true,
        },
      ],
    }));
  };

  const deleteFeature = (id) => {
    setForm((prev) => ({
      ...prev,
      features: prev.features.filter((item) => item.id !== id),
    }));
  };

  const updateStat = (id, field, value) => {
    setForm((prev) => ({
      ...prev,
      stats: prev.stats.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
  };

  const addStat = () => {
    setForm((prev) => ({
      ...prev,
      stats: [
        ...prev.stats,
        {
          id: Date.now(),
          value: "100+",
          label: "New Stat",
          icon: "users",
          color: colors.green,
          visible: true,
        },
      ],
    }));
  };

  const deleteStat = (id) => {
    setForm((prev) => ({
      ...prev,
      stats: prev.stats.filter((item) => item.id !== id),
    }));
  };

  const updateTimeline = (id, field, value) => {
    setForm((prev) => ({
      ...prev,
      timelineTerms: prev.timelineTerms.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
  };

  const addTimeline = () => {
    setForm((prev) => ({
      ...prev,
      timelineTerms: [
        ...prev.timelineTerms,
        {
          id: Date.now(),
          term: "New Exam Term",
          timeframe: "Timeframe description.",
          visible: true,
        },
      ],
    }));
  };

  const deleteTimeline = (id) => {
    setForm((prev) => ({
      ...prev,
      timelineTerms: prev.timelineTerms.filter((item) => item.id !== id),
    }));
  };

  const updateCurriculumGrade = (level, gradeIndex, field, value) => {
    setForm((prev) => ({
      ...prev,
      curriculum: {
        ...prev.curriculum,
        [level]: prev.curriculum[level].map((item, idx) =>
          idx === gradeIndex ? { ...item, [field]: value } : item
        ),
      },
    }));
  };

  const addBookToGrade = (level, gradeIndex) => {
    setForm((prev) => {
      const updatedGrades = prev.curriculum[level].map((item, idx) => {
        if (idx === gradeIndex) {
          return {
            ...item,
            books: [
              ...item.books,
              { subject: "New Subject", publication: "New Publication" },
            ],
          };
        }

        return item;
      });

      return {
        ...prev,
        curriculum: {
          ...prev.curriculum,
          [level]: updatedGrades,
        },
      };
    });
  };

  const updateBook = (level, gradeIndex, bookIndex, field, value) => {
    setForm((prev) => {
      const updatedGrades = prev.curriculum[level].map((item, idx) => {
        if (idx === gradeIndex) {
          const updatedBooks = item.books.map((book, bidx) =>
            bidx === bookIndex ? { ...book, [field]: value } : book
          );

          return { ...item, books: updatedBooks };
        }

        return item;
      });

      return {
        ...prev,
        curriculum: {
          ...prev.curriculum,
          [level]: updatedGrades,
        },
      };
    });
  };

  const removeBook = (level, gradeIndex, bookIndex) => {
    setForm((prev) => {
      const updatedGrades = prev.curriculum[level].map((item, idx) => {
        if (idx === gradeIndex) {
          const filteredBooks = item.books.filter(
            (_, bidx) => bidx !== bookIndex
          );

          return { ...item, books: filteredBooks };
        }

        return item;
      });

      return {
        ...prev,
        curriculum: {
          ...prev.curriculum,
          [level]: updatedGrades,
        },
      };
    });
  };

  const addGradeToLevel = (level) => {
    setForm((prev) => ({
      ...prev,
      curriculum: {
        ...prev.curriculum,
        [level]: [
          ...prev.curriculum[level],
          {
            grade: "New Grade",
            books: [
              { subject: "New Subject", publication: "New Publication" },
            ],
          },
        ],
      },
    }));
  };

  const removeGrade = (level, gradeIndex) => {
    setForm((prev) => {
      const filteredGrades = prev.curriculum[level].filter(
        (_, idx) => idx !== gradeIndex
      );

      return {
        ...prev,
        curriculum: {
          ...prev.curriculum,
          [level]: filteredGrades,
        },
      };
    });
  };

  const moveGrade = (level, gradeIndex, direction) => {
    setForm((prev) => {
      const grades = Array.isArray(prev.curriculum?.[level])
        ? [...prev.curriculum[level]]
        : [];

      const targetIndex = gradeIndex + direction;

      if (targetIndex < 0 || targetIndex >= grades.length) {
        return prev;
      }

      const temp = grades[gradeIndex];
      grades[gradeIndex] = grades[targetIndex];
      grades[targetIndex] = temp;

      return {
        ...prev,
        curriculum: {
          ...prev.curriculum,
          [level]: grades,
        },
      };
    });
  };

  async function saveAcademicsContent() {
    setSuccess("");
    setError("");
    setSaving(true);

    try {
      const contentToSave = {
        ...form,
        _contentVersion: 2,
      };

      await axios.put(
        "http://localhost:5000/api/site-content/academics",
        { content: contentToSave },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setForm(contentToSave);
      setSuccess("Academics page content saved successfully.");
    } catch (err) {
      console.error("Save academics content error:", err);
      setError(
        err.response?.data?.message || "Could not save academics content."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "#FFF8EE" }}
      >
        <div className="text-slate-600 font-semibold">
          Loading academics editor...
        </div>
      </div>
    );
  }

  const expandedCount = Object.values(expandedSections).filter(Boolean).length;
  const totalSections = sectionKeys.length;

  return (
    <section
      className="min-h-screen relative overflow-hidden"
      style={{
        background: `
          radial-gradient(circle at top right, rgba(56,189,248,0.16), transparent 34%),
          radial-gradient(circle at bottom left, rgba(250,204,21,0.12), transparent 32%),
          linear-gradient(180deg, #FFF8EE 0%, #F1ECFF 100%)
        `,
      }}
    >
      <header
        className="sticky top-0 z-40"
        style={{
          background:
            "linear-gradient(145deg, rgba(2,6,23,0.96), rgba(15,23,42,0.88))",
          borderBottom: "1px solid rgba(255,255,255,0.12)",
          boxShadow: "0 18px 52px rgba(0,0,0,0.22)",
          backdropFilter: "blur(22px)",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate("/admin/dashboard")}
            className="inline-flex items-center gap-2 text-white/80 hover:text-white font-semibold text-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>

          <div className="flex items-center gap-3">
            <a
              href="/academics"
              target="_blank"
              rel="noreferrer"
              className="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-white/80 hover:text-white text-sm transition-all"
              style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)" }}
            >
              <ExternalLink className="w-4 h-4" />
              View Academics Page
            </a>

            <button
              type="button"
              onClick={saveAcademicsContent}
              disabled={saving}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all hover:scale-105 disabled:opacity-60"
              style={{
                color: "#020617",
                background: `linear-gradient(135deg, ${colors.gold}, ${colors.cyan})`,
                boxShadow: "0 8px 24px rgba(56,189,248,0.28)",
              }}
            >
              <Save className="w-4 h-4" />
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-7"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: "rgba(75,46,131,0.12)", border: "1px solid rgba(75,46,131,0.2)" }}
                >
                  <BookOpen className="w-4 h-4" style={{ color: colors.purple }} />
                </div>
                <span className="text-sm font-bold" style={{ color: colors.purple }}>Manage Academics Page</span>
              </div>

              <h1
                className="text-3xl md:text-4xl font-black mb-2"
                style={{ color: colors.dark, letterSpacing: "-0.04em" }}
              >
                Edit Academics Page
              </h1>
              <p className="text-slate-500 text-sm">
                Click on any section below to expand and edit. Only the section you need will be visible.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-400 font-medium">
                {expandedCount} of {totalSections} sections open
              </span>
              
              {expandedCount < totalSections ? (
                <button
                  onClick={expandAll}
                  className="px-4 py-2 rounded-xl text-sm font-bold transition-all hover:scale-105"
                  style={{
                    background: "rgba(56,189,248,0.1)",
                    color: colors.cyan,
                    border: "1px solid rgba(56,189,248,0.2)",
                  }}
                >
                  Expand All
                </button>
              ) : (
                <button
                  onClick={collapseAll}
                  className="px-4 py-2 rounded-xl text-sm font-bold transition-all hover:scale-105"
                  style={{
                    background: "rgba(15,23,42,0.06)",
                    color: "rgba(15,23,42,0.5)",
                    border: "1px solid rgba(15,23,42,0.08)",
                  }}
                >
                  Collapse All
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {success && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-5 rounded-xl px-4 py-3 flex items-center gap-3 font-semibold text-sm"
            style={{ background: "rgba(22,138,58,0.08)", color: colors.green, border: "1px solid rgba(22,138,58,0.18)" }}
          >
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            {success}
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-5 rounded-xl px-4 py-3 font-semibold text-sm"
            style={{ background: "rgba(215,25,32,0.08)", color: colors.red, border: "1px solid rgba(215,25,32,0.18)" }}
          >
            {error}
          </motion.div>
        )}

        <div className="grid xl:grid-cols-[1fr_1.2fr] gap-6 items-start">
          {/* Left: Accordion sections */}
          <div className="space-y-3">
            {/* Hero Section */}
            <AccordionSection
              icon={sectionIcons.hero}
              title={sectionTitles.hero}
              color={sectionColors.hero}
              isExpanded={expandedSections.hero}
              onToggle={toggleSection}
              sectionId="hero"
              index={0}
            >
              <Field
                label="Hero Badge"
                value={form.heroBadge}
                onChange={(value) => updateField("heroBadge", value)}
              />
              <Field
                label="Hero Title"
                value={form.heroTitle}
                onChange={(value) => updateField("heroTitle", value)}
              />
              <Field
                label="Red Highlight Word"
                value={form.heroHighlight}
                onChange={(value) => updateField("heroHighlight", value)}
              />
              <TextArea
                label="Hero Description"
                value={form.heroDescription}
                onChange={(value) => updateField("heroDescription", value)}
                rows={4}
              />
            </AccordionSection>

            {/* Academic Programs */}
            <AccordionSection
              icon={sectionIcons.programs}
              title={sectionTitles.programs}
              color={sectionColors.programs}
              isExpanded={expandedSections.programs}
              onToggle={toggleSection}
              sectionId="programs"
              index={1}
            >
              <div className="flex justify-end mb-4">
                <button
                  type="button"
                  onClick={addProgram}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm text-white transition-all hover:scale-105"
                  style={{
                    background: `linear-gradient(135deg, ${colors.purple}, ${colors.green})`,
                  }}
                >
                  <Plus className="w-4 h-4" />
                  Add Program
                </button>
              </div>

              <div className="space-y-4">
                {form.programs.map((program, index) => (
                  <div
                    key={program.id}
                    className="rounded-xl p-4 space-y-4"
                    style={{
                      background: "rgba(15,23,42,0.03)",
                      border: "1px solid rgba(15,23,42,0.06)",
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-bold text-slate-900 text-sm">
                          Program {index + 1}
                        </div>
                        <div className="text-xs text-slate-400">{program.level}</div>
                      </div>
                      <VisibilityDeleteControls
                        visible={program.visible}
                        onToggle={() => updateProgram(program.id, "visible", !program.visible)}
                        onDelete={() => deleteProgram(program.id)}
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-3">
                      <Field
                        label="Level"
                        value={program.level}
                        onChange={(value) => updateProgram(program.id, "level", value)}
                      />
                      <Field
                        label="Span"
                        value={program.span}
                        onChange={(value) => updateProgram(program.id, "span", value)}
                      />
                      <Field
                        label="Accent Color"
                        type="color"
                        value={program.badgeColor}
                        onChange={(value) => {
                          updateProgram(program.id, "badgeColor", value);
                          updateProgram(program.id, "border", `${value}24`);
                        }}
                      />
                    </div>
                    <TextArea
                      label="Highlight"
                      value={program.highlight}
                      onChange={(value) => updateProgram(program.id, "highlight", value)}
                      rows={2}
                    />
                    <TextArea
                      label="Course Structure / Subjects - one per line"
                      value={(program.classes || []).join("\n")}
                      onChange={(value) =>
                        updateProgram(
                          program.id,
                          "classes",
                          value
                            .split("\n")
                            .map((item) => item.trim())
                            .filter(Boolean)
                        )
                      }
                      rows={4}
                    />
                  </div>
                ))}
              </div>
            </AccordionSection>

            {/* Curriculum & Books */}
            <AccordionSection
              icon={sectionIcons.curriculum}
              title={sectionTitles.curriculum}
              color={sectionColors.curriculum}
              isExpanded={expandedSections.curriculum}
              onToggle={toggleSection}
              sectionId="curriculum"
              index={2}
            >
              <p className="text-sm text-slate-500 mb-4">
                Manage subjects and publications for each grade level across all
                academic programs.
              </p>

              {Object.entries(form.curriculum || {}).map(([level, grades]) => {
                const isExpanded = expandedCurriculumLevel === level;

                const levelColor =
                  form.programs.find((p) => p.level === level)?.badgeColor ||
                  colors.purple;

                return (
                  <div key={level} className="mb-4 last:mb-0">
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedCurriculumLevel(isExpanded ? null : level)
                      }
                      className="w-full flex items-center justify-between p-3 rounded-xl transition-all"
                      style={{
                        background: isExpanded
                          ? `${levelColor}10`
                          : "rgba(15,23,42,0.03)",
                        border: `1px solid ${
                          isExpanded ? `${levelColor}30` : "rgba(15,23,42,0.06)"
                        }`,
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ background: levelColor }}
                        />
                        <span className="font-bold text-slate-900 text-sm">
                          {level}
                        </span>
                        <span className="text-xs text-slate-400">
                          ({grades.length} grades)
                        </span>
                      </div>
                      <span className="text-slate-400">
                        {isExpanded ? "−" : "+"}
                      </span>
                    </button>

                    {isExpanded && (
                      <div className="mt-3 space-y-3">
                        {grades.map((grade, gradeIndex) => {
                          const gradeAccentColor = gradeAccent(gradeIndex);

                          return (
                            <div
                              key={`${level}-grade-${gradeIndex}`}
                              className="rounded-xl p-4"
                              style={{
                                background: "rgba(255,255,255,0.6)",
                                border: `1px solid ${gradeAccentColor}22`,
                              }}
                            >
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex-1 mr-4">
                                  <Field
                                    label="Grade Name"
                                    value={grade.grade}
                                    onChange={(value) =>
                                      updateCurriculumGrade(
                                        level,
                                        gradeIndex,
                                        "grade",
                                        value
                                      )
                                    }
                                  />
                                </div>

                                <div className="flex items-center gap-2 mt-6">
                                  <button
                                    type="button"
                                    onClick={() => moveGrade(level, gradeIndex, -1)}
                                    disabled={gradeIndex === 0}
                                    className="p-2 rounded-xl disabled:opacity-35 disabled:cursor-not-allowed"
                                    style={{
                                      background: "rgba(75,46,131,0.08)",
                                      color: colors.purple,
                                      border: "1px solid rgba(75,46,131,0.18)",
                                    }}
                                    title="Move grade up"
                                  >
                                    <ArrowUp className="w-4 h-4" />
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => moveGrade(level, gradeIndex, 1)}
                                    disabled={gradeIndex === grades.length - 1}
                                    className="p-2 rounded-xl disabled:opacity-35 disabled:cursor-not-allowed"
                                    style={{
                                      background: "rgba(22,138,58,0.08)",
                                      color: colors.green,
                                      border: "1px solid rgba(22,138,58,0.18)",
                                    }}
                                    title="Move grade down"
                                  >
                                    <ArrowDown className="w-4 h-4" />
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => removeGrade(level, gradeIndex)}
                                    className="p-2 rounded-xl"
                                    style={{
                                      background: "rgba(215,25,32,0.09)",
                                      color: colors.red,
                                      border: "1px solid rgba(215,25,32,0.18)",
                                    }}
                                    title="Delete grade"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>

                              <div className="space-y-2">
                                {grade.books.map((book, bookIndex) => (
                                  <div
                                    key={`${level}-grade-${gradeIndex}-book-${bookIndex}`}
                                    className="grid md:grid-cols-12 gap-2 items-center p-3 rounded-xl"
                                    style={{
                                      background: "rgba(255,255,255,0.8)",
                                      border: "1px solid rgba(15,23,42,0.06)",
                                    }}
                                  >
                                    <div className="md:col-span-5">
                                      <Field
                                        label="Subject"
                                        value={book.subject}
                                        onChange={(value) =>
                                          updateBook(
                                            level,
                                            gradeIndex,
                                            bookIndex,
                                            "subject",
                                            value
                                          )
                                        }
                                      />
                                    </div>

                                    <div className="md:col-span-5">
                                      <Field
                                        label="Publication"
                                        value={book.publication}
                                        onChange={(value) =>
                                          updateBook(
                                            level,
                                            gradeIndex,
                                            bookIndex,
                                            "publication",
                                            value
                                          )
                                        }
                                      />
                                    </div>

                                    <div className="md:col-span-2">
                                      <button
                                        type="button"
                                        onClick={() =>
                                          removeBook(
                                            level,
                                            gradeIndex,
                                            bookIndex
                                          )
                                        }
                                        className="p-2 rounded-xl w-full"
                                        style={{
                                          background: "rgba(215,25,32,0.08)",
                                          color: colors.red,
                                          border:
                                            "1px solid rgba(215,25,32,0.15)",
                                        }}
                                      >
                                        <Trash2 className="w-4 h-4 mx-auto" />
                                      </button>
                                    </div>
                                  </div>
                                ))}

                                <button
                                  type="button"
                                  onClick={() =>
                                    addBookToGrade(level, gradeIndex)
                                  }
                                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all hover:scale-105"
                                  style={{
                                    color: colors.purple,
                                    background: "rgba(75,46,131,0.08)",
                                    border: `1px dashed ${colors.purple}44`,
                                  }}
                                >
                                  <Plus className="w-4 h-4" />
                                  Add Subject
                                </button>
                              </div>
                            </div>
                          );
                        })}

                        <button
                          type="button"
                          onClick={() => addGradeToLevel(level)}
                          className="flex items-center gap-2 px-4 py-3 rounded-xl font-bold text-sm transition-all hover:scale-105 w-full justify-center"
                          style={{
                            color: colors.green,
                            background: "rgba(22,138,58,0.08)",
                            border: `2px dashed ${colors.green}44`,
                          }}
                        >
                          <Plus className="w-4 h-4" />
                          Add New Grade
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </AccordionSection>

            {/* Features Section */}
            <AccordionSection
              icon={sectionIcons.features}
              title={sectionTitles.features}
              color={sectionColors.features}
              isExpanded={expandedSections.features}
              onToggle={toggleSection}
              sectionId="features"
              index={3}
            >
              <Field
                label="Features Title"
                value={form.featuresTitle}
                onChange={(value) => updateField("featuresTitle", value)}
              />
              <TextArea
                label="Features Description"
                value={form.featuresDescription}
                onChange={(value) => updateField("featuresDescription", value)}
                rows={3}
              />

              <div className="flex justify-end mt-2">
                <button
                  type="button"
                  onClick={addFeature}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm text-white transition-all hover:scale-105"
                  style={{
                    background: `linear-gradient(135deg, ${colors.purple}, ${colors.green})`,
                  }}
                >
                  <Plus className="w-4 h-4" />
                  Add Feature
                </button>
              </div>

              <div className="space-y-3 mt-4">
                {form.features.map((feature, index) => (
                  <div
                    key={feature.id}
                    className="rounded-xl p-4 space-y-3"
                    style={{
                      background: "rgba(15,23,42,0.03)",
                      border: "1px solid rgba(15,23,42,0.06)",
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-slate-900 text-sm">
                        Feature {index + 1}
                      </div>
                      <VisibilityDeleteControls
                        visible={feature.visible}
                        onToggle={() => updateFeature(feature.id, "visible", !feature.visible)}
                        onDelete={() => deleteFeature(feature.id)}
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-3">
                      <Field
                        label="Title"
                        value={feature.title}
                        onChange={(value) => updateFeature(feature.id, "title", value)}
                      />
                      <Field
                        label="Accent Color"
                        type="color"
                        value={feature.color}
                        onChange={(value) => updateFeature(feature.id, "color", value)}
                      />
                    </div>
                    <TextArea
                      label="Description"
                      value={feature.desc}
                      onChange={(value) => updateFeature(feature.id, "desc", value)}
                      rows={2}
                    />
                  </div>
                ))}
              </div>
            </AccordionSection>

            {/* Statistics */}
            <AccordionSection
              icon={sectionIcons.stats}
              title={sectionTitles.stats}
              color={sectionColors.stats}
              isExpanded={expandedSections.stats}
              onToggle={toggleSection}
              sectionId="stats"
              index={4}
            >
              <div className="flex justify-end mb-4">
                <button
                  type="button"
                  onClick={addStat}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm text-white transition-all hover:scale-105"
                  style={{
                    background: `linear-gradient(135deg, ${colors.purple}, ${colors.green})`,
                  }}
                >
                  <Plus className="w-4 h-4" />
                  Add Stat
                </button>
              </div>

              <div className="space-y-4">
                {form.stats.map((stat, index) => (
                  <div
                    key={stat.id}
                    className="rounded-xl p-4 space-y-3"
                    style={{
                      background: "rgba(15,23,42,0.03)",
                      border: "1px solid rgba(15,23,42,0.06)",
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-bold text-slate-900 text-sm">
                          Stat {index + 1}
                        </div>
                        <div className="text-xs text-slate-400">{stat.value} {stat.label}</div>
                      </div>
                      <VisibilityDeleteControls
                        visible={stat.visible}
                        onToggle={() => updateStat(stat.id, "visible", !stat.visible)}
                        onDelete={() => deleteStat(stat.id)}
                      />
                    </div>

                    <div className="grid md:grid-cols-3 gap-3">
                      <Field
                        label="Value"
                        value={stat.value}
                        onChange={(value) => updateStat(stat.id, "value", value)}
                      />
                      <Field
                        label="Label"
                        value={stat.label}
                        onChange={(value) => updateStat(stat.id, "label", value)}
                      />
                      <Field
                        label="Accent Color"
                        type="color"
                        value={stat.color}
                        onChange={(value) => updateStat(stat.id, "color", value)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </AccordionSection>

            {/* Examination System */}
            <AccordionSection
              icon={sectionIcons.exam}
              title={sectionTitles.exam}
              color={sectionColors.exam}
              isExpanded={expandedSections.exam}
              onToggle={toggleSection}
              sectionId="exam"
              index={5}
            >
              <Field
                label="Exam Section Title"
                value={form.examTitle}
                onChange={(value) => updateField("examTitle", value)}
              />
              <TextArea
                label="Exam Section Description"
                value={form.examDescription}
                onChange={(value) => updateField("examDescription", value)}
                rows={3}
              />
              <Field
                label="Continuous Evaluation Title"
                value={form.continuousTitle}
                onChange={(value) => updateField("continuousTitle", value)}
              />
              <TextArea
                label="Continuous Evaluation Description"
                value={form.continuousDescription}
                onChange={(value) => updateField("continuousDescription", value)}
                rows={3}
              />
              <TextArea
                label="Ongoing Assessments - one per line"
                value={(form.ongoingAssessments || []).join("\n")}
                onChange={(value) =>
                  updateField(
                    "ongoingAssessments",
                    value
                      .split("\n")
                      .map((item) => item.trim())
                      .filter(Boolean)
                  )
                }
                rows={4}
              />

              <div className="flex justify-end mt-2">
                <button
                  type="button"
                  onClick={addTimeline}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm text-white transition-all hover:scale-105"
                  style={{
                    background: `linear-gradient(135deg, ${colors.purple}, ${colors.green})`,
                  }}
                >
                  <Plus className="w-4 h-4" />
                  Add Exam Term
                </button>
              </div>

              <div className="space-y-3 mt-4">
                {form.timelineTerms.map((item, index) => (
                  <div
                    key={item.id}
                    className="rounded-xl p-4 space-y-3"
                    style={{
                      background: "rgba(15,23,42,0.03)",
                      border: "1px solid rgba(15,23,42,0.06)",
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-bold text-slate-900 text-sm">
                          Exam Term {index + 1}
                        </div>
                        <div className="text-xs text-slate-400">{item.term}</div>
                      </div>
                      <VisibilityDeleteControls
                        visible={item.visible}
                        onToggle={() => updateTimeline(item.id, "visible", !item.visible)}
                        onDelete={() => deleteTimeline(item.id)}
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-3">
                      <Field
                        label="Term"
                        value={item.term}
                        onChange={(value) => updateTimeline(item.id, "term", value)}
                      />
                      <Field
                        label="Timeframe"
                        value={item.timeframe}
                        onChange={(value) => updateTimeline(item.id, "timeframe", value)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </AccordionSection>

            {/* Bottom CTA */}
            <AccordionSection
              icon={sectionIcons.cta}
              title={sectionTitles.cta}
              color={sectionColors.cta}
              isExpanded={expandedSections.cta}
              onToggle={toggleSection}
              sectionId="cta"
              index={6}
            >
              <Field
                label="CTA Title"
                value={form.ctaTitle}
                onChange={(value) => updateField("ctaTitle", value)}
              />
              <TextArea
                label="CTA Description"
                value={form.ctaDescription}
                onChange={(value) => updateField("ctaDescription", value)}
                rows={3}
              />
              <div className="grid md:grid-cols-2 gap-3">
                <Field
                  label="Primary Button Text"
                  value={form.primaryButtonText}
                  onChange={(value) => updateField("primaryButtonText", value)}
                />
                <Field
                  label="Primary Button Link"
                  value={form.primaryButtonLink}
                  onChange={(value) => updateField("primaryButtonLink", value)}
                />
                <Field
                  label="Secondary Button Text"
                  value={form.secondaryButtonText}
                  onChange={(value) => updateField("secondaryButtonText", value)}
                />
                <Field
                  label="Secondary Button Link"
                  value={form.secondaryButtonLink}
                  onChange={(value) => updateField("secondaryButtonLink", value)}
                />
              </div>
            </AccordionSection>
          </div>

          {/* Right: Preview */}
          <aside
            className="xl:sticky xl:top-24 rounded-2xl overflow-hidden"
            style={{
              background: "linear-gradient(145deg, rgba(15,23,42,0.98), rgba(30,41,59,0.94))",
              border: "1px solid rgba(255,255,255,0.1)",
              boxShadow: "0 20px 60px rgba(11,16,32,0.3)",
            }}
          >
            <div
              className="px-5 py-4 flex items-center justify-between"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: "rgba(56,189,248,0.12)" }}
                >
                  <Eye className="w-4 h-4" style={{ color: colors.cyan }} />
                </div>
                <div>
                  <div className="text-white font-bold text-sm">Academics Page Preview</div>
                  <div className="text-white/45 text-xs">Updates live while typing</div>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-400/60" />
              </div>
            </div>

            <div className="bg-white overflow-y-auto" style={{ height: "720px" }}>
              <AcademicsPreview form={form} />
            </div>
          </aside>
        </div>
      </main>
    </section>
  );
}