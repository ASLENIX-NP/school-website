import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft,
  CheckCircle2,
  ExternalLink,
  GraduationCap,
  Pencil,
  Save,
  Trash2,
  X,
} from "lucide-react";

import {
  Admissions,
  defaultAdmissionsContent,
  mergeAdmissionsContent,
  stepColorOptions,
} from "../app/components/Admissions";

const colors = {
  red: "#D71920",
  green: "#168A3A",
  purple: "#4B2E83",
  softPurple: "#7C5CC4",
  dark: "#0B1020",
  cyan: "#38BDF8",
  gold: "#FACC15",
};

const lightAdminPanelStyle = {
  background:
    "linear-gradient(135deg, rgba(255,255,255,0.96), rgba(248,244,255,0.95), rgba(238,247,255,0.95))",
  border: "1px solid rgba(75,46,131,0.12)",
  boxShadow: "0 18px 44px rgba(15,23,42,0.08)",
  backdropFilter: "blur(14px)",
};

function getAdminToken() {
  return (
    localStorage.getItem("adminToken") ||
    localStorage.getItem("token") ||
    localStorage.getItem("admin_token") ||
    ""
  );
}

function getAuthHeaders() {
  const token = getAdminToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function Field({ label, value, onChange, placeholder = "", type = "text" }) {
  return (
    <div>
      <label className="block text-sm font-black mb-2 text-slate-700">
        {label}
      </label>

      <input
        type={type}
        value={value || ""}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-2xl outline-none text-sm"
        style={{
          background: "rgba(255,255,255,0.92)",
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
      <label className="block text-sm font-black mb-2 text-slate-700">
        {label}
      </label>

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
        style={{ background: checked ? colors.green : "#CBD5E1" }}
      >
        <span
          className="absolute top-1 w-5 h-5 rounded-full bg-white transition-all shadow"
          style={{ left: checked ? "24px" : "4px" }}
        />
      </span>
    </button>
  );
}

function ModalShell({ title, subtitle, icon: Icon, children, onClose }) {
  return (
    <motion.div
      className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-5"
      style={{
        background: "rgba(2,6,23,0.58)",
        backdropFilter: "blur(14px)",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.94 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12, scale: 0.96 }}
        transition={{ type: "spring", stiffness: 130, damping: 16 }}
        onClick={(event) => event.stopPropagation()}
        className="w-full max-w-3xl rounded-[26px] sm:rounded-[30px] overflow-hidden max-h-[92vh] overflow-y-auto"
        style={{
          background: "#FFFFFF",
          border: "1px solid rgba(255,255,255,0.78)",
          boxShadow: "0 42px 110px rgba(0,0,0,0.3)",
        }}
      >
        <div
          className="h-1"
          style={{
            background: `linear-gradient(90deg, ${colors.gold}, ${colors.cyan}, ${colors.green})`,
          }}
        />

        <div className="p-5 md:p-7">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div className="flex items-center gap-3 min-w-0">
              <div
                className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center shrink-0"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(250,204,21,0.18), rgba(56,189,248,0.18))",
                  color: colors.dark,
                }}
              >
                <Icon className="w-5 h-5" />
              </div>

              <div className="min-w-0">
                <h3 className="text-xl sm:text-2xl font-black text-slate-950">
                  {title}
                </h3>
                <p className="text-sm text-slate-500">{subtitle}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-10 h-10 rounded-2xl flex items-center justify-center bg-slate-100 text-slate-600 shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {children}
        </div>
      </motion.div>
    </motion.div>
  );
}

function ConfirmDelete({ itemTitle, onCancel, onConfirm }) {
  return (
    <ModalShell
      title="Delete Admission Step?"
      subtitle="This action only becomes public after saving the admissions page."
      icon={Trash2}
      onClose={onCancel}
    >
      <div className="rounded-3xl p-5 bg-red-50 border border-red-100 text-red-700 font-semibold">
        Are you sure you want to delete <b>{itemTitle}</b>?
      </div>

      <div className="flex gap-3 mt-7">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-3 rounded-2xl text-sm font-black bg-slate-100 text-slate-600"
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={onConfirm}
          className="flex-1 py-3 rounded-2xl text-sm font-black text-white"
          style={{ background: colors.red }}
        >
          Delete Step
        </button>
      </div>
    </ModalShell>
  );
}

export default function AdminAdmissions() {
  const navigate = useNavigate();

  const [form, setForm] = useState(defaultAdmissionsContent);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(null);
  const [modalForm, setModalForm] = useState({});
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    let alive = true;

    const loadAdmissionsContent = async () => {
      try {
        const res = await axios.get(
          "https://school-website-backend-ixx2.onrender.com/api/site-content/admissions",
          { timeout: 20000 }
        );

        if (!alive) return;

        const savedContent = res.data?.data?.content || {};
        setForm(mergeAdmissionsContent(savedContent));
      } catch (err) {
        console.error("Load admissions content error:", err);
        if (alive) {
          setError("Could not load saved admissions content. Default content is shown.");
        }
      } finally {
        if (alive) setLoading(false);
      }
    };

    loadAdmissionsContent();

    return () => {
      alive = false;
    };
  }, []);

  const visibleCount = useMemo(
    () => (form.steps || []).filter((item) => item.visible !== false).length,
    [form.steps]
  );

  const openHeroEditor = () => {
    setSuccess("");
    setError("");
    setEditing({ type: "hero" });
    setModalForm({
      badgeText: form.badgeText || "",
      title: form.title || "",
      highlightedText: form.highlightedText || "",
      subtitle: form.subtitle || "",
    });
  };

  const openStepEditor = (step) => {
    setSuccess("");
    setError("");
    setEditing({ type: "step", id: step.id });
    setModalForm({ ...step });
  };

  const openFormEditor = () => {
    setSuccess("");
    setError("");
    setEditing({ type: "form" });
    setModalForm({
      formTitle: form.formTitle || "",
      formDescription: form.formDescription || "",
      nameLabel: form.nameLabel || "",
      namePlaceholder: form.namePlaceholder || "",
      emailLabel: form.emailLabel || "",
      emailPlaceholder: form.emailPlaceholder || "",
      phoneLabel: form.phoneLabel || "",
      phonePlaceholder: form.phonePlaceholder || "",
      gradeLabel: form.gradeLabel || "",
      gradePlaceholder: form.gradePlaceholder || "",
      messageLabel: form.messageLabel || "",
      messagePlaceholder: form.messagePlaceholder || "",
      gradesText: (form.grades || []).join("\n"),
      submitButtonText: form.submitButtonText || "",
      submittingText: form.submittingText || "",
      successTitle: form.successTitle || "",
      successMessage: form.successMessage || "",
    });
  };

  const closeEditor = () => {
    if (saving) return;
    setEditing(null);
    setModalForm({});
  };

  const updateModalField = (name, value) => {
    setModalForm((prev) => ({ ...prev, [name]: value }));
  };

  const saveModalChanges = () => {
    if (!editing) return;

    if (editing.type === "hero") {
      setForm((prev) => ({
        ...prev,
        badgeText: modalForm.badgeText || "",
        title: modalForm.title || "",
        highlightedText: modalForm.highlightedText || "",
        subtitle: modalForm.subtitle || "",
      }));
    }

    if (editing.type === "step") {
      setForm((prev) => ({
        ...prev,
        steps: prev.steps.map((step) =>
          step.id === editing.id
            ? {
                ...step,
                step: modalForm.step || "",
                title: modalForm.title || "",
                desc: modalForm.desc || "",
                color: modalForm.color || colors.green,
                visible: modalForm.visible !== false,
              }
            : step
        ),
      }));
    }

    if (editing.type === "form") {
      const grades = String(modalForm.gradesText || "")
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean);

      setForm((prev) => ({
        ...prev,
        formTitle: modalForm.formTitle || "",
        formDescription: modalForm.formDescription || "",
        nameLabel: modalForm.nameLabel || "",
        namePlaceholder: modalForm.namePlaceholder || "",
        emailLabel: modalForm.emailLabel || "",
        emailPlaceholder: modalForm.emailPlaceholder || "",
        phoneLabel: modalForm.phoneLabel || "",
        phonePlaceholder: modalForm.phonePlaceholder || "",
        gradeLabel: modalForm.gradeLabel || "",
        gradePlaceholder: modalForm.gradePlaceholder || "",
        messageLabel: modalForm.messageLabel || "",
        messagePlaceholder: modalForm.messagePlaceholder || "",
        grades: grades.length ? grades : prev.grades,
        submitButtonText: modalForm.submitButtonText || "",
        submittingText: modalForm.submittingText || "",
        successTitle: modalForm.successTitle || "",
        successMessage: modalForm.successMessage || "",
      }));
    }

    closeEditor();
    setSuccess("Section updated. Click Save Changes to publish.");
  };

  const addStep = () => {
    setSuccess("");
    setError("");

    setForm((prev) => {
      const nextIndex = (prev.steps || []).length;
      const newStep = {
        id: Date.now(),
        icon: "message",
        step: String(nextIndex + 1).padStart(2, "0"),
        title: "New Admission Step",
        desc: "Write the admission step description here.",
        color: stepColorOptions[nextIndex % stepColorOptions.length],
        visible: true,
      };

      setTimeout(() => {
        const target = document.getElementById(`admission-step-${newStep.id}`);
        target?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 120);

      return {
        ...prev,
        steps: [...(prev.steps || []), newStep],
      };
    });

    setSuccess("New step added. Click its Edit button, then Save Changes to publish.");
  };

  const confirmDeleteStep = (step) => {
    setDeleteTarget(step);
  };

  const deleteStep = () => {
    if (!deleteTarget) return;

    if ((form.steps || []).length <= 1) {
      setDeleteTarget(null);
      setError("At least one admission step must remain.");
      return;
    }

    setForm((prev) => ({
      ...prev,
      steps: prev.steps.filter((step) => step.id !== deleteTarget.id),
    }));

    setDeleteTarget(null);
    setSuccess("Step deleted. Click Save Changes to publish.");
  };

  async function saveAdmissionsContent() {
    setSuccess("");
    setError("");
    setSaving(true);

    try {
      const cleanedForm = mergeAdmissionsContent({
        ...form,
        steps: (form.steps || []).map((step, index) => ({
          ...step,
          id: step.id || Date.now() + index,
          step: step.step || String(index + 1).padStart(2, "0"),
          title: step.title || "Admission Step",
          desc: step.desc || "Step description.",
          color: step.color || stepColorOptions[index % stepColorOptions.length],
          visible: step.visible !== false,
        })),
        grades: (form.grades || []).map((item) => String(item).trim()).filter(Boolean),
      });

      await axios.put(
        "https://school-website-backend-ixx2.onrender.com/api/site-content/admissions",
        { content: cleanedForm },
        {
          headers: getAuthHeaders(),
          timeout: 30000,
        }
      );

      setForm(cleanedForm);
      setSuccess("Admissions page content saved successfully.");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error("Save admissions content error:", err);
      setError(
        err.response?.data?.message ||
          JSON.stringify(err.response?.data) ||
          "Could not save admissions content."
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
          Loading admissions editor...
        </div>
      </div>
    );
  }

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
      <style>
        {`
          .admin-admissions-preview-frame .bg-slate-950 {
            background: linear-gradient(135deg, rgba(255,255,255,0.96), rgba(248,244,255,0.95), rgba(238,247,255,0.95)) !important;
            color: #0F172A !important;
            border: 1px solid rgba(75,46,131,0.12) !important;
            box-shadow: 0 18px 44px rgba(15,23,42,0.08) !important;
          }

          .admin-admissions-preview-frame .bg-slate-950 [class*="text-white"] {
            color: #0F172A !important;
          }

          .admin-admissions-preview-frame .bg-slate-950 [class*="text-white/45"],
          .admin-admissions-preview-frame .bg-slate-950 [class*="text-white/55"],
          .admin-admissions-preview-frame .bg-slate-950 [class*="text-white/70"] {
            color: #7C5CC4 !important;
          }

          @media (max-width: 767px) {
            .admin-admissions-preview-frame .group .md\\:opacity-0 {
              opacity: 1 !important;
            }

            .admin-admissions-preview-frame button {
              max-width: calc(100vw - 40px);
            }
          }
        `}
      </style>

      <style>
        {`
          @media (max-width: 767px) {
            .admin-admissions-preview-frame .group .opacity-0,
            .admin-admissions-preview-frame .group [class*="opacity-0"],
            .admin-admissions-preview-frame .group .md\\:opacity-0,
            .admin-admissions-preview-frame .group [class*="md:opacity-0"],
            .admin-admissions-preview-frame .group [class*="group-hover:opacity"],
            .admin-admissions-preview-frame [class*="group-hover:opacity"] {
              opacity: 1 !important;
              visibility: visible !important;
              pointer-events: auto !important;
            }

            .admin-admissions-preview-frame .group .pointer-events-none,
            .admin-admissions-preview-frame .group [class*="pointer-events-none"] {
              pointer-events: auto !important;
            }

            .admin-admissions-preview-frame .group button[class*="opacity-0"],
            .admin-admissions-preview-frame button[class*="group-hover:opacity"],
            .admin-admissions-preview-frame button[class*="opacity-0"] {
              opacity: 1 !important;
              visibility: visible !important;
              pointer-events: auto !important;
            }

            .admin-admissions-preview-frame .group .hidden,
            .admin-admissions-preview-frame .group [class*="hidden"] {
              display: inline-flex !important;
            }

            .admin-admissions-preview-frame [class*="absolute"] button,
            .admin-admissions-preview-frame button[class*="rounded-full"] {
              min-width: 2.25rem !important;
              min-height: 2.25rem !important;
              max-width: calc(100vw - 2rem) !important;
              white-space: nowrap !important;
              z-index: 30 !important;
              pointer-events: auto !important;
            }

            .admin-admissions-preview-frame [class*="absolute"][class*="z-50"],
            .admin-admissions-preview-frame [class*="absolute"][class*="z-[50]"],
            .admin-admissions-preview-frame [class*="absolute"][class*="z-[60]"],
            .admin-admissions-preview-frame [class*="absolute"][class*="z-[70]"],
            .admin-admissions-preview-frame [class*="absolute"][class*="z-[80]"],
            .admin-admissions-preview-frame [class*="absolute"][class*="z-[90]"],
            .admin-admissions-preview-frame [class*="absolute"][class*="z-[999]"] {
              z-index: 30 !important;
            }
          }
        `}
      </style>

      <header
        className="relative z-0"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.96), rgba(248,244,255,0.95), rgba(238,247,255,0.95))",
          borderBottom: "1px solid rgba(75,46,131,0.12)",
          boxShadow: "0 14px 36px rgba(15,23,42,0.08)",
          backdropFilter: "blur(18px)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <button
            type="button"
            onClick={() => navigate("/admin/dashboard")}
            className="inline-flex w-fit items-center gap-2 font-black transition-all hover:-translate-x-1"
            style={{ color: colors.dark }}
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </button>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href="/admissions"
              target="_blank"
              rel="noreferrer"
              className="hidden md:inline-flex items-center gap-2 px-4 py-3 rounded-2xl font-black transition-all hover:scale-105"
              style={{
                color: colors.dark,
                background: "rgba(255,255,255,0.72)",
                border: "1px solid rgba(75,46,131,0.12)",
                boxShadow: "0 10px 26px rgba(15,23,42,0.06)",
              }}
            >
              <ExternalLink className="w-4 h-4" />
              View Admissions Page
            </a>

            <button
              type="button"
              onClick={saveAdmissionsContent}
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

      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8 rounded-[28px] sm:rounded-[34px] p-5 sm:p-8"
          style={lightAdminPanelStyle}
        >
          <span
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold mb-5"
            style={{
              background: "rgba(75,46,131,0.1)",
              color: colors.purple,
              border: "1px solid rgba(75,46,131,0.2)",
            }}
          >
            <GraduationCap className="w-4 h-4" />
            Manage Admissions Page
          </span>

          <h1
            className="text-3xl md:text-6xl mb-4"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 850,
              color: colors.dark,
              letterSpacing: "-0.045em",
            }}
          >
            Edit Admissions Page
          </h1>

          <p className="text-slate-500 max-w-3xl text-base sm:text-lg">
            Hover and edit the real admissions page. Steps can be added,
            hidden, edited, or deleted. {visibleCount} step
            {visibleCount === 1 ? "" : "s"} visible on the public page.
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

        <div className="admin-admissions-preview-frame rounded-[2rem] overflow-hidden bg-white shadow-2xl">
          <Admissions
            editMode
            contentOverride={form}
            onEditHero={openHeroEditor}
            onEditStep={openStepEditor}
            onAddStep={addStep}
            onDeleteStep={confirmDeleteStep}
            onEditForm={openFormEditor}
          />
        </div>
      </main>

      <AnimatePresence>
        {editing?.type === "hero" && (
          <ModalShell
            title="Edit Admissions Heading"
            subtitle="Update the badge, main title, highlighted text, and subtitle."
            icon={Pencil}
            onClose={closeEditor}
          >
            <div className="grid gap-5">
              <Field
                label="Badge Text"
                value={modalForm.badgeText}
                onChange={(value) => updateModalField("badgeText", value)}
              />

              <Field
                label="Main Title"
                value={modalForm.title}
                onChange={(value) => updateModalField("title", value)}
              />

              <Field
                label="Red Highlight Text"
                value={modalForm.highlightedText}
                onChange={(value) => updateModalField("highlightedText", value)}
                placeholder="Example: Starts Here"
              />

              <TextArea
                label="Subtitle"
                value={modalForm.subtitle}
                onChange={(value) => updateModalField("subtitle", value)}
                rows={4}
              />
            </div>

            <div className="flex gap-3 mt-7">
              <button
                type="button"
                onClick={closeEditor}
                className="flex-1 py-3 rounded-2xl text-sm font-black bg-slate-100 text-slate-600"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={saveModalChanges}
                className="flex-1 py-3 rounded-2xl text-sm font-black text-slate-950"
                style={{ background: `linear-gradient(135deg, ${colors.gold}, ${colors.cyan})` }}
              >
                Update Heading
              </button>
            </div>
          </ModalShell>
        )}

        {editing?.type === "step" && (
          <ModalShell
            title="Edit Admission Step"
            subtitle="Update this step card. Hidden steps remain in admin but do not show publicly."
            icon={Pencil}
            onClose={closeEditor}
          >
            <div className="grid gap-5">
              <Toggle
                checked={modalForm.visible !== false}
                onChange={(value) => updateModalField("visible", value)}
                label="Show this step on public admissions page"
              />

              <div className="grid md:grid-cols-3 gap-4">
                <Field
                  label="Step Number"
                  value={modalForm.step}
                  onChange={(value) => updateModalField("step", value)}
                  placeholder="01"
                />

                <Field
                  label="Step Title"
                  value={modalForm.title}
                  onChange={(value) => updateModalField("title", value)}
                />

                <Field
                  label="Accent Color"
                  type="color"
                  value={modalForm.color}
                  onChange={(value) => updateModalField("color", value)}
                />
              </div>

              <TextArea
                label="Step Description"
                value={modalForm.desc}
                onChange={(value) => updateModalField("desc", value)}
                rows={4}
              />
            </div>

            <div className="flex gap-3 mt-7">
              <button
                type="button"
                onClick={closeEditor}
                className="flex-1 py-3 rounded-2xl text-sm font-black bg-slate-100 text-slate-600"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={saveModalChanges}
                className="flex-1 py-3 rounded-2xl text-sm font-black text-slate-950"
                style={{ background: `linear-gradient(135deg, ${colors.gold}, ${colors.cyan})` }}
              >
                Update Step
              </button>
            </div>
          </ModalShell>
        )}

        {editing?.type === "form" && (
          <ModalShell
            title="Edit Admission Inquiry Form"
            subtitle="Update public form labels, placeholders, grade options, and success text."
            icon={Pencil}
            onClose={closeEditor}
          >
            <div className="grid gap-5">
              <Field
                label="Form Title"
                value={modalForm.formTitle}
                onChange={(value) => updateModalField("formTitle", value)}
              />

              <TextArea
                label="Form Description"
                value={modalForm.formDescription}
                onChange={(value) => updateModalField("formDescription", value)}
                rows={3}
              />

              <div className="grid md:grid-cols-2 gap-4">
                <Field label="Name Label" value={modalForm.nameLabel} onChange={(value) => updateModalField("nameLabel", value)} />
                <Field label="Name Placeholder" value={modalForm.namePlaceholder} onChange={(value) => updateModalField("namePlaceholder", value)} />
                <Field label="Email Label" value={modalForm.emailLabel} onChange={(value) => updateModalField("emailLabel", value)} />
                <Field label="Email Placeholder" value={modalForm.emailPlaceholder} onChange={(value) => updateModalField("emailPlaceholder", value)} />
                <Field label="Phone Label" value={modalForm.phoneLabel} onChange={(value) => updateModalField("phoneLabel", value)} />
                <Field label="Phone Placeholder" value={modalForm.phonePlaceholder} onChange={(value) => updateModalField("phonePlaceholder", value)} />
                <Field label="Grade Label" value={modalForm.gradeLabel} onChange={(value) => updateModalField("gradeLabel", value)} />
                <Field label="Grade Placeholder" value={modalForm.gradePlaceholder} onChange={(value) => updateModalField("gradePlaceholder", value)} />
                <Field label="Message Label" value={modalForm.messageLabel} onChange={(value) => updateModalField("messageLabel", value)} />
                <Field label="Submit Button Text" value={modalForm.submitButtonText} onChange={(value) => updateModalField("submitButtonText", value)} />
                <Field label="Submitting Text" value={modalForm.submittingText} onChange={(value) => updateModalField("submittingText", value)} />
                <Field label="Success Title" value={modalForm.successTitle} onChange={(value) => updateModalField("successTitle", value)} />
              </div>

              <TextArea
                label="Message Placeholder"
                value={modalForm.messagePlaceholder}
                onChange={(value) => updateModalField("messagePlaceholder", value)}
                rows={3}
              />

              <TextArea
                label="Grades - one per line"
                value={modalForm.gradesText}
                onChange={(value) => updateModalField("gradesText", value)}
                rows={8}
              />

              <TextArea
                label="Success Message"
                value={modalForm.successMessage}
                onChange={(value) => updateModalField("successMessage", value)}
                rows={3}
              />
            </div>

            <div className="flex gap-3 mt-7">
              <button
                type="button"
                onClick={closeEditor}
                className="flex-1 py-3 rounded-2xl text-sm font-black bg-slate-100 text-slate-600"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={saveModalChanges}
                className="flex-1 py-3 rounded-2xl text-sm font-black text-slate-950"
                style={{ background: `linear-gradient(135deg, ${colors.gold}, ${colors.cyan})` }}
              >
                Update Form
              </button>
            </div>
          </ModalShell>
        )}

        {deleteTarget && (
          <ConfirmDelete
            itemTitle={deleteTarget.title || "this step"}
            onCancel={() => setDeleteTarget(null)}
            onConfirm={deleteStep}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
