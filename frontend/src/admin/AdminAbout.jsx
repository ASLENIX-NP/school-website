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
  Eye as EyeIcon,
  EyeOff,
  Image as ImageIcon,
  Type,
  BookOpen,
  Target,
  CalendarDays,
  Award,
  X,
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

const defaultAboutContent = {
  pageTitle: "About Us",
  pageSubtitle:
    "Learn about Baljagriti Secondary English School, our values, and our commitment to quality education.",
  heroImageUrl:
    "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=700&h=500&fit=crop&auto=format",
  heroImageAlt: "Students in classroom with teacher",
  floatingCardEmoji: "🏫",
  floatingCardTitle: "Baljagriti Secondary English School",
  floatingCardSubtitle: "Hetauda, Makwanpur",
  topCardTitle: "PG to Grade 10",
  topCardSubtitle: "Co-educational day school",
  pillars: [
    {
      id: 1,
      icon: "award",
      label: "Academic Excellence",
      desc: "Focused classroom learning that helps students build a strong academic foundation from early years to Grade 10.",
      color: "#D71920",
      visible: true,
    },
    {
      id: 2,
      icon: "heart",
      label: "Holistic Development",
      desc: "A nurturing and child-friendly environment where students grow academically, personally, socially, and morally.",
      color: "#168A3A",
      visible: true,
    },
    {
      id: 3,
      icon: "lightbulb",
      label: "Creative & Practical Learning",
      desc: "Extra-curricular activities, competitions, sports, arts, and school programs help students explore their talents.",
      color: "#4B2E83",
      visible: true,
    },
  ],
  highlights: [
    "Play Group to Grade 10",
    "Co-educational day school",
    "Located in Hetauda-2, Makwanpur",
    "Child-friendly learning environment",
    "Focus on academic and moral foundation",
    "ECA, sports, arts, and competitions",
  ],
  storyBadge: "Our Story",
  storyTitle: "Building Tomorrow's Leaders Today",
  storyParagraphs: [
    "Baljagriti Secondary English School, located in the heart of Makwanpur, Nepal, has been a beacon of quality education for many years. What began as a small school with a strong vision has grown into a thriving institution serving students from Play Group to Grade 10.",
    "We take pride in our dedicated team of experienced educators who work tirelessly to ensure every child receives the attention, guidance, and learning environment they need to grow academically and personally.",
  ],
  storyImageUrl:
    "https://images.unsplash.com/photo-1588072432836-e10032774350?w=900&h=700&fit=crop&auto=format",
  storyImageAlt: "School campus",
  storyImageTitle: "School Campus",
  storyImageSubtitle: "Image can later be managed from admin dashboard",
  missionVision: [
    {
      id: 1,
      icon: "target",
      title: "Our Mission",
      desc: "To provide a safe, nurturing, and academically rigorous learning environment that empowers students to become confident, creative, and responsible citizens equipped for the challenges of the modern world.",
      color: "#4B2E83",
      visible: true,
    },
    {
      id: 2,
      icon: "eye",
      title: "Our Vision",
      desc: "To be a leading educational institution in Makwanpur, recognized for academic excellence, holistic development, and producing leaders who contribute positively to society and the nation.",
      color: "#168A3A",
      visible: true,
    },
  ],
  journeyTitle: "Our Journey",
  journey: [
    {
      id: 1,
      year: "2046 BS",
      title: "School Founded",
      desc: "Baljagriti Secondary English School was established in Makwanpur with a vision to provide quality English-medium education.",
      visible: true,
    },
    {
      id: 2,
      year: "Secondary Level",
      title: "Expanded to Grade 10",
      desc: "The school expanded its academic structure to support students from early learning levels up to Grade 10.",
      visible: true,
    },
    {
      id: 3,
      year: "Academic Growth",
      title: "Strong SEE Foundation",
      desc: "Students continued building strong academic results through focused classroom teaching, discipline, and guided learning.",
      visible: true,
    },
    {
      id: 4,
      year: "Today",
      title: "Growing Learning Community",
      desc: "The school community continues to grow with dedicated educators, modern facilities, and a focus on holistic student development.",
      visible: true,
    },
  ],
};

function mergeAboutContent(saved = {}) {
  return {
    ...defaultAboutContent,
    ...saved,
    pillars: Array.isArray(saved.pillars)
      ? saved.pillars
      : defaultAboutContent.pillars,
    highlights: Array.isArray(saved.highlights)
      ? saved.highlights
      : defaultAboutContent.highlights,
    storyParagraphs: Array.isArray(saved.storyParagraphs)
      ? saved.storyParagraphs
      : defaultAboutContent.storyParagraphs,
    missionVision: Array.isArray(saved.missionVision)
      ? saved.missionVision
      : defaultAboutContent.missionVision,
    journey: Array.isArray(saved.journey)
      ? saved.journey
      : defaultAboutContent.journey,
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
          <EyeIcon className="w-4 h-4" />
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

function ImageUploadBox({
  label,
  imageUrl,
  onUpload,
  onRemove,
  uploading,
  instruction,
}) {
  return (
    <div>
      <label className="block text-sm font-bold mb-2 text-slate-700">
        {label}
      </label>

      <div
        className="rounded-2xl overflow-hidden bg-white mb-4 relative"
        style={{ border: "1px solid rgba(15,23,42,0.08)" }}
      >
        {imageUrl ? (
          <>
            <img src={imageUrl} alt={label} className="w-full h-56 object-cover" />
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
          <div className="w-full h-56 bg-slate-100 flex items-center justify-center">
            <ImageIcon className="w-16 h-16 text-slate-300" />
          </div>
        )}
      </div>

      <label
        className="flex flex-col items-center justify-center gap-2 cursor-pointer rounded-2xl p-4 text-center"
        style={{
          background: "rgba(255,255,255,0.72)",
          border: "1px dashed rgba(75,46,131,0.28)",
        }}
      >
        <UploadCloud className="w-6 h-6" style={{ color: colors.purple }} />

        <span className="text-sm font-bold text-slate-800">
          {uploading ? "Uploading..." : "Upload Image"}
        </span>

        <span className="text-xs text-slate-500 leading-relaxed">
          {instruction}
        </span>

        <input
          type="file"
          accept="image/*"
          disabled={uploading}
          onChange={(e) => {
            onUpload(e.target.files?.[0]);
            e.target.value = "";
          }}
          className="hidden"
        />
      </label>
    </div>
  );
}

function PreviewImage({ src, alt, height = "h-60" }) {
  if (src) {
    return <img src={src} alt={alt} className={`w-full ${height} object-cover`} />;
  }

  return (
    <div className={`w-full ${height} bg-slate-100 flex items-center justify-center`}>
      <ImageIcon className="w-14 h-14 text-slate-300" />
    </div>
  );
}

function AboutPreview({ form }) {
  const visiblePillars = (form.pillars || []).filter(
    (item) => item.visible !== false
  );

  const visibleMissionVision = (form.missionVision || []).filter(
    (item) => item.visible !== false
  );

  const visibleJourney = (form.journey || []).filter(
    (item) => item.visible !== false
  );

  const glanceItems = [
    {
      value: form.topCardTitle || "PG to Grade 10",
      label: form.topCardSubtitle || "Co-educational day school",
    },
    {
      value: visibleJourney[0]?.year || "2046 BS",
      label: "Established",
    },
    {
      value: form.floatingCardSubtitle || "Hetauda, Makwanpur",
      label: "School Location",
    },
    {
      value: "ECA",
      label: "Sports, arts & activities",
    },
  ];

  return (
    <div
      className="min-h-full p-6"
      style={{
        background:
          "radial-gradient(circle at top right, rgba(124,92,196,0.18), transparent 34%), radial-gradient(circle at bottom left, rgba(22,138,58,0.14), transparent 32%), linear-gradient(180deg, #FFF8EE 0%, #F1ECFF 100%)",
      }}
    >
      <div className="text-center mb-8">
        <span
          className="inline-block px-4 py-1.5 rounded-full text-sm font-bold mb-4"
          style={{
            background: "rgba(215,25,32,0.08)",
            color: colors.red,
            border: "1px solid rgba(215,25,32,0.14)",
          }}
        >
          School Profile
        </span>

        <h3
          className="text-4xl text-slate-950"
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 850,
            letterSpacing: "-0.04em",
          }}
        >
          {form.pageTitle || "About Us"}
        </h3>

        <p className="text-sm text-slate-500 mt-3 leading-relaxed">
          {form.pageSubtitle}
        </p>
      </div>

      <div
        className="rounded-3xl overflow-hidden bg-white mb-5 relative"
        style={{
          border: "1px solid rgba(15,23,42,0.08)",
          boxShadow: "0 14px 34px rgba(15,23,42,0.08)",
        }}
      >
        <PreviewImage
          src={form.heroImageUrl}
          alt={form.heroImageAlt || "About image"}
        />

        <div
          className="absolute top-4 left-4 rounded-2xl px-4 py-3"
          style={{
            background: "rgba(255,255,255,0.92)",
            border: "1px solid rgba(75,46,131,0.14)",
            backdropFilter: "blur(12px)",
          }}
        >
          <div
            className="w-10 h-1 rounded-full mb-2"
            style={{ background: colors.green }}
          />

          <div className="text-sm font-bold text-slate-950">
            {form.topCardTitle}
          </div>

          <div className="text-xs text-slate-500">
            {form.topCardSubtitle}
          </div>
        </div>
      </div>

      <div
        className="rounded-3xl p-5 mb-8"
        style={{
          background: `linear-gradient(135deg, ${colors.dark}, ${colors.purple})`,
          border: "1px solid rgba(255,255,255,0.12)",
          boxShadow: "0 16px 42px rgba(11,16,32,0.16)",
        }}
      >
        <div
          className="w-16 h-1 rounded-full mb-5"
          style={{
            background: `linear-gradient(90deg, ${colors.red}, ${colors.green})`,
          }}
        />

        <div className="grid grid-cols-2 gap-4">
          {glanceItems.map((item) => (
            <div key={`${item.value}-${item.label}`}>
              <div className="text-xl font-black text-white">{item.value}</div>
              <div
                className="text-xs mt-1"
                style={{ color: "rgba(255,255,255,0.65)" }}
              >
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <div className="text-xl font-black text-slate-950 mb-4">
          Pillar Cards
        </div>

        <div className="space-y-4">
          {visiblePillars.map((item, index) => {
            const pillarColor = item.color || colors.green;

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-4"
                style={{
                  border: `1px solid ${pillarColor}22`,
                  boxShadow: "0 12px 32px rgba(15,23,42,0.08)",
                }}
              >
                <div
                  className="text-sm font-black tracking-widest mb-3"
                  style={{ color: pillarColor }}
                >
                  {String(index + 1).padStart(2, "0")}
                </div>

                <div
                  className="w-16 h-1 rounded-full mb-4"
                  style={{ background: pillarColor }}
                />

                <div className="font-black text-slate-950">{item.label}</div>

                <div className="text-sm text-slate-500 mt-1 leading-relaxed">
                  {item.desc}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mb-8">
        <div
          className="inline-flex px-4 py-1.5 rounded-full text-sm font-bold mb-4"
          style={{
            background: "rgba(75,46,131,0.09)",
            color: colors.purple,
            border: "1px solid rgba(75,46,131,0.18)",
          }}
        >
          {form.storyBadge}
        </div>

        <div
          className="bg-white rounded-3xl p-5 mb-5"
          style={{
            border: "1px solid rgba(15,23,42,0.08)",
            boxShadow: "0 12px 32px rgba(15,23,42,0.08)",
          }}
        >
          <div className="text-3xl font-black text-slate-950 leading-tight">
            {form.storyTitle}
          </div>

          <div className="space-y-4 mt-4">
            {(form.storyParagraphs || []).map((paragraph, index) => (
              <p key={index} className="text-sm text-slate-500 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        <div
          className="rounded-3xl overflow-hidden bg-white relative"
          style={{
            border: "1px solid rgba(15,23,42,0.08)",
            boxShadow: "0 12px 32px rgba(15,23,42,0.08)",
          }}
        >
          <PreviewImage
            src={form.storyImageUrl}
            alt={form.storyImageAlt || "Story image"}
          />

          <div className="absolute bottom-4 left-4 right-4 rounded-2xl p-4 bg-black/45 backdrop-blur-md">
            <div
              className="w-14 h-1 rounded-full mb-3"
              style={{
                background:
                  "linear-gradient(90deg, rgba(250,204,21,0.95), rgba(56,189,248,0.95))",
              }}
            />

            <div className="text-white font-bold">{form.storyImageTitle}</div>
            <div className="text-white/70 text-xs">
              {form.storyImageSubtitle}
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <div className="text-xl font-black text-slate-950 mb-4">
          Mission / Vision
        </div>

        <div className="space-y-4">
          {visibleMissionVision.map((item, index) => {
            const cardColor = item.color || colors.green;

            return (
              <div
                key={item.id}
                className="bg-white rounded-3xl p-5"
                style={{
                  border: `1px solid ${cardColor}22`,
                  boxShadow: "0 12px 32px rgba(15,23,42,0.08)",
                }}
              >
                <div
                  className="text-sm font-black tracking-widest mb-3"
                  style={{ color: cardColor }}
                >
                  {String(index + 1).padStart(2, "0")}
                </div>

                <div
                  className="w-16 h-1 rounded-full mb-4"
                  style={{ background: cardColor }}
                />

                <div className="text-2xl font-black text-slate-950">
                  {item.title}
                </div>

                <p className="text-sm text-slate-500 mt-3 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <div className="text-center mb-6">
          <div className="text-3xl font-black text-slate-950">
            {form.journeyTitle}
          </div>
        </div>

        <div className="space-y-4">
          {visibleJourney.map((item, index) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl p-5"
              style={{
                border: "1px solid rgba(15,23,42,0.08)",
                boxShadow: "0 12px 32px rgba(15,23,42,0.08)",
              }}
            >
              <div className="flex items-start gap-4">
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 text-white text-sm font-black"
                  style={{ background: colors.dark }}
                >
                  {String(index + 1).padStart(2, "0")}
                </div>

                <div>
                  <div className="font-bold" style={{ color: colors.green }}>
                    {item.year}
                  </div>

                  <div className="text-xl font-black text-slate-950 mt-1">
                    {item.title}
                  </div>

                  <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function AdminAbout() {
  const navigate = useNavigate();

  const [form, setForm] = useState(defaultAboutContent);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingKey, setUploadingKey] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    const loadAboutContent = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/site-content/about");
        const savedContent = res.data?.data?.content || {};
        setForm(mergeAboutContent(savedContent));
      } catch (err) {
        console.error("Load about content error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadAboutContent();
  }, []);

  const updateField = (name, value) => {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const updatePillar = (id, name, value) => {
    setForm((prev) => ({
      ...prev,
      pillars: prev.pillars.map((item) =>
        item.id === id ? { ...item, [name]: value } : item
      ),
    }));
  };

  const addPillar = () => {
    setForm((prev) => ({
      ...prev,
      pillars: [
        ...prev.pillars,
        {
          id: Date.now(),
          icon: "award",
          label: "New Pillar",
          desc: "Short description.",
          color: colors.green,
          visible: true,
        },
      ],
    }));
  };

  const deletePillar = (id) => {
    setForm((prev) => ({
      ...prev,
      pillars: prev.pillars.filter((item) => item.id !== id),
    }));
  };

  const updateMissionVision = (id, name, value) => {
    setForm((prev) => ({
      ...prev,
      missionVision: prev.missionVision.map((item) =>
        item.id === id ? { ...item, [name]: value } : item
      ),
    }));
  };

  const addMissionVision = () => {
    setForm((prev) => ({
      ...prev,
      missionVision: [
        ...prev.missionVision,
        {
          id: Date.now(),
          icon: "target",
          title: "New Section",
          desc: "Section description.",
          color: colors.purple,
          visible: true,
        },
      ],
    }));
  };

  const deleteMissionVision = (id) => {
    setForm((prev) => ({
      ...prev,
      missionVision: prev.missionVision.filter((item) => item.id !== id),
    }));
  };

  const updateJourney = (id, name, value) => {
    setForm((prev) => ({
      ...prev,
      journey: prev.journey.map((item) =>
        item.id === id ? { ...item, [name]: value } : item
      ),
    }));
  };

  const addJourney = () => {
    setForm((prev) => ({
      ...prev,
      journey: [
        ...prev.journey,
        {
          id: Date.now(),
          year: "Year",
          title: "Journey Title",
          desc: "Journey description.",
          visible: true,
        },
      ],
    }));
  };

  const deleteJourney = (id) => {
    setForm((prev) => ({
      ...prev,
      journey: prev.journey.filter((item) => item.id !== id),
    }));
  };

  const uploadImage = async (fieldName, file) => {
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

    setSuccess("");
    setError("");
    setUploadingKey(fieldName);

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
        setError("Image uploaded but backend did not return image URL.");
        return;
      }

      updateField(fieldName, uploadedUrl);
      setSuccess("Image uploaded successfully. Click Save Changes.");
    } catch (err) {
      console.error("About image upload error:", err);
      setError(err.response?.data?.message || "Image upload failed.");
    } finally {
      setUploadingKey("");
    }
  };

  async function saveAboutContent() {
    setSuccess("");
    setError("");
    setSaving(true);

    try {
      await axios.put(
        "http://localhost:5000/api/site-content/about",
        { content: form },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess("About page content saved successfully.");
    } catch (err) {
      console.error("Save about content error:", err);
      setError(err.response?.data?.message || "Could not save about content.");
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
          Loading about editor...
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
              href="/about"
              target="_blank"
              rel="noreferrer"
              className="hidden md:inline-flex items-center gap-2 px-4 py-3 rounded-2xl font-bold text-white transition-all hover:scale-105"
              style={{
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.14)",
              }}
            >
              <ExternalLink className="w-4 h-4" />
              View About Page
            </a>

            <button
              type="button"
              onClick={saveAboutContent}
              disabled={saving || uploadingKey}
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
            Manage About Page
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
            Edit About Page
          </h1>

          <p className="text-slate-500 max-w-3xl text-lg">
            Edit about heading, school images, pillar cards, story, mission,
            vision, and journey timeline. Icon and old highlight editing is
            hidden because the public page now uses a cleaner number-and-line
            layout.
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
              title="Top About Section"
              color={colors.purple}
            >
              <div className="grid gap-5">
                <Field
                  label="Page Title"
                  value={form.pageTitle}
                  onChange={(value) => updateField("pageTitle", value)}
                />

                <TextArea
                  label="Page Subtitle"
                  value={form.pageSubtitle}
                  onChange={(value) => updateField("pageSubtitle", value)}
                  rows={3}
                />

                <ImageUploadBox
                  label="Main About Image"
                  imageUrl={form.heroImageUrl}
                  uploading={uploadingKey === "heroImageUrl"}
                  instruction="Recommended: 1200×800 px landscape, PNG/JPG/WebP, max 3 MB."
                  onUpload={(file) => uploadImage("heroImageUrl", file)}
                  onRemove={() => updateField("heroImageUrl", "")}
                />

                <Field
                  label="Image Alt Text"
                  value={form.heroImageAlt}
                  onChange={(value) => updateField("heroImageAlt", value)}
                />

                <div className="grid md:grid-cols-2 gap-4">
                  <Field
                    label="Top Small Card Title"
                    value={form.topCardTitle}
                    onChange={(value) => updateField("topCardTitle", value)}
                  />

                  <Field
                    label="Top Small Card Subtitle"
                    value={form.topCardSubtitle}
                    onChange={(value) => updateField("topCardSubtitle", value)}
                  />
                </div>

                <Field
                  label="School Location Text"
                  value={form.floatingCardSubtitle}
                  onChange={(value) =>
                    updateField("floatingCardSubtitle", value)
                  }
                  placeholder="Example: Hetauda, Makwanpur"
                />
              </div>
            </EditorCard>

            <EditorCard icon={Award} title="Pillar Cards" color={colors.red}>
              <div className="flex justify-end mb-6">
                <button
                  type="button"
                  onClick={addPillar}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-white"
                  style={{
                    background: `linear-gradient(135deg, ${colors.purple}, ${colors.green})`,
                  }}
                >
                  <Plus className="w-4 h-4" />
                  Add Pillar
                </button>
              </div>

              <div className="space-y-5">
                {form.pillars.map((item, index) => (
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
                          Pillar {index + 1}
                        </div>

                        <div className="text-sm text-slate-500">
                          {item.label}
                        </div>
                      </div>

                      <VisibilityDeleteControls
                        visible={item.visible}
                        onToggle={() =>
                          updatePillar(item.id, "visible", !item.visible)
                        }
                        onDelete={() => deletePillar(item.id)}
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <Field
                        label="Label"
                        value={item.label}
                        onChange={(value) =>
                          updatePillar(item.id, "label", value)
                        }
                      />

                      <Field
                        label="Accent Color"
                        type="color"
                        value={item.color}
                        onChange={(value) =>
                          updatePillar(item.id, "color", value)
                        }
                      />
                    </div>

                    <div className="mt-4">
                      <TextArea
                        label="Description"
                        value={item.desc}
                        onChange={(value) =>
                          updatePillar(item.id, "desc", value)
                        }
                      />
                    </div>
                  </div>
                ))}
              </div>
            </EditorCard>

            <EditorCard
              icon={BookOpen}
              title="Story Section"
              color={colors.purple}
            >
              <div className="grid gap-5">
                <Field
                  label="Story Badge"
                  value={form.storyBadge}
                  onChange={(value) => updateField("storyBadge", value)}
                />

                <Field
                  label="Story Title"
                  value={form.storyTitle}
                  onChange={(value) => updateField("storyTitle", value)}
                />

                <TextArea
                  label="Story Paragraphs - one paragraph per line"
                  value={form.storyParagraphs.join("\n")}
                  onChange={(value) =>
                    updateField(
                      "storyParagraphs",
                      value
                        .split("\n")
                        .map((item) => item.trim())
                        .filter(Boolean)
                    )
                  }
                  rows={7}
                />

                <ImageUploadBox
                  label="Story Image"
                  imageUrl={form.storyImageUrl}
                  uploading={uploadingKey === "storyImageUrl"}
                  instruction="Recommended: 1200×900 px landscape, PNG/JPG/WebP, max 3 MB."
                  onUpload={(file) => uploadImage("storyImageUrl", file)}
                  onRemove={() => updateField("storyImageUrl", "")}
                />

                <Field
                  label="Story Image Alt Text"
                  value={form.storyImageAlt}
                  onChange={(value) => updateField("storyImageAlt", value)}
                />

                <div className="grid md:grid-cols-2 gap-4">
                  <Field
                    label="Story Image Caption Title"
                    value={form.storyImageTitle}
                    onChange={(value) => updateField("storyImageTitle", value)}
                  />

                  <Field
                    label="Story Image Caption Subtitle"
                    value={form.storyImageSubtitle}
                    onChange={(value) =>
                      updateField("storyImageSubtitle", value)
                    }
                  />
                </div>
              </div>
            </EditorCard>

            <EditorCard
              icon={Target}
              title="Mission / Vision Cards"
              color={colors.green}
            >
              <div className="flex justify-end mb-6">
                <button
                  type="button"
                  onClick={addMissionVision}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-white"
                  style={{
                    background: `linear-gradient(135deg, ${colors.purple}, ${colors.green})`,
                  }}
                >
                  <Plus className="w-4 h-4" />
                  Add Card
                </button>
              </div>

              <div className="space-y-5">
                {form.missionVision.map((item, index) => (
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
                          Card {index + 1}
                        </div>

                        <div className="text-sm text-slate-500">
                          {item.title}
                        </div>
                      </div>

                      <VisibilityDeleteControls
                        visible={item.visible}
                        onToggle={() =>
                          updateMissionVision(
                            item.id,
                            "visible",
                            !item.visible
                          )
                        }
                        onDelete={() => deleteMissionVision(item.id)}
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <Field
                        label="Title"
                        value={item.title}
                        onChange={(value) =>
                          updateMissionVision(item.id, "title", value)
                        }
                      />

                      <Field
                        label="Accent Color"
                        type="color"
                        value={item.color}
                        onChange={(value) =>
                          updateMissionVision(item.id, "color", value)
                        }
                      />
                    </div>

                    <div className="mt-4">
                      <TextArea
                        label="Description"
                        value={item.desc}
                        onChange={(value) =>
                          updateMissionVision(item.id, "desc", value)
                        }
                      />
                    </div>
                  </div>
                ))}
              </div>
            </EditorCard>

            <EditorCard
              icon={CalendarDays}
              title="Journey Timeline"
              color={colors.red}
            >
              <div className="grid gap-5">
                <Field
                  label="Journey Section Title"
                  value={form.journeyTitle}
                  onChange={(value) => updateField("journeyTitle", value)}
                />

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={addJourney}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-white"
                    style={{
                      background: `linear-gradient(135deg, ${colors.purple}, ${colors.green})`,
                    }}
                  >
                    <Plus className="w-4 h-4" />
                    Add Journey
                  </button>
                </div>

                {form.journey.map((item, index) => (
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
                          Journey {index + 1}
                        </div>

                        <div className="text-sm text-slate-500">
                          {item.title}
                        </div>
                      </div>

                      <VisibilityDeleteControls
                        visible={item.visible}
                        onToggle={() =>
                          updateJourney(item.id, "visible", !item.visible)
                        }
                        onDelete={() => deleteJourney(item.id)}
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <Field
                        label="Year / Label"
                        value={item.year}
                        onChange={(value) =>
                          updateJourney(item.id, "year", value)
                        }
                      />

                      <Field
                        label="Title"
                        value={item.title}
                        onChange={(value) =>
                          updateJourney(item.id, "title", value)
                        }
                      />
                    </div>

                    <div className="mt-4">
                      <TextArea
                        label="Description"
                        value={item.desc}
                        onChange={(value) =>
                          updateJourney(item.id, "desc", value)
                        }
                      />
                    </div>
                  </div>
                ))}
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
                <EyeIcon className="w-5 h-5" />
                About Page Preview
              </div>

              <div className="text-sm text-white/55">
                Preview updates while editing.
              </div>
            </div>

            <div className="bg-white">
              <AboutPreview form={form} />
            </div>
          </aside>
        </div>
      </main>
    </section>
  );
}