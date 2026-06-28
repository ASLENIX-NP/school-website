import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import {
  ArrowLeft,
  Save,
  Users,
  Plus,
  Trash2,
  UploadCloud,
  CheckCircle2,
  ExternalLink,
  Image,
  Type,
  BarChart3,
  Eye,
  EyeOff,
  Phone,
  UserRound,
  ChevronDown,
  ChevronRight,
  X,
} from "lucide-react";

const colors = {
  red: "#D71920",
  green: "#168A3A",
  purple: "#4B2E83",
  dark: "#0B1020",
  cyan: "#38BDF8",
  gold: "#FACC15",
};

const defaultStaffContent = {
  badgeText: "Our Faculty Team",
  title: "Our Staff & Members",
  highlightedWord: "Members",
  subtitle:
    "Meet the dedicated educators, mentors, and leaders who inspire excellence, character, and lifelong learning at Baljagriti Secondary English Boarding School.",
  stats: [
    {
      id: "teachingStaff",
      value: "50+",
      label: "Teaching Staff",
      icon: "users",
      color: colors.green,
    },
    {
      id: "expertFaculty",
      value: "240+",
      label: "Expert Faculty",
      icon: "graduation",
      color: colors.purple,
    },
    {
      id: "yearsExcellence",
      value: "35+",
      label: "Years Excellence",
      icon: "award",
      color: colors.red,
    },
  ],
  staff: [
    {
      id: 1,
      name: "Binod Subedi",
      position: "Principal",
      imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
      qualification: "M.Ed",
      phone: "+977-9800000000",
      description:
        "Mr. Binod Subedi has been leading Baljagriti Secondary English School with vision and dedication for over a decade. His commitment to academic excellence and student welfare has transformed the school into a centre of quality education in the region.",
      visible: true,
    },
    {
      id: 2,
      name: "Amul Shrestha",
      position: "Vice Principal",
      imageUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d",
      qualification: "M.Ed",
      phone: "+977-9800000000",
      description:
        "Mr. Amul Shrestha brings years of administrative and academic expertise to Baljagriti. As Vice Principal, he oversees daily operations, faculty coordination, and student discipline, ensuring a productive and inspiring learning environment.",
      visible: true,
    },
    {
      id: 3,
      name: "Prem Hamal",
      position: "Science Teacher",
      imageUrl: "https://images.unsplash.com/photo-1504593811423-6dd665756598",
      qualification: "B.Sc, B.Ed",
      phone: "+977-9800000000",
      description:
        "Mr. Prem Hamal is a passionate science educator who brings curiosity and innovation into the classroom. With expertise in Physics, Chemistry, and Biology, he makes complex concepts accessible and exciting for every student.",
      visible: true,
    },
  ],
};

function mergeStaffContent(saved = {}) {
  return {
    ...defaultStaffContent,
    ...saved,
    stats:
      Array.isArray(saved.stats) && saved.stats.length
        ? saved.stats
        : defaultStaffContent.stats,
    staff:
      Array.isArray(saved.staff) && saved.staff.length
        ? saved.staff
        : defaultStaffContent.staff,
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
            <UserRound className="w-16 h-16 text-slate-300" />
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
          {uploading ? "Uploading..." : "Upload Photo"}
        </span>

        <span className="text-xs text-slate-400 leading-relaxed">
          Recommended: 800×1000 px • PNG, JPG, WebP • Max 2 MB
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

function StaffPreview({ form }) {
  const visibleStaff = form.staff.filter((staff) => staff.visible !== false);

  return (
    <div
      className="min-h-full p-6"
      style={{
        background:
          "radial-gradient(circle at top left, rgba(75,46,131,0.12), transparent 34%), linear-gradient(180deg, #FFF8EE 0%, #F8FAFC 100%)",
      }}
    >
      <div className="text-center mb-8">
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold mb-4"
          style={{
            background: "rgba(22,138,58,0.08)",
            color: colors.green,
            border: "1px solid rgba(22,138,58,0.18)",
          }}
        >
          <Users className="w-4 h-4" />
          {form.badgeText}
        </div>

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

      <div className="grid grid-cols-3 gap-3 mb-8">
        {form.stats.map((stat, index) => (
          <div
            key={stat.id || index}
            className="bg-white rounded-2xl p-4 text-center"
            style={{
              border: "1px solid rgba(15,23,42,0.08)",
              boxShadow: "0 12px 32px rgba(15,23,42,0.08)",
            }}
          >
            <div className="text-2xl font-black text-slate-950">{stat.value}</div>
            <div className="text-xs text-slate-500">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-4">
        {visibleStaff.slice(0, 3).map((staff) => (
          <div
            key={staff.id}
            className="bg-white rounded-2xl overflow-hidden flex gap-4"
            style={{
              border: "1px solid rgba(15,23,42,0.08)",
              boxShadow: "0 12px 32px rgba(15,23,42,0.08)",
            }}
          >
            {staff.imageUrl ? (
              <img
                src={staff.imageUrl}
                alt={staff.name}
                className="w-28 h-32 object-cover flex-shrink-0"
              />
            ) : (
              <div className="w-28 h-32 bg-slate-100 flex items-center justify-center flex-shrink-0">
                <UserRound className="w-10 h-10 text-slate-300" />
              </div>
            )}

            <div className="py-4 pr-4">
              <div className="font-black text-slate-950">{staff.name}</div>
              <div className="text-green-700 font-bold text-sm">{staff.position}</div>
              {staff.description && (
                <div className="text-slate-400 text-xs mt-1 line-clamp-2 leading-relaxed">
                  {staff.description}
                </div>
              )}
              <div className="text-slate-500 text-sm mt-2">{staff.qualification}</div>
              <div className="text-slate-500 text-sm flex items-center gap-2 mt-1">
                <Phone className="w-3 h-3" />
                {staff.phone}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AdminStaff() {
  const navigate = useNavigate();

  const [form, setForm] = useState(defaultStaffContent);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingId, setUploadingId] = useState(null);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Define sections for accordion
  const sectionKeys = ['topHeading', 'stats', 'staffMembers'];
  const sectionTitles = {
    topHeading: 'Top Heading Section',
    stats: 'Top Staff Number Cards',
    staffMembers: 'Staff Members'
  };
  const sectionIcons = {
    topHeading: Type,
    stats: BarChart3,
    staffMembers: Image
  };
  const sectionColors = {
    topHeading: colors.green,
    stats: colors.purple,
    staffMembers: colors.red
  };

  const [expandedSections, setExpandedSections] = useState(
    Object.fromEntries(sectionKeys.map(key => [key, false]))
  );

  // Dynamic state for staff sections
  const [expandedStaff, setExpandedStaff] = useState({});

  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    const loadStaffContent = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/site-content/staff");
        const savedContent = res.data?.data?.content || {};
        const mergedContent = mergeStaffContent(savedContent);
        setForm(mergedContent);
        
        // Initialize expanded state for all staff sections (all collapsed by default)
        const initialExpanded = {};
        mergedContent.staff?.forEach(member => {
          initialExpanded[member.id] = false;
        });
        setExpandedStaff(initialExpanded);
      } catch (err) {
        console.error("Load staff content error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadStaffContent();
  }, []);

  const toggleSection = (sectionId) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const toggleStaffSection = (staffId) => {
    setExpandedStaff((prev) => ({
      ...prev,
      [staffId]: !prev[staffId],
    }));
  };

  const expandAll = () => {
    const allStaffExpanded = {};
    form.staff.forEach(member => {
      allStaffExpanded[member.id] = true;
    });
    setExpandedStaff(allStaffExpanded);
    setExpandedSections(
      Object.fromEntries(sectionKeys.map(key => [key, true]))
    );
  };

  const collapseAll = () => {
    const allStaffCollapsed = {};
    form.staff.forEach(member => {
      allStaffCollapsed[member.id] = false;
    });
    setExpandedStaff(allStaffCollapsed);
    setExpandedSections(
      Object.fromEntries(sectionKeys.map(key => [key, false]))
    );
  };

  const updateField = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const updateStat = (id, name, value) => {
    setForm((prev) => ({
      ...prev,
      stats: prev.stats.map((stat) =>
        stat.id === id ? { ...stat, [name]: value } : stat
      ),
    }));
  };

  const updateStaff = (id, name, value) => {
    setForm((prev) => ({
      ...prev,
      staff: prev.staff.map((member) =>
        member.id === id ? { ...member, [name]: value } : member
      ),
    }));
  };

  const addStaffMember = () => {
    const newMember = {
      id: Date.now(),
      name: "New Staff Member",
      position: "Teacher",
      imageUrl: "",
      qualification: "",
      phone: "",
      description: "",
      visible: true,
    };
    setForm((prev) => ({ ...prev, staff: [...prev.staff, newMember] }));
    
    // Auto-expand the new staff section
    setExpandedStaff((prev) => ({
      ...prev,
      [newMember.id]: true,
    }));
  };

  const deleteStaffMember = (id) => {
    setForm((prev) => ({
      ...prev,
      staff: prev.staff.filter((member) => member.id !== id),
    }));
    
    // Remove from expanded state
    setExpandedStaff((prev) => {
      const newState = { ...prev };
      delete newState[id];
      return newState;
    });
  };

  const uploadStaffImage = async (staffId, file) => {
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    const maxSize = 2 * 1024 * 1024;

    if (!allowedTypes.includes(file.type)) {
      setError("Please upload only PNG, JPG, or WebP image.");
      return;
    }
    if (file.size > maxSize) {
      setError("Staff photo must be less than 2 MB.");
      return;
    }

    setSuccess("");
    setError("");
    setUploadingId(staffId);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await axios.post("http://localhost:5000/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

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

      updateStaff(staffId, "imageUrl", uploadedUrl);
      setSuccess("Staff photo uploaded successfully. Click Save Changes.");
    } catch (err) {
      console.error("Staff photo upload error:", err);
      setError(err.response?.data?.message || "Staff photo upload failed.");
    } finally {
      setUploadingId(null);
    }
  };

  async function saveStaffContent() {
    setSuccess("");
    setError("");
    setSaving(true);

    try {
      await axios.put(
        "http://localhost:5000/api/site-content/staff",
        { content: form },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess("Staff page content saved successfully.");
    } catch (err) {
      console.error("Save staff content error:", err);
      setError(err.response?.data?.message || "Could not save staff content.");
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
        <div className="text-slate-600 font-semibold">Loading staff editor...</div>
      </div>
    );
  }

  const expandedCount = Object.values(expandedStaff).filter(Boolean).length + Object.values(expandedSections).filter(Boolean).length;
  const totalSections = sectionKeys.length + form.staff.length;

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
              href="/staff"
              target="_blank"
              rel="noreferrer"
              className="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-white/80 hover:text-white text-sm transition-all"
              style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)" }}
            >
              <ExternalLink className="w-4 h-4" />
              View Staff Page
            </a>

            <button
              type="button"
              onClick={saveStaffContent}
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
                  <Users className="w-4 h-4" style={{ color: colors.green }} />
                </div>
                <span className="text-sm font-bold" style={{ color: colors.green }}>Manage Staff Page</span>
              </div>

              <h1
                className="text-3xl md:text-4xl font-black mb-2"
                style={{ color: colors.dark, letterSpacing: "-0.04em" }}
              >
                Edit Staff Page
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
              <div className="grid gap-5">
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
                    label="Green Highlight Word"
                    value={form.highlightedWord}
                    onChange={(value) => updateField("highlightedWord", value)}
                    placeholder="Example: Members"
                  />
                </div>

                <TextArea
                  label="Subtitle"
                  value={form.subtitle}
                  onChange={(value) => updateField("subtitle", value)}
                  rows={4}
                />
              </div>
            </AccordionSection>

            {/* Top Staff Number Cards */}
            <AccordionSection
              icon={sectionIcons.stats}
              title={sectionTitles.stats}
              color={sectionColors.stats}
              isExpanded={expandedSections.stats}
              onToggle={toggleSection}
              sectionId="stats"
              index={1}
            >
              <div className="space-y-4">
                {form.stats.map((stat, index) => (
                  <div
                    key={stat.id}
                    className="rounded-xl p-4"
                    style={{
                      background: "rgba(15,23,42,0.03)",
                      border: "1px solid rgba(15,23,42,0.06)",
                    }}
                  >
                    <div className="font-bold text-slate-900 text-sm mb-3">
                      Number Card {index + 1}
                    </div>
                    <div className="grid md:grid-cols-2 gap-3">
                      <Field
                        label="Number"
                        value={stat.value}
                        onChange={(value) => updateStat(stat.id, "value", value)}
                      />
                      <Field
                        label="Label"
                        value={stat.label}
                        onChange={(value) => updateStat(stat.id, "label", value)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </AccordionSection>

            {/* Staff Members - Each as a separate accordion */}
            {form.staff.map((member, index) => (
              <AccordionSection
                key={member.id}
                icon={UserRound}
                title={`Staff Member ${index + 1}: ${member.name || "Untitled"}`}
                color={colors.red}
                isExpanded={expandedStaff[member.id] || false}
                onToggle={() => toggleStaffSection(member.id)}
                sectionId={member.id}
                index={index + 2}
              >
                <div className="flex justify-end mb-3">
                  <button
                    type="button"
                    onClick={() => deleteStaffMember(member.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all hover:scale-105"
                    style={{
                      background: "rgba(215,25,32,0.08)",
                      color: colors.red,
                      border: "1px solid rgba(215,25,32,0.15)",
                    }}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete Staff
                  </button>
                </div>

                <div className="grid md:grid-cols-[180px_1fr] gap-4">
                  <div>
                    <ImageUploadBox
                      label="Staff Photo"
                      imageUrl={member.imageUrl}
                      uploading={uploadingId === member.id}
                      onUpload={(file) => uploadStaffImage(member.id, file)}
                      onRemove={() => updateStaff(member.id, "imageUrl", "")}
                    />
                  </div>

                  <div className="grid gap-3">
                    <div className="grid md:grid-cols-2 gap-3">
                      <Field
                        label="Name"
                        value={member.name}
                        onChange={(value) => updateStaff(member.id, "name", value)}
                      />
                      <Field
                        label="Position"
                        value={member.position}
                        onChange={(value) => updateStaff(member.id, "position", value)}
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-3">
                      <Field
                        label="Qualification"
                        value={member.qualification}
                        onChange={(value) => updateStaff(member.id, "qualification", value)}
                      />
                      <Field
                        label="Phone Number"
                        value={member.phone}
                        onChange={(value) => updateStaff(member.id, "phone", value)}
                        placeholder="+977-98XXXXXXXX"
                      />
                    </div>

                    <TextArea
                      label="Description / About"
                      value={member.description}
                      onChange={(value) => updateStaff(member.id, "description", value)}
                      placeholder="Write a short bio about this staff member."
                      rows={3}
                    />

                    <label className="flex items-center gap-3 text-xs font-bold text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={member.visible !== false}
                        onChange={(e) => updateStaff(member.id, "visible", e.target.checked)}
                        className="w-4 h-4 accent-green-500"
                      />
                      Show this staff member on website
                    </label>
                  </div>
                </div>
              </AccordionSection>
            ))}

            {/* Add New Staff Button */}
            <button
              type="button"
              onClick={addStaffMember}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-4 rounded-2xl font-bold text-sm transition-all hover:scale-[1.01]"
              style={{
                color: colors.dark,
                background: "#FFFFFF",
                border: "1.5px dashed rgba(75,46,131,0.2)",
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
              }}
            >
              <Plus className="w-4 h-4" style={{ color: colors.purple }} />
              Add New Staff Member
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
                  <div className="text-white font-bold text-sm">Staff Page Preview</div>
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
              <StaffPreview form={form} />
            </div>
          </aside>
        </div>
      </main>
    </section>
  );
}