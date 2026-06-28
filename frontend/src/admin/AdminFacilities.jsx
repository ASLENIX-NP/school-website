import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  UploadCloud,
  CheckCircle2,
  ExternalLink,
  Eye,
  EyeOff,
  Type,
  Building2,
  X,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

const colors = {
  red: "#D71920",
  green: "#168A3A",
  purple: "#4B2E83",
  dark: "#0B1020",
  cyan: "#38BDF8",
  gold: "#FACC15",
};

const defaultFacilitiesContent = {
  badgeText: "School Facilities",
  title: "Learning Beyond Classrooms",
  highlightedText: "Classrooms",
  subtitle:
    "Baljagriti provides modern facilities that create an engaging, practical, and technology-driven learning environment for every student.",
  learnMoreText: "Learn More",
  highlightsTitle: "Facility Highlights",
  facilities: [
    {
      id: 1,
      emoji: "📚",
      title: "E-Library",
      category: "Digital Learning",
      description:
        "Access thousands of digital books, journals, educational resources and online learning platforms.",
      details:
        "Students can access e-books, research journals, academic databases, digital resources, and online learning platforms from school.",
      imageUrl: "",
      color: colors.red,
      visible: true,
    },
    {
      id: 2,
      emoji: "💻",
      title: "Computer Lab",
      category: "Technology",
      description:
        "Modern computer laboratory equipped with internet access and updated software for practical learning.",
      details:
        "40+ modern computers with internet access, programming tools, office applications, and multimedia software.",
      imageUrl: "",
      color: colors.purple,
      visible: true,
    },
    {
      id: 3,
      emoji: "🔬",
      title: "Science Laboratory",
      category: "Practical Education",
      description:
        "Physics, Chemistry and Biology practical experiments with modern laboratory equipment and safety measures.",
      details:
        "Fully equipped separate labs for Physics, Chemistry, and Biology, providing hands-on experimental learning and top-tier safety gear.",
      imageUrl: "",
      color: colors.green,
      visible: true,
    },
    {
      id: 4,
      emoji: "🚌",
      title: "Bus Facility",
      category: "Transportation",
      description:
        "Safe and reliable transportation service covering multiple routes.",
      details:
        "Baljagriti provides safe transportation with experienced drivers, route management, student safety monitoring, and comfortable buses for daily travel.",
      imageUrl: "",
      color: "#F59E0B",
      visible: true,
    },
    {
      id: 5,
      emoji: "🎭",
      title: "Auditorium",
      category: "Events & Activities",
      description:
        "Spacious auditorium for seminars, cultural events, presentations, and school programs.",
      details:
        "A state-of-the-art auditorium with advanced audio-visual technology, comfortable seating, and staging for hosting all major school events and presentations.",
      imageUrl: "",
      color: colors.red,
      visible: true,
    },
    {
      id: 6,
      emoji: "⚽",
      title: "Sports Ground",
      category: "Physical Development",
      description:
        "Indoor and outdoor sports facilities encouraging fitness, teamwork, and healthy competition.",
      details:
        "Expansive playgrounds and courts facilitating football, basketball, cricket, and various indoor games under expert physical guidance.",
      imageUrl: "",
      color: colors.green,
      visible: true,
    },
  ],
};

function mergeFacilitiesContent(saved = {}) {
  return {
    ...defaultFacilitiesContent,
    ...saved,
    facilities: Array.isArray(saved.facilities)
      ? saved.facilities
      : defaultFacilitiesContent.facilities,
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
            <img src={imageUrl} alt={label} className="w-full h-48 object-cover" />
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
          <div className="w-full h-48 bg-slate-50 flex items-center justify-center">
            <Building2 className="w-16 h-16 text-slate-300" />
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
          Recommended: 1200×800 px • PNG, JPG, WebP • Max 3 MB
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

function FacilityPreviewVisual({ facility }) {
  const facilityColor = facility.color || colors.green;

  if (facility.imageUrl) {
    return (
      <img
        src={facility.imageUrl}
        alt={facility.title}
        className="w-full h-full object-cover"
      />
    );
  }

  return (
    <div
      className="w-full h-full flex items-center justify-center"
      style={{
        background: `
          radial-gradient(circle at top right, ${facilityColor}24, transparent 36%),
          linear-gradient(145deg, rgba(11,16,32,0.96), rgba(75,46,131,0.9))
        `,
      }}
    >
      <div className="text-center px-6">
        <div
          className="w-16 h-1 rounded-full mx-auto mb-4"
          style={{
            background: `linear-gradient(90deg, ${colors.red}, ${colors.green})`,
          }}
        />

        <div
          className="text-xs font-bold uppercase tracking-[0.18em] mb-2"
          style={{ color: "rgba(255,255,255,0.58)" }}
        >
          {facility.category}
        </div>

        <div
          className="text-2xl font-black text-white leading-tight"
          style={{
            fontFamily: "var(--font-display)",
            letterSpacing: "-0.04em",
          }}
        >
          {facility.title}
        </div>
      </div>
    </div>
  );
}

function FacilityPreview({ form }) {
  const visibleFacilities = form.facilities.filter(
    (facility) => facility.visible !== false
  );

  return (
    <div
      className="min-h-full p-6"
      style={{
        background:
          "radial-gradient(circle at top left, rgba(75,46,131,0.12), transparent 34%), linear-gradient(180deg,#FFF8EE 0%,#F8FAFC 100%)",
      }}
    >
      <div className="text-center mb-8">
        <span
          className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-bold mb-4"
          style={{
            background: "rgba(22,138,58,0.08)",
            color: colors.green,
            border: "1px solid rgba(22,138,58,0.18)",
          }}
        >
          {form.badgeText}
        </span>

        <h3
          className="text-4xl text-slate-950 leading-tight"
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 850,
            letterSpacing: "-0.04em",
          }}
        >
          {form.title}
        </h3>

        <p className="mt-3 text-slate-500 text-sm leading-relaxed">
          {form.subtitle}
        </p>
      </div>

      <div className="grid gap-4">
        {visibleFacilities.slice(0, 4).map((facility) => {
          const facilityColor = facility.color || colors.green;

          return (
            <div
              key={facility.id}
              className="bg-white rounded-2xl overflow-hidden"
              style={{
                border: `1px solid ${facilityColor}22`,
                boxShadow: "0 12px 32px rgba(15,23,42,0.08)",
              }}
            >
              <div className="h-36 relative overflow-hidden">
                <FacilityPreviewVisual facility={facility} />

                <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/5 to-transparent" />

                <div className="absolute bottom-4 left-4 right-4">
                  <div
                    className="w-14 h-1 rounded-full mb-3"
                    style={{ background: facilityColor }}
                  />

                  <div
                    className="inline-flex px-3 py-1 rounded-full text-xs font-bold"
                    style={{
                      background: "rgba(255,255,255,0.9)",
                      color: facilityColor,
                      border: `1px solid ${facilityColor}22`,
                    }}
                  >
                    {facility.category}
                  </div>
                </div>
              </div>

              <div className="p-4">
                <div className="font-black text-slate-950">
                  {facility.title}
                </div>

                <div className="mt-2 text-sm text-slate-500 line-clamp-2">
                  {facility.description}
                </div>

                <div
                  className="mt-3 text-sm font-bold"
                  style={{ color: facilityColor }}
                >
                  {form.learnMoreText}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function AdminFacilities() {
  const navigate = useNavigate();

  const [form, setForm] = useState(defaultFacilitiesContent);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingId, setUploadingId] = useState(null);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Define sections for accordion
  const sectionKeys = ['topHeading', 'facilityCards'];
  const sectionTitles = {
    topHeading: 'Top Heading Section',
    facilityCards: 'Facility Cards'
  };
  const sectionIcons = {
    topHeading: Type,
    facilityCards: Building2
  };
  const sectionColors = {
    topHeading: colors.green,
    facilityCards: colors.purple
  };

  const [expandedSections, setExpandedSections] = useState(
    Object.fromEntries(sectionKeys.map(key => [key, false]))
  );

  // Dynamic state for facility sections
  const [expandedFacilities, setExpandedFacilities] = useState({});

  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    const loadFacilitiesContent = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/site-content/facilities"
        );

        const savedContent = res.data?.data?.content || {};
        const mergedContent = mergeFacilitiesContent(savedContent);
        setForm(mergedContent);
        
        // Initialize expanded state for all facility sections (all collapsed by default)
        const initialExpanded = {};
        mergedContent.facilities?.forEach(facility => {
          initialExpanded[facility.id] = false;
        });
        setExpandedFacilities(initialExpanded);
      } catch (err) {
        console.error("Load facilities content error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadFacilitiesContent();
  }, []);

  const toggleSection = (sectionId) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const toggleFacilitySection = (facilityId) => {
    setExpandedFacilities((prev) => ({
      ...prev,
      [facilityId]: !prev[facilityId],
    }));
  };

  const expandAll = () => {
    const allFacilitiesExpanded = {};
    form.facilities.forEach(facility => {
      allFacilitiesExpanded[facility.id] = true;
    });
    setExpandedFacilities(allFacilitiesExpanded);
    setExpandedSections(
      Object.fromEntries(sectionKeys.map(key => [key, true]))
    );
  };

  const collapseAll = () => {
    const allFacilitiesCollapsed = {};
    form.facilities.forEach(facility => {
      allFacilitiesCollapsed[facility.id] = false;
    });
    setExpandedFacilities(allFacilitiesCollapsed);
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

  const updateFacility = (id, name, value) => {
    setForm((prev) => ({
      ...prev,
      facilities: prev.facilities.map((facility) =>
        facility.id === id
          ? {
              ...facility,
              [name]: value,
            }
          : facility
      ),
    }));
  };

  const addFacility = () => {
    const newFacility = {
      id: Date.now(),
      emoji: "🏫",
      title: "New Facility",
      category: "School Facility",
      description: "Short facility description.",
      details: "Detailed facility highlights.",
      imageUrl: "",
      color: colors.green,
      visible: true,
    };

    setForm((prev) => ({
      ...prev,
      facilities: [...prev.facilities, newFacility],
    }));
    
    // Auto-expand the new facility section
    setExpandedFacilities((prev) => ({
      ...prev,
      [newFacility.id]: true,
    }));
  };

  const deleteFacility = (id) => {
    setForm((prev) => ({
      ...prev,
      facilities: prev.facilities.filter((facility) => facility.id !== id),
    }));
    
    // Remove from expanded state
    setExpandedFacilities((prev) => {
      const newState = { ...prev };
      delete newState[id];
      return newState;
    });
  };

  const uploadFacilityImage = async (facilityId, file) => {
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    const maxSize = 3 * 1024 * 1024;

    if (!allowedTypes.includes(file.type)) {
      setError("Please upload only PNG, JPG, or WebP image.");
      return;
    }

    if (file.size > maxSize) {
      setError("Facility image must be less than 3 MB.");
      return;
    }

    setSuccess("");
    setError("");
    setUploadingId(facilityId);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await axios.post(
        "http://localhost:5000/api/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const uploadedUrl =
        res.data?.url ||
        res.data?.imageUrl ||
        res.data?.fileUrl ||
        res.data?.data?.url ||
        res.data?.data?.imageUrl ||
        res.data?.data?.fileUrl;

      if (!uploadedUrl) {
        setError("Image uploaded but backend did not return image URL.");
        return;
      }

      updateFacility(facilityId, "imageUrl", uploadedUrl);
      setSuccess("Facility image uploaded successfully. Click Save Changes.");
    } catch (err) {
      console.error("Facility image upload error:", err);
      setError(err.response?.data?.message || "Facility image upload failed.");
    } finally {
      setUploadingId(null);
    }
  };

  async function saveFacilitiesContent() {
    setSuccess("");
    setError("");
    setSaving(true);

    try {
      await axios.put(
        "http://localhost:5000/api/site-content/facilities",
        {
          content: form,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess("Facilities page content saved successfully.");
    } catch (err) {
      console.error("Save facilities content error:", err);
      setError(
        err.response?.data?.message || "Could not save facilities content."
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
          Loading facilities editor...
        </div>
      </div>
    );
  }

  const expandedCount = Object.values(expandedFacilities).filter(Boolean).length + Object.values(expandedSections).filter(Boolean).length;
  const totalSections = sectionKeys.length + form.facilities.length;

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
              href="/facilities"
              target="_blank"
              rel="noreferrer"
              className="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-white/80 hover:text-white text-sm transition-all"
              style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)" }}
            >
              <ExternalLink className="w-4 h-4" />
              View Facilities Page
            </a>

            <button
              type="button"
              onClick={saveFacilitiesContent}
              disabled={saving || uploadingId}
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
                  style={{ background: "rgba(22,138,58,0.12)", border: "1px solid rgba(22,138,58,0.2)" }}
                >
                  <Building2 className="w-4 h-4" style={{ color: colors.green }} />
                </div>
                <span className="text-sm font-bold" style={{ color: colors.green }}>Manage Facilities Page</span>
              </div>

              <h1
                className="text-3xl md:text-4xl font-black mb-2"
                style={{ color: colors.dark, letterSpacing: "-0.04em" }}
              >
                Edit Facilities Page
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
            {/* Top Heading Section */}
            <AccordionSection
              icon={sectionIcons.topHeading}
              title={sectionTitles.topHeading}
              color={sectionColors.topHeading}
              isExpanded={expandedSections.topHeading}
              onToggle={toggleSection}
              sectionId="topHeading"
              index={0}
            >
              <div className="grid gap-4">
                <Field
                  label="Small Badge Text"
                  value={form.badgeText}
                  onChange={(value) => updateField("badgeText", value)}
                />

                <div className="grid md:grid-cols-2 gap-4">
                  <Field
                    label="Main Title"
                    value={form.title}
                    onChange={(value) => updateField("title", value)}
                  />

                  <Field
                    label="Red Highlight Text"
                    value={form.highlightedText}
                    onChange={(value) => updateField("highlightedText", value)}
                    placeholder="Example: Classrooms"
                  />
                </div>

                <TextArea
                  label="Subtitle"
                  value={form.subtitle}
                  onChange={(value) => updateField("subtitle", value)}
                  rows={4}
                />

                <div className="grid md:grid-cols-2 gap-4">
                  <Field
                    label="Card Button Text"
                    value={form.learnMoreText}
                    onChange={(value) => updateField("learnMoreText", value)}
                  />

                  <Field
                    label="Modal Details Title"
                    value={form.highlightsTitle}
                    onChange={(value) => updateField("highlightsTitle", value)}
                  />
                </div>
              </div>
            </AccordionSection>

            {/* Facility Cards - Each as a separate accordion */}
            {form.facilities.map((facility, index) => (
              <AccordionSection
                key={facility.id}
                icon={Building2}
                title={`Facility ${index + 1}: ${facility.title || "Untitled"}`}
                color={facility.color || colors.purple}
                isExpanded={expandedFacilities[facility.id] || false}
                onToggle={() => toggleFacilitySection(facility.id)}
                sectionId={facility.id}
                index={index + 1}
              >
                <div className="flex justify-end mb-3">
                  <button
                    type="button"
                    onClick={() => deleteFacility(facility.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all hover:scale-105"
                    style={{
                      background: "rgba(215,25,32,0.08)",
                      color: colors.red,
                      border: "1px solid rgba(215,25,32,0.15)",
                    }}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete Facility
                  </button>
                </div>

                <div className="grid md:grid-cols-[220px_1fr] gap-4">
                  <div>
                    <ImageUploadBox
                      label="Facility Image"
                      imageUrl={facility.imageUrl}
                      uploading={uploadingId === facility.id}
                      onUpload={(file) => uploadFacilityImage(facility.id, file)}
                      onRemove={() => updateFacility(facility.id, "imageUrl", "")}
                    />
                  </div>

                  <div className="grid gap-3">
                    <div className="grid md:grid-cols-2 gap-3">
                      <Field
                        label="Facility Title"
                        value={facility.title}
                        onChange={(value) => updateFacility(facility.id, "title", value)}
                      />

                      <Field
                        label="Category"
                        value={facility.category}
                        onChange={(value) => updateFacility(facility.id, "category", value)}
                      />
                    </div>

                    <Field
                      label="Accent Color"
                      type="color"
                      value={facility.color}
                      onChange={(value) => updateFacility(facility.id, "color", value)}
                    />

                    <TextArea
                      label="Short Description"
                      value={facility.description}
                      onChange={(value) => updateFacility(facility.id, "description", value)}
                      rows={3}
                    />

                    <TextArea
                      label="Modal Facility Details"
                      value={facility.details}
                      onChange={(value) => updateFacility(facility.id, "details", value)}
                      rows={4}
                    />

                    <label className="flex items-center gap-3 text-xs font-bold text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={facility.visible !== false}
                        onChange={(e) => updateFacility(facility.id, "visible", e.target.checked)}
                        className="w-4 h-4 accent-green-500"
                      />
                      Show this facility on website
                    </label>
                  </div>
                </div>
              </AccordionSection>
            ))}

            {/* Add New Facility Button */}
            <button
              type="button"
              onClick={addFacility}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-4 rounded-2xl font-bold text-sm transition-all hover:scale-[1.01]"
              style={{
                color: colors.dark,
                background: "#FFFFFF",
                border: "1.5px dashed rgba(75,46,131,0.2)",
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
              }}
            >
              <Plus className="w-4 h-4" style={{ color: colors.purple }} />
              Add New Facility
            </button>
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
                  <div className="text-white font-bold text-sm">Facilities Page Preview</div>
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
              <FacilityPreview form={form} />
            </div>
          </aside>
        </div>
      </main>
    </section>
  );
}