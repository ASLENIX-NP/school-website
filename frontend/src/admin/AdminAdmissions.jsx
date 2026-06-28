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
  ChevronDown,
  ChevronRight,
  UploadCloud,
  X,
  Image,
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

// Image Upload Box Component
function ImageUploadBox({ label, imageUrl, onUpload, onRemove, uploading }) {
  return (
    <div>
      <label className="block text-xs font-bold mb-1.5 text-slate-500 uppercase tracking-wider">
        {label}
      </label>

      <div
        className="rounded-xl overflow-hidden bg-white mb-4 relative"
        style={{ border: "1.5px solid rgba(15,23,42,0.08)" }}
      >
        {imageUrl ? (
          <>
            <img src={imageUrl} alt={label} className="w-full h-64 object-cover" />
            <button
              type="button"
              onClick={onRemove}
              className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"
              title="Remove image"
            >
              <X className="w-4 h-4" />
            </button>
          </>
        ) : (
          <div className="w-full h-56 bg-slate-50 flex items-center justify-center">
            <Image className="w-16 h-16 text-slate-300" />
          </div>
        )}
      </div>

      <label
        className="flex flex-col items-center justify-center gap-2 cursor-pointer rounded-xl p-4 text-center transition-all duration-150 hover:bg-white/90"
        style={{
          background: "rgba(255,255,255,0.6)",
          border: "1.5px dashed rgba(75,46,131,0.2)",
        }}
      >
        <UploadCloud className="w-5 h-5" style={{ color: colors.purple }} />

        <span className="text-sm font-bold text-slate-800">
          {uploading ? "Uploading..." : "Upload Image"}
        </span>

        <span className="text-xs text-slate-400 leading-relaxed">
          Recommended: 1100×900 px • PNG, JPG, WebP • Max 3 MB
        </span>

        <input
          type="file"
          accept="image/*"
          disabled={uploading}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              onUpload(file);
            }
            e.target.value = "";
          }}
          className="hidden"
        />
      </label>
    </div>
  );
}

// Accordion Section Component
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
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Define sections for accordion
  const sectionKeys = ['topSection', 'steps', 'formText'];
  const sectionTitles = {
    topSection: 'Top Admissions Section',
    steps: 'Admission Process Steps',
    formText: 'Inquiry Form Text'
  };
  const sectionIcons = {
    topSection: Type,
    steps: ClipboardList,
    formText: FileText
  };
  const sectionColors = {
    topSection: colors.purple,
    steps: colors.green,
    formText: colors.red
  };

  const [expandedSections, setExpandedSections] = useState(
    Object.fromEntries(sectionKeys.map(key => [key, false]))
  );

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

  const uploadImage = async (file, fieldName) => {
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    const maxSize = 3 * 1024 * 1024;

    if (!allowedTypes.includes(file.type)) {
      setError("Please upload only PNG, JPG, or WebP image.");
      return;
    }

    if (file.size > maxSize) {
      setError("Image must be less than 3 MB.");
      return;
    }

    setError("");
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await axios.post("http://localhost:5000/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const uploadedUrl =
        res.data?.url ||
        res.data?.imageUrl ||
        res.data?.fileUrl ||
        res.data?.data?.url ||
        res.data?.data?.imageUrl ||
        res.data?.data?.fileUrl;

      if (!uploadedUrl) {
        setError("Image uploaded but URL not returned.");
        return;
      }

      updateField(fieldName, uploadedUrl);
      setSuccess("Image uploaded successfully.");
    } catch (err) {
      console.error("Image upload error:", err);
      setError(err.response?.data?.message || "Image upload failed.");
    } finally {
      setUploading(false);
    }
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
              href="/admissions"
              target="_blank"
              rel="noreferrer"
              className="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-white/80 hover:text-white text-sm transition-all"
              style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)" }}
            >
              <ExternalLink className="w-4 h-4" />
              View Admissions Page
            </a>

            <button
              type="button"
              onClick={saveAdmissionsContent}
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
                  <GraduationCap className="w-4 h-4" style={{ color: colors.purple }} />
                </div>
                <span className="text-sm font-bold" style={{ color: colors.purple }}>Manage Admissions Page</span>
              </div>

              <h1
                className="text-3xl md:text-4xl font-black mb-2"
                style={{ color: colors.dark, letterSpacing: "-0.04em" }}
              >
                Edit Admissions Page
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
          <div className="space-y-3">
            {/* Top Admissions Section */}
            <AccordionSection
              icon={sectionIcons.topSection}
              title={sectionTitles.topSection}
              color={sectionColors.topSection}
              isExpanded={expandedSections.topSection}
              onToggle={toggleSection}
              sectionId="topSection"
              index={0}
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
            </AccordionSection>

            {/* Admission Process Steps */}
            <AccordionSection
              icon={sectionIcons.steps}
              title={sectionTitles.steps}
              color={sectionColors.steps}
              isExpanded={expandedSections.steps}
              onToggle={toggleSection}
              sectionId="steps"
              index={1}
            >
              <div className="flex justify-end mb-4">
                <button
                  type="button"
                  onClick={addStep}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm text-white transition-all hover:scale-105"
                  style={{
                    background: `linear-gradient(135deg, ${colors.purple}, ${colors.green})`,
                  }}
                >
                  <Plus className="w-4 h-4" />
                  Add Step
                </button>
              </div>

              <div className="space-y-4">
                {form.steps.map((step, index) => (
                  <div
                    key={step.id}
                    className="rounded-xl p-4 space-y-4"
                    style={{
                      background: "rgba(15,23,42,0.03)",
                      border: "1px solid rgba(15,23,42,0.06)",
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-bold text-slate-900 text-sm">
                          Step {index + 1}
                        </div>
                        <div className="text-xs text-slate-400">{step.title}</div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => updateStep(step.id, "visible", !step.visible)}
                          className="p-2 rounded-xl"
                          style={{
                            background: step.visible !== false ? "rgba(22,138,58,0.1)" : "rgba(100,116,139,0.12)",
                            color: step.visible !== false ? colors.green : "#64748B",
                            border: step.visible !== false ? "1px solid rgba(22,138,58,0.2)" : "1px solid rgba(100,116,139,0.16)",
                          }}
                        >
                          {step.visible !== false ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        </button>

                        <button
                          type="button"
                          onClick={() => deleteStep(step.id)}
                          className="p-2 rounded-xl"
                          style={{
                            background: "rgba(215,25,32,0.09)",
                            color: colors.red,
                            border: "1px solid rgba(215,25,32,0.18)",
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-3">
                      <Field
                        label="Step Number"
                        value={step.step}
                        onChange={(value) => updateStep(step.id, "step", value)}
                      />

                      <Field
                        label="Title"
                        value={step.title}
                        onChange={(value) => updateStep(step.id, "title", value)}
                      />

                      <Field
                        label="Accent Color"
                        type="color"
                        value={step.color}
                        onChange={(value) => updateStep(step.id, "color", value)}
                      />
                    </div>

                    <TextArea
                      label="Description"
                      value={step.desc}
                      onChange={(value) => updateStep(step.id, "desc", value)}
                      rows={3}
                    />
                  </div>
                ))}
              </div>
            </AccordionSection>

            {/* Inquiry Form Text */}
            <AccordionSection
              icon={sectionIcons.formText}
              title={sectionTitles.formText}
              color={sectionColors.formText}
              isExpanded={expandedSections.formText}
              onToggle={toggleSection}
              sectionId="formText"
              index={2}
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

                <div className="grid md:grid-cols-2 gap-3">
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
                    onChange={(value) => updateField("emailPlaceholder", value)}
                  />

                  <Field
                    label="Phone Label"
                    value={form.phoneLabel}
                    onChange={(value) => updateField("phoneLabel", value)}
                  />

                  <Field
                    label="Phone Placeholder"
                    value={form.phonePlaceholder}
                    onChange={(value) => updateField("phonePlaceholder", value)}
                  />

                  <Field
                    label="Grade Label"
                    value={form.gradeLabel}
                    onChange={(value) => updateField("gradeLabel", value)}
                  />

                  <Field
                    label="Grade Placeholder"
                    value={form.gradePlaceholder}
                    onChange={(value) => updateField("gradePlaceholder", value)}
                  />

                  <Field
                    label="Submit Button Text"
                    value={form.submitButtonText}
                    onChange={(value) => updateField("submitButtonText", value)}
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
            </AccordionSection>
          </div>

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
                  <div className="text-white font-bold text-sm">Admissions Page Preview</div>
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
              <AdmissionsPreview form={form} />
            </div>
          </aside>
        </div>
      </main>
    </section>
  );
}