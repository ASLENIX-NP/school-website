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
    ],
  },
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
    curriculum: saved.curriculum || defaultAcademicsContent.curriculum,
  };
}

function Field({ label, value, onChange, placeholder = "", type = "text" }) {
  return (
    <div>
      <label className="block text-sm font-bold mb-2 text-slate-700">
        {label}
      </label>

      <input
        type={type}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-2xl outline-none text-sm"
        style={{
          background: "rgba(255,255,255,0.88)",
          border: "1px solid rgba(75,46,131,0.16)",
          color: colors.dark,
        }}
      />
    </div>
  );
}

function TextArea({ label, value, onChange, placeholder = "", rows = 4 }) {
  return (
    <div>
      <label className="block text-sm font-bold mb-2 text-slate-700">
        {label}
      </label>

      <textarea
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full px-4 py-3 rounded-2xl outline-none text-sm resize-none"
        style={{
          background: "rgba(255,255,255,0.88)",
          border: "1px solid rgba(75,46,131,0.16)",
          color: colors.dark,
        }}
      />
    </div>
  );
}

function EditorCard({ icon: Icon, title, color, children }) {
  return (
    <div
      className="rounded-3xl p-6 md:p-8"
      style={{
        background:
          "linear-gradient(145deg, rgba(255,255,255,0.96), rgba(255,255,255,0.78))",
        border: "1px solid rgba(11,16,32,0.08)",
        boxShadow:
          "0 18px 48px rgba(11,16,32,0.075), inset 0 1px 0 rgba(255,255,255,0.85)",
      }}
    >
      <div className="flex items-center gap-3 mb-6">
        <Icon className="w-5 h-5" style={{ color }} />
        <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
      </div>

      {children}
    </div>
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

// Preview component - shows ONLY program cards without curriculum books
function AcademicsPreview({ form }) {
  const visiblePrograms = (form.programs || []).filter(
    (item) => item.visible !== false
  );
  const visibleFeatures = (form.features || []).filter(
    (item) => item.visible !== false
  );
  const visibleStats = (form.stats || []).filter((item) => item.visible !== false);
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
      {/* Hero Section */}
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

      {/* Academic Programs - Only shows program cards */}
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

      {/* Features Section */}
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

      {/* Statistics */}
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

      {/* Examination System */}
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

      {/* CTA */}
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

  const updateField = (name, value) => {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const updateProgram = (id, field, value) => {
    setForm((prev) => ({
      ...prev,
      programs: prev.programs.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
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
        [newProgram.level]: [{ grade: "New Grade", books: [{ subject: "New Subject", publication: "New Publication" }] }],
      },
    }));
  };

  const deleteProgram = (id) => {
    const programToDelete = form.programs.find(p => p.id === id);
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

  // Curriculum management functions
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
            books: [...item.books, { subject: "New Subject", publication: "New Publication" }],
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
          const filteredBooks = item.books.filter((_, bidx) => bidx !== bookIndex);
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
          { grade: `New Grade`, books: [{ subject: "New Subject", publication: "New Publication" }] },
        ],
      },
    }));
  };

  const removeGrade = (level, gradeIndex) => {
    setForm((prev) => {
      const filteredGrades = prev.curriculum[level].filter((_, idx) => idx !== gradeIndex);
      return {
        ...prev,
        curriculum: {
          ...prev.curriculum,
          [level]: filteredGrades,
        },
      };
    });
  };

  async function saveAcademicsContent() {
    setSuccess("");
    setError("");
    setSaving(true);

    try {
      await axios.put(
        "http://localhost:5000/api/site-content/academics",
        { content: form },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

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

  const ACCENT_SEQUENCE = [colors.red, colors.green, colors.purple, colors.softPurple];
  const gradeAccent = (index) => ACCENT_SEQUENCE[index % ACCENT_SEQUENCE.length];

  return (
    <section
    className="min-h-screen relative"
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
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate("/admin/dashboard")}
            className="inline-flex items-center gap-2 text-white font-bold"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </button>

          <div className="flex items-center gap-3">
            <a
              href="/academics"
              target="_blank"
              rel="noreferrer"
              className="hidden md:inline-flex items-center gap-2 px-4 py-3 rounded-2xl font-bold text-white transition-all hover:scale-105"
              style={{
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.14)",
              }}
            >
              <ExternalLink className="w-4 h-4" />
              View Academics Page
            </a>

            <button
              type="button"
              onClick={saveAcademicsContent}
              disabled={saving}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl font-bold transition-all hover:scale-105 disabled:opacity-60"
              style={{
                color: "#020617",
                background: `linear-gradient(135deg, ${colors.gold}, ${colors.cyan})`,
                boxShadow:
                  "0 18px 42px rgba(56,189,248,0.28), inset 0 1px 0 rgba(255,255,255,0.45)",
              }}
            >
              <Save className="w-4 h-4" />
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-6 py-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <span
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold mb-5"
            style={{
              background: "rgba(75,46,131,0.1)",
              color: colors.purple,
              border: "1px solid rgba(75,46,131,0.2)",
            }}
          >
            <BookOpen className="w-4 h-4" />
            Manage Academics Page
          </span>

          <h1
            className="text-4xl md:text-6xl mb-4"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 850,
              color: colors.dark,
              letterSpacing: "-0.045em",
            }}
          >
            Edit Academics Page
          </h1>

          <p className="text-slate-500 max-w-3xl text-lg">
            Edit academic hero, programs, features, statistics, examination
            system, ongoing assessments, and CTA buttons. Manage curriculum books
            and publications for each grade level.
          </p>
        </motion.div>

        {success && (
          <div
            className="mb-6 rounded-2xl px-5 py-4 flex items-center gap-3 font-semibold"
            style={{
              background: "rgba(22,138,58,0.1)",
              color: colors.green,
              border: "1px solid rgba(22,138,58,0.2)",
            }}
          >
            <CheckCircle2 className="w-5 h-5" />
            {success}
          </div>
        )}

        {error && (
          <div
            className="mb-6 rounded-2xl px-5 py-4 font-semibold"
            style={{
              background: "rgba(215,25,32,0.1)",
              color: colors.red,
              border: "1px solid rgba(215,25,32,0.2)",
            }}
          >
            {error}
          </div>
        )}

        {/* Changed to items-start with proper sticky positioning */}
        <div className="grid xl:grid-cols-[780px_1fr] gap-8 items-start relative">
          <div className="space-y-8">
            <EditorCard icon={Type} title="Hero Section" color={colors.purple}>
              <div className="grid gap-5">
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
              </div>
            </EditorCard>

            <EditorCard
              icon={BookOpen}
              title="Academic Programs"
              color={colors.green}
            >
              <div className="flex justify-end mb-6">
                <button
                  type="button"
                  onClick={addProgram}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-white"
                  style={{
                    background: `linear-gradient(135deg, ${colors.purple}, ${colors.green})`,
                  }}
                >
                  <Plus className="w-4 h-4" />
                  Add Program
                </button>
              </div>

              <div className="space-y-5">
                {form.programs.map((program, index) => (
                  <div
                    key={program.id}
                    className="rounded-3xl p-5"
                    style={{
                      background: "rgba(15,23,42,0.04)",
                      border: "1px solid rgba(15,23,42,0.08)",
                    }}
                  >
                    <div className="flex items-center justify-between mb-5">
                      <div>
                        <div className="font-black text-slate-950">
                          Program {index + 1}
                        </div>
                        <div className="text-sm text-slate-500">
                          {program.level}
                        </div>
                      </div>

                      <VisibilityDeleteControls
                        visible={program.visible}
                        onToggle={() =>
                          updateProgram(
                            program.id,
                            "visible",
                            !program.visible
                          )
                        }
                        onDelete={() => deleteProgram(program.id)}
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <Field
                        label="Level"
                        value={program.level}
                        onChange={(value) =>
                          updateProgram(program.id, "level", value)
                        }
                      />

                      <Field
                        label="Span"
                        value={program.span}
                        onChange={(value) =>
                          updateProgram(program.id, "span", value)
                        }
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

                    <div className="mt-4">
                      <TextArea
                        label="Highlight"
                        value={program.highlight}
                        onChange={(value) =>
                          updateProgram(program.id, "highlight", value)
                        }
                        rows={3}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </EditorCard>

            <EditorCard
              icon={Library}
              title="Curriculum & Books"
              color={colors.purple}
            >
              <p className="text-sm text-slate-500 mb-6">
                Manage subjects and publications for each grade level across all academic programs.
                These appear in the ledger modal on the public Academics page.
              </p>

              {Object.entries(form.curriculum || {}).map(([level, grades]) => {
                const isExpanded = expandedCurriculumLevel === level;
                const levelColor = form.programs.find(p => p.level === level)?.badgeColor || colors.purple;

                return (
                  <div key={level} className="mb-6 last:mb-0">
                    <button
                      onClick={() => setExpandedCurriculumLevel(isExpanded ? null : level)}
                      className="w-full flex items-center justify-between p-4 rounded-2xl transition-all"
                      style={{
                        background: isExpanded ? "rgba(75,46,131,0.08)" : "rgba(15,23,42,0.04)",
                        border: `1px solid ${isExpanded ? levelColor : "rgba(15,23,42,0.08)"}`,
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ background: levelColor }}
                        />
                        <span className="font-bold text-slate-950">{level}</span>
                        <span className="text-sm text-slate-400">
                          ({grades.length} grades)
                        </span>
                      </div>
                      <span className="text-slate-400">
                        {isExpanded ? "−" : "+"}
                      </span>
                    </button>

                    {isExpanded && (
                      <div className="mt-4 space-y-4">
                        {grades.map((grade, gradeIndex) => {
                          const gradeAccentColor = gradeAccent(gradeIndex);
                          return (
                            <div
                              key={gradeIndex}
                              className="rounded-2xl p-5"
                              style={{
                                background: "rgba(255,255,255,0.6)",
                                border: `1px solid ${gradeAccentColor}22`,
                              }}
                            >
                              <div className="flex items-center justify-between mb-4">
                                <div className="flex-1 mr-4">
                                  <Field
                                    label="Grade Name"
                                    value={grade.grade}
                                    onChange={(value) =>
                                      updateCurriculumGrade(level, gradeIndex, "grade", value)
                                    }
                                  />
                                </div>
                                <button
                                  type="button"
                                  onClick={() => removeGrade(level, gradeIndex)}
                                  className="p-2 rounded-xl mt-6"
                                  style={{
                                    background: "rgba(215,25,32,0.09)",
                                    color: colors.red,
                                    border: "1px solid rgba(215,25,32,0.18)",
                                  }}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>

                              <div className="space-y-3">
                                {grade.books.map((book, bookIndex) => (
                                  <div
                                    key={bookIndex}
                                    className="grid md:grid-cols-12 gap-3 items-center p-3 rounded-xl"
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
                                          updateBook(level, gradeIndex, bookIndex, "subject", value)
                                        }
                                      />
                                    </div>
                                    <div className="md:col-span-5">
                                      <Field
                                        label="Publication"
                                        value={book.publication}
                                        onChange={(value) =>
                                          updateBook(level, gradeIndex, bookIndex, "publication", value)
                                        }
                                      />
                                    </div>
                                    <div className="md:col-span-2">
                                      <button
                                        type="button"
                                        onClick={() => removeBook(level, gradeIndex, bookIndex)}
                                        className="p-3 rounded-xl w-full"
                                        style={{
                                          background: "rgba(215,25,32,0.08)",
                                          color: colors.red,
                                          border: "1px solid rgba(215,25,32,0.15)",
                                        }}
                                      >
                                        <Trash2 className="w-4 h-4 mx-auto" />
                                      </button>
                                    </div>
                                  </div>
                                ))}

                                <button
                                  type="button"
                                  onClick={() => addBookToGrade(level, gradeIndex)}
                                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all hover:scale-105"
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
                          className="flex items-center gap-2 px-4 py-3 rounded-2xl font-bold transition-all hover:scale-105 w-full justify-center"
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
            </EditorCard>

            <EditorCard icon={Award} title="Features Section" color={colors.red}>
              <div className="grid gap-5 mb-6">
                <Field
                  label="Features Title"
                  value={form.featuresTitle}
                  onChange={(value) => updateField("featuresTitle", value)}
                />

                <TextArea
                  label="Features Description"
                  value={form.featuresDescription}
                  onChange={(value) =>
                    updateField("featuresDescription", value)
                  }
                  rows={3}
                />
              </div>

              <div className="flex justify-end mb-6">
                <button
                  type="button"
                  onClick={addFeature}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-white"
                  style={{
                    background: `linear-gradient(135deg, ${colors.purple}, ${colors.green})`,
                  }}
                >
                  <Plus className="w-4 h-4" />
                  Add Feature
                </button>
              </div>

              <div className="space-y-5">
                {form.features.map((feature, index) => (
                  <div
                    key={feature.id}
                    className="rounded-3xl p-5"
                    style={{
                      background: "rgba(15,23,42,0.04)",
                      border: "1px solid rgba(15,23,42,0.08)",
                    }}
                  >
                    <div className="flex items-center justify-between mb-5">
                      <div>
                        <div className="font-black text-slate-950">
                          Feature {index + 1}
                        </div>
                        <div className="text-sm text-slate-500">
                          {feature.title}
                        </div>
                      </div>

                      <VisibilityDeleteControls
                        visible={feature.visible}
                        onToggle={() =>
                          updateFeature(
                            feature.id,
                            "visible",
                            !feature.visible
                          )
                        }
                        onDelete={() => deleteFeature(feature.id)}
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <Field
                        label="Title"
                        value={feature.title}
                        onChange={(value) =>
                          updateFeature(feature.id, "title", value)
                        }
                      />

                      <Field
                        label="Accent Color"
                        type="color"
                        value={feature.color}
                        onChange={(value) =>
                          updateFeature(feature.id, "color", value)
                        }
                      />
                    </div>

                    <div className="mt-4">
                      <TextArea
                        label="Description"
                        value={feature.desc}
                        onChange={(value) =>
                          updateFeature(feature.id, "desc", value)
                        }
                        rows={3}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </EditorCard>

            <EditorCard icon={Users} title="Statistics" color={colors.purple}>
              <div className="flex justify-end mb-6">
                <button
                  type="button"
                  onClick={addStat}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-white"
                  style={{
                    background: `linear-gradient(135deg, ${colors.purple}, ${colors.green})`,
                  }}
                >
                  <Plus className="w-4 h-4" />
                  Add Stat
                </button>
              </div>

              <div className="space-y-5">
                {form.stats.map((stat, index) => (
                  <div
                    key={stat.id}
                    className="rounded-3xl p-5"
                    style={{
                      background: "rgba(15,23,42,0.04)",
                      border: "1px solid rgba(15,23,42,0.08)",
                    }}
                  >
                    <div className="flex items-center justify-between mb-5">
                      <div>
                        <div className="font-black text-slate-950">
                          Stat {index + 1}
                        </div>
                        <div className="text-sm text-slate-500">
                          {stat.value} {stat.label}
                        </div>
                      </div>

                      <VisibilityDeleteControls
                        visible={stat.visible}
                        onToggle={() =>
                          updateStat(stat.id, "visible", !stat.visible)
                        }
                        onDelete={() => deleteStat(stat.id)}
                      />
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                      <Field
                        label="Value"
                        value={stat.value}
                        onChange={(value) =>
                          updateStat(stat.id, "value", value)
                        }
                      />

                      <Field
                        label="Label"
                        value={stat.label}
                        onChange={(value) =>
                          updateStat(stat.id, "label", value)
                        }
                      />

                      <Field
                        label="Accent Color"
                        type="color"
                        value={stat.color}
                        onChange={(value) =>
                          updateStat(stat.id, "color", value)
                        }
                      />
                    </div>
                  </div>
                ))}
              </div>
            </EditorCard>

            <EditorCard
              icon={Calendar}
              title="Examination System"
              color={colors.green}
            >
              <div className="grid gap-5">
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
                  onChange={(value) =>
                    updateField("continuousDescription", value)
                  }
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
                  rows={5}
                />
              </div>

              <div className="flex justify-end my-6">
                <button
                  type="button"
                  onClick={addTimeline}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-white"
                  style={{
                    background: `linear-gradient(135deg, ${colors.purple}, ${colors.green})`,
                  }}
                >
                  <Plus className="w-4 h-4" />
                  Add Exam Term
                </button>
              </div>

              <div className="space-y-5">
                {form.timelineTerms.map((item, index) => (
                  <div
                    key={item.id}
                    className="rounded-3xl p-5"
                    style={{
                      background: "rgba(15,23,42,0.04)",
                      border: "1px solid rgba(15,23,42,0.08)",
                    }}
                  >
                    <div className="flex items-center justify-between mb-5">
                      <div>
                        <div className="font-black text-slate-950">
                          Exam Term {index + 1}
                        </div>
                        <div className="text-sm text-slate-500">
                          {item.term}
                        </div>
                      </div>

                      <VisibilityDeleteControls
                        visible={item.visible}
                        onToggle={() =>
                          updateTimeline(item.id, "visible", !item.visible)
                        }
                        onDelete={() => deleteTimeline(item.id)}
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <Field
                        label="Term"
                        value={item.term}
                        onChange={(value) =>
                          updateTimeline(item.id, "term", value)
                        }
                      />

                      <Field
                        label="Timeframe"
                        value={item.timeframe}
                        onChange={(value) =>
                          updateTimeline(item.id, "timeframe", value)
                        }
                      />
                    </div>
                  </div>
                ))}
              </div>
            </EditorCard>

            <EditorCard icon={Target} title="Bottom CTA" color={colors.red}>
              <div className="grid gap-5">
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

                <div className="grid md:grid-cols-2 gap-4">
                  <Field
                    label="Primary Button Text"
                    value={form.primaryButtonText}
                    onChange={(value) =>
                      updateField("primaryButtonText", value)
                    }
                  />

                  <Field
                    label="Primary Button Link"
                    value={form.primaryButtonLink}
                    onChange={(value) =>
                      updateField("primaryButtonLink", value)
                    }
                  />

                  <Field
                    label="Secondary Button Text"
                    value={form.secondaryButtonText}
                    onChange={(value) =>
                      updateField("secondaryButtonText", value)
                    }
                  />

                  <Field
                    label="Secondary Button Link"
                    value={form.secondaryButtonLink}
                    onChange={(value) =>
                      updateField("secondaryButtonLink", value)
                    }
                  />
                </div>
              </div>
            </EditorCard>
          </div>

          {/* Sticky preview - properly positioned */}
          <div
  className="xl:sticky xl:top-24 self-start"
  style={{
    maxHeight: "calc(100vh - 120px)",
  }}
>
            <div
              className="rounded-3xl overflow-hidden"
              style={{
                background:
                  "linear-gradient(145deg, rgba(15,23,42,0.98), rgba(30,41,59,0.94))",
                border: "1px solid rgba(255,255,255,0.14)",
                boxShadow: "0 22px 58px rgba(11,16,32,0.25)",
              }}
            >
              <div className="p-5 border-b border-white/10">
                <div className="text-white font-bold text-lg flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Academics Page Preview
                </div>

                <div className="text-sm text-white/55">
                  Full preview updates while editing. Scroll to see all content.
                </div>
              </div>

              <div
  className="bg-white overflow-y-auto"
  style={{
    maxHeight: "calc(100vh - 180px)",
  }}
>
                <AcademicsPreview form={form} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </section>
  );
}