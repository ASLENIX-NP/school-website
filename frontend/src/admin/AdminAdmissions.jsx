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
  GraduationCap,
  Type,
  ClipboardList,
  FileText,
} from "lucide-react";

const colors = {
  red: "#D71920",
  green: "#168A3A",
  purple: "#4B2E83",
  softPurple: "#7C5CC4",
  dark: "#0B1020",
  cyan: "#38BDF8",
  gold: "#FACC15",
};

const defaultAdmissionsContent = {
  badgeText: "Admissions",
  title: "Your Journey Starts Here",
  highlightedText: "Starts Here",
  subtitle:
    "Baljagriti Secondary English Boarding School welcomes students through a clear admission process for Play Group, LKG, and classes up to Class IX.",
  steps: [
    {
      id: 1,
      icon: "message",
      step: "01",
      title: "Play Group Admission",
      desc: "Admission opens for Play Group in the month of Magh. Parents can contact the school administration for details.",
      color: "#D71920",
      visible: true,
    },
    {
      id: 2,
      icon: "map",
      step: "02",
      title: "LKG to Class IX",
      desc: "Admission for Lower Kindergarten to Class IX opens from the new academic year in Baishakh.",
      color: "#168A3A",
      visible: true,
    },
    {
      id: 3,
      icon: "file",
      step: "03",
      title: "Written Examination",
      desc: "Interested candidates are selected through a written examination followed by parents or guardians’ interview.",
      color: "#7C5CC4",
      visible: true,
    },
    {
      id: 4,
      icon: "check",
      step: "04",
      title: "Enrollment",
      desc: "Selected students complete enrollment by submitting required documents to the school administration.",
      color: "#168A3A",
      visible: true,
    },
  ],
  formTitle: "Admission Inquiry",
  formDescription:
    "Fill in the form and the school administration will contact you with admission details.",
  nameLabel: "Full Name",
  namePlaceholder: "Student or parent name",
  emailLabel: "Email Address",
  emailPlaceholder: "example@email.com",
  phoneLabel: "Phone Number",
  phonePlaceholder: "+977 98XXXXXXXX",
  gradeLabel: "Applying for Grade",
  gradePlaceholder: "Select grade",
  grades: [
    "Play Group",
    "LKG",
    "UKG",
    "Grade 1",
    "Grade 2",
    "Grade 3",
    "Grade 4",
    "Grade 5",
    "Grade 6",
    "Grade 7",
    "Grade 8",
    "Grade 9",
  ],
  submitButtonText: "Submit Inquiry",
  submittingText: "Submitting...",
  successTitle: "Inquiry Submitted!",
  successMessage: "We will contact you soon with admission details.",
};

function mergeAdmissionsContent(saved = {}) {
  return {
    ...defaultAdmissionsContent,
    ...saved,
    steps: Array.isArray(saved.steps)
      ? saved.steps
      : defaultAdmissionsContent.steps,
    grades: Array.isArray(saved.grades)
      ? saved.grades
      : defaultAdmissionsContent.grades,
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

function AdmissionsPreview({ form }) {
  const visibleSteps = (form.steps || []).filter(
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
          {form.badgeText}
        </span>

        <h2
          className="text-4xl font-black text-slate-950"
          style={{
            fontFamily: "var(--font-display)",
            letterSpacing: "-0.04em",
          }}
        >
          {form.title}
        </h2>

        <p className="text-sm text-slate-500 mt-4 leading-relaxed">
          {form.subtitle}
        </p>
      </div>

      <div className="grid gap-4 mb-10">
        {visibleSteps.map((step, index) => {
          const stepColor = step.color || colors.green;

          return (
            <div
              key={step.id}
              className="bg-white rounded-3xl p-5"
              style={{
                border: `1px solid ${stepColor}22`,
                boxShadow: "0 12px 32px rgba(15,23,42,0.08)",
              }}
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div
                  className="text-sm font-black tracking-widest"
                  style={{ color: stepColor }}
                >
                  {step.step || String(index + 1).padStart(2, "0")}
                </div>

                <div
                  className="w-16 h-1 rounded-full"
                  style={{ background: stepColor }}
                />
              </div>

              <h3 className="font-black text-xl text-slate-950">
                {step.title}
              </h3>

              <p className="text-sm text-slate-500 leading-relaxed mt-2">
                {step.desc}
              </p>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-3xl p-6 border">
        <div
          className="w-20 h-1 rounded-full mb-5"
          style={{
            background: `linear-gradient(90deg, ${colors.red}, ${colors.green})`,
          }}
        />

        <h3 className="text-3xl font-black text-slate-950">
          {form.formTitle}
        </h3>

        <p className="text-sm text-slate-500 mt-2 mb-5">
          {form.formDescription}
        </p>

        <div className="grid gap-3">
          <div className="bg-slate-50 border rounded-xl p-3 text-sm text-slate-500">
            {form.nameLabel}
          </div>

          <div className="bg-slate-50 border rounded-xl p-3 text-sm text-slate-500">
            {form.emailLabel}
          </div>

          <div className="bg-slate-50 border rounded-xl p-3 text-sm text-slate-500">
            {form.phoneLabel}
          </div>

          <div className="bg-slate-50 border rounded-xl p-3 text-sm text-slate-500">
            {form.gradeLabel}: {(form.grades || []).join(", ")}
          </div>
        </div>

        <div
          className="mt-5 py-3 rounded-xl text-center font-bold text-white"
          style={{
            background: `linear-gradient(135deg, ${colors.red}, ${colors.green})`,
          }}
        >
          {form.submitButtonText}
        </div>
      </div>
    </div>
  );
}

export default function AdminAdmissions() {
  const navigate = useNavigate();

  const [form, setForm] = useState(defaultAdmissionsContent);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    const loadAdmissionsContent = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/site-content/admissions"
        );

        const savedContent = res.data?.data?.content || {};
        setForm(mergeAdmissionsContent(savedContent));
      } catch (err) {
        console.error("Load admissions content error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadAdmissionsContent();
  }, []);

  const updateField = (name, value) => {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const updateStep = (id, field, value) => {
    setForm((prev) => ({
      ...prev,
      steps: prev.steps.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
  };

  const addStep = () => {
    setForm((prev) => ({
      ...prev,
      steps: [
        ...prev.steps,
        {
          id: Date.now(),
          icon: "message",
          step: String(prev.steps.length + 1).padStart(2, "0"),
          title: "New Admission Step",
          desc: "Step description.",
          color: colors.green,
          visible: true,
        },
      ],
    }));
  };

  const deleteStep = (id) => {
    setForm((prev) => ({
      ...prev,
      steps: prev.steps.filter((item) => item.id !== id),
    }));
  };

  async function saveAdmissionsContent() {
    setSuccess("");
    setError("");
    setSaving(true);

    try {
      await axios.put(
        "http://localhost:5000/api/site-content/admissions",
        { content: form },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess("Admissions page content saved successfully.");
    } catch (err) {
      console.error("Save admissions content error:", err);
      setError(
        err.response?.data?.message || "Could not save admissions content."
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
              href="/admissions"
              target="_blank"
              rel="noreferrer"
              className="hidden md:inline-flex items-center gap-2 px-4 py-3 rounded-2xl font-bold text-white transition-all hover:scale-105"
              style={{
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.14)",
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
            <GraduationCap className="w-4 h-4" />
            Manage Admissions Page
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
            Edit Admissions Page
          </h1>

          <p className="text-slate-500 max-w-3xl text-lg">
            Edit admission heading, process steps, inquiry form labels, grade
            options, and success message. Step icon editing is hidden because
            the public page now uses a clean number-and-line design.
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

        <div className="grid xl:grid-cols-[780px_1fr] gap-8 items-start">
          <div className="space-y-8">
            <EditorCard
              icon={Type}
              title="Top Admissions Section"
              color={colors.purple}
            >
              <div className="grid gap-5">
                <Field
                  label="Badge Text"
                  value={form.badgeText}
                  onChange={(value) => updateField("badgeText", value)}
                />

                <Field
                  label="Main Title"
                  value={form.title}
                  onChange={(value) => updateField("title", value)}
                />

                <Field
                  label="Red Highlight Text"
                  value={form.highlightedText}
                  onChange={(value) => updateField("highlightedText", value)}
                />

                <TextArea
                  label="Subtitle"
                  value={form.subtitle}
                  onChange={(value) => updateField("subtitle", value)}
                  rows={4}
                />
              </div>
            </EditorCard>

            <EditorCard
              icon={ClipboardList}
              title="Admission Process Steps"
              color={colors.green}
            >
              <div className="flex justify-end mb-6">
                <button
                  type="button"
                  onClick={addStep}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-white"
                  style={{
                    background: `linear-gradient(135deg, ${colors.purple}, ${colors.green})`,
                  }}
                >
                  <Plus className="w-4 h-4" />
                  Add Step
                </button>
              </div>

              <div className="space-y-5">
                {form.steps.map((step, index) => (
                  <div
                    key={step.id}
                    className="rounded-3xl p-5"
                    style={{
                      background: "rgba(15,23,42,0.04)",
                      border: "1px solid rgba(15,23,42,0.08)",
                    }}
                  >
                    <div className="flex items-center justify-between mb-5">
                      <div>
                        <div className="font-black text-slate-950">
                          Step {index + 1}
                        </div>

                        <div className="text-sm text-slate-500">
                          {step.title}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            updateStep(step.id, "visible", !step.visible)
                          }
                          className="p-3 rounded-xl"
                          style={{
                            background:
                              step.visible !== false
                                ? "rgba(22,138,58,0.1)"
                                : "rgba(100,116,139,0.12)",
                            color:
                              step.visible !== false ? colors.green : "#64748B",
                            border:
                              step.visible !== false
                                ? "1px solid rgba(22,138,58,0.2)"
                                : "1px solid rgba(100,116,139,0.16)",
                          }}
                          title={step.visible !== false ? "Visible" : "Hidden"}
                        >
                          {step.visible !== false ? (
                            <Eye className="w-4 h-4" />
                          ) : (
                            <EyeOff className="w-4 h-4" />
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => deleteStep(step.id)}
                          className="p-3 rounded-xl"
                          style={{
                            background: "rgba(215,25,32,0.09)",
                            color: colors.red,
                            border: "1px solid rgba(215,25,32,0.18)",
                          }}
                          title="Delete step"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                      <Field
                        label="Step Number"
                        value={step.step}
                        onChange={(value) =>
                          updateStep(step.id, "step", value)
                        }
                      />

                      <Field
                        label="Title"
                        value={step.title}
                        onChange={(value) =>
                          updateStep(step.id, "title", value)
                        }
                      />

                      <Field
                        label="Accent Color"
                        type="color"
                        value={step.color}
                        onChange={(value) =>
                          updateStep(step.id, "color", value)
                        }
                      />
                    </div>

                    <div className="mt-4">
                      <TextArea
                        label="Description"
                        value={step.desc}
                        onChange={(value) =>
                          updateStep(step.id, "desc", value)
                        }
                        rows={3}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </EditorCard>

            <EditorCard
              icon={FileText}
              title="Inquiry Form Text"
              color={colors.red}
            >
              <div className="grid gap-5">
                <Field
                  label="Form Title"
                  value={form.formTitle}
                  onChange={(value) => updateField("formTitle", value)}
                />

                <TextArea
                  label="Form Description"
                  value={form.formDescription}
                  onChange={(value) => updateField("formDescription", value)}
                  rows={3}
                />

                <div className="grid md:grid-cols-2 gap-4">
                  <Field
                    label="Name Label"
                    value={form.nameLabel}
                    onChange={(value) => updateField("nameLabel", value)}
                  />

                  <Field
                    label="Name Placeholder"
                    value={form.namePlaceholder}
                    onChange={(value) => updateField("namePlaceholder", value)}
                  />

                  <Field
                    label="Email Label"
                    value={form.emailLabel}
                    onChange={(value) => updateField("emailLabel", value)}
                  />

                  <Field
                    label="Email Placeholder"
                    value={form.emailPlaceholder}
                    onChange={(value) =>
                      updateField("emailPlaceholder", value)
                    }
                  />

                  <Field
                    label="Phone Label"
                    value={form.phoneLabel}
                    onChange={(value) => updateField("phoneLabel", value)}
                  />

                  <Field
                    label="Phone Placeholder"
                    value={form.phonePlaceholder}
                    onChange={(value) =>
                      updateField("phonePlaceholder", value)
                    }
                  />

                  <Field
                    label="Grade Label"
                    value={form.gradeLabel}
                    onChange={(value) => updateField("gradeLabel", value)}
                  />

                  <Field
                    label="Grade Placeholder"
                    value={form.gradePlaceholder}
                    onChange={(value) =>
                      updateField("gradePlaceholder", value)
                    }
                  />

                  <Field
                    label="Submit Button Text"
                    value={form.submitButtonText}
                    onChange={(value) =>
                      updateField("submitButtonText", value)
                    }
                  />

                  <Field
                    label="Submitting Text"
                    value={form.submittingText}
                    onChange={(value) => updateField("submittingText", value)}
                  />
                </div>

                <TextArea
                  label="Grades - one per line"
                  value={(form.grades || []).join("\n")}
                  onChange={(value) =>
                    updateField(
                      "grades",
                      value
                        .split("\n")
                        .map((item) => item.trim())
                        .filter(Boolean)
                    )
                  }
                  rows={8}
                />

                <Field
                  label="Success Title"
                  value={form.successTitle}
                  onChange={(value) => updateField("successTitle", value)}
                />

                <TextArea
                  label="Success Message"
                  value={form.successMessage}
                  onChange={(value) => updateField("successMessage", value)}
                  rows={3}
                />
              </div>
            </EditorCard>
          </div>

          <aside
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
                Admissions Page Preview
              </div>

              <div className="text-sm text-white/55">
                Full preview updates while editing.
              </div>
            </div>

            <div className="bg-white">
              <AdmissionsPreview form={form} />
            </div>
          </aside>
        </div>
      </main>
    </section>
  );
}