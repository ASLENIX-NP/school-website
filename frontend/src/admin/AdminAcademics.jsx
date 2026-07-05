import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router-dom";
import {
  AlertCircle,
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  BookOpen,
  CheckCircle2,
  ExternalLink,
  Eye,
  GraduationCap,
  Pencil,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react";

import {
  Academics,
  defaultAcademicsContent,
  mergeAcademicsContent,
} from "../app/components/Academics";

const colors = {
  red: "#D71920",
  green: "#168A3A",
  purple: "#4B2E83",
  softPurple: "#7C5CC4",
  dark: "#0B1020",
  cyan: "#38BDF8",
  gold: "#FACC15",
};

const cardColors = [
  "#4B2E83",
  "#168A3A",
  "#D71920",
  "#38BDF8",
  "#F97316",
  "#FACC15",
  "#14B8A6",
  "#8B5CF6",
];

function cloneJson(value) {
  return JSON.parse(JSON.stringify(value));
}

function getAuthHeaders() {
  const token = localStorage.getItem("adminToken");

  if (!token) return null;

  return {
    Authorization: `Bearer ${token}`,
  };
}

function Field({
  label,
  value,
  onChange,
  placeholder = "",
  textarea = false,
  type = "text",
  rows = 4,
}) {
  return (
    <div>
      <label className="block text-sm font-black mb-2 text-slate-700">
        {label}
      </label>

      {textarea ? (
        <textarea
          value={value || ""}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          rows={rows}
          className="w-full px-4 py-3 rounded-2xl outline-none text-sm resize-none"
          style={{
            background: "rgba(255,255,255,0.92)",
            border: "1px solid rgba(75,46,131,0.16)",
            color: colors.dark,
          }}
        />
      ) : (
        <input
          type={type}
          value={value || ""}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="w-full px-4 py-3 rounded-2xl outline-none text-sm"
          style={{
            background: type === "color" ? "#FFFFFF" : "rgba(255,255,255,0.92)",
            border: "1px solid rgba(75,46,131,0.16)",
            color: colors.dark,
            minHeight: type === "color" ? "48px" : "auto",
          }}
        />
      )}
    </div>
  );
}

function Toggle({ checked, onChange, label }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="w-full flex items-center justify-between gap-4 rounded-2xl px-4 py-3 text-left"
      style={{
        background: checked
          ? "rgba(22,138,58,0.08)"
          : "rgba(100,116,139,0.08)",
        border: checked
          ? "1px solid rgba(22,138,58,0.18)"
          : "1px solid rgba(100,116,139,0.18)",
      }}
    >
      <span className="text-sm font-black text-slate-700">{label}</span>

      <span
        className="relative w-12 h-7 rounded-full transition-all"
        style={{
          background: checked ? colors.green : "#CBD5E1",
        }}
      >
        <span
          className="absolute top-1 w-5 h-5 rounded-full bg-white transition-all shadow"
          style={{
            left: checked ? "24px" : "4px",
          }}
        />
      </span>
    </button>
  );
}

function getDeleteName(target) {
  if (!target) return "this item";

  if (target.type === "program") return "this academic program and its curriculum";
  if (target.type === "feature") return "this academic feature";
  if (target.type === "stat") return "this statistic";
  if (target.type === "timeline") return "this exam term";

  return "this item";
}

function sanitizeGrades(grades = []) {
  return grades.map((grade) => ({
    grade: grade.grade || "New Grade",
    books: Array.isArray(grade.books)
      ? grade.books.map((book) => ({
          subject: book.subject || "New Subject",
          publication: book.publication || "New Publication",
        }))
      : [],
  }));
}

export default function AdminAcademics() {
  const navigate = useNavigate();

  const [form, setForm] = useState(defaultAcademicsContent);
  const [loading, setLoading] = useState(true);
  const [editingTarget, setEditingTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [modalForm, setModalForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const loadAcademicsContent = async () => {
      try {
        const res = await axios.get(
          "https://school-website-backend-ixx2.onrender.com/api/site-content/academics"
        );

        const savedContent = res.data?.data?.content || {};
        setForm(mergeAcademicsContent(savedContent));
      } catch (err) {
        console.error("Load academics content error:", err);
        setError("Could not load saved academics content. Default content shown.");
      } finally {
        setLoading(false);
      }
    };

    loadAcademicsContent();
  }, []);

  const updateModalField = (name, value) => {
    setModalForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const saveContentToBackend = async (nextForm, message) => {
    const authHeaders = getAuthHeaders();

    if (!authHeaders) {
      setError("Admin login expired. Please logout and login again.");
      return false;
    }

    const cleanContent = mergeAcademicsContent({
      ...nextForm,
      _contentVersion: 2,
    });

    await axios.put(
      "https://school-website-backend-ixx2.onrender.com/api/site-content/academics",
      { content: cleanContent },
      { headers: authHeaders }
    );

    setForm(cleanContent);
    setSuccess(message || "Academics page updated successfully.");
    return true;
  };

  const openEditor = (target) => {
    setSuccess("");
    setError("");
    setEditingTarget(target);

    if (target.type === "hero") {
      setModalForm({
        heroBadge: form.heroBadge || "",
        heroTitle: form.heroTitle || "",
        heroHighlight: form.heroHighlight || "",
        heroDescription: form.heroDescription || "",
      });
      return;
    }

    if (target.type === "program") {
      const item = form.programs?.[target.index] || {};
      const curriculumGrades = Array.isArray(form.curriculum?.[item.level])
        ? cloneJson(form.curriculum[item.level])
        : [
            {
              grade: "New Grade",
              books: [
                { subject: "New Subject", publication: "New Publication" },
              ],
            },
          ];

      setModalForm({
        oldLevel: item.level || "",
        level: item.level || "",
        span: item.span || "",
        badgeColor: item.badgeColor || colors.green,
        highlight: item.highlight || "",
        classesText: Array.isArray(item.classes) ? item.classes.join("\n") : "",
        visible: item.visible !== false,
        curriculumGrades,
      });
      return;
    }

    if (target.type === "featuresHeader") {
      setModalForm({
        featuresTitle: form.featuresTitle || "",
        featuresDescription: form.featuresDescription || "",
      });
      return;
    }

    if (target.type === "feature") {
      const item = form.features?.[target.index] || {};

      setModalForm({
        title: item.title || "",
        desc: item.desc || "",
        emoji: item.emoji || "📘",
        color: item.color || colors.green,
        visible: item.visible !== false,
      });
      return;
    }

    if (target.type === "stat") {
      const item = form.stats?.[target.index] || {};

      setModalForm({
        value: item.value || "",
        label: item.label || "",
        icon: item.icon || "users",
        color: item.color || colors.green,
        visible: item.visible !== false,
      });
      return;
    }

    if (target.type === "examHeader") {
      setModalForm({
        examTitle: form.examTitle || "",
        examDescription: form.examDescription || "",
      });
      return;
    }

    if (target.type === "timeline") {
      const item = form.timelineTerms?.[target.index] || {};

      setModalForm({
        term: item.term || "",
        timeframe: item.timeframe || "",
        visible: item.visible !== false,
      });
      return;
    }

    if (target.type === "continuous") {
      setModalForm({
        continuousTitle: form.continuousTitle || "",
        continuousDescription: form.continuousDescription || "",
        ongoingAssessmentsText: Array.isArray(form.ongoingAssessments)
          ? form.ongoingAssessments.join("\n")
          : "",
      });
      return;
    }

    if (target.type === "cta") {
      setModalForm({
        ctaTitle: form.ctaTitle || "",
        ctaDescription: form.ctaDescription || "",
        primaryButtonText: form.primaryButtonText || "",
        primaryButtonLink: form.primaryButtonLink || "",
        secondaryButtonText: form.secondaryButtonText || "",
        secondaryButtonLink: form.secondaryButtonLink || "",
      });
    }
  };

  const closeEditor = () => {
    if (saving) return;
    setEditingTarget(null);
    setModalForm({});
  };

  const updateModalGrade = (gradeIndex, field, value) => {
    setModalForm((prev) => {
      const grades = Array.isArray(prev.curriculumGrades)
        ? [...prev.curriculumGrades]
        : [];

      grades[gradeIndex] = {
        ...grades[gradeIndex],
        [field]: value,
      };

      return {
        ...prev,
        curriculumGrades: grades,
      };
    });
  };

  const addModalGrade = () => {
    setModalForm((prev) => ({
      ...prev,
      curriculumGrades: [
        ...(Array.isArray(prev.curriculumGrades) ? prev.curriculumGrades : []),
        {
          grade: "New Grade",
          books: [
            { subject: "New Subject", publication: "New Publication" },
          ],
        },
      ],
    }));
  };

  const removeModalGrade = (gradeIndex) => {
    setModalForm((prev) => ({
      ...prev,
      curriculumGrades: (prev.curriculumGrades || []).filter(
        (_, index) => index !== gradeIndex
      ),
    }));
  };

  const moveModalGrade = (gradeIndex, direction) => {
    setModalForm((prev) => {
      const grades = Array.isArray(prev.curriculumGrades)
        ? [...prev.curriculumGrades]
        : [];
      const targetIndex = gradeIndex + direction;

      if (targetIndex < 0 || targetIndex >= grades.length) return prev;

      const temp = grades[gradeIndex];
      grades[gradeIndex] = grades[targetIndex];
      grades[targetIndex] = temp;

      return {
        ...prev,
        curriculumGrades: grades,
      };
    });
  };

  const addModalBook = (gradeIndex) => {
    setModalForm((prev) => {
      const grades = Array.isArray(prev.curriculumGrades)
        ? [...prev.curriculumGrades]
        : [];

      grades[gradeIndex] = {
        ...grades[gradeIndex],
        books: [
          ...(Array.isArray(grades[gradeIndex]?.books)
            ? grades[gradeIndex].books
            : []),
          { subject: "New Subject", publication: "New Publication" },
        ],
      };

      return {
        ...prev,
        curriculumGrades: grades,
      };
    });
  };

  const updateModalBook = (gradeIndex, bookIndex, field, value) => {
    setModalForm((prev) => {
      const grades = Array.isArray(prev.curriculumGrades)
        ? [...prev.curriculumGrades]
        : [];
      const books = Array.isArray(grades[gradeIndex]?.books)
        ? [...grades[gradeIndex].books]
        : [];

      books[bookIndex] = {
        ...books[bookIndex],
        [field]: value,
      };

      grades[gradeIndex] = {
        ...grades[gradeIndex],
        books,
      };

      return {
        ...prev,
        curriculumGrades: grades,
      };
    });
  };

  const removeModalBook = (gradeIndex, bookIndex) => {
    setModalForm((prev) => {
      const grades = Array.isArray(prev.curriculumGrades)
        ? [...prev.curriculumGrades]
        : [];

      grades[gradeIndex] = {
        ...grades[gradeIndex],
        books: (grades[gradeIndex]?.books || []).filter(
          (_, index) => index !== bookIndex
        ),
      };

      return {
        ...prev,
        curriculumGrades: grades,
      };
    });
  };

  const saveSelectedPart = async () => {
    if (!editingTarget) return;

    setSaving(true);
    setSuccess("");
    setError("");

    try {
      let nextForm = mergeAcademicsContent(form);

      if (editingTarget.type === "hero") {
        nextForm = {
          ...nextForm,
          heroBadge: modalForm.heroBadge || "",
          heroTitle: modalForm.heroTitle || "",
          heroHighlight: modalForm.heroHighlight || "",
          heroDescription: modalForm.heroDescription || "",
        };
      }

      if (editingTarget.type === "program") {
        const oldLevel = modalForm.oldLevel || nextForm.programs[editingTarget.index]?.level;
        const nextLevel = modalForm.level || "New Academic Level";
        const nextCurriculum = { ...(nextForm.curriculum || {}) };

        if (oldLevel && oldLevel !== nextLevel) {
          delete nextCurriculum[oldLevel];
        }

        nextCurriculum[nextLevel] = sanitizeGrades(modalForm.curriculumGrades || []);

        nextForm = {
          ...nextForm,
          programs: nextForm.programs.map((item, index) =>
            index === editingTarget.index
              ? {
                  ...item,
                  level: nextLevel,
                  span: modalForm.span || "",
                  badgeColor: modalForm.badgeColor || colors.green,
                  border: `${modalForm.badgeColor || colors.green}24`,
                  highlight: modalForm.highlight || "",
                  classes: (modalForm.classesText || "")
                    .split("\n")
                    .map((subject) => subject.trim())
                    .filter(Boolean),
                  visible: modalForm.visible !== false,
                }
              : item
          ),
          curriculum: nextCurriculum,
        };
      }

      if (editingTarget.type === "featuresHeader") {
        nextForm = {
          ...nextForm,
          featuresTitle: modalForm.featuresTitle || "",
          featuresDescription: modalForm.featuresDescription || "",
        };
      }

      if (editingTarget.type === "feature") {
        nextForm = {
          ...nextForm,
          features: nextForm.features.map((item, index) =>
            index === editingTarget.index
              ? {
                  ...item,
                  title: modalForm.title || "",
                  desc: modalForm.desc || "",
                  emoji: modalForm.emoji || "📘",
                  color: modalForm.color || colors.green,
                  visible: modalForm.visible !== false,
                }
              : item
          ),
        };
      }

      if (editingTarget.type === "stat") {
        nextForm = {
          ...nextForm,
          stats: nextForm.stats.map((item, index) =>
            index === editingTarget.index
              ? {
                  ...item,
                  value: modalForm.value || "",
                  label: modalForm.label || "",
                  icon: modalForm.icon || "users",
                  color: modalForm.color || colors.green,
                  visible: modalForm.visible !== false,
                }
              : item
          ),
        };
      }

      if (editingTarget.type === "examHeader") {
        nextForm = {
          ...nextForm,
          examTitle: modalForm.examTitle || "",
          examDescription: modalForm.examDescription || "",
        };
      }

      if (editingTarget.type === "timeline") {
        nextForm = {
          ...nextForm,
          timelineTerms: nextForm.timelineTerms.map((item, index) =>
            index === editingTarget.index
              ? {
                  ...item,
                  term: modalForm.term || "",
                  timeframe: modalForm.timeframe || "",
                  visible: modalForm.visible !== false,
                }
              : item
          ),
        };
      }

      if (editingTarget.type === "continuous") {
        nextForm = {
          ...nextForm,
          continuousTitle: modalForm.continuousTitle || "",
          continuousDescription: modalForm.continuousDescription || "",
          ongoingAssessments: (modalForm.ongoingAssessmentsText || "")
            .split("\n")
            .map((item) => item.trim())
            .filter(Boolean),
        };
      }

      if (editingTarget.type === "cta") {
        nextForm = {
          ...nextForm,
          ctaTitle: modalForm.ctaTitle || "",
          ctaDescription: modalForm.ctaDescription || "",
          primaryButtonText: modalForm.primaryButtonText || "",
          primaryButtonLink: modalForm.primaryButtonLink || "",
          secondaryButtonText: modalForm.secondaryButtonText || "",
          secondaryButtonLink: modalForm.secondaryButtonLink || "",
        };
      }

      await saveContentToBackend(
        nextForm,
        "Selected academics item saved successfully."
      );

      setEditingTarget(null);
      setModalForm({});
    } catch (err) {
      console.error("Save selected academics item error:", err);

      if (err.response?.status === 401) {
        setError("Admin login expired or token is invalid. Please login again.");
      } else {
        setError(err.response?.data?.message || "Could not save selected item.");
      }
    } finally {
      setSaving(false);
    }
  };

  const addItem = async (type) => {
    setSaving(true);
    setSuccess("");
    setError("");

    try {
      let nextForm = mergeAcademicsContent(form);

      if (type === "program") {
        const nextColor = cardColors[nextForm.programs.length % cardColors.length];
        const newLevel = `New Academic Level ${nextForm.programs.length + 1}`;

        nextForm = {
          ...nextForm,
          programs: [
            ...nextForm.programs,
            {
              id: Date.now(),
              level: newLevel,
              span: "Grade / Level",
              badgeColor: nextColor,
              border: `${nextColor}24`,
              classes: ["Subject 1", "Subject 2"],
              highlight: "Write a short academic level description.",
              visible: true,
            },
          ],
          curriculum: {
            ...nextForm.curriculum,
            [newLevel]: [
              {
                grade: "New Grade",
                books: [
                  { subject: "New Subject", publication: "New Publication" },
                ],
              },
            ],
          },
        };
      }

      if (type === "feature") {
        const nextColor = cardColors[nextForm.features.length % cardColors.length];

        nextForm = {
          ...nextForm,
          features: [
            ...nextForm.features,
            {
              id: Date.now(),
              emoji: "📘",
              title: "New Feature",
              desc: "Write the feature description.",
              color: nextColor,
              visible: true,
            },
          ],
        };
      }

      if (type === "stat") {
        const nextColor = cardColors[nextForm.stats.length % cardColors.length];

        nextForm = {
          ...nextForm,
          stats: [
            ...nextForm.stats,
            {
              id: Date.now(),
              value: "100+",
              label: "New Stat",
              icon: "users",
              color: nextColor,
              visible: true,
            },
          ],
        };
      }

      if (type === "timeline") {
        nextForm = {
          ...nextForm,
          timelineTerms: [
            ...nextForm.timelineTerms,
            {
              id: Date.now(),
              term: "New Exam Term",
              timeframe: "Timeframe description.",
              visible: true,
            },
          ],
        };
      }

      await saveContentToBackend(nextForm, "New item added successfully.");
    } catch (err) {
      console.error("Add academics item error:", err);
      setError(err.response?.data?.message || "Could not add item.");
    } finally {
      setSaving(false);
    }
  };

  const deleteTargetItem = async (target) => {
    if (!target) return;

    setSaving(true);
    setSuccess("");
    setError("");

    try {
      let nextForm = mergeAcademicsContent(form);

      if (target.type === "program") {
        const program = nextForm.programs[target.index];
        const nextCurriculum = { ...nextForm.curriculum };

        if (program?.level) {
          delete nextCurriculum[program.level];
        }

        nextForm = {
          ...nextForm,
          programs: nextForm.programs.filter((_, index) => index !== target.index),
          curriculum: nextCurriculum,
        };
      }

      if (target.type === "feature") {
        nextForm = {
          ...nextForm,
          features: nextForm.features.filter((_, index) => index !== target.index),
        };
      }

      if (target.type === "stat") {
        nextForm = {
          ...nextForm,
          stats: nextForm.stats.filter((_, index) => index !== target.index),
        };
      }

      if (target.type === "timeline") {
        nextForm = {
          ...nextForm,
          timelineTerms: nextForm.timelineTerms.filter(
            (_, index) => index !== target.index
          ),
        };
      }

      await saveContentToBackend(nextForm, "Selected item deleted successfully.");
      setDeleteTarget(null);
      setEditingTarget(null);
      setModalForm({});
    } catch (err) {
      console.error("Delete academics item error:", err);
      setError(err.response?.data?.message || "Could not delete selected item.");
    } finally {
      setSaving(false);
    }
  };

  async function saveWholePage() {
    setSaving(true);
    setSuccess("");
    setError("");

    try {
      await saveContentToBackend(form, "Academics page content saved successfully.");
    } catch (err) {
      console.error("Save academics content error:", err);
      setError(err.response?.data?.message || "Could not save academics content.");
    } finally {
      setSaving(false);
    }
  }

  const modalTitle = useMemo(() => {
    if (!editingTarget) return "";

    const titles = {
      hero: "Edit Academics Hero",
      program: "Edit Academic Program + Curriculum",
      featuresHeader: "Edit Academic Strengths Heading",
      feature: "Edit Academic Feature",
      stat: "Edit Statistic",
      examHeader: "Edit Examination Heading",
      timeline: "Edit Exam Term",
      continuous: "Edit Continuous Evaluation",
      cta: "Edit Bottom CTA",
    };

    return titles[editingTarget.type] || "Edit Academics Page";
  }, [editingTarget]);

  const canDeleteSelected = useMemo(() => {
    if (!editingTarget) return false;
    return ["program", "feature", "stat", "timeline"].includes(editingTarget.type);
  }, [editingTarget]);

  if (loading) {
    return (
      <div className="py-16 flex items-center justify-center">
        <div className="text-slate-600 font-semibold">
          Loading visual academics editor...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      <style>
        {`
          /* Mobile fix: Only make admin edit/delete buttons visible on mobile */
          @media (max-width: 767px) {
            .admin-academics-preview-frame .group button[class*="absolute"],
            .admin-academics-preview-frame .group [class*="absolute"] button,
            .admin-academics-preview-frame .group .opacity-0,
            .admin-academics-preview-frame .group [class*="opacity-0"],
            .admin-academics-preview-frame .group [class*="group-hover:opacity"],
            .admin-academics-preview-frame [class*="group-hover:opacity"] {
              opacity: 1 !important;
              visibility: visible !important;
              pointer-events: auto !important;
            }

            .admin-academics-preview-frame .group button {
              min-width: 2rem !important;
              min-height: 2rem !important;
            }
          }
        `}
      </style>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-[24px] p-4 sm:p-5 md:p-6"
        style={{
          background:
            "linear-gradient(135deg, #E8EDF5 0%, #DCE3EF 50%, #E8E0F0 100%)",
          border: "1px solid rgba(15,23,42,0.06)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
        }}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-black mb-3 bg-purple-50 text-purple-700 border border-purple-100">
              <Eye className="w-3.5 h-3.5" />
              Visual Academics Editor
            </div>

            <h2
              className="text-2xl md:text-3xl font-black text-slate-950"
              style={{
                fontFamily: "var(--font-display)",
                letterSpacing: "-0.04em",
              }}
            >
              Hover and Edit Academics Page
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Hover sections to edit. Program cards include curriculum books, grade reorder, add grade, and delete with confirmation.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={() => navigate("/admin/dashboard")}
              className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-sm font-black bg-white text-slate-700 border border-slate-100"
            >
              <ArrowLeft className="w-4 h-4" />
              Dashboard
            </button>

            <a
              href="/academics"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-sm font-black bg-white text-slate-700 border border-slate-100"
            >
              <ExternalLink className="w-4 h-4" />
              View Page
            </a>

            <button
              type="button"
              onClick={saveWholePage}
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl text-sm font-black transition-all hover:-translate-y-0.5 disabled:opacity-60"
              style={{
                background: `linear-gradient(135deg, ${colors.gold}, ${colors.cyan})`,
                color: colors.dark,
                boxShadow: "0 16px 38px rgba(56,189,248,0.22)",
              }}
            >
              <Save className="w-4 h-4" />
              {saving ? "Saving..." : "Save All"}
            </button>
          </div>
        </div>

        {success && (
          <div className="mb-4 rounded-2xl px-4 py-3 flex items-center gap-2 font-semibold bg-green-50 text-green-700 border border-green-100">
            <CheckCircle2 className="w-4 h-4" />
            {success}
          </div>
        )}

        {error && (
          <div className="mb-4 rounded-2xl px-4 py-3 flex items-center gap-2 font-semibold bg-red-50 text-red-700 border border-red-100">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        <div
          className="admin-academics-preview-frame rounded-[2rem] overflow-x-auto"
          style={{
            background:
              "radial-gradient(circle at top left, rgba(56,189,248,0.14), transparent 34%), linear-gradient(180deg, #FFF8EE 0%, #F1ECFF 100%)",
            border: "1px solid rgba(15,23,42,0.08)",
          }}
        >
          <div className="w-full min-w-0 bg-white">
            <Academics
              editMode
              contentOverride={form}
              onEditTarget={openEditor}
              onDeleteTarget={(target) => setDeleteTarget(target)}
              onAddTarget={addItem}
            />
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {editingTarget && (
          <motion.div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-5"
            style={{
              background: "rgba(2,6,23,0.55)",
              backdropFilter: "blur(12px)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeEditor}
          >
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 14, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 130, damping: 16 }}
              className="w-full max-w-3xl rounded-[28px] overflow-hidden max-h-[92vh] overflow-y-auto"
              style={{
                background: "#FFFFFF",
                border: "1px solid rgba(255,255,255,0.75)",
                boxShadow: "0 42px 110px rgba(0,0,0,0.28)",
              }}
              onClick={(event) => event.stopPropagation()}
            >
              <div
                className="h-1"
                style={{
                  background: `linear-gradient(90deg, ${colors.gold}, ${colors.cyan}, ${colors.green})`,
                }}
              />

              <div className="p-6">
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center"
                      style={{
                        background:
                          "linear-gradient(135deg, rgba(250,204,21,0.18), rgba(56,189,248,0.18))",
                        color: colors.dark,
                      }}
                    >
                      {editingTarget.type === "program" ? (
                        <GraduationCap className="w-5 h-5" />
                      ) : (
                        <Pencil className="w-5 h-5" />
                      )}
                    </div>

                    <div>
                      <h3 className="text-xl font-black text-slate-950">
                        {modalTitle}
                      </h3>
                      <p className="text-sm text-slate-500">
                        Save only this selected Academics page item.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={closeEditor}
                    className="w-10 h-10 rounded-2xl flex items-center justify-center bg-slate-100 text-slate-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-5">
                  {editingTarget.type === "hero" && (
                    <>
                      <Field
                        label="Hero Badge"
                        value={modalForm.heroBadge}
                        onChange={(value) => updateModalField("heroBadge", value)}
                      />
                      <Field
                        label="Hero Title"
                        value={modalForm.heroTitle}
                        onChange={(value) => updateModalField("heroTitle", value)}
                      />
                      <Field
                        label="Red Highlight Word"
                        value={modalForm.heroHighlight}
                        onChange={(value) => updateModalField("heroHighlight", value)}
                      />
                      <Field
                        label="Hero Description"
                        value={modalForm.heroDescription}
                        onChange={(value) => updateModalField("heroDescription", value)}
                        textarea
                        rows={5}
                      />
                    </>
                  )}

                  {editingTarget.type === "program" && (
                    <>
                      <div className="grid md:grid-cols-2 gap-4">
                        <Field
                          label="Program Level"
                          value={modalForm.level}
                          onChange={(value) => updateModalField("level", value)}
                        />
                        <Field
                          label="Span"
                          value={modalForm.span}
                          onChange={(value) => updateModalField("span", value)}
                        />
                      </div>

                      <Field
                        label="Accent Color"
                        value={modalForm.badgeColor}
                        onChange={(value) => updateModalField("badgeColor", value)}
                        type="color"
                      />

                      <Field
                        label="Highlight"
                        value={modalForm.highlight}
                        onChange={(value) => updateModalField("highlight", value)}
                        textarea
                        rows={3}
                      />

                      <Field
                        label="Course Structure / Subjects - one per line"
                        value={modalForm.classesText}
                        onChange={(value) => updateModalField("classesText", value)}
                        textarea
                        rows={5}
                      />

                      <Toggle
                        label="Show this program on website"
                        checked={modalForm.visible !== false}
                        onChange={(value) => updateModalField("visible", value)}
                      />

                      <div
                        className="rounded-3xl p-5 space-y-4"
                        style={{
                          background: "rgba(75,46,131,0.04)",
                          border: "1px solid rgba(75,46,131,0.12)",
                        }}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="inline-flex items-center gap-2 text-sm font-black text-purple-700">
                              <BookOpen className="w-4 h-4" />
                              Curriculum & Books
                            </div>
                            <p className="text-xs text-slate-500 mt-1">
                              This controls the popup opened when users click this academic program.
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={addModalGrade}
                            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-black"
                            style={{
                              background: "rgba(22,138,58,0.08)",
                              color: colors.green,
                              border: "1px solid rgba(22,138,58,0.18)",
                            }}
                          >
                            <Plus className="w-4 h-4" />
                            Add Grade
                          </button>
                        </div>

                        <div className="space-y-4">
                          {(modalForm.curriculumGrades || []).map((grade, gradeIndex) => (
                            <div
                              key={`modal-grade-${gradeIndex}`}
                              className="rounded-2xl p-4 space-y-4"
                              style={{
                                background: "rgba(255,255,255,0.82)",
                                border: "1px solid rgba(15,23,42,0.08)",
                              }}
                            >
                              <div className="grid md:grid-cols-[1fr_auto] gap-3 items-end">
                                <Field
                                  label={`Grade ${gradeIndex + 1}`}
                                  value={grade.grade}
                                  onChange={(value) =>
                                    updateModalGrade(gradeIndex, "grade", value)
                                  }
                                />

                                <div className="flex items-center gap-2 pb-0.5">
                                  <button
                                    type="button"
                                    onClick={() => moveModalGrade(gradeIndex, -1)}
                                    disabled={gradeIndex === 0}
                                    className="p-3 rounded-xl disabled:opacity-35"
                                    style={{
                                      background: "rgba(75,46,131,0.08)",
                                      color: colors.purple,
                                      border: "1px solid rgba(75,46,131,0.16)",
                                    }}
                                  >
                                    <ArrowUp className="w-4 h-4" />
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => moveModalGrade(gradeIndex, 1)}
                                    disabled={gradeIndex === (modalForm.curriculumGrades || []).length - 1}
                                    className="p-3 rounded-xl disabled:opacity-35"
                                    style={{
                                      background: "rgba(22,138,58,0.08)",
                                      color: colors.green,
                                      border: "1px solid rgba(22,138,58,0.16)",
                                    }}
                                  >
                                    <ArrowDown className="w-4 h-4" />
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => removeModalGrade(gradeIndex)}
                                    className="p-3 rounded-xl"
                                    style={{
                                      background: "rgba(215,25,32,0.08)",
                                      color: colors.red,
                                      border: "1px solid rgba(215,25,32,0.16)",
                                    }}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>

                              <div className="space-y-3">
                                {(grade.books || []).map((book, bookIndex) => (
                                  <div
                                    key={`modal-grade-${gradeIndex}-book-${bookIndex}`}
                                    className="grid md:grid-cols-[1fr_1fr_auto] gap-3 items-end rounded-2xl p-3"
                                    style={{
                                      background: "rgba(248,250,252,0.95)",
                                      border: "1px solid rgba(15,23,42,0.06)",
                                    }}
                                  >
                                    <Field
                                      label="Subject"
                                      value={book.subject}
                                      onChange={(value) =>
                                        updateModalBook(
                                          gradeIndex,
                                          bookIndex,
                                          "subject",
                                          value
                                        )
                                      }
                                    />

                                    <Field
                                      label="Publication"
                                      value={book.publication}
                                      onChange={(value) =>
                                        updateModalBook(
                                          gradeIndex,
                                          bookIndex,
                                          "publication",
                                          value
                                        )
                                      }
                                    />

                                    <button
                                      type="button"
                                      onClick={() => removeModalBook(gradeIndex, bookIndex)}
                                      className="p-3 rounded-xl"
                                      style={{
                                        background: "rgba(215,25,32,0.08)",
                                        color: colors.red,
                                        border: "1px solid rgba(215,25,32,0.16)",
                                      }}
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                ))}

                                <button
                                  type="button"
                                  onClick={() => addModalBook(gradeIndex)}
                                  className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-black"
                                  style={{
                                    background: "rgba(75,46,131,0.08)",
                                    color: colors.purple,
                                    border: "1px dashed rgba(75,46,131,0.3)",
                                  }}
                                >
                                  <Plus className="w-4 h-4" />
                                  Add Subject
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  {editingTarget.type === "featuresHeader" && (
                    <>
                      <Field
                        label="Features Title"
                        value={modalForm.featuresTitle}
                        onChange={(value) => updateModalField("featuresTitle", value)}
                      />
                      <Field
                        label="Features Description"
                        value={modalForm.featuresDescription}
                        onChange={(value) => updateModalField("featuresDescription", value)}
                        textarea
                        rows={4}
                      />
                    </>
                  )}

                  {editingTarget.type === "feature" && (
                    <>
                      <Field
                        label="Title"
                        value={modalForm.title}
                        onChange={(value) => updateModalField("title", value)}
                      />
                      <Field
                        label="Description"
                        value={modalForm.desc}
                        onChange={(value) => updateModalField("desc", value)}
                        textarea
                        rows={4}
                      />
                      <Field
                        label="Emoji / Icon Text"
                        value={modalForm.emoji}
                        onChange={(value) => updateModalField("emoji", value)}
                      />
                      <Field
                        label="Accent Color"
                        value={modalForm.color}
                        onChange={(value) => updateModalField("color", value)}
                        type="color"
                      />
                      <Toggle
                        label="Show this feature on website"
                        checked={modalForm.visible !== false}
                        onChange={(value) => updateModalField("visible", value)}
                      />
                    </>
                  )}

                  {editingTarget.type === "stat" && (
                    <>
                      <Field
                        label="Value"
                        value={modalForm.value}
                        onChange={(value) => updateModalField("value", value)}
                      />
                      <Field
                        label="Label"
                        value={modalForm.label}
                        onChange={(value) => updateModalField("label", value)}
                      />
                      <Field
                        label="Accent Color"
                        value={modalForm.color}
                        onChange={(value) => updateModalField("color", value)}
                        type="color"
                      />
                      <Toggle
                        label="Show this stat on website"
                        checked={modalForm.visible !== false}
                        onChange={(value) => updateModalField("visible", value)}
                      />
                    </>
                  )}

                  {editingTarget.type === "examHeader" && (
                    <>
                      <Field
                        label="Exam Title"
                        value={modalForm.examTitle}
                        onChange={(value) => updateModalField("examTitle", value)}
                      />
                      <Field
                        label="Exam Description"
                        value={modalForm.examDescription}
                        onChange={(value) => updateModalField("examDescription", value)}
                        textarea
                        rows={4}
                      />
                    </>
                  )}

                  {editingTarget.type === "timeline" && (
                    <>
                      <Field
                        label="Term"
                        value={modalForm.term}
                        onChange={(value) => updateModalField("term", value)}
                      />
                      <Field
                        label="Timeframe"
                        value={modalForm.timeframe}
                        onChange={(value) => updateModalField("timeframe", value)}
                      />
                      <Toggle
                        label="Show this exam term on website"
                        checked={modalForm.visible !== false}
                        onChange={(value) => updateModalField("visible", value)}
                      />
                    </>
                  )}

                  {editingTarget.type === "continuous" && (
                    <>
                      <Field
                        label="Continuous Evaluation Title"
                        value={modalForm.continuousTitle}
                        onChange={(value) => updateModalField("continuousTitle", value)}
                      />
                      <Field
                        label="Continuous Evaluation Description"
                        value={modalForm.continuousDescription}
                        onChange={(value) => updateModalField("continuousDescription", value)}
                        textarea
                        rows={4}
                      />
                      <Field
                        label="Assessment Items - one per line"
                        value={modalForm.ongoingAssessmentsText}
                        onChange={(value) =>
                          updateModalField("ongoingAssessmentsText", value)
                        }
                        textarea
                        rows={5}
                      />
                    </>
                  )}

                  {editingTarget.type === "cta" && (
                    <>
                      <Field
                        label="CTA Title"
                        value={modalForm.ctaTitle}
                        onChange={(value) => updateModalField("ctaTitle", value)}
                      />
                      <Field
                        label="CTA Description"
                        value={modalForm.ctaDescription}
                        onChange={(value) => updateModalField("ctaDescription", value)}
                        textarea
                        rows={4}
                      />
                      <div className="grid md:grid-cols-2 gap-4">
                        <Field
                          label="Primary Button Text"
                          value={modalForm.primaryButtonText}
                          onChange={(value) => updateModalField("primaryButtonText", value)}
                        />
                        <Field
                          label="Primary Button Link"
                          value={modalForm.primaryButtonLink}
                          onChange={(value) => updateModalField("primaryButtonLink", value)}
                        />
                        <Field
                          label="Secondary Button Text"
                          value={modalForm.secondaryButtonText}
                          onChange={(value) => updateModalField("secondaryButtonText", value)}
                        />
                        <Field
                          label="Secondary Button Link"
                          value={modalForm.secondaryButtonLink}
                          onChange={(value) => updateModalField("secondaryButtonLink", value)}
                        />
                      </div>
                    </>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 mt-7">
                  {canDeleteSelected && (
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(editingTarget)}
                      disabled={saving}
                      className="sm:w-auto px-5 py-3 rounded-2xl text-sm font-black transition-all hover:-translate-y-0.5 disabled:opacity-60 inline-flex items-center justify-center gap-2"
                      style={{
                        background: "rgba(215,25,32,0.08)",
                        color: colors.red,
                        border: "1px solid rgba(215,25,32,0.18)",
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={closeEditor}
                    disabled={saving}
                    className="flex-1 py-3 rounded-2xl text-sm font-black transition-all hover:-translate-y-0.5 disabled:opacity-60"
                    style={{
                      background: "rgba(15,23,42,0.06)",
                      color: "rgba(15,23,42,0.65)",
                      border: "1px solid rgba(15,23,42,0.08)",
                    }}
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={saveSelectedPart}
                    disabled={saving}
                    className="flex-1 py-3 rounded-2xl text-sm font-black transition-all hover:-translate-y-0.5 disabled:opacity-60 inline-flex items-center justify-center gap-2"
                    style={{
                      background: `linear-gradient(135deg, ${colors.gold}, ${colors.cyan})`,
                      color: "#020617",
                      boxShadow: "0 16px 38px rgba(56,189,248,0.24)",
                    }}
                  >
                    <Save className="w-4 h-4" />
                    {saving ? "Saving..." : "Save This Item"}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {deleteTarget && (
          <motion.div
            className="fixed inset-0 z-[10000] flex items-center justify-center p-3 sm:p-5"
            style={{
              background: "rgba(2,6,23,0.62)",
              backdropFilter: "blur(14px)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              if (!saving) setDeleteTarget(null);
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.96 }}
              className="w-full max-w-md rounded-[28px] bg-white overflow-hidden"
              style={{
                boxShadow: "0 42px 110px rgba(0,0,0,0.32)",
                border: "1px solid rgba(255,255,255,0.75)",
              }}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="p-6">
                <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mb-5">
                  <Trash2 className="w-6 h-6" />
                </div>

                <h3 className="text-2xl font-black text-slate-950 mb-2">
                  Are you sure?
                </h3>

                <p className="text-sm text-slate-500 leading-relaxed mb-6">
                  This will permanently delete {getDeleteName(deleteTarget)} from the Academics page.
                </p>

                <div className="flex gap-3">
                  <button
                    type="button"
                    disabled={saving}
                    onClick={() => setDeleteTarget(null)}
                    className="flex-1 py-3 rounded-2xl text-sm font-black disabled:opacity-60"
                    style={{
                      background: "rgba(15,23,42,0.06)",
                      color: "rgba(15,23,42,0.68)",
                      border: "1px solid rgba(15,23,42,0.08)",
                    }}
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    disabled={saving}
                    onClick={() => deleteTargetItem(deleteTarget)}
                    className="flex-1 py-3 rounded-2xl text-sm font-black disabled:opacity-60 inline-flex items-center justify-center gap-2"
                    style={{
                      background: `linear-gradient(135deg, ${colors.red}, #991B1B)`,
                      color: "#FFFFFF",
                      boxShadow: "0 16px 38px rgba(215,25,32,0.24)",
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                    {saving ? "Deleting..." : "Yes, Delete"}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
